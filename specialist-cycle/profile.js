document.addEventListener(
  "DOMContentLoaded",
  () => {

    // =====================================
    // SPECIALIST
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


    const heroSpecialty =
      document.getElementById(
        "heroSpecialty"
      );


    const verificationBadge =
      document.getElementById(
        "verificationBadge"
      );


    const statusBanner =
      document.getElementById(
        "statusBanner"
      );


    const statusBannerIcon =
      document.getElementById(
        "statusBannerIcon"
      );


    const statusBannerTitle =
      document.getElementById(
        "statusBannerTitle"
      );


    const statusBannerText =
      document.getElementById(
        "statusBannerText"
      );


    // VERIFIED

    const fullName =
      document.getElementById(
        "fullName"
      );


    const specialty =
      document.getElementById(
        "specialty"
      );


    const qualification =
      document.getElementById(
        "qualification"
      );


    const licenseNumber =
      document.getElementById(
        "licenseNumber"
      );


    const credentialFile =
      document.getElementById(
        "credentialFile"
      );


    const credentialStatus =
      document.getElementById(
        "credentialStatus"
      );


    // EDITABLE

    const bio =
      document.getElementById(
        "bio"
      );


    const experience =
      document.getElementById(
        "experience"
      );


    const sessionFee =
      document.getElementById(
        "sessionFee"
      );


    const consultationInputs =
      document.querySelectorAll(
        'input[name="consultationType"]'
      );


    const languageInputs =
      document.querySelectorAll(
        'input[name="language"]'
      );


    // ERRORS

    const bioError =
      document.getElementById(
        "bioError"
      );


    const experienceError =
      document.getElementById(
        "experienceError"
      );


    const consultationTypeError =
      document.getElementById(
        "consultationTypeError"
      );


    const languageError =
      document.getElementById(
        "languageError"
      );


    const feeError =
      document.getElementById(
        "feeError"
      );


    const bioCount =
      document.getElementById(
        "bioCount"
      );


    const saveStatus =
      document.getElementById(
        "saveStatus"
      );


    const saveProfileButton =
      document.getElementById(
        "saveProfileButton"
      );


    const saveToast =
      document.getElementById(
        "saveToast"
      );


    // PREVIEW

    const previewAvatar =
      document.getElementById(
        "previewAvatar"
      );


    const previewName =
      document.getElementById(
        "previewName"
      );


    const previewSpecialty =
      document.getElementById(
        "previewSpecialty"
      );


    const previewVerified =
      document.getElementById(
        "previewVerified"
      );


    const previewBio =
      document.getElementById(
        "previewBio"
      );


    const previewExperience =
      document.getElementById(
        "previewExperience"
      );


    const previewPrice =
      document.getElementById(
        "previewPrice"
      );


    const previewConsultationTypes =
      document.getElementById(
        "previewConsultationTypes"
      );


    const previewLanguages =
      document.getElementById(
        "previewLanguages"
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
          .slice(0,2)
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
    // STATUS
    // =====================================

    function renderStatus() {

      const status =
        specialist.status ||
        "pending";


      sidebarStatus.className =
        `sidebar-status ${status}`;


      verificationBadge.className =
        `verification-badge ${status}`;


      statusBanner.className =
        `status-banner ${status}`;


      if (
        status === "approved"
      ) {

        sidebarStatusText.textContent =
          "Approved";


        verificationBadge.textContent =
          "Verified";


        credentialStatus.textContent =
          "Verified";


        credentialStatus.style.color =
          "var(--mint-ink)";


        credentialStatus.style.background =
          "var(--mint)";


        statusBannerIcon.textContent =
          "✓";


        statusBannerTitle.textContent =
          "Your profile is approved";


        statusBannerText.textContent =
          "Your professional profile is verified and can be published to families in the specialist directory.";


        previewVerified.textContent =
          "✓ Verified Specialist";


        previewVerified.className =
          "preview-verified";


      } else if (
        status === "rejected"
      ) {

        sidebarStatusText.textContent =
          "Needs Review";


        verificationBadge.textContent =
          "Needs Attention";


        credentialStatus.textContent =
          "Review Required";


        credentialStatus.style.color =
          "var(--peach-ink)";


        credentialStatus.style.background =
          "var(--peach)";


        statusBannerIcon.textContent =
          "!";


        statusBannerTitle.textContent =
          "Verification requires attention";


        statusBannerText.textContent =
          "Your submitted professional verification was not approved. Administrative review is required before practice tools become available.";


        previewVerified.textContent =
          "Verification Required";


        previewVerified.className =
          "preview-verified rejected";


      } else {

        sidebarStatusText.textContent =
          "Pending Review";


        verificationBadge.textContent =
          "Pending";


        credentialStatus.textContent =
          "Pending Review";


        statusBannerIcon.textContent =
          "i";


        statusBannerTitle.textContent =
          "Profile under review";


        statusBannerText.textContent =
          "Your submitted professional credentials are currently awaiting RAFIQ administrative review.";


        previewVerified.textContent =
          "Verification Pending";


        previewVerified.className =
          "preview-verified pending";
      }

    }


    // =====================================
    // LOAD PROFILE
    // =====================================

    function loadProfile() {

      const initials =
        getInitials(
          specialist.fullName
        );


      sidebarAvatar.textContent =
        initials;


      heroAvatar.textContent =
        initials;


      previewAvatar.textContent =
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


      heroSpecialty.textContent =
        specialist.specialty ||
        "Specialty";


      fullName.value =
        specialist.fullName ||
        "";


      specialty.value =
        specialist.specialty ||
        "";


      qualification.value =
        specialist.qualification ||
        "";


      licenseNumber.value =
        specialist.licenseNumber ||
        "";


      credentialFile.textContent =
        specialist.credentialFileName ||
        "No file name recorded";


      bio.value =
        specialist.bio ||
        "";


      experience.value =
        specialist.experience ?? "";


      sessionFee.value =
        specialist.price ?? "";


      // CONSULTATION TYPES

      const savedTypes =
        Array.isArray(
          specialist.consultationTypes
        )
          ? specialist.consultationTypes
          : [];


      consultationInputs.forEach(
        input => {

          input.checked =
            savedTypes.includes(
              input.value
            );
        }
      );


      // LANGUAGES

      const savedLanguages =
        Array.isArray(
          specialist.languages
        )
          ? specialist.languages
          : [];


      languageInputs.forEach(
        input => {

          input.checked =
            savedLanguages.includes(
              input.value
            );
        }
      );


      renderStatus();

      updateBioCount();

      renderPreview();

    }


    // =====================================
    // BIO COUNT
    // =====================================

    function updateBioCount() {

      bioCount.textContent =
        `${bio.value.length} / 1200`;
    }


    bio.addEventListener(
      "input",
      updateBioCount
    );


    // =====================================
    // GET SELECTED
    // =====================================

    function getSelectedValues(
      selector
    ) {

      return Array
        .from(
          document.querySelectorAll(
            selector
          )
        )
        .filter(
          input =>
            input.checked
        )
        .map(
          input =>
            input.value
        );
    }


    // =====================================
    // LABEL HELPERS
    // =====================================

    function formatConsultationType(
      value
    ) {

      if (
        value === "online"
      ) {

        return "Online";
      }


      if (
        value === "in-person"
      ) {

        return "In-person";
      }


      return value;
    }


    function formatLanguage(
      value
    ) {

      if (
        value === "arabic"
      ) {

        return "Arabic";
      }


      if (
        value === "english"
      ) {

        return "English";
      }


      return value;
    }


    function getConsultationLabel(
      values
    ) {

      return values
        .map(
          formatConsultationType
        )
        .join(" & ");
    }


    // =====================================
    // PREVIEW TAGS
    // =====================================

    function renderTags(
      container,
      values,
      formatter
    ) {

      container.innerHTML =
        "";


      if (
        values.length === 0
      ) {

        const tag =
          document.createElement(
            "span"
          );


        tag.className =
          "preview-tag";


        tag.textContent =
          "Not selected";


        container.appendChild(
          tag
        );


        return;
      }


      values.forEach(
        value => {

          const tag =
            document.createElement(
              "span"
            );


          tag.className =
            "preview-tag";


          tag.textContent =
            formatter(
              value
            );


          container.appendChild(
            tag
          );
        }
      );

    }


    // =====================================
    // LIVE PREVIEW
    // =====================================

    function renderPreview() {

      previewName.textContent =
        specialist.fullName ||
        "Specialist";


      previewSpecialty.textContent =
        specialist.specialty ||
        "Specialty";


      previewBio.textContent =
        bio.value.trim() ||
        "Professional bio will appear here.";


      const years =
        Number(
          experience.value
        );


      previewExperience.textContent =
        Number.isFinite(
          years
        ) &&
        years >= 0
          ? (
              years +
              (
                years === 1
                  ? " year"
                  : " years"
              )
            )
          : "—";


      const price =
        Number(
          sessionFee.value
        );


      previewPrice.textContent =
        Number.isFinite(
          price
        ) &&
        price > 0
          ? `${price} JOD`
          : "—";


      const types =
        getSelectedValues(
          'input[name="consultationType"]'
        );


      const languages =
        getSelectedValues(
          'input[name="language"]'
        );


      renderTags(
        previewConsultationTypes,
        types,
        formatConsultationType
      );


      renderTags(
        previewLanguages,
        languages,
        formatLanguage
      );

    }


    // =====================================
    // DIRTY STATE
    // =====================================

    function markUnsaved() {

      saveStatus.textContent =
        "You have unsaved changes.";


      renderPreview();
    }


    [
      bio,
      experience,
      sessionFee
    ].forEach(
      field => {

        field.addEventListener(
          "input",
          markUnsaved
        );
      }
    );


    [
      ...consultationInputs,
      ...languageInputs
    ].forEach(
      input => {

        input.addEventListener(
          "change",
          markUnsaved
        );
      }
    );


    // =====================================
    // VALIDATION
    // =====================================

    function clearErrors() {

      bioError.textContent =
        "";


      experienceError.textContent =
        "";


      consultationTypeError.textContent =
        "";


      languageError.textContent =
        "";


      feeError.textContent =
        "";
    }


    function validateProfile() {

      clearErrors();


      let valid =
        true;


      const bioValue =
        bio.value.trim();


      const experienceValue =
        Number(
          experience.value
        );


      const priceValue =
        Number(
          sessionFee.value
        );


      const types =
        getSelectedValues(
          'input[name="consultationType"]'
        );


      const languages =
        getSelectedValues(
          'input[name="language"]'
        );


      if (
        bioValue.length < 40
      ) {

        bioError.textContent =
          "Professional bio must contain at least 40 characters.";


        valid =
          false;
      }


      if (
        !Number.isFinite(
          experienceValue
        ) ||
        experienceValue < 0 ||
        experienceValue > 60
      ) {

        experienceError.textContent =
          "Enter a valid number of years between 0 and 60.";


        valid =
          false;
      }


      if (
        types.length === 0
      ) {

        consultationTypeError.textContent =
          "Select at least one consultation type.";


        valid =
          false;
      }


      if (
        languages.length === 0
      ) {

        languageError.textContent =
          "Select at least one language.";


        valid =
          false;
      }


      if (
        !Number.isFinite(
          priceValue
        ) ||
        priceValue <= 0 ||
        priceValue > 500
      ) {

        feeError.textContent =
          "Enter a valid session fee between 1 and 500 JOD.";


        valid =
          false;
      }


      return valid;
    }


    // =====================================
    // SAVE
    // =====================================

    saveProfileButton.addEventListener(
      "click",
      saveProfile
    );


    function saveProfile() {

      if (
        !validateProfile()
      ) {

        const firstError =
          document.querySelector(
            ".field-error:not(:empty)"
          );


        if (
          firstError
        ) {

          firstError.scrollIntoView({
            behavior:
              "smooth",

            block:
              "center"
          });
        }


        return;
      }


      const types =
        getSelectedValues(
          'input[name="consultationType"]'
        );


      const languages =
        getSelectedValues(
          'input[name="language"]'
        );


      specialist.bio =
        bio.value.trim();


      specialist.experience =
        Number(
          experience.value
        );


      specialist.consultationTypes =
        types;


      specialist.consultationLabel =
        getConsultationLabel(
          types
        );


      specialist.languages =
        languages;


      specialist.price =
        Number(
          sessionFee.value
        );


      specialist.profileUpdatedAt =
        new Date()
          .toISOString();


      /*
        Important:
        Profile editing does NOT modify:
        status
        verificationStatus
        specialty
        licenseNumber
        qualification
      */


      localStorage.setItem(
        "rafiqSpecialistProfile",
        JSON.stringify(
          specialist
        )
      );


      syncSpecialistCollection();


      saveStatus.textContent =
        "Profile saved " +
        new Date()
          .toLocaleTimeString(
            undefined,
            {
              hour:
                "numeric",

              minute:
                "2-digit"
            }
          );


      renderPreview();

      showToast();

    }


    // =====================================
    // SYNC GLOBAL SPECIALISTS
    // =====================================

    function syncSpecialistCollection() {

      let specialists =
        [];


      try {

        specialists =
          JSON.parse(
            localStorage.getItem(
              "rafiqSpecialists"
            )
          ) || [];

      } catch (error) {

        specialists =
          [];
      }


      const index =
        specialists.findIndex(
          item =>
            item.id ===
            specialist.id
        );


      if (
        index !== -1
      ) {

        specialists[index] =
          specialist;

      } else {

        specialists.push(
          specialist
        );
      }


      localStorage.setItem(
        "rafiqSpecialists",
        JSON.stringify(
          specialists
        )
      );

    }


    // =====================================
    // TOAST
    // =====================================

    let toastTimer =
      null;


    function showToast() {

      saveToast.hidden =
        false;


      clearTimeout(
        toastTimer
      );


      toastTimer =
        setTimeout(
          () => {

            saveToast.hidden =
              true;

          },
          2500
        );

    }


    // =====================================
    // SIDEBAR
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
    // LOGOUT
    // =====================================

    document
      .getElementById(
        "logoutButton"
      )
      .addEventListener(
        "click",
        () => {

          sessionStorage.clear();


          window.location.href =
            "../piblic-pages/login.html";

        }
      );


    // =====================================
    // INIT
    // =====================================

    loadProfile();

  }
);