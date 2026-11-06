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

        return window.RafiqSetup.readChildren() || [];

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
      (window.RafiqFamily ? window.RafiqFamily.selected() : localStorage.getItem('rafiqCurrentChildId'));


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

    function getCurrentPlan(){return window.RafiqMembership.state().plan;}

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
          "Cancel renewal";


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
      const familyState=window.RafiqMembership.state();
      freePlanButton.disabled=!familyState.canManage||!familyState.active;
      if(familyState.active)freePlanButton.textContent=familyState.record.cancelAtPeriodEnd?'Keep renewal enabled':'Cancel renewal';
      if(!familyState.canManage){plusPlanButton.disabled=true;freePlanButton.disabled=true;}
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
            window.RafiqMembership.config.price,

          currency:
            "JOD",

          familyId: window.RafiqMembership.familyId(),
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
            "Change renewal? Your family keeps Plus until the paid period ends. Existing records and paid appointments stay available."
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

        try{window.RafiqMembership.renewal(!window.RafiqMembership.state().record?.cancelAtPeriodEnd);}catch(error){alert(error.message);return;}
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
    document.addEventListener('rafiq:family-plan',renderCurrentPlan);document.addEventListener('rafiq:family-change',renderCurrentPlan);
    window.addEventListener('focus',renderCurrentPlan);
    window.addEventListener('storage',event=>{if(['rafiqParentMemberships','rafiqFamilyMemberships','rafiqFamilies'].includes(event.key))renderCurrentPlan();});

  }
);