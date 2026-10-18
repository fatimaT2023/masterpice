document.addEventListener(
  "DOMContentLoaded",
  () => {

    // ===========================
    // ELEMENTS
    // ===========================

    const childAvatar =
      document.getElementById(
        "childAvatar"
      );

    const childName =
      document.getElementById(
        "childName"
      );

    const childAge =
      document.getElementById(
        "childAge"
      );


    const heroCurrentPlan =
      document.getElementById(
        "heroCurrentPlan"
      );

    const heroPlanBadge =
      document.getElementById(
        "heroPlanBadge"
      );


    const freePlanCard =
      document.getElementById(
        "freePlanCard"
      );

    const plusPlanCard =
      document.getElementById(
        "plusPlanCard"
      );


    const freeStatus =
      document.getElementById(
        "freeStatus"
      );

    const plusStatus =
      document.getElementById(
        "plusStatus"
      );


    const freePlanButton =
      document.getElementById(
        "freePlanButton"
      );

    const plusPlanButton =
      document.getElementById(
        "plusPlanButton"
      );


    // ===========================
    // CHILD
    // ===========================

    function getChildren() {

      try {

        return JSON.parse(
          localStorage.getItem(
            "rafiqChildren"
          )
        ) || [];

      } catch (error) {

        return [];
      }
    }


    const children =
      getChildren();


    if (
      children.length === 0
    ) {

      window.location.href =
        "onboarding.html";

      return;
    }


    const currentChildId =
      localStorage.getItem(
        "rafiqCurrentChildId"
      );


    const currentChild =
      children.find(
        child =>
          child.id ===
          currentChildId
      ) || children[0];


    // ===========================
    // AGE
    // ===========================

    function calculateAge(dateString) { return window.RafiqSetup.ageFromBirth(dateString) || {years:NaN,months:NaN,totalMonths:NaN,days:NaN}; }


    function formatAge(age) { return window.RafiqSetup.formatAge(age); }


    const age =
      calculateAge(
        currentChild.dateOfBirth
      );


    childAvatar.textContent =
      currentChild.name
        .charAt(0)
        .toUpperCase();


    childName.textContent =
      currentChild.name;


    childAge.textContent =
      formatAge(age);


    // ===========================
    // PLAN
    // ===========================

    function getCurrentPlan() {

      return (
        localStorage.getItem(
          "rafiqSubscriptionPlan"
        ) ||
        "free"
      );
    }


    function renderCurrentPlan() {

      const plan =
        getCurrentPlan();


      if (
        plan === "plus"
      ) {

        heroCurrentPlan.textContent =
          "RAFIQ Plus";


        heroPlanBadge.textContent =
          "Active";


        freeStatus.hidden =
          true;


        plusStatus.hidden =
          false;


        plusStatus.textContent =
          "Current Plan";


        plusPlanButton.textContent =
          "RAFIQ Plus Active";


        plusPlanButton.disabled =
          true;


        freePlanButton.textContent =
          "Switch to Free";


        freePlanButton.disabled =
          false;


        plusPlanCard.classList.add(
          "current"
        );


        freePlanCard.classList.remove(
          "current"
        );

      } else {

        heroCurrentPlan.textContent =
          "RAFIQ Free";


        heroPlanBadge.textContent =
          "Active";


        freeStatus.hidden =
          false;


        freeStatus.textContent =
          "Current Plan";


        plusStatus.hidden =
          true;


        freePlanButton.textContent =
          "Current Plan";


        freePlanButton.disabled =
          true;


        plusPlanButton.textContent =
          "Upgrade to RAFIQ Plus";


        plusPlanButton.disabled =
          false;


        freePlanCard.classList.add(
          "current"
        );


        plusPlanCard.classList.remove(
          "current"
        );
      }
    }


    // ===========================
    // UPGRADE
    // ===========================

    plusPlanButton.addEventListener(
      "click",
      () => {

        if (
          getCurrentPlan() ===
          "plus"
        ) {
          return;
        }


        /*
          Save the plan the parent selected.
          Payment page will read this.
        */

        const selectedPlan = {

          id:
            "plus",

          name:
            "RAFIQ Plus",

          price:
            5,

          currency:
            "JOD",

          billing:
            "monthly"
        };


        sessionStorage.setItem(
          "rafiqSelectedPlan",
          JSON.stringify(
            selectedPlan
          )
        );


        window.location.href =
          "payment.html";

      }
    );


    // ===========================
    // SWITCH TO FREE
    // ===========================

    freePlanButton.addEventListener(
      "click",
      () => {

        if (
          getCurrentPlan() ===
          "free"
        ) {
          return;
        }


        const confirmed =
          window.confirm(
            "Switch back to RAFIQ Free?"
          );


        if (!confirmed) {
          return;
        }


        /*
          Prototype only:
          downgrade immediately.
          Real subscriptions would normally
          handle billing-cycle rules.
        */

        localStorage.setItem(
          "rafiqSubscriptionPlan",
          "free"
        );


        localStorage.removeItem(
          "rafiqSubscriptionDetails"
        );


        renderCurrentPlan();

      }
    );


    // ===========================
    // SIDEBAR
    // ===========================

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


    // ===========================
    // LOGOUT
    // ===========================

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


    // ===========================
    // INIT
    // ===========================

    renderCurrentPlan();

  }
);