document.addEventListener(
  "DOMContentLoaded",
  () => {

    // =================================
    // ELEMENTS
    // =================================

    const sidebar =
      document.getElementById("sidebar");

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


    const childSwitcherButton =
      document.getElementById(
        "childSwitcherButton"
      );

    const childDropdown =
      document.getElementById(
        "childDropdown"
      );

    const childDropdownList =
      document.getElementById(
        "childDropdownList"
      );


    const sidebarChildAvatar =
      document.getElementById(
        "sidebarChildAvatar"
      );

    const sidebarChildName =
      document.getElementById(
        "sidebarChildName"
      );

    const sidebarChildAge =
      document.getElementById(
        "sidebarChildAge"
      );


    const welcomeTitle =
      document.getElementById(
        "welcomeTitle"
      );

    const heroChildName =
      document.getElementById(
        "heroChildName"
      );

    const heroDescription =
      document.getElementById(
        "heroDescription"
      );


    const largeChildAvatar =
      document.getElementById(
        "largeChildAvatar"
      );

    const heroProfileName =
      document.getElementById(
        "heroProfileName"
      );

    const heroProfileAge =
      document.getElementById(
        "heroProfileAge"
      );

    const ageStage =
      document.getElementById(
        "ageStage"
      );


    const developmentMessage =
      document.getElementById(
        "developmentMessage"
      );

    const aiPromptText =
      document.getElementById(
        "aiPromptText"
      );


    const logoutButton =
      document.getElementById(
        "logoutButton"
      );


    // =================================
    // LOAD CHILDREN
    // =================================

    function getChildren() {

      try {

        return (
          JSON.parse(
            localStorage.getItem(
              "rafiqChildren"
            )
          ) || []
        );

      } catch (error) {

        return [];
      }

    }


    let children =
      getChildren();


    /*
      If there is no child profile,
      send the parent back to onboarding.
    */

    if (children.length === 0) {

      window.location.href =
        "onboarding.html";

      return;
    }


    // =================================
    // CURRENT CHILD
    // =================================

    function getCurrentChild() {

      const currentId =
        localStorage.getItem(
          "rafiqCurrentChildId"
        );


      const savedChild =
        children.find(
          child =>
            child.id === currentId
        );


      if (savedChild) {
        return savedChild;
      }


      // Otherwise use first child
      const firstChild =
        children[0];


      localStorage.setItem(
        "rafiqCurrentChildId",
        firstChild.id
      );


      return firstChild;
    }


    let currentChild =
      getCurrentChild();


    // =================================
    // AGE
    // =================================

    function calculateAge(
      dateString
    ) {

      if (!dateString) {
        return null;
      }


      const birthDate =
        new Date(
          dateString +
          "T00:00:00"
        );


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


      return {
        years,
        months,
        totalMonths:
          years * 12 + months
      };
    }


    function formatAge(age) {

      if (!age) {
        return "";
      }


      if (age.totalMonths < 12) {

        const label =
          age.totalMonths === 1
            ? "month"
            : "months";


        return (
          age.totalMonths +
          " " +
          label
        );
      }


      if (
        age.years < 3 &&
        age.months > 0
      ) {

        return (
          age.years +
          (age.years === 1
            ? " year, "
            : " years, ") +
          age.months +
          (age.months === 1
            ? " month"
            : " months")
        );
      }


      return (
        age.years +
        (age.years === 1
          ? " year old"
          : " years old")
      );
    }


    // =================================
    // AGE STAGE
    // =================================

    function getStage(age) {

      if (!age) {
        return "Growing with Rafiq";
      }


      if (age.years <= 3) {
        return "Early Years • 0–3";
      }


      if (age.years <= 6) {
        return "Early Childhood • 4–6";
      }


      if (age.years <= 12) {
        return "School Age • 7–12";
      }


      return "Adolescence • 13–18";
    }


    // =================================
    // PERSONALIZED TEXT
    // =================================

    function getHeroText(age) {

      if (!age) {
        return "";
      }


      if (age.years <= 3) {

        return (
          "Follow early development, communication, " +
          "sleep, feeding and everyday milestones."
        );
      }


      if (age.years <= 6) {

        return (
          "Support behavior, language, independence, " +
          "social skills and school readiness."
        );
      }


      if (age.years <= 12) {

        return (
          "Stay connected to school progress, learning, " +
          "friends, emotions and healthy routines."
        );
      }


      return (
        "Support communication, independence, emotional " +
        "wellbeing, school pressure and social life."
      );
    }


    function getDevelopmentText(
      age
    ) {

      if (!age) {
        return "";
      }


      if (age.years <= 3) {

        return (
          "Keep tracking communication, movement " +
          "and early daily skills."
        );
      }


      if (age.years <= 6) {

        return (
          "Keep following language, behavior, " +
          "social and independence milestones."
        );
      }


      if (age.years <= 12) {

        return (
          "Track learning, communication, social " +
          "skills and everyday independence."
        );
      }


      return (
        "Follow emotional wellbeing, communication, " +
        "independence and academic development."
      );
    }


    function getAIText(age) {

      if (!age) {
        return "";
      }


      if (age.years <= 3) {

        return (
          "Ask about sleep, feeding, early speech, " +
          "development or everyday routines."
        );
      }


      if (age.years <= 6) {

        return (
          "Ask about behavior, tantrums, language, " +
          "social skills or kindergarten."
        );
      }


      if (age.years <= 12) {

        return (
          "Ask about school, learning, attention, " +
          "bullying, friends or screen time."
        );
      }


      return (
        "Ask about communication, school pressure, " +
        "social media, independence or emotional wellbeing."
      );
    }


    // =================================
    // UPDATE DASHBOARD
    // =================================

    function renderCurrentChild() {

      const age =
        calculateAge(
          currentChild.dateOfBirth
        );


      const formattedAge =
        formatAge(age);


      const initial =
        currentChild.name
          ? currentChild.name
              .charAt(0)
              .toUpperCase()
          : "?";


      // Sidebar
      sidebarChildAvatar.textContent =
        initial;

      sidebarChildName.textContent =
        currentChild.name;

      sidebarChildAge.textContent =
        formattedAge;


      // Header
      welcomeTitle.textContent =
        "Welcome back";


      // Hero
      heroChildName.textContent =
        currentChild.name;

      heroDescription.textContent =
        getHeroText(age);


      largeChildAvatar.textContent =
        initial;

      heroProfileName.textContent =
        currentChild.name;

      heroProfileAge.textContent =
        formattedAge;

      ageStage.textContent =
        getStage(age);


      developmentMessage.textContent =
        getDevelopmentText(age);


      aiPromptText.textContent =
        getAIText(age);


      renderChildDropdown();
    }


    // =================================
    // CHILD DROPDOWN
    // =================================

    function renderChildDropdown() {

      childDropdownList.innerHTML = "";


      children.forEach(child => {

        const age =
          calculateAge(
            child.dateOfBirth
          );


        const button =
          document.createElement(
            "button"
          );


        button.type = "button";

        button.className =
          "dropdown-child-button";


        if (
          child.id ===
          currentChild.id
        ) {

          button.classList.add(
            "active"
          );
        }


        const initial =
          child.name
            ? child.name
                .charAt(0)
                .toUpperCase()
            : "?";


        button.innerHTML = `
          <span class="dropdown-avatar">
            ${initial}
          </span>

          <span class="dropdown-child-info">
            <strong>
              ${escapeHTML(child.name)}
            </strong>

            <span>
              ${escapeHTML(
                formatAge(age)
              )}
            </span>
          </span>
        `;


        button.addEventListener(
          "click",
          () => {

            localStorage.setItem(
              "rafiqCurrentChildId",
              child.id
            );


            currentChild =
              child;


            childDropdown.hidden =
              true;


            renderCurrentChild();
          }
        );


        childDropdownList.appendChild(
          button
        );

      });

    }


    // =================================
    // SAFE TEXT
    // =================================

    function escapeHTML(value) {

      const div =
        document.createElement(
          "div"
        );


      div.textContent =
        String(value || "");


      return div.innerHTML;
    }


    // =================================
    // CHILD SWITCHER
    // =================================

    childSwitcherButton.addEventListener(
      "click",
      () => {

        childDropdown.hidden =
          !childDropdown.hidden;

      }
    );


    document.addEventListener(
      "click",
      event => {

        const clickedInside =
          event.target.closest(
            ".child-switcher"
          );


        if (!clickedInside) {

          childDropdown.hidden =
            true;
        }

      }
    );


    // =================================
    // MOBILE SIDEBAR
    // =================================

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


    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape"
        ) {

          closeSidebar();

          childDropdown.hidden =
            true;
        }

      }
    );


    // =================================
    // LOGOUT
    // =================================

    logoutButton.addEventListener(
      "click",
      () => {

        /*
          We DO NOT delete child profiles here.

          Logout should end the session,
          not delete stored user data.
        */

        sessionStorage.clear();


        window.location.href =
          "../piblic-pages/login.html";
      }
    );


    // =================================
    // INITIALIZE
    // =================================

    renderCurrentChild();

  }
);