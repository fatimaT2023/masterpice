const translations = {
  en: {
    login_title: "Log in to your account",
    login_subtitle: "Welcome back. Choose your role and continue.",

    parent: "Parent",
    specialist: "Specialist",

    email: "Email",
    password: "Password",

    remember_me: "Remember me",
    forgot_password: "Forgot Password?",

    login_parent: "Log In as Parent",
    login_specialist: "Log In as Specialist",

    no_account: "Don't have an account?",
    create_account: "Create Account",

    back_home: "Back to Home"
  },

  ar: {
    login_title: "تسجيل الدخول إلى حسابك",
    login_subtitle: "أهلاً بعودتك. اختاري نوع الحساب وتابعي.",

    parent: "ولي أمر",
    specialist: "أخصائي",

    email: "البريد الإلكتروني",
    password: "كلمة المرور",

    remember_me: "تذكرني",
    forgot_password: "نسيت كلمة المرور؟",

    login_parent: "تسجيل الدخول كولي أمر",
    login_specialist: "تسجيل الدخول كأخصائي",

    no_account: "ليس لديك حساب؟",
    create_account: "إنشاء حساب",

    back_home: "العودة للرئيسية"
  }
};


function setLanguage(lang) {

  // إذا اللغة مش ar أو en نخليها إنجليزي
  if (lang !== "ar" && lang !== "en") {
    lang = "en";
  }

  // تغيير لغة واتجاه الصفحة
  document.documentElement.lang = lang;
  document.documentElement.dir =
    lang === "ar" ? "rtl" : "ltr";


  // تغيير النصوص
  document.querySelectorAll("[data-i18n]").forEach((element) => {

    const key = element.getAttribute("data-i18n");

    if (translations[lang][key]) {
      element.textContent = translations[lang][key];
    }

  });


  // حفظ اختيار اللغة
  localStorage.setItem("rafiqLanguage", lang);
}


// لما الصفحة تفتح
document.addEventListener("DOMContentLoaded", () => {

  // نشوف إذا المستخدم اختار لغة من قبل
  const savedLanguage =
    localStorage.getItem("rafiqLanguage") || "en";

  // نطبق اللغة المحفوظة
  setLanguage(savedLanguage);


  // أزرار اللغة
  document
    .querySelectorAll("[data-language]")
    .forEach((button) => {

      button.addEventListener("click", () => {

        const language =
          button.getAttribute("data-language");

        setLanguage(language);

      });

    });

});
// ==========================================
// RAFIQ - Shared Language Helper
// ==========================================

// نجيب اللغة المحفوظة
function getRafiqLanguage() {
  return localStorage.getItem("rafiqLanguage") || "en";
}


// نحفظ اللغة
function saveRafiqLanguage(language) {
  localStorage.setItem("rafiqLanguage", language);
}


// نغيّر اتجاه الصفحة
function applyRafiqDirection(language) {
  document.documentElement.lang = language;

  document.documentElement.dir =
    language === "ar" ? "rtl" : "ltr";
}