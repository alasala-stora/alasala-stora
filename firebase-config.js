/* =========================================================
   متجر الأصالة — إعدادات Firebase
   عبّي بياناتك هنا (من Firebase Console → إعدادات المشروع → عام
   → "إضافة تطبيق ويب" → انسخي القيم اللي تطلع لك)
   نفس هذا الملف يُستخدم بصفحة المتجر وصفحة لوحة التحكم.
   ========================================================= */

const ALASALA_FIREBASE_CONFIG = {
  apiKey: "AIzaSyASu032ZeIfd-N_U17bEFEZyBGLqOLPlgQ",
  authDomain: "alasala-store.firebaseapp.com",
  projectId: "alasala-store",
  storageBucket: "alasala-store.firebasestorage.app",
  messagingSenderId: "361350228556",
  appId: "1:361350228556:web:7bb9e641d07e5153e5a2e9"
};

// مفتاح VAPID للإشعارات (Firebase Console → إعدادات المشروع → Cloud Messaging
// → "Web Push certificates" → Generate key pair)
const ALASALA_VAPID_KEY = "PASTE_VAPID_KEY_HERE";
