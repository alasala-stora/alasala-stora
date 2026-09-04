// netlify/functions/send-notification.js
// يستقبل {title, body} من لوحة التحكم، ويرسل إشعار خارجي حقيقي
// لكل من فعّل الإشعارات، عن طريق Firebase Cloud Messaging.
// المفاتيح السرية تُقرأ من متغيرات بيئة Netlify (Environment Variables)
// ولا تظهر أبدًا داخل كود التطبيق — هذا هو سبب استخدام دالة خادم بدل الإرسال مباشرة من لوحة التحكم.

const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
    })
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { title, body } = JSON.parse(event.body || '{}');
    if (!title) {
      return { statusCode: 400, body: JSON.stringify({ error: 'العنوان مطلوب' }) };
    }

    const db = admin.firestore();
    const tokensSnap = await db.collection('fcmTokens').get();
    const tokens = tokensSnap.docs.map((d) => d.id);

    if (!tokens.length) {
      return { statusCode: 200, body: JSON.stringify({ sent: 0, message: 'لا يوجد مشتركين بالإشعارات بعد' }) };
    }

    const message = {
      notification: { title, body: body || '' },
      tokens
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    // تنظيف التوكنات المنتهية/غير الصالحة تلقائيًا
    const invalid = [];
    response.responses.forEach((r, i) => {
      if (!r.success) invalid.push(tokens[i]);
    });
    await Promise.all(invalid.map((t) => db.collection('fcmTokens').doc(t).delete().catch(() => {})));

    return {
      statusCode: 200,
      body: JSON.stringify({ sent: response.successCount, failed: response.failureCount })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
