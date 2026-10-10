/* =========================================================
   RAFIQ LOGIN PAGE
   Frontend-only mock interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     ELEMENT REFERENCES
     ======================================================= */

  const root = document.documentElement;
  const body = document.body;

  const loginForm = document.getElementById("loginForm");

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const emailField = document.getElementById("emailField");
  const passwordField = document.getElementById("passwordField");

  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  const passwordToggle =
    document.getElementById("passwordToggle");

  const roleSelector =
    document.querySelector(".role-selector");

  const roleButtons =
    document.querySelectorAll(".role-button");

  const roleHelper =
    document.getElementById("roleHelper");

  const loginButton =
    document.getElementById("loginButton");

  const loginButtonText =
    document.getElementById("loginButtonText");

  const loadingLabel =
    document.querySelector("[data-loading-label]");

  const successLabel =
    document.querySelector("[data-success-label]");

  const formStatus =
    document.getElementById("formStatus");

  const languageButtons =
    document.querySelectorAll("[data-language]");

  const mobileLanguageButtons =
    document.querySelectorAll("[data-mobile-language]");

  const translatableElements =
    document.querySelectorAll("[data-i18n]");

  const parentRoleLabel =
    document.querySelector(
      '[data-role-label="parent"]'
    );

  const specialistRoleLabel =
    document.querySelector(
      '[data-role-label="specialist"]'
    );

  /* =======================================================
     STATE
     ======================================================= */

  let selectedRole = "parent";
  let currentLanguage = "en";
  let isSubmitting = false;

  /* =======================================================
     TRANSLATIONS
     Partial Arabic demo by design
     ======================================================= */

  const translations = {
    en: {
      backHome: "Back to Home",
      storyEyebrow:
        "AI-powered support for every stage",
      welcomeTitle:
        "Welcome back to Rafiq.",
      welcomeText:
        "Continue your parenting journey, manage your child profiles, or access your specialist workspace.",

      secureSpace:
        "Your secure space",
      loginTitle:
        "Log in to your account",
      loginSubtitle:
        "Welcome back. Choose your role and continue.",
      continueAs:
        "Continue as",

      email:
        "Email",
      password:
        "Password",
      rememberMe:
        "Remember me",
      forgotPassword:
        "Forgot Password?",

      firstTime:
        "First time here?",
      noAccount:
        "Don't have an account?",
      createAccount:
        "Create Account",

      newSpecialist:
        "New specialist?",
      joinSpecialist:
        "Join as a Specialist",

      privacyText:
        "Your family information stays private and protected.",

      parent:
        "Parent",
      specialist:
        "Specialist",

      parentHelper:
        "Access your family profiles, milestones and personalized guidance.",

      specialistHelper:
        "Access your client sessions, appointments and specialist workspace.",

      parentButton:
        "Log In as Parent",

      specialistButton:
        "Log In as Specialist",

      emailPlaceholder:
        "you@example.com",

      passwordPlaceholder:
        "Enter your password",

      showPassword:
        "Show password",

      hidePassword:
        "Hide password",

      emailRequired:
        "Please enter your email address.",

      emailInvalid:
        "Please enter a valid email address.",

      passwordRequired:
        "Please enter your password.",

      passwordShort:
        "Password must be at least 6 characters.",

      formInvalid:
        "Please check the highlighted fields and try again.",

      loading:
        "Logging in...",

      success:
        "Welcome back!",

      redirectParent:
        "Login successful. Opening your parent workspace...",

      redirectSpecialist:
        "Login successful. Opening your specialist workspace..."
    },

    ar: {
      backHome:
        "العودة للرئيسية",
      storyEyebrow:
        "دعم ذكي لكل مرحلة",
      welcomeTitle:
        "مرحباً بعودتك إلى رفيق.",
      welcomeText:
        "واصل رحلتك في التربية، وأدر ملفات أطفالك، أو ادخل إلى مساحة عملك كأخصائي.",

      secureSpace:
        "مساحتك الآمنة",
      loginTitle:
        "تسجيل الدخول إلى حسابك",
      loginSubtitle:
        "مرحباً بعودتك. اختر دورك ثم تابع.",
      continueAs:
        "الدخول بصفة",

      email:
        "البريد الإلكتروني",
      password:
        "كلمة المرور",
      rememberMe:
        "تذكرني",
      forgotPassword:
        "نسيت كلمة المرور؟",

      firstTime:
        "جديد في رفيق؟",
      noAccount:
        "ليس لديك حساب؟",
      createAccount:
        "إنشاء حساب",

      newSpecialist:
        "أخصائي جديد؟",
      joinSpecialist:
        "انضم كأخصائي",

      privacyText:
        "تبقى معلومات عائلتك خاصة ومحمية.",

      parent:
        "ولي أمر",
      specialist:
        "أخصائي",

      parentHelper:
        "ادخل إلى ملفات العائلة، ومراحل التطور، والإرشادات المخصصة.",

      specialistHelper:
        "ادخل إلى الجلسات والمواعيد ومساحة العمل الخاصة بالأخصائي.",

      parentButton:
        "الدخول كولي أمر",

      specialistButton:
        "الدخول كأخصائي",

      emailPlaceholder:
        "you@example.com",

      passwordPlaceholder:
        "أدخل كلمة المرور",

      showPassword:
        "إظهار كلمة المرور",

      hidePassword:
        "إخفاء كلمة المرور",

      emailRequired:
        "يرجى إدخال البريد الإلكتروني.",

      emailInvalid:
        "يرجى إدخال بريد إلكتروني صحيح.",

      passwordRequired:
        "يرجى إدخال كلمة المرور.",

      passwordShort:
        "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.",

      formInvalid:
        "يرجى مراجعة الحقول المحددة والمحاولة مرة أخرى.",

      loading:
        "جارٍ تسجيل الدخول...",

      success:
        "مرحباً بعودتك!",

      redirectParent:
        "تم تسجيل الدخول. جارٍ فتح مساحة ولي الأمر...",

      redirectSpecialist:
        "تم تسجيل الدخول. جارٍ فتح مساحة الأخصائي..."
    }
  };

  /* =======================================================
     ROLE MANAGEMENT
     ======================================================= */

  function setRole(role) {
    if (
      role !== "parent" &&
      role !== "specialist"
    ) {
      return;
    }

    selectedRole = role;

    roleSelector.dataset.role = role;

    roleButtons.forEach((button) => {
      const isActive =
        button.dataset.role === role;

      button.classList.toggle(
        "active",
        isActive
      );

      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );
    });

    body.classList.toggle(
      "specialist-mode",
      role === "specialist"
    );

    updateRoleContent();

    /*
      If the user switches role after a
      successful/loading state, reset the form
      button back to its normal appearance.
    */
    if (!isSubmitting) {
      loginButton.classList.remove(
        "is-loading",
        "is-success"
      );
    }
  }

  function updateRoleContent() {
    const text =
      translations[currentLanguage];

    if (selectedRole === "parent") {
      loginButtonText.textContent =
        text.parentButton;

      roleHelper.textContent =
        text.parentHelper;
    } else {
      loginButtonText.textContent =
        text.specialistButton;

      roleHelper.textContent =
        text.specialistHelper;
    }
  }

  roleButtons.forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        if (isSubmitting) {
          return;
        }

        setRole(button.dataset.role);
      }
    );
  });

  /* =======================================================
     PASSWORD VISIBILITY
     ======================================================= */

  passwordToggle.addEventListener(
    "click",
    () => {
      const isCurrentlyPassword =
        passwordInput.type === "password";

      passwordInput.type =
        isCurrentlyPassword
          ? "text"
          : "password";

      passwordToggle.classList.toggle(
        "is-visible",
        isCurrentlyPassword
      );

      passwordToggle.setAttribute(
        "aria-pressed",
        String(isCurrentlyPassword)
      );

      passwordToggle.setAttribute(
        "aria-label",
        isCurrentlyPassword
          ? translations[currentLanguage]
              .hidePassword
          : translations[currentLanguage]
              .showPassword
      );

      /*
        Keep focus in the password field
        after toggling visibility.
      */
      passwordInput.focus();

      const valueLength =
        passwordInput.value.length;

      try {
        passwordInput.setSelectionRange(
          valueLength,
          valueLength
        );
      } catch (error) {
        /*
          Some browsers can reject
          setSelectionRange for certain
          input states. No action needed.
        */
      }
    }
  );

  /* =======================================================
     VALIDATION
     ======================================================= */

  function isValidEmail(email) {
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
  }

  function setFieldError(
    fieldElement,
    errorElement,
    message
  ) {
    fieldElement.classList.add(
      "has-error"
    );

    fieldElement.classList.remove(
      "is-valid"
    );

    errorElement.textContent = message;
  }

  function setFieldValid(
    fieldElement,
    errorElement
  ) {
    fieldElement.classList.remove(
      "has-error"
    );

    fieldElement.classList.add(
      "is-valid"
    );

    errorElement.textContent = "";
  }

  function clearFieldState(
    fieldElement,
    errorElement
  ) {
    fieldElement.classList.remove(
      "has-error",
      "is-valid"
    );

    errorElement.textContent = "";
  }

  function validateEmail() {
    const email =
      emailInput.value.trim();

    const text =
      translations[currentLanguage];

    if (!email) {
      setFieldError(
        emailField,
        emailError,
        text.emailRequired
      );

      return false;
    }

    if (!isValidEmail(email)) {
      setFieldError(
        emailField,
        emailError,
        text.emailInvalid
      );

      return false;
    }

    setFieldValid(
      emailField,
      emailError
    );

    return true;
  }

  function validatePassword() {
    const password =
      passwordInput.value;

    const text =
      translations[currentLanguage];

    if (!password) {
      setFieldError(
        passwordField,
        passwordError,
        text.passwordRequired
      );

      return false;
    }

    if (password.length < 6) {
      setFieldError(
        passwordField,
        passwordError,
        text.passwordShort
      );

      return false;
    }

    setFieldValid(
      passwordField,
      passwordError
    );

    return true;
  }

  emailInput.addEventListener(
    "blur",
    validateEmail
  );

  passwordInput.addEventListener(
    "blur",
    validatePassword
  );

  emailInput.addEventListener(
    "input",
    () => {
      if (
        emailField.classList.contains(
          "has-error"
        )
      ) {
        validateEmail();
      } else if (!emailInput.value) {
        clearFieldState(
          emailField,
          emailError
        );
      }
    }
  );

  passwordInput.addEventListener(
    "input",
    () => {
      if (
        passwordField.classList.contains(
          "has-error"
        )
      ) {
        validatePassword();
      } else if (!passwordInput.value) {
        clearFieldState(
          passwordField,
          passwordError
        );
      }
    }
  );

  /* =======================================================
     FORM STATUS
     ======================================================= */

  function setFormStatus(
    message = "",
    type = ""
  ) {
    formStatus.textContent = message;

    formStatus.classList.remove(
      "show",
      "error",
      "success"
    );

    if (!message) {
      return;
    }

    formStatus.classList.add(
      "show"
    );

    if (type) {
      formStatus.classList.add(type);
    }
  }

  /* =======================================================
     MOCK LOGIN
     ======================================================= */

  loginForm.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      const emailValid =
        validateEmail();

      const passwordValid =
        validatePassword();

      if (
        !emailValid ||
        !passwordValid
      ) {
        setFormStatus(
          translations[currentLanguage]
            .formInvalid,
          "error"
        );

        /*
          Send keyboard focus to the first
          invalid field for accessibility.
        */
        if (!emailValid) {
          emailInput.focus();
        } else {
          passwordInput.focus();
        }

        return;
      }

      startMockLogin();
    }
  );

  function startMockLogin() {
    isSubmitting = true;

    setFormStatus("");

    loginButton.disabled = true;

    loginButton.classList.remove(
      "is-success"
    );

    loginButton.classList.add(
      "is-loading"
    );

    loadingLabel.textContent =
      translations[currentLanguage]
        .loading;

    /*
      Frontend mock request delay.
      No backend authentication occurs.
    */
    window.setTimeout(() => {
      loginButton.classList.remove(
        "is-loading"
      );

      loginButton.classList.add(
        "is-success"
      );

      successLabel.textContent =
        translations[currentLanguage]
          .success;

      const successMessage =
        selectedRole === "parent"
          ? translations[currentLanguage]
              .redirectParent
          : translations[currentLanguage]
              .redirectSpecialist;

      setFormStatus(
        successMessage,
        "success"
      );

      /*
        Simulated routing.

        Parent:
        parent-dashboard.html

        Specialist:
        specialist-dashboard.html
      */
      window.setTimeout(() => {
        const destination =
          selectedRole === "parent"
            ? "../pearent-cycel/parent-dashboard.html"
            : "../specialist-dashboard.html";

        window.location.href =
          destination;
      }, 950);
    }, 1100);
  }

  /* =======================================================
     LANGUAGE / RTL
     ======================================================= */

  function setLanguage(language) {
    if (
      language !== "en" &&
      language !== "ar"
    ) {
      return;
    }

    currentLanguage = language;
   saveRafiqLanguage(language);

    const isArabic =
      language === "ar";

    applyRafiqDirection(language);

    body.classList.toggle(
      "rtl-mode",
      isArabic
    );

    updateTranslations();
    updateLanguageButtons();

    /*
      Revalidate visible errors in the
      newly selected language.
    */
    if (
      emailField.classList.contains(
        "has-error"
      )
    ) {
      validateEmail();
    }

    if (
      passwordField.classList.contains(
        "has-error"
      )
    ) {
      validatePassword();
    }

    /*
      Update password toggle aria label.
    */
    const passwordVisible =
      passwordInput.type === "text";

    passwordToggle.setAttribute(
      "aria-label",
      passwordVisible
        ? translations[currentLanguage]
            .hidePassword
        : translations[currentLanguage]
            .showPassword
    );

    /*
      Reset generic status text when language
      changes unless the page is currently
      processing the mock login.
    */
    if (!isSubmitting) {
      setFormStatus("");
    }
  }

  function updateTranslations() {
    const text =
      translations[currentLanguage];

    translatableElements.forEach(
      (element) => {
        const key =
          element.dataset.i18n;

        if (
          Object.prototype.hasOwnProperty.call(
            text,
            key
          )
        ) {
          element.textContent =
            text[key];
        }
      }
    );

    parentRoleLabel.textContent =
      text.parent;

    specialistRoleLabel.textContent =
      text.specialist;

    emailInput.placeholder =
      text.emailPlaceholder;

    passwordInput.placeholder =
      text.passwordPlaceholder;

    loadingLabel.textContent =
      text.loading;

    successLabel.textContent =
      text.success;

    updateRoleContent();
  }

  function updateLanguageButtons() {
    languageButtons.forEach(
      (button) => {
        const isActive =
          button.dataset.language ===
          currentLanguage;

        button.classList.toggle(
          "active",
          isActive
        );

        button.setAttribute(
          "aria-pressed",
          String(isActive)
        );
      }
    );

    mobileLanguageButtons.forEach(
      (button) => {
        const isActive =
          button.dataset.mobileLanguage ===
          currentLanguage;

        button.classList.toggle(
          "active",
          isActive
        );
      }
    );
  }

  languageButtons.forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        setLanguage(
          button.dataset.language
        );
      }
    );
  });

  mobileLanguageButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          setLanguage(
            button.dataset.mobileLanguage
          );
        }
      );
    }
  );

  /* =======================================================
     BACKGROUND PARALLAX
     ======================================================= */

  const reduceMotionQuery =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

  let pointerAnimationFrame = null;

  function handlePointerMove(event) {
    if (reduceMotionQuery.matches) {
      return;
    }

    if (pointerAnimationFrame) {
      cancelAnimationFrame(
        pointerAnimationFrame
      );
    }

    pointerAnimationFrame =
      requestAnimationFrame(() => {
        const viewportWidth =
          window.innerWidth;

        const viewportHeight =
          window.innerHeight;

        const normalizedX =
          (
            event.clientX /
            viewportWidth -
            0.5
          ) * 2;

        const normalizedY =
          (
            event.clientY /
            viewportHeight -
            0.5
          ) * 2;

        const xMovement =
          normalizedX * 18;

        const yMovement =
          normalizedY * 18;

        root.style.setProperty(
          "--mouse-x",
          `${xMovement}px`
        );

        root.style.setProperty(
          "--mouse-y",
          `${yMovement}px`
        );
      });
  }

  function resetParallax() {
    root.style.setProperty(
      "--mouse-x",
      "0px"
    );

    root.style.setProperty(
      "--mouse-y",
      "0px"
    );
  }

  window.addEventListener(
    "pointermove",
    handlePointerMove,
    {
      passive: true
    }
  );

  document.addEventListener(
    "mouseleave",
    resetParallax
  );

  /*
    If reduced motion changes while
    the page is open, reset the effects.
  */
  reduceMotionQuery.addEventListener?.(
    "change",
    (event) => {
      if (event.matches) {
        resetParallax();
      }
    }
  );

  /* =======================================================
     SMALL KEYBOARD IMPROVEMENT
     Enter/Space is already supported by buttons,
     but this keeps the role area predictable.
     ======================================================= */

  roleButtons.forEach(
    (button, index) => {
      button.addEventListener(
        "keydown",
        (event) => {
          if (
            event.key !== "ArrowLeft" &&
            event.key !== "ArrowRight"
          ) {
            return;
          }

          event.preventDefault();

          const direction =
            event.key === "ArrowRight"
              ? 1
              : -1;

          const nextIndex =
            (
              index +
              direction +
              roleButtons.length
            ) %
            roleButtons.length;

          const nextButton =
            roleButtons[nextIndex];

          nextButton.focus();

          setRole(
            nextButton.dataset.role
          );
        }
      );
    }
  );

  /* =======================================================
     INITIALIZE
     ======================================================= */

  setRole("parent");
  const savedLanguage = getRafiqLanguage();

setLanguage(savedLanguage);
});