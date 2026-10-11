document.addEventListener(
  "DOMContentLoaded",
  () => {

    // =====================================
    // ROLE GUARD
    // =====================================

    const role =
      sessionStorage.getItem(
        "rafiqRole"
      );


    if (
      role &&
      role !== "admin"
    ) {

      window.location.href =
        "../piblic-pages/login.html";

      return;
    }


    // =====================================
    // STORAGE
    // =====================================

    const SETTINGS_KEY =
      "rafiqAdminSettings";


    function readArray(key) {

      try {

        const value =
          JSON.parse(
            localStorage.getItem(
              key
            )
          );


        return Array.isArray(value)
          ? value
          : [];

      } catch (error) {

        return [];
      }
    }


    function readObject(key) {

      try {

        const value =
          JSON.parse(
            localStorage.getItem(
              key
            )
          );


        return (
          value &&
          typeof value === "object" &&
          !Array.isArray(value)
        )
          ? value
          : null;

      } catch (error) {

        return null;
      }
    }


    function saveSettings() {

      settings.updatedAt =
        new Date()
          .toISOString();


      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(
          settings
        )
      );
    }


    // =====================================
    // DEFAULT SETTINGS
    // =====================================

    const defaultSettings = {

      profile: {

        displayName:
          sessionStorage.getItem(
            "rafiqAdminName"
          ) ||
          "RAFIQ Admin",

        email:
          "admin@rafiq.com",

        department:
          "Platform Operations"
      },


      platform: {

        platformName:
          "RAFIQ",

        supportEmail:
          "support@rafiq.com",

        defaultLanguage:
          "en",

        currency:
          "JOD",

        disclaimer:
          "RAFIQ provides educational and supportive information and does not replace professional medical advice, diagnosis, or emergency services."
      },


      notifications: {

        specialistApplications:
          true,

        bookings:
          true,

        billing:
          true,

        aiChanges:
          true
      },


      updatedAt:
        null
    };


    const storedSettings =
      readObject(
        SETTINGS_KEY
      );


    const settings = {

      ...defaultSettings,

      ...storedSettings,


      profile: {

        ...defaultSettings.profile,

        ...storedSettings?.profile
      },


      platform: {

        ...defaultSettings.platform,

        ...storedSettings?.platform
      },


      notifications: {

        ...defaultSettings.notifications,

        ...storedSettings?.notifications
      }
    };


    // =====================================
    // ELEMENTS
    // =====================================

    const $ =
      id =>
        document.getElementById(
          id
        );


    const adminSidebarName =
      $("adminSidebarName");


    const adminAvatar =
      $("adminAvatar");


    const profileAvatar =
      $("profileAvatar");


    const profilePreviewName =
      $("profilePreviewName");


    const approvalNavCount =
      $("approvalNavCount");


    // SETTINGS NAV

    const settingsNavButtons =
      document.querySelectorAll(
        ".settings-nav-button"
      );


    const settingsSections = {

      profile:
        $("profileSection"),

      platform:
        $("platformSection"),

      notifications:
        $("notificationsSection"),

      security:
        $("securitySection")
    };


    // PROFILE

    const profileForm =
      $("profileForm");


    const adminNameInput =
      $("adminNameInput");


    const adminEmailInput =
      $("adminEmailInput");


    const adminDepartmentInput =
      $("adminDepartmentInput");


    const profileError =
      $("profileError");


    // PLATFORM

    const platformForm =
      $("platformForm");


    const platformNameInput =
      $("platformNameInput");


    const supportEmailInput =
      $("supportEmailInput");


    const defaultLanguageSelect =
      $("defaultLanguageSelect");


    const currencySelect =
      $("currencySelect");


    const platformDisclaimerInput =
      $("platformDisclaimerInput");


    const platformError =
      $("platformError");


    // NOTIFICATIONS

    const notificationForm =
      $("notificationForm");


    const notifySpecialistApplications =
      $("notifySpecialistApplications");


    const notifyBookings =
      $("notifyBookings");


    const notifyBilling =
      $("notifyBilling");


    const notifyAIChanges =
      $("notifyAIChanges");


    // SECURITY

    const currentRoleLabel =
      $("currentRoleLabel");


    const passwordForm =
      $("passwordForm");


    const currentPasswordInput =
      $("currentPasswordInput");


    const newPasswordInput =
      $("newPasswordInput");


    const confirmPasswordInput =
      $("confirmPasswordInput");


    const passwordError =
      $("passwordError");


    const endSessionButton =
      $("endSessionButton");


    // SESSION MODAL

    const sessionModal =
      $("sessionModal");


    const cancelSessionEnd =
      $("cancelSessionEnd");


    const confirmSessionEnd =
      $("confirmSessionEnd");


    // TOAST

    const toast =
      $("toast");


    const toastTitle =
      $("toastTitle");


    const toastMessage =
      $("toastMessage");


    // =====================================
    // INITIALS
    // =====================================

    function getInitials(name) {

      const parts =
        String(name || "")
          .trim()
          .split(/\s+/)
          .filter(Boolean);


      if (
        parts.length === 0
      ) {

        return "A";
      }


      if (
        parts.length === 1
      ) {

        return parts[0]
          .charAt(0)
          .toUpperCase();
      }


      return (
        parts[0][0] +
        parts[
          parts.length - 1
        ][0]
      ).toUpperCase();
    }


    // =====================================
    // ADMIN DISPLAY
    // =====================================

    function renderAdminIdentity() {

      const name =
        settings.profile.displayName ||
        "RAFIQ Admin";


      const initials =
        getInitials(name);


      adminSidebarName.textContent =
        name;


      profilePreviewName.textContent =
        name;


      adminAvatar.textContent =
        initials;


      profileAvatar.textContent =
        initials;
    }


    // =====================================
    // APPROVAL BADGE
    // =====================================

    function renderApprovalBadge() {

      const pending =
        readArray(
          "rafiqSpecialists"
        )
          .filter(
            specialist =>
              (
                specialist.status ||
                "pending"
              ) === "pending"
          );


      if (
        pending.length === 0
      ) {

        approvalNavCount.hidden =
          true;

        return;
      }


      approvalNavCount.hidden =
        false;


      approvalNavCount.textContent =
        pending.length > 9
          ? "9+"
          : pending.length;
    }


    // =====================================
    // SETTINGS NAVIGATION
    // =====================================

    function showSection(
      sectionName
    ) {

      settingsNavButtons
        .forEach(
          button => {

            button.classList.toggle(
              "active",
              button.dataset.section ===
                sectionName
            );

          }
        );


      Object
        .entries(
          settingsSections
        )
        .forEach(
          ([name, section]) => {

            section.classList.toggle(
              "active",
              name ===
                sectionName
            );

          }
        );
    }


    settingsNavButtons
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              showSection(
                button.dataset.section
              );
            }
          );

        }
      );


    // =====================================
    // POPULATE SETTINGS
    // =====================================

    function populateSettings() {

      adminNameInput.value =
        settings.profile.displayName;


      adminEmailInput.value =
        settings.profile.email;


      adminDepartmentInput.value =
        settings.profile.department;


      platformNameInput.value =
        settings.platform.platformName;


      supportEmailInput.value =
        settings.platform.supportEmail;


      defaultLanguageSelect.value =
        settings.platform.defaultLanguage;


      currencySelect.value =
        settings.platform.currency;


      platformDisclaimerInput.value =
        settings.platform.disclaimer;


      notifySpecialistApplications.checked =
        Boolean(
          settings.notifications
            .specialistApplications
        );


      notifyBookings.checked =
        Boolean(
          settings.notifications.bookings
        );


      notifyBilling.checked =
        Boolean(
          settings.notifications.billing
        );


      notifyAIChanges.checked =
        Boolean(
          settings.notifications.aiChanges
        );


      currentRoleLabel.textContent =
        role === "admin"
          ? "Admin"
          : "Admin testing session";


      renderAdminIdentity();
    }


    // =====================================
    // PROFILE FORM
    // =====================================

    profileForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        profileError.textContent =
          "";


        const displayName =
          adminNameInput.value
            .trim();


        const email =
          adminEmailInput.value
            .trim();


        const department =
          adminDepartmentInput.value
            .trim();


        if (!displayName) {

          profileError.textContent =
            "Please enter an admin display name.";

          return;
        }


        if (
          !isValidEmail(email)
        ) {

          profileError.textContent =
            "Please enter a valid admin email.";

          return;
        }


        settings.profile = {

          displayName,

          email,

          department:
            department ||
            "Platform Operations"
        };


        saveSettings();


        /*
          Keep current Admin name available
          across admin pages in this session.
        */

        sessionStorage.setItem(
          "rafiqAdminName",
          displayName
        );


        renderAdminIdentity();


        showToast(
          "Profile saved",
          "Admin profile settings were updated."
        );
      }
    );


    // =====================================
    // LIVE PROFILE PREVIEW
    // =====================================

    adminNameInput.addEventListener(
      "input",
      () => {

        const value =
          adminNameInput.value
            .trim() ||
          "RAFIQ Admin";


        profilePreviewName.textContent =
          value;


        profileAvatar.textContent =
          getInitials(value);
      }
    );


    // =====================================
    // PLATFORM FORM
    // =====================================

    platformForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        platformError.textContent =
          "";


        const platformName =
          platformNameInput.value
            .trim();


        const supportEmail =
          supportEmailInput.value
            .trim();


        const disclaimer =
          platformDisclaimerInput.value
            .trim();


        if (!platformName) {

          platformError.textContent =
            "Please enter a platform name.";

          return;
        }


        if (
          supportEmail &&
          !isValidEmail(
            supportEmail
          )
        ) {

          platformError.textContent =
            "Please enter a valid support email.";

          return;
        }


        if (!disclaimer) {

          platformError.textContent =
            "Please enter a platform disclaimer.";

          return;
        }


        settings.platform = {

          platformName,

          supportEmail,

          defaultLanguage:
            defaultLanguageSelect.value,

          currency:
            currencySelect.value,

          disclaimer
        };


        saveSettings();


        showToast(
          "Platform settings saved",
          "RAFIQ administrative preferences were updated."
        );
      }
    );


    // =====================================
    // NOTIFICATIONS
    // =====================================

    notificationForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        settings.notifications = {

          specialistApplications:
            notifySpecialistApplications
              .checked,

          bookings:
            notifyBookings.checked,

          billing:
            notifyBilling.checked,

          aiChanges:
            notifyAIChanges.checked
        };


        saveSettings();


        showToast(
          "Notifications saved",
          "Admin alert preferences were updated."
        );
      }
    );


    // =====================================
    // PASSWORD DEMO
    // =====================================

    passwordForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        passwordError.textContent =
          "";


        const currentPassword =
          currentPasswordInput.value;


        const newPassword =
          newPasswordInput.value;


        const confirmPassword =
          confirmPasswordInput.value;


        if (
          !currentPassword ||
          !newPassword ||
          !confirmPassword
        ) {

          passwordError.textContent =
            "Please complete all password fields.";

          return;
        }


        if (
          newPassword.length < 8
        ) {

          passwordError.textContent =
            "The new password must contain at least 8 characters.";

          return;
        }


        if (
          newPassword ===
          currentPassword
        ) {

          passwordError.textContent =
            "Choose a new password different from the current one.";

          return;
        }


        if (
          newPassword !==
          confirmPassword
        ) {

          passwordError.textContent =
            "New passwords do not match.";

          return;
        }


        /*
          IMPORTANT:
          Frontend demo only.
          Do NOT save passwords.
        */

        currentPasswordInput.value =
          "";


        newPasswordInput.value =
          "";


        confirmPasswordInput.value =
          "";


        showToast(
          "Validation successful",
          "Prototype password validation passed. No password was stored."
        );
      }
    );


    // =====================================
    // EMAIL VALIDATION
    // =====================================

    function isValidEmail(value) {

      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(value);
    }


    // =====================================
    // SESSION MODAL
    // =====================================

    endSessionButton.addEventListener(
      "click",
      () => {

        sessionModal.hidden =
          false;
      }
    );


    cancelSessionEnd.addEventListener(
      "click",
      () => {

        sessionModal.hidden =
          true;
      }
    );


    confirmSessionEnd.addEventListener(
      "click",
      logout
    );


    sessionModal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          sessionModal
        ) {

          sessionModal.hidden =
            true;
        }
      }
    );


    // =====================================
    // TOAST
    // =====================================

    let toastTimer =
      null;


    function showToast(
      title,
      message
    ) {

      toastTitle.textContent =
        title;


      toastMessage.textContent =
        message;


      toast.hidden =
        false;


      clearTimeout(
        toastTimer
      );


      toastTimer =
        setTimeout(
          () => {

            toast.hidden =
              true;

          },
          2800
        );
    }


    // =====================================
    // SIDEBAR
    // =====================================

    const sidebar =
      $("sidebar");


    const sidebarOverlay =
      $("sidebarOverlay");


    const menuButton =
      $("menuButton");


    const sidebarClose =
      $("sidebarClose");


    function openSidebar() {

      sidebar.classList.add(
        "open"
      );


      sidebarOverlay.classList.add(
        "show"
      );
    }


    function closeSidebar() {

      sidebar.classList.remove(
        "open"
      );


      sidebarOverlay.classList.remove(
        "show"
      );
    }


    menuButton.addEventListener(
      "click",
      openSidebar
    );


    sidebarClose.addEventListener(
      "click",
      closeSidebar
    );


    sidebarOverlay.addEventListener(
      "click",
      closeSidebar
    );


    // =====================================
    // LOGOUT
    // =====================================

    function logout() {

      /*
        IMPORTANT:
        Do not clear localStorage.
        Platform prototype data remains.
      */

      sessionStorage.clear();


      window.location.href =
        "../piblic-pages/login.html";
    }


    $("logoutButton")
      .addEventListener(
        "click",
        logout
      );


    // =====================================
    // ESC
    // =====================================

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key !==
          "Escape"
        ) {

          return;
        }


        if (
          !sessionModal.hidden
        ) {

          sessionModal.hidden =
            true;

          return;
        }


        closeSidebar();
      }
    );


    // =====================================
    // INIT
    // =====================================

    populateSettings();

    renderApprovalBadge();

    showSection(
      "profile"
    );

  }
);