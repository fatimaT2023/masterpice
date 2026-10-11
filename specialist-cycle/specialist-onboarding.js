document.addEventListener(
  "DOMContentLoaded",
  () => {

    // ==================================
    // ELEMENTS
    // ==================================

    const formView =
      document.getElementById(
        "formView"
      );


    const successView =
      document.getElementById(
        "successView"
      );


    const specialistForm =
      document.getElementById(
        "specialistForm"
      );


    const submitButton =
      document.getElementById(
        "submitButton"
      );


    const fullName =
      document.getElementById(
        "fullName"
      );


    const email =
      document.getElementById(
        "email"
      );


    const phone =
      document.getElementById(
        "phone"
      );


    const specialty =
      document.getElementById(
        "specialty"
      );


    const experience =
      document.getElementById(
        "experience"
      );


    const licenseNumber =
      document.getElementById(
        "licenseNumber"
      );


    const qualification =
      document.getElementById(
        "qualification"
      );


    const bio =
      document.getElementById(
        "bio"
      );


    const bioCount =
      document.getElementById(
        "bioCount"
      );


    const sessionFee =
      document.getElementById(
        "sessionFee"
      );


    const credentialFile =
      document.getElementById(
        "credentialFile"
      );


    const uploadText =
      document.getElementById(
        "uploadText"
      );


    const accuracyCheckbox =
      document.getElementById(
        "accuracyCheckbox"
      );


    // Errors

    const fullNameError =
      document.getElementById(
        "fullNameError"
      );


    const emailError =
      document.getElementById(
        "emailError"
      );


    const phoneError =
      document.getElementById(
        "phoneError"
      );


    const specialtyError =
      document.getElementById(
        "specialtyError"
      );


    const experienceError =
      document.getElementById(
        "experienceError"
      );


    const licenseError =
      document.getElementById(
        "licenseError"
      );


    const qualificationError =
      document.getElementById(
        "qualificationError"
      );


    const bioError =
      document.getElementById(
        "bioError"
      );


    const consultationError =
      document.getElementById(
        "consultationError"
      );


    const languageError =
      document.getElementById(
        "languageError"
      );


    const feeError =
      document.getElementById(
        "feeError"
      );


    const accuracyError =
      document.getElementById(
        "accuracyError"
      );


    // ==================================
    // EXISTING PROFILE
    // ==================================

    function getExistingProfile() {

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


    const existingProfile =
      getExistingProfile();


    /*
      If onboarding was already submitted,
      show success state instead of form.
    */

    if (
      existingProfile &&
      localStorage.getItem(
        "rafiqSpecialistOnboardingComplete"
      ) === "true"
    ) {

      showSuccessView();

      return;
    }


    // ==================================
    // BIO COUNT
    // ==================================

    bio.addEventListener(
      "input",
      () => {

        bioCount.textContent =
          bio.value.length +
          " / 600";
      }
    );


    // ==================================
    // FILE
    // ==================================

    credentialFile.addEventListener(
      "change",
      () => {

        const file =
          credentialFile.files[0];


        if (!file) {

          uploadText.textContent =
            "PDF or image — demo only";

          return;
        }


        uploadText.textContent =
          file.name;
      }
    );


    // ==================================
    // HELPERS
    // ==================================

    function getCheckedValues(
      name
    ) {

      return Array
        .from(
          document.querySelectorAll(
            `input[name="${name}"]:checked`
          )
        )
        .map(
          input =>
            input.value
        );
    }


    function getSpecialtyLabel(
      key
    ) {

      const labels = {

        pediatrician:
          "Pediatrician",

        psychology:
          "Child Psychologist",

        speech:
          "Speech & Language Specialist",

        behavior:
          "Behavioral Specialist",

        occupational:
          "Occupational Therapist",

        learning:
          "Learning Difficulties Specialist",

        development:
          "Child Development Specialist",

        nutrition:
          "Nutrition Specialist",

        family:
          "Family Counselor"
      };


      return labels[key] || key;
    }


    // ==================================
    // CLEAR ERRORS
    // ==================================

    function clearErrors() {

      [
        fullNameError,
        emailError,
        phoneError,
        specialtyError,
        experienceError,
        licenseError,
        qualificationError,
        bioError,
        consultationError,
        languageError,
        feeError,
        accuracyError
      ].forEach(
        element => {

          element.textContent =
            "";
        }
      );
    }


    // ==================================
    // VALIDATION
    // ==================================

    function validateForm() {

      clearErrors();


      let valid =
        true;


      const nameValue =
        fullName.value.trim();


      const emailValue =
        email.value.trim();


      const phoneValue =
        phone.value.trim();


      const experienceValue =
        Number(
          experience.value
        );


      const feeValue =
        Number(
          sessionFee.value
        );


      const consultationTypes =
        getCheckedValues(
          "consultationType"
        );


      const languages =
        getCheckedValues(
          "language"
        );


      if (
        nameValue.length < 3
      ) {

        fullNameError.textContent =
          "Please enter your full name.";

        valid =
          false;
      }


      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
          .test(
            emailValue
          )
      ) {

        emailError.textContent =
          "Please enter a valid email address.";

        valid =
          false;
      }


      if (
        phoneValue.length < 7
      ) {

        phoneError.textContent =
          "Please enter a valid phone number.";

        valid =
          false;
      }


      if (
        !specialty.value
      ) {

        specialtyError.textContent =
          "Please choose your specialty.";

        valid =
          false;
      }


      if (
        experience.value === "" ||
        experienceValue < 0 ||
        experienceValue > 60
      ) {

        experienceError.textContent =
          "Enter valid years of experience.";

        valid =
          false;
      }


      if (
        licenseNumber.value
          .trim()
          .length < 3
      ) {

        licenseError.textContent =
          "Please enter your professional number.";

        valid =
          false;
      }


      if (
        qualification.value
          .trim()
          .length < 3
      ) {

        qualificationError.textContent =
          "Please enter your qualification.";

        valid =
          false;
      }


      if (
        bio.value
          .trim()
          .length < 30
      ) {

        bioError.textContent =
          "Please add a short professional bio of at least 30 characters.";

        valid =
          false;
      }


      if (
        consultationTypes.length === 0
      ) {

        consultationError.textContent =
          "Choose at least one consultation type.";

        valid =
          false;
      }


      if (
        languages.length === 0
      ) {

        languageError.textContent =
          "Choose at least one language.";

        valid =
          false;
      }


      if (
        sessionFee.value === "" ||
        feeValue < 1
      ) {

        feeError.textContent =
          "Please enter a valid session fee.";

        valid =
          false;
      }


      if (
        !accuracyCheckbox.checked
      ) {

        accuracyError.textContent =
          "Please confirm that your information is accurate.";

        valid =
          false;
      }


      return valid;
    }


    // ==================================
    // CREATE PROFILE
    // ==================================

    function createSpecialistProfile() {

      const consultationTypes =
        getCheckedValues(
          "consultationType"
        );


      const languages =
        getCheckedValues(
          "language"
        );


      const file =
        credentialFile.files[0];


      const specialistId =
        "specialist_" +
        Date.now();


      return {

        id:
          specialistId,


        fullName:
          fullName.value.trim(),


        email:
          email.value.trim(),


        phone:
          phone.value.trim(),


        specialtyKey:
          specialty.value,


        specialty:
          getSpecialtyLabel(
            specialty.value
          ),


        experience:
          Number(
            experience.value
          ),


        licenseNumber:
          licenseNumber.value.trim(),


        qualification:
          qualification.value.trim(),


        bio:
          bio.value.trim(),


        consultationTypes,


        consultationLabel:
          consultationTypes.length === 2
            ? "Online & In-person"
            : consultationTypes[0] ===
              "online"
              ? "Online"
              : "In-person",


        languages,


        price:
          Number(
            sessionFee.value
          ),


        currency:
          "JOD",


        credentialFileName:
          file
            ? file.name
            : null,


        /*
          IMPORTANT:
          New specialists are pending
          until admin approval.
        */

        status:
          "pending",


        verificationStatus:
          "pending",


        rating:
          null,


        reviews:
          0,


        createdAt:
          new Date().toISOString(),


        approvedAt:
          null
      };
    }


    // ==================================
    // SAVE
    // ==================================

    function saveSpecialist(
      profile
    ) {

      /*
        Current specialist profile.
      */

      localStorage.setItem(
        "rafiqSpecialistProfile",
        JSON.stringify(
          profile
        )
      );


      localStorage.setItem(
        "rafiqCurrentSpecialistId",
        profile.id
      );


      localStorage.setItem(
        "rafiqSpecialistOnboardingComplete",
        "true"
      );


      /*
        Also keep all specialists in one
        prototype collection.

        Admin cycle can read this later.
      */

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


      specialists.push(
        profile
      );


      localStorage.setItem(
        "rafiqSpecialists",
        JSON.stringify(
          specialists
        )
      );


      /*
        Mock current session.
      */

      sessionStorage.setItem(
        "rafiqRole",
        "specialist"
      );


      sessionStorage.setItem(
        "rafiqSpecialistId",
        profile.id
      );
    }


    // ==================================
    // SUBMIT
    // ==================================

    specialistForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        if (
          !validateForm()
        ) {

          const firstError =
            document.querySelector(
              ".field-error:not(:empty)"
            );


          if (firstError) {

            firstError.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });
          }


          return;
        }


        submitButton.disabled =
          true;


        submitButton.innerHTML =
          `Submitting...`;


        /*
          Small delay only for prototype UX.
        */

        window.setTimeout(
          () => {

            const profile =
              createSpecialistProfile();


            saveSpecialist(
              profile
            );


            showSuccessView();

          },
          600
        );
      }
    );


    // ==================================
    // SUCCESS
    // ==================================

    function showSuccessView() {

      formView.hidden =
        true;


      successView.hidden =
        false;


      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }

  }
);