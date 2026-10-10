/* =========================================================
   RAFIQ FORGOT PASSWORD
   Frontend-only recovery demonstration
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     DOM REFERENCES
     ======================================================= */

  const root =
    document.documentElement;

  const requestState =
    document.getElementById("requestState");

  const successState =
    document.getElementById("successState");

  const resetState =
    document.getElementById("resetState");

  const resetSuccessState =
    document.getElementById("resetSuccessState");

  const forgotPasswordForm =
    document.getElementById("forgotPasswordForm");

  const emailInput =
    document.getElementById("email");

  const emailField =
    document.getElementById("emailField");

  const emailError =
    document.getElementById("emailError");

  const sendResetButton =
    document.getElementById("sendResetButton");

  const requestStatus =
    document.getElementById("requestStatus");

  const submittedEmail =
    document.getElementById("submittedEmail");

  const resendButton =
    document.getElementById("resendButton");

  const resendFeedback =
    document.getElementById("resendFeedback");

  const previewResetButton =
    document.getElementById("previewResetButton");

  const resetBackButton =
    document.getElementById("resetBackButton");

  const resetPasswordForm =
    document.getElementById("resetPasswordForm");

  const newPasswordInput =
    document.getElementById("newPassword");

  const confirmNewPasswordInput =
    document.getElementById("confirmNewPassword");

  const newPasswordField =
    document.getElementById("newPasswordField");

  const confirmNewPasswordField =
    document.getElementById("confirmNewPasswordField");

  const newPasswordError =
    document.getElementById("newPasswordError");

  const confirmNewPasswordError =
    document.getElementById("confirmNewPasswordError");

  const passwordStrength =
    document.getElementById("passwordStrength");

  const strengthLabel =
    document.getElementById("strengthLabel");

  const resetStatus =
    document.getElementById("resetStatus");

  const resetPasswordButton =
    document.getElementById("resetPasswordButton");

  const passwordToggles =
    document.querySelectorAll(".password-toggle");

  const languageButtons =
    document.querySelectorAll("[data-language]");

  const mobileLanguageButtons =
    document.querySelectorAll("[data-mobile-language]");

  const translatableElements =
    document.querySelectorAll("[data-i18n]");

  const sendLoadingText =
    document.querySelector("[data-send-loading]");

  const resendLoadingText =
    document.querySelector("[data-resend-loading]");

  const resetLoadingText =
    document.querySelector("[data-reset-loading]");

  const toast =
    document.getElementById("toast");

  const toastText =
    document.getElementById("toastText");

  /* =======================================================
     APP STATE
     ======================================================= */

  let currentLanguage = "en";

  let submittedEmailAddress = "";

  let requestSubmitting = false;

  let resendSubmitting = false;

  let resetSubmitting = false;

  let toastTimeout = null;

  /* =======================================================
     TRANSLATIONS
     ======================================================= */

  const translations = {

    en: {
      backToLogin:
        "Back to Login",

      eyebrow:
        "PASSWORD RECOVERY",

      forgotTitle:
        "Forgot your password?",

      forgotDescription:
        "No worries. Enter the email linked to your Rafiq account and we'll send you reset instructions.",

      stepEmail:
        "Enter email",

      stepInstructions:
        "Reset instructions",

      stepLogin:
        "Return to login",

      emailAddress:
        "Email Address",

      sendResetLink:
        "Send Reset Link",

      rememberPassword:
        "Remember your password?",

      backToLoginText:
        "Back to Log In",

      emailOnWay:
        "RESET EMAIL ON THE WAY",

      checkInbox:
        "Check your inbox",

      sentInstructions:
        "We sent password reset instructions to:",

      didntReceive:
        "Didn't receive the email?",

      resendEmail:
        "Resend Email",

      demoOnly:
        "FRONTEND DEMO ONLY",

      previewTitle:
        "Preview the reset experience",

      previewText:
        "This simulates the screen a user would see after opening a valid reset link.",

      previewReset:
        "Preview Reset Password",

      back:
        "Back",

      demoResetEyebrow:
        "DEMO RESET PASSWORD",

      createNewPassword:
        "Create a new password",

      newPasswordDescription:
        "Choose a strong password for this frontend reset demonstration.",

      tokenNotice:
        "Demo only — no real reset token or account change is being used.",

      newPassword:
        "New Password",

      passwordStrength:
        "Password strength",

      minimumEight:
        "Minimum 8 characters",

      oneUppercase:
        "One uppercase letter",

      oneNumber:
        "One number",

      confirmNewPassword:
        "Confirm New Password",

      resetPassword:
        "Reset Password",

      allSet:
        "YOU'RE ALL SET",

      passwordUpdated:
        "Password updated successfully.",

      passwordUpdatedText:
        "This frontend demo is complete. You can now return to the RAFIQ login page.",

      accountReady:
        "Your account is ready",

      accountReadyText:
        "Continue to login using your updated password.",

      continueLogin:
        "Continue to Log In",

      securityFooter:
        "RAFIQ keeps account recovery calm, private and secure.",

      emailPlaceholder:
        "you@example.com",

      newPasswordPlaceholder:
        "Create a new password",

      confirmPasswordPlaceholder:
        "Repeat your new password",

      emailInvalid:
        "Please enter a valid email address.",

      requestError:
        "Please check your email address and try again.",

      sending:
        "Sending...",

      resetEmailSentAgain:
        "Reset email sent again.",

      updating:
        "Updating...",

      weak:
        "Weak",

      medium:
        "Medium",

      strong:
        "Strong",

      passwordRequired:
        "Please enter a new password.",

      passwordRequirementsError:
        "Use at least 8 characters, one uppercase letter and one number.",

      confirmPasswordRequired:
        "Please confirm your new password.",

      passwordsMismatch:
        "Passwords do not match.",

      resetFormError:
        "Please review the highlighted fields.",

      showPassword:
        "Show password",

      hidePassword:
        "Hide password"
    },

    ar: {
      backToLogin:
        "العودة لتسجيل الدخول",

      eyebrow:
        "استعادة كلمة المرور",

      forgotTitle:
        "هل نسيت كلمة المرور؟",

      forgotDescription:
        "لا تقلق. أدخل البريد الإلكتروني المرتبط بحساب رفيق وسنقوم بمحاكاة إرسال تعليمات إعادة تعيين كلمة المرور.",

      stepEmail:
        "أدخل البريد",

      stepInstructions:
        "تعليمات الاستعادة",

      stepLogin:
        "العودة للدخول",

      emailAddress:
        "البريد الإلكتروني",

      sendResetLink:
        "إرسال رابط الاستعادة",

      rememberPassword:
        "تذكرت كلمة المرور؟",

      backToLoginText:
        "العودة لتسجيل الدخول",

      emailOnWay:
        "تم إرسال رسالة الاستعادة",

      checkInbox:
        "تحقق من بريدك",

      sentInstructions:
        "تم إرسال تعليمات إعادة تعيين كلمة المرور إلى:",

      didntReceive:
        "لم تصلك الرسالة؟",

      resendEmail:
        "إعادة إرسال البريد",

      demoOnly:
        "عرض تجريبي للواجهة فقط",

      previewTitle:
        "معاينة تجربة إعادة التعيين",

      previewText:
        "يحاكي هذا الشاشة التي سيشاهدها المستخدم بعد فتح رابط استعادة صالح.",

      previewReset:
        "معاينة إعادة تعيين كلمة المرور",

      back:
        "رجوع",

      demoResetEyebrow:
        "إعادة تعيين تجريبية",

      createNewPassword:
        "أنشئ كلمة مرور جديدة",

      newPasswordDescription:
        "اختر كلمة مرور قوية لهذا العرض التجريبي.",

      tokenNotice:
        "للعرض فقط — لا يوجد رمز استعادة حقيقي ولا يتم تعديل حساب فعلي.",

      newPassword:
        "كلمة المرور الجديدة",

      passwordStrength:
        "قوة كلمة المرور",

      minimumEight:
        "8 أحرف على الأقل",

      oneUppercase:
        "حرف إنجليزي كبير واحد",

      oneNumber:
        "رقم واحد على الأقل",

      confirmNewPassword:
        "تأكيد كلمة المرور الجديدة",

      resetPassword:
        "إعادة تعيين كلمة المرور",

      allSet:
        "تمت العملية",

      passwordUpdated:
        "تم تحديث كلمة المرور بنجاح.",

      passwordUpdatedText:
        "اكتمل العرض التجريبي ويمكنك الآن العودة إلى صفحة تسجيل الدخول في رفيق.",

      accountReady:
        "حسابك جاهز",

      accountReadyText:
        "تابع إلى تسجيل الدخول باستخدام كلمة المرور الجديدة.",

      continueLogin:
        "المتابعة إلى تسجيل الدخول",

      securityFooter:
        "رفيق يجعل استعادة الحساب بسيطة وخاصة وآمنة.",

      emailPlaceholder:
        "you@example.com",

      newPasswordPlaceholder:
        "أنشئ كلمة مرور جديدة",

      confirmPasswordPlaceholder:
        "أعد كتابة كلمة المرور",

      emailInvalid:
        "يرجى إدخال بريد إلكتروني صحيح.",

      requestError:
        "يرجى مراجعة البريد الإلكتروني والمحاولة مرة أخرى.",

      sending:
        "جارٍ الإرسال...",

      resetEmailSentAgain:
        "تم إرسال رسالة الاستعادة مرة أخرى.",

      updating:
        "جارٍ التحديث...",

      weak:
        "ضعيفة",

      medium:
        "متوسطة",

      strong:
        "قوية",

      passwordRequired:
        "يرجى إدخال كلمة مرور جديدة.",

      passwordRequirementsError:
        "استخدم 8 أحرف على الأقل وحرفًا إنجليزيًا كبيرًا ورقمًا واحدًا.",

      confirmPasswordRequired:
        "يرجى تأكيد كلمة المرور الجديدة.",

      passwordsMismatch:
        "كلمتا المرور غير متطابقتين.",

      resetFormError:
        "يرجى مراجعة الحقول المحددة.",

      showPassword:
        "إظهار كلمة المرور",

      hidePassword:
        "إخفاء كلمة المرور"
    }
  };

  /* =======================================================
     STATE NAVIGATION
     ======================================================= */

  const states = [
    requestState,
    successState,
    resetState,
    resetSuccessState
  ];

  function showState(stateElement) {

    states.forEach((state) => {
      state.hidden = true;

      state.classList.remove(
        "state-enter"
      );
    });

    stateElement.hidden = false;

    void stateElement.offsetWidth;

    stateElement.classList.add(
      "state-enter"
    );

    window.scrollTo({
      top: 0,
      behavior:
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth"
    });
  }

  /* =======================================================
     EMAIL VALIDATION
     ======================================================= */

  function isValidEmail(email) {

    const pattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(email);
  }

  function validateEmail() {

    const email =
      emailInput.value.trim();

    if (
      !email ||
      !isValidEmail(email)
    ) {

      emailField.classList.add(
        "has-error"
      );

      emailField.classList.remove(
        "is-valid"
      );

      emailError.textContent =
        translations[currentLanguage]
          .emailInvalid;

      return false;
    }

    emailField.classList.remove(
      "has-error"
    );

    emailField.classList.add(
      "is-valid"
    );

    emailError.textContent = "";

    return true;
  }

  emailInput.addEventListener(
    "blur",
    validateEmail
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
      }

      if (!emailInput.value) {

        emailField.classList.remove(
          "has-error",
          "is-valid"
        );

        emailError.textContent = "";
      }
    }
  );

  /* =======================================================
     STATUS HELPER
     ======================================================= */

  function setStatus(
    element,
    message = "",
    type = ""
  ) {

    element.textContent = message;

    element.classList.remove(
      "show",
      "error",
      "success"
    );

    if (!message) {
      return;
    }

    element.classList.add(
      "show"
    );

    if (type) {
      element.classList.add(type);
    }
  }

  /* =======================================================
     SEND RESET EMAIL
     ======================================================= */

  forgotPasswordForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      if (requestSubmitting) {
        return;
      }

      if (!validateEmail()) {

        setStatus(
          requestStatus,
          translations[currentLanguage]
            .requestError,
          "error"
        );

        emailInput.focus();

        return;
      }

      startSendReset();
    }
  );

  function startSendReset() {

    requestSubmitting = true;

    submittedEmailAddress =
      emailInput.value.trim();

    setStatus(
      requestStatus
    );

    sendResetButton.disabled = true;

    sendResetButton.classList.add(
      "is-loading"
    );

    sendLoadingText.textContent =
      translations[currentLanguage]
        .sending;

    /*
      Frontend-only fake delay.
      No API or email service is called.
    */
    window.setTimeout(
      () => {

        sendResetButton.classList.remove(
          "is-loading"
        );

        sendResetButton.disabled = false;

        requestSubmitting = false;

        submittedEmail.textContent =
          submittedEmailAddress;

        showState(successState);

      },
      950
    );
  }

  /* =======================================================
     RESEND EMAIL
     ======================================================= */

  resendButton.addEventListener(
    "click",
    () => {

      if (resendSubmitting) {
        return;
      }

      resendSubmitting = true;

      resendFeedback.classList.remove(
        "show"
      );

      resendButton.disabled = true;

      resendButton.classList.add(
        "is-loading"
      );

      resendLoadingText.textContent =
        translations[currentLanguage]
          .sending;

      window.setTimeout(
        () => {

          resendButton.disabled = false;

          resendButton.classList.remove(
            "is-loading"
          );

          resendSubmitting = false;

          resendFeedback.textContent =
            translations[currentLanguage]
              .resetEmailSentAgain;

          resendFeedback.classList.add(
            "show"
          );

          showToast(
            translations[currentLanguage]
              .resetEmailSentAgain
          );

          window.setTimeout(
            () => {
              resendFeedback.classList.remove(
                "show"
              );
            },
            2600
          );

        },
        750
      );
    }
  );

  /* =======================================================
     TOAST
     ======================================================= */

  function showToast(message) {

    toastText.textContent = message;

    toast.classList.add(
      "show"
    );

    if (toastTimeout) {
      window.clearTimeout(
        toastTimeout
      );
    }

    toastTimeout =
      window.setTimeout(
        () => {
          toast.classList.remove(
            "show"
          );
        },
        2600
      );
  }

  /* =======================================================
     DEMO RESET NAVIGATION
     ======================================================= */

  previewResetButton.addEventListener(
    "click",
    () => {

      clearResetForm();

      showState(resetState);

      window.setTimeout(
        () => {
          newPasswordInput.focus();
        },
        100
      );
    }
  );

  resetBackButton.addEventListener(
    "click",
    () => {

      showState(successState);
    }
  );

  /* =======================================================
     PASSWORD TOGGLES
     ======================================================= */

  passwordToggles.forEach(
    (toggle) => {

      toggle.addEventListener(
        "click",
        () => {

          const targetId =
            toggle.dataset
              .passwordTarget;

          const input =
            document.getElementById(
              targetId
            );

          if (!input) {
            return;
          }

          const currentlyHidden =
            input.type === "password";

          input.type =
            currentlyHidden
              ? "text"
              : "password";

          toggle.classList.toggle(
            "is-visible",
            currentlyHidden
          );

          toggle.setAttribute(
            "aria-pressed",
            String(currentlyHidden)
          );

          toggle.setAttribute(
            "aria-label",
            currentlyHidden
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

            /*
              No action needed.
            */
          }
        }
      );
    }
  );

  /* =======================================================
     PASSWORD STRENGTH
     ======================================================= */

  function getPasswordChecks(
    password
  ) {

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
      newPasswordInput.value;

    const checks =
      getPasswordChecks(
        password
      );

    document
      .querySelectorAll(
        ".password-requirements li"
      )
      .forEach((item) => {

        const requirement =
          item.dataset.requirement;

        item.classList.toggle(
          "met",
          Boolean(
            checks[requirement]
          )
        );
      });

    if (!password) {

      passwordStrength
        .removeAttribute(
          "data-strength"
        );

      strengthLabel.textContent =
        "—";

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
      /[^A-Za-z0-9]/.test(
        password
      )
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

  /* =======================================================
     PASSWORD FIELD HELPERS
     ======================================================= */

  function setPasswordError(
    field,
    errorElement,
    message
  ) {

    field.classList.add(
      "has-error"
    );

    field.classList.remove(
      "is-valid"
    );

    errorElement.textContent =
      message;
  }

  function setPasswordValid(
    field,
    errorElement
  ) {

    field.classList.remove(
      "has-error"
    );

    field.classList.add(
      "is-valid"
    );

    errorElement.textContent = "";
  }

  function clearPasswordField(
    field,
    errorElement
  ) {

    field.classList.remove(
      "has-error",
      "is-valid"
    );

    errorElement.textContent = "";
  }

  /* =======================================================
     PASSWORD VALIDATION
     ======================================================= */

  function validateNewPassword() {

    const password =
      newPasswordInput.value;

    const text =
      translations[currentLanguage];

    if (!password) {

      setPasswordError(
        newPasswordField,
        newPasswordError,
        text.passwordRequired
      );

      return false;
    }

    const checks =
      getPasswordChecks(
        password
      );

    if (
      !checks.length ||
      !checks.uppercase ||
      !checks.number
    ) {

      setPasswordError(
        newPasswordField,
        newPasswordError,
        text.passwordRequirementsError
      );

      return false;
    }

    setPasswordValid(
      newPasswordField,
      newPasswordError
    );

    return true;
  }

  function validateConfirmPassword() {

    const confirmPassword =
      confirmNewPasswordInput.value;

    const text =
      translations[currentLanguage];

    if (!confirmPassword) {

      setPasswordError(
        confirmNewPasswordField,
        confirmNewPasswordError,
        text.confirmPasswordRequired
      );

      return false;
    }

    if (
      confirmPassword !==
      newPasswordInput.value
    ) {

      setPasswordError(
        confirmNewPasswordField,
        confirmNewPasswordError,
        text.passwordsMismatch
      );

      return false;
    }

    setPasswordValid(
      confirmNewPasswordField,
      confirmNewPasswordError
    );

    return true;
  }

  newPasswordInput.addEventListener(
    "input",
    () => {

      updatePasswordStrength();

      if (
        newPasswordField
          .classList
          .contains("has-error")
      ) {
        validateNewPassword();
      }

      if (
        confirmNewPasswordInput.value &&
        confirmNewPasswordField
          .classList
          .contains("has-error")
      ) {
        validateConfirmPassword();
      }
    }
  );

  newPasswordInput.addEventListener(
    "blur",
    validateNewPassword
  );

  confirmNewPasswordInput.addEventListener(
    "input",
    () => {

      if (
        confirmNewPasswordField
          .classList
          .contains("has-error")
      ) {
        validateConfirmPassword();
      }
    }
  );

  confirmNewPasswordInput.addEventListener(
    "blur",
    validateConfirmPassword
  );

  /* =======================================================
     RESET SUBMIT
     ======================================================= */

  resetPasswordForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      if (resetSubmitting) {
        return;
      }

      const passwordValid =
        validateNewPassword();

      const confirmationValid =
        validateConfirmPassword();

      if (
        !passwordValid ||
        !confirmationValid
      ) {

        setStatus(
          resetStatus,
          translations[currentLanguage]
            .resetFormError,
          "error"
        );

        if (!passwordValid) {
          newPasswordInput.focus();
        } else {
          confirmNewPasswordInput.focus();
        }

        return;
      }

      startDemoReset();
    }
  );

  function startDemoReset() {

    resetSubmitting = true;

    setStatus(
      resetStatus
    );

    resetPasswordButton.disabled =
      true;

    resetPasswordButton.classList.add(
      "is-loading"
    );

    resetLoadingText.textContent =
      translations[currentLanguage]
        .updating;

    /*
      Frontend-only reset demonstration.
      No real password is changed.
    */
    window.setTimeout(
      () => {

        resetPasswordButton.disabled =
          false;

        resetPasswordButton.classList.remove(
          "is-loading"
        );

        resetSubmitting = false;

        showState(
          resetSuccessState
        );

      },
      950
    );
  }

  function clearResetForm() {

    resetPasswordForm.reset();

    clearPasswordField(
      newPasswordField,
      newPasswordError
    );

    clearPasswordField(
      confirmNewPasswordField,
      confirmNewPasswordError
    );

    setStatus(
      resetStatus
    );

    passwordStrength
      .removeAttribute(
        "data-strength"
      );

    strengthLabel.textContent =
      "—";

    document
      .querySelectorAll(
        ".password-requirements li"
      )
      .forEach((item) => {
        item.classList.remove(
          "met"
        );
      });

    passwordToggles.forEach(
      (toggle) => {

        const input =
          document.getElementById(
            toggle.dataset
              .passwordTarget
          );

        if (input) {
          input.type = "password";
        }

        toggle.classList.remove(
          "is-visible"
        );

        toggle.setAttribute(
          "aria-pressed",
          "false"
        );
      }
    );
  }

  /* =======================================================
     LANGUAGE
     ======================================================= */

  function setLanguage(
    language
  ) {

    if (
      language !== "en" &&
      language !== "ar"
    ) {
      return;
    }

    currentLanguage =
      language;

    const arabic =
      language === "ar";

    root.lang =
      arabic
        ? "ar"
        : "en";

    root.dir =
      arabic
        ? "rtl"
        : "ltr";

    updateTranslations();

    updateLanguageControls();

    updatePasswordStrength();

    if (
      emailField.classList.contains(
        "has-error"
      )
    ) {
      validateEmail();
    }

    if (
      newPasswordField
        .classList
        .contains("has-error")
    ) {
      validateNewPassword();
    }

    if (
      confirmNewPasswordField
        .classList
        .contains("has-error")
    ) {
      validateConfirmPassword();
    }

    passwordToggles.forEach(
      (toggle) => {

        const target =
          document.getElementById(
            toggle.dataset
              .passwordTarget
          );

        if (!target) {
          return;
        }

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

    sendLoadingText.textContent =
      translations[currentLanguage]
        .sending;

    resendLoadingText.textContent =
      translations[currentLanguage]
        .sending;

    resetLoadingText.textContent =
      translations[currentLanguage]
        .updating;
  }

  function updateTranslations() {

    const text =
      translations[currentLanguage];

    translatableElements.forEach(
      (element) => {

        const key =
          element.dataset.i18n;

        if (
          Object.prototype
            .hasOwnProperty
            .call(
              text,
              key
            )
        ) {
          element.textContent =
            text[key];
        }
      }
    );

    emailInput.placeholder =
      text.emailPlaceholder;

    newPasswordInput.placeholder =
      text.newPasswordPlaceholder;

    confirmNewPasswordInput.placeholder =
      text.confirmPasswordPlaceholder;
  }

  function updateLanguageControls() {

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
          button.dataset
            .mobileLanguage ===
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
            button.dataset
              .mobileLanguage
          );
        }
      );
    }
  );

  /* =======================================================
     PARALLAX
     ======================================================= */

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

  let pointerFrame = null;

  function handlePointerMove(
    event
  ) {

    if (
      reducedMotion.matches
    ) {
      return;
    }

    if (pointerFrame) {

      cancelAnimationFrame(
        pointerFrame
      );
    }

    pointerFrame =
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
     INITIALIZATION
     ======================================================= */

  setLanguage("en");

  updatePasswordStrength();

  showState(
    requestState
  );

});