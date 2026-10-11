document.addEventListener(
  "DOMContentLoaded",
  () => {

    // =====================================
    // SPECIALIST PROFILE
    // =====================================

    function getSpecialist() {

      try {

        return JSON.parse(
          localStorage.getItem(
            "rafiqSpecialistProfile"
          )
        );

      } catch (error) {

        return null;
      }
    }


    let specialist =
      getSpecialist();


    if (!specialist) {

      window.location.href =
        "specialist-onboarding.html";

      return;
    }


    // =====================================
    // SETTINGS KEY
    // =====================================

    const SETTINGS_KEY =
      `rafiqSpecialistSettings_${specialist.id}`;


    // =====================================
    // DEFAULT SETTINGS
    // =====================================

    const defaultSettings = {

      specialistId:
        specialist.id,


      language:
        "en",


      notifications: {

        newBooking:
          true,

        bookingChanges:
          true,

        reminders:
          true,

        reportFollowUp:
          true,

        earnings:
          false
      },


      channels: {

        inApp:
          true,

        email:
          false
      },


      updatedAt:
        null
    };


    // =====================================
    // LOAD SETTINGS
    // =====================================

    function getSettings() {

      try {

        const saved =
          JSON.parse(
            localStorage.getItem(
              SETTINGS_KEY
            )
          );


        if (!saved) {

          return {
            ...defaultSettings,

            notifications: {
              ...defaultSettings.notifications
            },

            channels: {
              ...defaultSettings.channels
            }
          };
        }


        return {

          ...defaultSettings,

          ...saved,

          notifications: {

            ...defaultSettings.notifications,

            ...(
              saved.notifications ||
              {}
            )
          },

          channels: {

            ...defaultSettings.channels,

            ...(
              saved.channels ||
              {}
            )
          }
        };

      } catch (error) {

        return {
          ...defaultSettings,

          notifications: {
            ...defaultSettings.notifications
          },

          channels: {
            ...defaultSettings.channels
          }
        };
      }
    }


    let settings =
      getSettings();


    // =====================================
    // ELEMENTS
    // =====================================

    const sidebarAvatar =
      document.getElementById(
        "sidebarAvatar"
      );


    const sidebarName =
      document.getElementById(
        "sidebarName"
      );


    const sidebarSpecialty =
      document.getElementById(
        "sidebarSpecialty"
      );


    const sidebarStatus =
      document.getElementById(
        "sidebarStatus"
      );


    const sidebarStatusText =
      document.getElementById(
        "sidebarStatusText"
      );


    const heroAvatar =
      document.getElementById(
        "heroAvatar"
      );


    const heroName =
      document.getElementById(
        "heroName"
      );


    const heroEmail =
      document.getElementById(
        "heroEmail"
      );


    // ACCOUNT

    const accountStatusText =
      document.getElementById(
        "accountStatusText"
      );


    const accountStatusBadge =
      document.getElementById(
        "accountStatusBadge"
      );


    const accountName =
      document.getElementById(
        "accountName"
      );


    const accountEmail =
      document.getElementById(
        "accountEmail"
      );


    const accountPhone =
      document.getElementById(
        "accountPhone"
      );


    const phoneError =
      document.getElementById(
        "phoneError"
      );


    const accountSaveStatus =
      document.getElementById(
        "accountSaveStatus"
      );


    const saveAccountButton =
      document.getElementById(
        "saveAccountButton"
      );


    // PREFERENCES

    const languageSelect =
      document.getElementById(
        "languageSelect"
      );


    const preferencesSaveStatus =
      document.getElementById(
        "preferencesSaveStatus"
      );


    const savePreferencesButton =
      document.getElementById(
        "savePreferencesButton"
      );


    // NOTIFICATIONS

    const newBookingNotification =
      document.getElementById(
        "newBookingNotification"
      );


    const bookingChangesNotification =
      document.getElementById(
        "bookingChangesNotification"
      );


    const reminderNotification =
      document.getElementById(
        "reminderNotification"
      );


    const reportNotification =
      document.getElementById(
        "reportNotification"
      );


    const earningsNotification =
      document.getElementById(
        "earningsNotification"
      );


    const inAppChannel =
      document.getElementById(
        "inAppChannel"
      );


    const emailChannel =
      document.getElementById(
        "emailChannel"
      );


    const notificationSaveStatus =
      document.getElementById(
        "notificationSaveStatus"
      );


    const saveNotificationsButton =
      document.getElementById(
        "saveNotificationsButton"
      );


    // SECURITY

    const currentPassword =
      document.getElementById(
        "currentPassword"
      );


    const newPassword =
      document.getElementById(
        "newPassword"
      );


    const confirmPassword =
      document.getElementById(
        "confirmPassword"
      );


    const passwordError =
      document.getElementById(
        "passwordError"
      );


    const updatePasswordButton =
      document.getElementById(
        "updatePasswordButton"
      );


    // TOAST

    const settingsToast =
      document.getElementById(
        "settingsToast"
      );


    const toastIcon =
      document.getElementById(
        "toastIcon"
      );


    const toastTitle =
      document.getElementById(
        "toastTitle"
      );


    const toastMessage =
      document.getElementById(
        "toastMessage"
      );


    // =====================================
    // INITIALS
    // =====================================

    function getInitials(
      name
    ) {

      const cleaned =
        String(
          name || ""
        )
          .replace(
            /^(Dr\.?|Mr\.?|Mrs\.?|Ms\.?)\s+/i,
            ""
          )
          .trim();


      const parts =
        cleaned
          .split(/\s+/)
          .filter(Boolean);


      if (
        parts.length === 0
      ) {

        return "DR";
      }


      if (
        parts.length === 1
      ) {

        return parts[0]
          .slice(
            0,
            2
          )
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
    // PROFILE HEADER
    // =====================================

    function renderProfileHeader() {

      const initials =
        getInitials(
          specialist.fullName
        );


      sidebarAvatar.textContent =
        initials;


      heroAvatar.textContent =
        initials;


      sidebarName.textContent =
        specialist.fullName ||
        "Specialist";


      sidebarSpecialty.textContent =
        specialist.specialty ||
        "Specialty";


      heroName.textContent =
        specialist.fullName ||
        "Specialist";


      heroEmail.textContent =
        specialist.email ||
        "No email recorded";
    }


    // =====================================
    // STATUS
    // =====================================

    function renderStatus() {

      const status =
        specialist.status ||
        "pending";


      sidebarStatus.className =
        `sidebar-status ${status}`;


      accountStatusBadge.className =
        `status-badge ${status}`;


      if (
        status === "approved"
      ) {

        sidebarStatusText.textContent =
          "Approved";


        accountStatusText.textContent =
          "Specialist account approved";


        accountStatusBadge.textContent =
          "Approved";


      } else if (
        status === "rejected"
      ) {

        sidebarStatusText.textContent =
          "Needs Review";


        accountStatusText.textContent =
          "Professional verification requires review";


        accountStatusBadge.textContent =
          "Needs Review";


      } else {

        sidebarStatusText.textContent =
          "Pending Review";


        accountStatusText.textContent =
          "Professional verification pending";


        accountStatusBadge.textContent =
          "Pending";
      }

    }


    // =====================================
    // ACCOUNT
    // =====================================

    function loadAccount() {

      accountName.value =
        specialist.fullName ||
        "";


      accountEmail.value =
        specialist.email ||
        "";


      accountPhone.value =
        specialist.phone ||
        "";
    }


    accountPhone.addEventListener(
      "input",
      () => {

        accountSaveStatus.textContent =
          "You have unsaved changes.";


        phoneError.textContent =
          "";
      }
    );


    function validatePhone() {

      const value =
        accountPhone.value
          .trim();


      phoneError.textContent =
        "";


      if (
        value.length < 7
      ) {

        phoneError.textContent =
          "Enter a valid phone number.";

        return false;
      }


      return true;
    }


    saveAccountButton.addEventListener(
      "click",
      () => {

        if (
          !validatePhone()
        ) {

          return;
        }


        specialist.phone =
          accountPhone.value
            .trim();


        specialist.accountUpdatedAt =
          new Date()
            .toISOString();


        saveSpecialistProfile();


        accountSaveStatus.textContent =
          "Account information saved.";


        showToast(
          "Account updated",
          "Your contact information has been saved."
        );
      }
    );


    // =====================================
    // SYNC SPECIALIST PROFILE
    // =====================================

    function saveSpecialistProfile() {

      localStorage.setItem(
        "rafiqSpecialistProfile",
        JSON.stringify(
          specialist
        )
      );


      let allSpecialists =
        [];


      try {

        allSpecialists =
          JSON.parse(
            localStorage.getItem(
              "rafiqSpecialists"
            )
          ) || [];

      } catch (error) {

        allSpecialists =
          [];
      }


      const index =
        allSpecialists.findIndex(
          item =>
            item.id ===
            specialist.id
        );


      if (
        index !== -1
      ) {

        allSpecialists[index] =
          specialist;

      } else {

        allSpecialists.push(
          specialist
        );
      }


      localStorage.setItem(
        "rafiqSpecialists",
        JSON.stringify(
          allSpecialists
        )
      );
    }


    // =====================================
    // PREFERENCES
    // =====================================

    function loadPreferences() {

      languageSelect.value =
        settings.language ||
        "en";
    }


    languageSelect.addEventListener(
      "change",
      () => {

        preferencesSaveStatus.textContent =
          "You have unsaved changes.";
      }
    );


    savePreferencesButton.addEventListener(
      "click",
      () => {

        settings.language =
          languageSelect.value;


        settings.updatedAt =
          new Date()
            .toISOString();


        saveSettings();


        preferencesSaveStatus.textContent =
          "Preferences saved.";


        showToast(
          "Preferences saved",
          "Your application preferences have been updated."
        );
      }
    );


    // =====================================
    // NOTIFICATIONS
    // =====================================

    function loadNotifications() {

      newBookingNotification.checked =
        settings.notifications
          .newBooking;


      bookingChangesNotification.checked =
        settings.notifications
          .bookingChanges;


      reminderNotification.checked =
        settings.notifications
          .reminders;


      reportNotification.checked =
        settings.notifications
          .reportFollowUp;


      earningsNotification.checked =
        settings.notifications
          .earnings;


      inAppChannel.checked =
        settings.channels
          .inApp;


      emailChannel.checked =
        settings.channels
          .email;
    }


    const notificationFields = [
      newBookingNotification,
      bookingChangesNotification,
      reminderNotification,
      reportNotification,
      earningsNotification,
      inAppChannel,
      emailChannel
    ];


    notificationFields.forEach(
      field => {

        field.addEventListener(
          "change",
          () => {

            notificationSaveStatus.textContent =
              "You have unsaved changes.";
          }
        );
      }
    );


    saveNotificationsButton.addEventListener(
      "click",
      () => {

        settings.notifications = {

          newBooking:
            newBookingNotification.checked,

          bookingChanges:
            bookingChangesNotification.checked,

          reminders:
            reminderNotification.checked,

          reportFollowUp:
            reportNotification.checked,

          earnings:
            earningsNotification.checked
        };


        settings.channels = {

          inApp:
            inAppChannel.checked,

          email:
            emailChannel.checked
        };


        settings.updatedAt =
          new Date()
            .toISOString();


        saveSettings();


        notificationSaveStatus.textContent =
          "Notification preferences saved.";


        showToast(
          "Notifications updated",
          "Your notification preferences have been saved."
        );
      }
    );


    // =====================================
    // SAVE SETTINGS
    // =====================================

    function saveSettings() {

      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(
          settings
        )
      );
    }


    // =====================================
    // SECURITY
    // =====================================

    document
      .querySelectorAll(
        ".password-toggle"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              const target =
                document.getElementById(
                  button.dataset.target
                );


              if (
                target.type ===
                "password"
              ) {

                target.type =
                  "text";


                button.textContent =
                  "Hide";

              } else {

                target.type =
                  "password";


                button.textContent =
                  "Show";
              }
            }
          );
        }
      );


    updatePasswordButton.addEventListener(
      "click",
      () => {

        passwordError.textContent =
          "";


        const current =
          currentPassword.value;


        const next =
          newPassword.value;


        const confirmation =
          confirmPassword.value;


        if (
          !current
        ) {

          passwordError.textContent =
            "Enter your current password.";

          return;
        }


        if (
          next.length < 8
        ) {

          passwordError.textContent =
            "New password must contain at least 8 characters.";

          return;
        }


        if (
          next !==
          confirmation
        ) {

          passwordError.textContent =
            "New passwords do not match.";

          return;
        }


        /*
          IMPORTANT:
          Do not store passwords in localStorage.

          This is only a frontend demonstration.
          Production needs secure backend authentication.
        */


        currentPassword.value =
          "";


        newPassword.value =
          "";


        confirmPassword.value =
          "";


        showToast(
          "Security demo",
          "Password form validated. A real password change requires backend authentication."
        );
      }
    );


    // =====================================
    // SETTINGS NAVIGATION
    // =====================================

    const settingsNavButtons =
      document.querySelectorAll(
        ".settings-nav-button"
      );


    const panels = {

      account:
        document.getElementById(
          "accountPanel"
        ),

      preferences:
        document.getElementById(
          "preferencesPanel"
        ),

      notifications:
        document.getElementById(
          "notificationsPanel"
        ),

      security:
        document.getElementById(
          "securityPanel"
        )
    };


    function openSettingsSection(
      section
    ) {

      settingsNavButtons.forEach(
        button => {

          button.classList.toggle(
            "active",
            button.dataset.section ===
              section
          );
        }
      );


      Object.entries(
        panels
      ).forEach(
        (
          [
            name,
            panel
          ]
        ) => {

          panel.hidden =
            name !==
            section;
        }
      );

    }


    settingsNavButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            openSettingsSection(
              button.dataset.section
            );
          }
        );
      }
    );


    // =====================================
    // TOAST
    // =====================================

    let toastTimer =
      null;


    function showToast(
      title,
      message,
      icon = "✓"
    ) {

      toastIcon.textContent =
        icon;


      toastTitle.textContent =
        title;


      toastMessage.textContent =
        message;


      settingsToast.hidden =
        false;


      clearTimeout(
        toastTimer
      );


      toastTimer =
        setTimeout(
          () => {

            settingsToast.hidden =
              true;

          },
          2800
        );
    }


    // =====================================
    // LOGOUT
    // =====================================

    function logout() {

      /*
        Session only.
        Persistent localStorage data remains.
      */

      sessionStorage.clear();


      window.location.href =
        "../piblic-pages/login.html";
    }


    document
      .getElementById(
        "logoutButton"
      )
      .addEventListener(
        "click",
        logout
      );


    document
      .getElementById(
        "securityLogoutButton"
      )
      .addEventListener(
        "click",
        logout
      );


    // =====================================
    // MOBILE SIDEBAR
    // =====================================

    const sidebar =
      document.getElementById(
        "sidebar"
      );


    const sidebarOverlay =
      document.getElementById(
        "sidebarOverlay"
      );


    const menuButton =
      document.getElementById(
        "menuButton"
      );


    const sidebarClose =
      document.getElementById(
        "sidebarClose"
      );


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
    // INIT
    // =====================================

    renderProfileHeader();

    renderStatus();

    loadAccount();

    loadPreferences();

    loadNotifications();

  }
);