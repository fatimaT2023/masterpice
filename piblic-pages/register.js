/* =========================================================
   RAFIQ REGISTER PAGE
   Frontend-only Registration
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     Elements
     ======================================================= */

  const root = document.documentElement;
  const body = document.body;

  const registerForm =
    document.getElementById("registerForm");

  const roleCards =
    document.querySelectorAll(".role-card");

  const fullNameInput =
    document.getElementById("fullName");

  const emailInput =
    document.getElementById("email");

  const phoneInput =
    document.getElementById("phone");

  const passwordInput =
    document.getElementById("password");

  const confirmPasswordInput =
    document.getElementById("confirmPassword");

  const specialtyInput =
    document.getElementById("specialty");

  const experienceInput =
    document.getElementById("experience");

  const consultationInput =
    document.getElementById("consultationType");

  const preferredLanguageInput =
    document.getElementById("preferredLanguage");

  const languageBothOption =
    document.getElementById("languageBothOption");

  const termsInput =
    document.getElementById("terms");

  const specialistFields =
    document.getElementById("specialistFields");

  const verificationNote =
    document.getElementById("verificationNote");

  const submitButton =
    document.getElementById("submitButton");

  const submitButtonText =
    document.getElementById("submitButtonText");

  const loadingText =
    document.querySelector("[data-loading-text]");

  const successText =
    document.querySelector("[data-success-text]");

  const formStatus =
    document.getElementById("formStatus");

  const passwordStrength =
    document.getElementById("passwordStrength");

  const strengthLabel =
    document.getElementById("strengthLabel");

  const passwordToggles =
    document.querySelectorAll(".password-toggle");

  const languageButtons =
    document.querySelectorAll("[data-language]");

  const mobileLanguageButtons =
    document.querySelectorAll("[data-mobile-language]");

  const translatableElements =
    document.querySelectorAll("[data-i18n]");

  const optionTranslations =
    document.querySelectorAll("[data-i18n-option]");

  const parentRoleTitle =
    document.querySelector(
      '[data-role-title="parent"]'
    );

  const specialistRoleTitle =
    document.querySelector(
      '[data-role-title="specialist"]'
    );

  const parentRoleDescription =
    document.querySelector(
      '[data-role-description="parent"]'
    );

  const specialistRoleDescription =
    document.querySelector(
      '[data-role-description="specialist"]'
    );

  /* =======================================================
     Form Fields
     ======================================================= */

  const fields = {
    fullName: {
      wrapper:
        document.getElementById("fullNameField"),

      input:
        fullNameInput,

      error:
        document.getElementById("fullNameError")
    },

    email: {
      wrapper:
        document.getElementById("emailField"),

      input:
        emailInput,

      error:
        document.getElementById("emailError")
    },

    phone: {
      wrapper:
        document.getElementById("phoneField"),

      input:
        phoneInput,

      error:
        document.getElementById("phoneError")
    },

    password: {
      wrapper:
        document.getElementById("passwordField"),

      input:
        passwordInput,

      error:
        document.getElementById("passwordError")
    },

    confirmPassword: {
      wrapper:
        document.getElementById("confirmPasswordField"),

      input:
        confirmPasswordInput,

      error:
        document.getElementById("confirmPasswordError")
    },

    specialty: {
      wrapper:
        document.getElementById("specialtyField"),

      input:
        specialtyInput,

      error:
        document.getElementById("specialtyError")
    },

    experience: {
      wrapper:
        document.getElementById("experienceField"),

      input:
        experienceInput,

      error:
        document.getElementById("experienceError")
    },

    consultation: {
      wrapper:
        document.getElementById("consultationField"),

      input:
        consultationInput,

      error:
        document.getElementById("consultationError")
    }
  };

  const termsField =
    document.getElementById("termsField");

  const termsError =
    document.getElementById("termsError");

  /* =======================================================
     State
     ======================================================= */

  let selectedRole = "parent";
  let currentLanguage = "en";
  let isSubmitting = false;

  /* =======================================================
     Translations
     ======================================================= */

  const translations = {
    en: {
      backHome:
        "Back to Home",

      eyebrow:
        "One connected space for families and specialists",

      storyTitle:
        "Join Rafiq and start your journey.",

      storyText:
        "For parents who want clearer guidance, and specialists who want to support families through one connected platform.",

      kicker:
        "Start your RAFIQ journey",

      registerTitle:
        "Create your account",

      registerSubtitle:
        "Choose how you want to join Rafiq.",

      joinAs:
        "I want to join as",

      parent:
        "Parent",

      specialist:
        "Specialist",

      parentDescription:
        "I want to follow my child’s development, get guidance, complete screening and book specialists.",

      specialistDescription:
        "I want to create a professional profile, manage availability, receive bookings and support families.",

      fullName:
        "Full Name",

      email:
        "Email",

      phone:
        "Phone Number",

      password:
        "Password",

      confirmPassword:
        "Confirm Password",

      passwordStrength:
        "Password strength",

      reqLength:
        "Minimum 8 characters",

      reqUppercase:
        "One uppercase letter",

      reqNumber:
        "One number",

      professionalDetails:
        "Professional details",

      specialty:
        "Specialty",

      experience:
        "Years of Experience",

      consultationType:
        "Consultation Type",

      preferredLanguage:
        "Preferred Language",

      agreeTerms:
        "I agree to the",

      termsLink:
        "Terms of Use",

      and:
        "and",

      privacyLink:
        "Privacy Policy",

      verificationText:
        "Specialist accounts require verification before becoming visible to parents.",

      alreadyAccount:
        "Already have an account?",

      login:
        "Log In",

      securityText:
        "Your information is kept private and protected.",

      parentButton:
        "Create Parent Account",

      specialistButton:
        "Create Specialist Account",

      fullNamePlaceholder:
        "Your full name",

      phonePlaceholder:
        "+962 7X XXX XXXX",

      passwordPlaceholder:
        "Create a password",

      confirmPasswordPlaceholder:
        "Repeat your password",

      chooseSpecialty:
        "Choose your specialty",

      chooseConsultation:
        "Choose type",

      showPassword:
        "Show password",

      hidePassword:
        "Hide password",

      weak:
        "Weak",

      medium:
        "Medium",

      strong:
        "Strong",

      fullNameRequired:
        "Please enter your full name.",

      emailRequired:
        "Please enter your email address.",

      emailInvalid:
        "Please enter a valid email address.",

      phoneRequired:
        "Please enter your phone number.",

      passwordRequired:
        "Please create a password.",

      passwordRequirements:
        "Use at least 8 characters, one uppercase letter and one number.",

      confirmRequired:
        "Please confirm your password.",

      passwordsMismatch:
        "Passwords do not match.",

      specialtyRequired:
        "Please choose your specialty.",

      experienceRequired:
        "Please enter your years of experience.",

      experienceInvalid:
        "Please enter a valid number of years.",

      consultationRequired:
        "Please choose a consultation type.",

      termsRequired:
        "You must agree to the Terms of Use and Privacy Policy.",

      formInvalid:
        "Please review the highlighted fields before continuing.",

      loading:
        "Creating your account...",

      success:
        "Account created successfully!",

      parentRedirect:
        "Account created. Opening parent onboarding...",

      specialistRedirect:
        "Account created. Opening specialist onboarding..."
    },

    ar: {
      backHome:
        "العودة للرئيسية",

      eyebrow:
        "مساحة واحدة متصلة للعائلات والأخصائيين",

      storyTitle:
        "انضم إلى رفيق وابدأ رحلتك.",

      storyText:
        "للأهل الذين يبحثون عن إرشاد أوضح، وللأخصائيين الذين يريدون دعم العائلات من خلال منصة واحدة متكاملة.",

      kicker:
        "ابدأ رحلتك مع رفيق",

      registerTitle:
        "إنشاء حساب جديد",

      registerSubtitle:
        "اختر كيف تريد الانضمام إلى رفيق.",

      joinAs:
        "أريد الانضمام بصفة",

      parent:
        "ولي أمر",

      specialist:
        "أخصائي",

      parentDescription:
        "أريد متابعة تطور طفلي والحصول على الإرشاد وإجراء التقييمات وحجز الأخصائيين.",

      specialistDescription:
        "أريد إنشاء ملف مهني وإدارة مواعيدي واستقبال الحجوزات ودعم العائلات.",

      fullName:
        "الاسم الكامل",

      email:
        "البريد الإلكتروني",

      phone:
        "رقم الهاتف",

      password:
        "كلمة المرور",

      confirmPassword:
        "تأكيد كلمة المرور",

      passwordStrength:
        "قوة كلمة المرور",

      reqLength:
        "8 أحرف على الأقل",

      reqUppercase:
        "حرف إنجليزي كبير واحد",

      reqNumber:
        "رقم واحد على الأقل",

      professionalDetails:
        "البيانات المهنية",

      specialty:
        "التخصص",

      experience:
        "سنوات الخبرة",

      consultationType:
        "نوع الاستشارة",

      preferredLanguage:
        "اللغة المفضلة",

      agreeTerms:
        "أوافق على",

      termsLink:
        "شروط الاستخدام",

      and:
        "و",

      privacyLink:
        "سياسة الخصوصية",

      verificationText:
        "تحتاج حسابات الأخصائيين إلى التحقق قبل ظهورها للأهل.",

      alreadyAccount:
        "لديك حساب بالفعل؟",

      login:
        "تسجيل الدخول",

      securityText:
        "يتم الحفاظ على معلوماتك بشكل خاص وآمن.",

      parentButton:
        "إنشاء حساب ولي أمر",

      specialistButton:
        "إنشاء حساب أخصائي",

      fullNamePlaceholder:
        "أدخل اسمك الكامل",

      phonePlaceholder:
        "+962 7X XXX XXXX",

      passwordPlaceholder:
        "أنشئ كلمة مرور",

      confirmPasswordPlaceholder:
        "أعد كتابة كلمة المرور",

      chooseSpecialty:
        "اختر تخصصك",

      chooseConsultation:
        "اختر نوع الاستشارة",

      showPassword:
        "إظهار كلمة المرور",

      hidePassword:
        "إخفاء كلمة المرور",

      weak:
        "ضعيفة",

      medium:
        "متوسطة",

      strong:
        "قوية",

      fullNameRequired:
        "يرجى إدخال الاسم الكامل.",

      emailRequired:
        "يرجى إدخال البريد الإلكتروني.",

      emailInvalid:
        "يرجى إدخال بريد إلكتروني صحيح.",

      phoneRequired:
        "يرجى إدخال رقم الهاتف.",

      passwordRequired:
        "يرجى إنشاء كلمة مرور.",

      passwordRequirements:
        "استخدم 8 أحرف على الأقل، وحرفًا إنجليزيًا كبيرًا، ورقمًا واحدًا.",

      confirmRequired:
        "يرجى تأكيد كلمة المرور.",

      passwordsMismatch:
        "كلمتا المرور غير متطابقتين.",

      specialtyRequired:
        "يرجى اختيار التخصص.",

      experienceRequired:
        "يرجى إدخال سنوات الخبرة.",

      experienceInvalid:
        "يرجى إدخال عدد صحيح لسنوات الخبرة.",

      consultationRequired:
        "يرجى اختيار نوع الاستشارة.",

      termsRequired:
        "يجب الموافقة على شروط الاستخدام وسياسة الخصوصية.",

      formInvalid:
        "يرجى مراجعة الحقول المحددة قبل المتابعة.",

      loading:
        "جارٍ إنشاء حسابك...",

      success:
        "تم إنشاء الحساب بنجاح!",

      parentRedirect:
        "تم إنشاء الحساب. جارٍ فتح إعداد حساب ولي الأمر...",

      specialistRedirect:
        "تم إنشاء الحساب. جارٍ فتح إعداد حساب الأخصائي..."
    }
  };

  /* =======================================================
     Role Selection
     ======================================================= */

  function setRole(role) {
    if (
      role !== "parent" &&
      role !== "specialist"
    ) {
      role = "parent";
    }

    selectedRole = role;

    roleCards.forEach((card) => {
      const isSelected =
        card.dataset.role === role;

      card.classList.toggle(
        "selected",
        isSelected
      );

      card.setAttribute(
        "aria-pressed",
        String(isSelected)
      );
    });

    const isSpecialist =
      role === "specialist";

    body.classList.toggle(
      "specialist-mode",
      isSpecialist
    );

    specialistFields.hidden =
      !isSpecialist;

    verificationNote.hidden =
      !isSpecialist;

    languageBothOption.hidden =
      !isSpecialist;

    if (!isSpecialist) {
      specialtyInput.value = "";
      experienceInput.value = "";
      consultationInput.value = "";

      clearFieldState(fields.specialty);
      clearFieldState(fields.experience);
      clearFieldState(fields.consultation);

      if (
        preferredLanguageInput.value ===
        "both"
      ) {
        preferredLanguageInput.value =
          "english";
      }
    }

    updateRoleContent();
    clearStatus();

    if (!isSubmitting) {
      submitButton.classList.remove(
        "is-loading",
        "is-success"
      );
    }
  }

  function updateRoleContent() {
    const text =
      translations[currentLanguage];

    submitButtonText.textContent =
      selectedRole === "parent"
        ? text.parentButton
        : text.specialistButton;
  }

  roleCards.forEach((card) => {
    card.addEventListener(
      "click",
      () => {
        if (isSubmitting) {
          return;
        }

        setRole(card.dataset.role);
      }
    );
  });

  /* =======================================================
     URL Role Support
     ======================================================= */

  function applyRoleFromURL() {
    const parameters =
      new URLSearchParams(
        window.location.search
      );

    const urlRole =
      parameters
        .get("role")
        ?.toLowerCase();

    if (
      urlRole === "parent" ||
      urlRole === "specialist"
    ) {
      setRole(urlRole);
    } else {
      setRole("parent");
    }
  }

  /* =======================================================
     Password Toggle
     ======================================================= */

  passwordToggles.forEach((toggle) => {
    toggle.addEventListener(
      "click",
      () => {
        const targetId =
          toggle.dataset.passwordTarget;

        const input =
          document.getElementById(
            targetId
          );

        if (!input) {
          return;
        }

        const isHidden =
          input.type === "password";

        input.type =
          isHidden
            ? "text"
            : "password";

        toggle.classList.toggle(
          "is-visible",
          isHidden
        );

        toggle.setAttribute(
          "aria-pressed",
          String(isHidden)
        );

        toggle.setAttribute(
          "aria-label",
          isHidden
            ? translations[currentLanguage]
                .hidePassword
            : translations[currentLanguage]
                .showPassword
        );

        input.focus();

        try {
          const length =
            input.value.length;

          input.setSelectionRange(
            length,
            length
          );
        } catch (error) {
          // No action required.
        }
      }
    );
  });

  /* =======================================================
     Password Strength
     ======================================================= */

  function getPasswordChecks(password) {
    return {
      length:
        password.length >= 8,

      uppercase:
        /[A-Z]/.test(password),

      number:
        /\d/.test(password)
    };
  }

  function updatePasswordStrength() {
    const password =
      passwordInput.value;

    const checks =
      getPasswordChecks(password);

    document
      .querySelectorAll(
        ".password-requirements li"
      )
      .forEach((item) => {
        const requirement =
          item.dataset.requirement;

        item.classList.toggle(
          "met",
          Boolean(checks[requirement])
        );
      });

    if (!password) {
      passwordStrength.removeAttribute(
        "data-strength"
      );

      strengthLabel.textContent = "—";

      return;
    }

    let score = 0;

    if (checks.length) {
      score += 1;
    }

    if (checks.uppercase) {
      score += 1;
    }

    if (checks.number) {
      score += 1;
    }

    if (
      password.length >= 12 &&
      /[^A-Za-z0-9]/.test(password)
    ) {
      score += 1;
    }

    let strength;

    if (score <= 1) {
      strength = "weak";
    } else if (score <= 2) {
      strength = "medium";
    } else {
      strength = "strong";
    }

    passwordStrength.dataset.strength =
      strength;

    strengthLabel.textContent =
      translations[currentLanguage][
        strength
      ];
  }

  passwordInput.addEventListener(
    "input",
    () => {
      updatePasswordStrength();

      if (
        fields.password.wrapper
          .classList
          .contains("has-error")
      ) {
        validatePassword();
      }

      if (
        confirmPasswordInput.value &&
        fields.confirmPassword.wrapper
          .classList
          .contains("has-error")
      ) {
        validateConfirmPassword();
      }
    }
  );

  /* =======================================================
     Field Error Helpers
     ======================================================= */

  function setFieldError(
    field,
    message
  ) {
    field.wrapper.classList.add(
      "has-error"
    );

    field.wrapper.classList.remove(
      "is-valid"
    );

    field.error.textContent =
      message;
  }

  function setFieldValid(field) {
    field.wrapper.classList.remove(
      "has-error"
    );

    field.wrapper.classList.add(
      "is-valid"
    );

    field.error.textContent = "";
  }

  function clearFieldState(field) {
    field.wrapper.classList.remove(
      "has-error",
      "is-valid"
    );

    field.error.textContent = "";
  }

  /* =======================================================
     Validation
     ======================================================= */

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(value);
  }

  function validateFullName() {
    const value =
      fullNameInput.value.trim();

    if (!value) {
      setFieldError(
        fields.fullName,
        translations[currentLanguage]
          .fullNameRequired
      );

      return false;
    }

    setFieldValid(
      fields.fullName
    );

    return true;
  }

  function validateEmail() {
    const value =
      emailInput.value.trim();

    if (!value) {
      setFieldError(
        fields.email,
        translations[currentLanguage]
          .emailRequired
      );

      return false;
    }

    if (!isValidEmail(value)) {
      setFieldError(
        fields.email,
        translations[currentLanguage]
          .emailInvalid
      );

      return false;
    }

    setFieldValid(
      fields.email
    );

    return true;
  }

  function validatePhone() {
    const value =
      phoneInput.value.trim();

    if (!value) {
      setFieldError(
        fields.phone,
        translations[currentLanguage]
          .phoneRequired
      );

      return false;
    }

    setFieldValid(
      fields.phone
    );

    return true;
  }

  function validatePassword() {
    const value =
      passwordInput.value;

    const text =
      translations[currentLanguage];

    if (!value) {
      setFieldError(
        fields.password,
        text.passwordRequired
      );

      return false;
    }

    const checks =
      getPasswordChecks(value);

    if (
      !checks.length ||
      !checks.uppercase ||
      !checks.number
    ) {
      setFieldError(
        fields.password,
        text.passwordRequirements
      );

      return false;
    }

    setFieldValid(
      fields.password
    );

    return true;
  }

  function validateConfirmPassword() {
    const value =
      confirmPasswordInput.value;

    const text =
      translations[currentLanguage];

    if (!value) {
      setFieldError(
        fields.confirmPassword,
        text.confirmRequired
      );

      return false;
    }

    if (
      value !==
      passwordInput.value
    ) {
      setFieldError(
        fields.confirmPassword,
        text.passwordsMismatch
      );

      return false;
    }

    setFieldValid(
      fields.confirmPassword
    );

    return true;
  }

  function validateSpecialty() {
    if (
      selectedRole !==
      "specialist"
    ) {
      return true;
    }

    if (!specialtyInput.value) {
      setFieldError(
        fields.specialty,
        translations[currentLanguage]
          .specialtyRequired
      );

      return false;
    }

    setFieldValid(
      fields.specialty
    );

    return true;
  }

  function validateExperience() {
    if (
      selectedRole !==
      "specialist"
    ) {
      return true;
    }

    const value =
      experienceInput.value.trim();

    const text =
      translations[currentLanguage];

    if (!value) {
      setFieldError(
        fields.experience,
        text.experienceRequired
      );

      return false;
    }

    const numericValue =
      Number(value);

    if (
      Number.isNaN(numericValue) ||
      numericValue < 0 ||
      numericValue > 60
    ) {
      setFieldError(
        fields.experience,
        text.experienceInvalid
      );

      return false;
    }

    setFieldValid(
      fields.experience
    );

    return true;
  }

  function validateConsultation() {
    if (
      selectedRole !==
      "specialist"
    ) {
      return true;
    }

    if (!consultationInput.value) {
      setFieldError(
        fields.consultation,
        translations[currentLanguage]
          .consultationRequired
      );

      return false;
    }

    setFieldValid(
      fields.consultation
    );

    return true;
  }

  function validateTerms() {
    if (!termsInput.checked) {
      termsField.classList.add(
        "has-error"
      );

      termsError.textContent =
        translations[currentLanguage]
          .termsRequired;

      return false;
    }

    termsField.classList.remove(
      "has-error"
    );

    termsError.textContent = "";

    return true;
  }

  /* =======================================================
     Live / Blur Validation
     ======================================================= */

  fullNameInput.addEventListener(
    "blur",
    validateFullName
  );

  emailInput.addEventListener(
    "blur",
    validateEmail
  );

  phoneInput.addEventListener(
    "blur",
    validatePhone
  );

  passwordInput.addEventListener(
    "blur",
    validatePassword
  );

  confirmPasswordInput.addEventListener(
    "blur",
    validateConfirmPassword
  );

  specialtyInput.addEventListener(
    "change",
    validateSpecialty
  );

  experienceInput.addEventListener(
    "blur",
    validateExperience
  );

  consultationInput.addEventListener(
    "change",
    validateConsultation
  );

  termsInput.addEventListener(
    "change",
    validateTerms
  );

  fullNameInput.addEventListener(
    "input",
    () => {
      if (
        fields.fullName.wrapper
          .classList
          .contains("has-error")
      ) {
        validateFullName();
      }
    }
  );

  emailInput.addEventListener(
    "input",
    () => {
      if (
        fields.email.wrapper
          .classList
          .contains("has-error")
      ) {
        validateEmail();
      }
    }
  );

  phoneInput.addEventListener(
    "input",
    () => {
      if (
        fields.phone.wrapper
          .classList
          .contains("has-error")
      ) {
        validatePhone();
      }
    }
  );

  confirmPasswordInput.addEventListener(
    "input",
    () => {
      if (
        fields.confirmPassword.wrapper
          .classList
          .contains("has-error")
      ) {
        validateConfirmPassword();
      }
    }
  );

  experienceInput.addEventListener(
    "input",
    () => {
      if (
        fields.experience.wrapper
          .classList
          .contains("has-error")
      ) {
        validateExperience();
      }
    }
  );

  /* =======================================================
     Terms Click Behaviour
     Prevent checkbox toggling when opening links
     ======================================================= */

  document
    .querySelectorAll(
      ".terms-option a"
    )
    .forEach((link) => {
      link.addEventListener(
        "click",
        (event) => {
          event.stopPropagation();
        }
      );
    });

  /* =======================================================
     Status
     ======================================================= */

  function setStatus(
    message,
    type
  ) {
    formStatus.textContent =
      message;

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
      formStatus.classList.add(
        type
      );
    }
  }

  function clearStatus() {
    setStatus("", "");
  }

  /* =======================================================
     Full Validation
     ======================================================= */

  function validateForm() {
    const results = [
      validateFullName(),
      validateEmail(),
      validatePhone(),
      validatePassword(),
      validateConfirmPassword()
    ];

    if (
      selectedRole ===
      "specialist"
    ) {
      results.push(
        validateSpecialty(),
        validateExperience(),
        validateConsultation()
      );
    }

    results.push(
      validateTerms()
    );

    return results.every(
      Boolean
    );
  }

  function focusFirstInvalidField() {
    const candidateFields = [
      fields.fullName,
      fields.email,
      fields.phone,
      fields.password,
      fields.confirmPassword
    ];

    if (
      selectedRole ===
      "specialist"
    ) {
      candidateFields.push(
        fields.specialty,
        fields.experience,
        fields.consultation
      );
    }

    const firstInvalid =
      candidateFields.find(
        (field) =>
          field.wrapper
            .classList
            .contains("has-error")
      );

    if (firstInvalid) {
      firstInvalid.input.focus();

      return;
    }

    if (
      termsField.classList.contains(
        "has-error"
      )
    ) {
      termsInput.focus();
    }
  }

  /* =======================================================
     Submit / Mock Registration
     ======================================================= */

  registerForm.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      const valid =
        validateForm();

      if (!valid) {
        setStatus(
          translations[currentLanguage]
            .formInvalid,
          "error"
        );

        focusFirstInvalidField();

        return;
      }

      startRegistration();
    }
  );

  function startRegistration() {
    isSubmitting = true;

    clearStatus();

    submitButton.disabled = true;

    submitButton.classList.remove(
      "is-success"
    );

    submitButton.classList.add(
      "is-loading"
    );

    loadingText.textContent =
      translations[currentLanguage]
        .loading;

    /*
      Frontend-only simulated request.
    */
    window.setTimeout(
      () => {
        submitButton.classList.remove(
          "is-loading"
        );

        submitButton.classList.add(
          "is-success"
        );

        successText.textContent =
          translations[currentLanguage]
            .success;

        const successMessage =
          selectedRole === "parent"
            ? translations[currentLanguage]
                .parentRedirect
            : translations[currentLanguage]
                .specialistRedirect;

        setStatus(
          successMessage,
          "success"
        );

        /*
          Mock onboarding redirect.
        */
        window.setTimeout(
          () => {
            const destination =
              selectedRole === "parent"
                ? "../pearent-cycel/onboarding.html"
                : "../specialist-cycle/specialist-onboarding.html";

            window.location.href =
              destination;
          },
          1000
        );
      },
      1100
    );
  }

  /* =======================================================
     Language
     ======================================================= */

  function setLanguage(language) {
    if (
      language !== "en" &&
      language !== "ar"
    ) {
      return;
    }

    currentLanguage =
      language;

    const isArabic =
      language === "ar";

    root.lang =
      isArabic
        ? "ar"
        : "en";

    root.dir =
      isArabic
        ? "rtl"
        : "ltr";

    updateTranslations();
    updateLanguageButtons();

    if (
      fields.fullName.wrapper
        .classList
        .contains("has-error")
    ) {
      validateFullName();
    }

    if (
      fields.email.wrapper
        .classList
        .contains("has-error")
    ) {
      validateEmail();
    }

    if (
      fields.phone.wrapper
        .classList
        .contains("has-error")
    ) {
      validatePhone();
    }

    if (
      fields.password.wrapper
        .classList
        .contains("has-error")
    ) {
      validatePassword();
    }

    if (
      fields.confirmPassword.wrapper
        .classList
        .contains("has-error")
    ) {
      validateConfirmPassword();
    }

    if (
      fields.specialty.wrapper
        .classList
        .contains("has-error")
    ) {
      validateSpecialty();
    }

    if (
      fields.experience.wrapper
        .classList
        .contains("has-error")
    ) {
      validateExperience();
    }

    if (
      fields.consultation.wrapper
        .classList
        .contains("has-error")
    ) {
      validateConsultation();
    }

    if (
      termsField.classList.contains(
        "has-error"
      )
    ) {
      validateTerms();
    }

    passwordToggles.forEach(
      (toggle) => {
        const target =
          document.getElementById(
            toggle.dataset.passwordTarget
          );

        toggle.setAttribute(
          "aria-label",
          target.type === "text"
            ? translations[currentLanguage]
                .hidePassword
            : translations[currentLanguage]
                .showPassword
        );
      }
    );

    updatePasswordStrength();

    if (!isSubmitting) {
      clearStatus();
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

    parentRoleTitle.textContent =
      text.parent;

    specialistRoleTitle.textContent =
      text.specialist;

    parentRoleDescription.textContent =
      text.parentDescription;

    specialistRoleDescription.textContent =
      text.specialistDescription;

    fullNameInput.placeholder =
      text.fullNamePlaceholder;

    phoneInput.placeholder =
      text.phonePlaceholder;

    passwordInput.placeholder =
      text.passwordPlaceholder;

    confirmPasswordInput.placeholder =
      text.confirmPasswordPlaceholder;

    optionTranslations.forEach(
      (option) => {
        const key =
          option.dataset.i18nOption;

        if (
          Object.prototype.hasOwnProperty.call(
            text,
            key
          )
        ) {
          option.textContent =
            text[key];
        }
      }
    );

    loadingText.textContent =
      text.loading;

    successText.textContent =
      text.success;

    updateRoleContent();
  }

  function updateLanguageButtons() {
    languageButtons.forEach(
      (button) => {
        const active =
          button.dataset.language ===
          currentLanguage;

        button.classList.toggle(
          "active",
          active
        );

        button.setAttribute(
          "aria-pressed",
          String(active)
        );
      }
    );

    mobileLanguageButtons.forEach(
      (button) => {
        const active =
          button.dataset.mobileLanguage ===
          currentLanguage;

        button.classList.toggle(
          "active",
          active
        );
      }
    );
  }

  languageButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          setLanguage(
            button.dataset.language
          );
        }
      );
    }
  );

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
     Keyboard Support for Role Cards
     ======================================================= */

  roleCards.forEach(
    (card, index) => {
      card.addEventListener(
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
              roleCards.length
            ) %
            roleCards.length;

          const nextCard =
            roleCards[nextIndex];

          nextCard.focus();

          setRole(
            nextCard.dataset.role
          );
        }
      );
    }
  );

  /* =======================================================
     Background Parallax
     ======================================================= */

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

  let animationFrame = null;

  function handlePointerMove(event) {
    if (reducedMotion.matches) {
      return;
    }

    if (animationFrame) {
      cancelAnimationFrame(
        animationFrame
      );
    }

    animationFrame =
      requestAnimationFrame(
        () => {
          const normalizedX =
            (
              event.clientX /
              window.innerWidth -
              .5
            ) * 2;

          const normalizedY =
            (
              event.clientY /
              window.innerHeight -
              .5
            ) * 2;

          root.style.setProperty(
            "--mouse-x",
            `${normalizedX * 18}px`
          );

          root.style.setProperty(
            "--mouse-y",
            `${normalizedY * 18}px`
          );
        }
      );
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

  reducedMotion
    .addEventListener?.(
      "change",
      (event) => {
        if (event.matches) {
          resetParallax();
        }
      }
    );

  /* =======================================================
     Initialize
     ======================================================= */

  setLanguage("en");
  applyRoleFromURL();
  updatePasswordStrength();
});