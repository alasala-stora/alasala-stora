/* =========================================================
   متجر الأصالة — إعدادات Firebase
   عبّي بياناتك هنا (من Firebase Console → إعدادات المشروع → عام
   → "إضافة تطبيق ويب" → انسخي القيم اللي تطلع لك)
   نفس هذا الملف يُستخدم بصفحة المتجر وصفحة لوحة التحكم.
   ========================================================= */

const ALASALA_FIREBASE_CONFIG = {
  apiKey: "PASTE_API_KEY_HERE",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};

// مفتاح VAPID للإشعارات (Firebase Console → إعدادات المشروع → Cloud Messaging
// → "Web Push certificates" → Generate key pair)
const ALASALA_VAPID_KEY = "PASTE_VAPID_KEY_HERE";
