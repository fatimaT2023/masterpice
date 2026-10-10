document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // ELEMENTS
  // ==============================

  const childForm =
    document.getElementById("childForm");

  const childName =
    document.getElementById("childName");

  const dateOfBirth =
    document.getElementById("dateOfBirth");

  const relationship =
    document.getElementById("relationship");


  const nameField =
    document.getElementById("nameField");

  const dobField =
    document.getElementById("dobField");

  const relationshipField =
    document.getElementById("relationshipField");


  const nameError =
    document.getElementById("nameError");

  const dobError =
    document.getElementById("dobError");

  const genderError =
    document.getElementById("genderError");

  const relationshipError =
    document.getElementById(
      "relationshipError"
    );


  const agePreview =
    document.getElementById("agePreview");

  const ageText =
    document.getElementById("ageText");


  const avatarPreview =
    document.getElementById("avatarPreview");

  const avatarInitial =
    document.getElementById("avatarInitial");


  const createButton =
    document.getElementById("createButton");

  const formStatus =
    document.getElementById("formStatus");


  // ==============================
  // DATE LIMIT
  // ==============================

  const today =
    new Date().toISOString().split("T")[0];

  dateOfBirth.max = today;


  // ==============================
  // NAME PREVIEW
  // ==============================

  childName.addEventListener("input", () => {

    const name =
      childName.value.trim();

    if (name) {

      avatarInitial.textContent =
        name.charAt(0).toUpperCase();

      avatarPreview.classList.add(
        "has-name"
      );

    } else {

      avatarInitial.textContent = "+";

      avatarPreview.classList.remove(
        "has-name"
      );
    }

    if (nameField.classList.contains("has-error")) {
      validateName();
    }

  });


  // ==============================
  // AGE CALCULATION
  // ==============================

  function calculateAge(dateString) {

    if (!dateString) {
      return null;
    }

    const birthDate =
      new Date(dateString + "T00:00:00");

    const now =
      new Date();


    let years =
      now.getFullYear() -
      birthDate.getFullYear();

    let months =
      now.getMonth() -
      birthDate.getMonth();


    if (
      now.getDate() <
      birthDate.getDate()
    ) {
      months--;
    }


    if (months < 0) {
      years--;
      months += 12;
    }


    const totalMonths =
      years * 12 + months;


    return {
      years,
      months,
      totalMonths
    };
  }


  function formatAge(age) {

    if (!age) {
      return "";
    }

    if (age.totalMonths < 12) {

      const monthLabel =
        age.totalMonths === 1
          ? "month"
          : "months";

      return `${age.totalMonths} ${monthLabel} old`;
    }


    if (age.years < 3 && age.months > 0) {

      const yearLabel =
        age.years === 1
          ? "year"
          : "years";

      const monthLabel =
        age.months === 1
          ? "month"
          : "months";

      return `${age.years} ${yearLabel}, ${age.months} ${monthLabel} old`;
    }


    const yearLabel =
      age.years === 1
        ? "year"
        : "years";

    return `${age.years} ${yearLabel} old`;
  }


  function getAgeGroup(age) {

    if (!age) {
      return "";
    }

    if (age.years < 4) {
      return "0-3";
    }

    if (age.years < 7) {
      return "4-6";
    }

    if (age.years < 13) {
      return "7-12";
    }

    return "13-18";
  }


  dateOfBirth.addEventListener(
    "change",
    () => {

      const age =
        calculateAge(dateOfBirth.value);

      if (!age) {

        agePreview.hidden = true;

        return;
      }


      if (
        age.years < 0 ||
        age.years > 18
      ) {

        agePreview.hidden = true;

        return;
      }


      ageText.textContent =
        formatAge(age);

      agePreview.hidden = false;


      if (
        dobField.classList.contains(
          "has-error"
        )
      ) {

        validateDateOfBirth();
      }

    }
  );


  // ==============================
  // VALIDATION HELPERS
  // ==============================

  function showError(
    field,
    errorElement,
    message
  ) {

    field?.classList.add("has-error");

    errorElement.textContent =
      message;
  }


  function clearError(
    field,
    errorElement
  ) {

    field?.classList.remove(
      "has-error"
    );

    errorElement.textContent = "";
  }


  // ==============================
  // NAME VALIDATION
  // ==============================

  function validateName() {

    const name =
      childName.value.trim();


    if (!name) {

      showError(
        nameField,
        nameError,
        "Please enter your child's first name."
      );

      return false;
    }


    if (name.length < 2) {

      showError(
        nameField,
        nameError,
        "Name must contain at least 2 characters."
      );

      return false;
    }


    clearError(
      nameField,
      nameError
    );

    return true;
  }


  // ==============================
  // DOB VALIDATION
  // ==============================

  function validateDateOfBirth() {

    if (!dateOfBirth.value) {

      showError(
        dobField,
        dobError,
        "Please select your child's date of birth."
      );

      return false;
    }


    const birthDate =
      new Date(
        dateOfBirth.value +
        "T00:00:00"
      );

    const now =
      new Date();


    if (birthDate > now) {

      showError(
        dobField,
        dobError,
        "Date of birth cannot be in the future."
      );

      return false;
    }


    const age =
      calculateAge(
        dateOfBirth.value
      );


    if (age.years > 18) {

      showError(
        dobField,
        dobError,
        "Rafiq currently supports child profiles from birth to 18 years."
      );

      return false;
    }


    clearError(
      dobField,
      dobError
    );

    return true;
  }


  // ==============================
  // GENDER VALIDATION
  // ==============================

  function getSelectedGender() {

    const selected =
      document.querySelector(
        'input[name="gender"]:checked'
      );

    return selected
      ? selected.value
      : "";
  }


  function validateGender() {

    if (!getSelectedGender()) {

      genderError.textContent =
        "Please select your child's gender.";

      return false;
    }


    genderError.textContent = "";

    return true;
  }


  document
    .querySelectorAll(
      'input[name="gender"]'
    )
    .forEach((radio) => {

      radio.addEventListener(
        "change",
        () => {

          genderError.textContent = "";

        }
      );

    });


  // ==============================
  // RELATIONSHIP VALIDATION
  // ==============================

  function validateRelationship() {

    if (!relationship.value) {

      showError(
        relationshipField,
        relationshipError,
        "Please select your relationship to the child."
      );

      return false;
    }


    clearError(
      relationshipField,
      relationshipError
    );

    return true;
  }


  relationship.addEventListener(
    "change",
    () => {

      if (
        relationshipField.classList.contains(
          "has-error"
        )
      ) {

        validateRelationship();
      }

    }
  );


  childName.addEventListener(
    "blur",
    validateName
  );


  dateOfBirth.addEventListener(
    "blur",
    validateDateOfBirth
  );


  relationship.addEventListener(
    "blur",
    validateRelationship
  );


  // ==============================
  // FORM STATUS
  // ==============================

  function setFormStatus(
    message = "",
    type = ""
  ) {

    formStatus.textContent =
      message;

    formStatus.className =
      "form-status";


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


  // ==============================
  // STORAGE
  // ==============================

  function saveChildProfile(child) {

    let children = [];


    try {

      children =
        JSON.parse(
          localStorage.getItem(
            "rafiqChildren"
          )
        ) || [];

    } catch (error) {

      children = [];
    }


    children.push(child);


    localStorage.setItem(
      "rafiqChildren",
      JSON.stringify(children)
    );


    // Save selected/current child
    localStorage.setItem(
      "rafiqCurrentChildId",
      child.id
    );


    // Mark onboarding complete
    localStorage.setItem(
      "rafiqParentOnboardingComplete",
      "true"
    );

  }


  // ==============================
  // SUBMIT
  // ==============================

  childForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const nameValid =
        validateName();

      const dobValid =
        validateDateOfBirth();

      const genderValid =
        validateGender();

      const relationshipValid =
        validateRelationship();


      if (
        !nameValid ||
        !dobValid ||
        !genderValid ||
        !relationshipValid
      ) {

        setFormStatus(
          "Please check the highlighted fields before continuing.",
          "error"
        );

        return;
      }


      setFormStatus("");


      const age =
        calculateAge(
          dateOfBirth.value
        );


      const child = {

        id:
          "child_" +
          Date.now(),

        name:
          childName.value.trim(),

        dateOfBirth:
          dateOfBirth.value,

        gender:
          getSelectedGender(),

        relationship:
          relationship.value,

        ageGroup:
          getAgeGroup(age),

        createdAt:
          new Date().toISOString()

      };


      createButton.disabled =
        true;

      createButton.classList.add(
        "loading"
      );


      // Frontend-only mock delay
      setTimeout(() => {

        saveChildProfile(child);


        createButton.classList.remove(
          "loading"
        );

        createButton.classList.add(
          "success"
        );


        setFormStatus(
          `${child.name}'s profile is ready!`,
          "success"
        );


        // Go to Parent Dashboard
        setTimeout(() => {

          window.location.href =
            "parent-dashboard.html";

        }, 900);


      }, 900);

    }
  );

});