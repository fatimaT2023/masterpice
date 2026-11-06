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


    const childrenList =
      document.getElementById(
        "childrenList"
      );


    const parentName =
      document.getElementById(
        "parentName"
      );

    const parentEmail =
      document.getElementById(
        "parentEmail"
      );

    const parentPhone =
      document.getElementById(
        "parentPhone"
      );

    const accountForm =
      document.getElementById(
        "accountForm"
      );

    const accountMessage =
      document.getElementById(
        "accountMessage"
      );


    const currentPlanName =
      document.getElementById(
        "currentPlanName"
      );

    const currentPlanDescription =
      document.getElementById(
        "currentPlanDescription"
      );

    const planBadge =
      document.getElementById(
        "planBadge"
      );


    // ===========================
    // CHILDREN
    // ===========================

    function getChildren() {

      try {

        return window.RafiqSetup.readChildren() || [];

      } catch (error) {

        return [];
      }
    }


    let children =
      getChildren();


    if (
      children.length === 0
    ) {

      window.location.href =
        "onboarding.html";

      return;
    }


    function getCurrentChild() {

      const id =
        (window.RafiqFamily ? window.RafiqFamily.selected() : localStorage.getItem('rafiqCurrentChildId'));


      return (
        children.find(
          child =>
            child.id === id
        ) ||
        children[0]
      );
    }


    let currentChild =
      getCurrentChild();


    // ===========================
    // AGE
    // ===========================

    function calculateAge(dateString) { return window.RafiqSetup.ageFromBirth(dateString) || {years:NaN,months:NaN,totalMonths:NaN,days:NaN}; }


    function formatAge(age) { return window.RafiqSetup.formatAge(age); }


    function renderSidebarChild() {

      currentChild =
        getCurrentChild();


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
    }


    // ===========================
    // SETTINGS TABS
    // ===========================

    const settingsTabs =
      document.querySelectorAll(
        ".settings-tab"
      );


    const panels = {
      account:
        document.getElementById(
          "accountPanel"
        ),

      children:
        document.getElementById(
          "childrenPanel"
        ),

      language:
        document.getElementById(
          "languagePanel"
        ),

      subscription:
        document.getElementById(
          "subscriptionPanel"
        ),

      privacy:
        document.getElementById(
          "privacyPanel"
        )
    };


    settingsTabs.forEach(
      tab => {

        tab.addEventListener(
          "click",
          () => {

            const target =
              tab.dataset.tab;


            settingsTabs.forEach(
              item => {

                item.classList.remove(
                  "active"
                );
              }
            );


            Object.values(
              panels
            ).forEach(
              panel => {

                panel.classList.remove(
                  "active"
                );
              }
            );


            tab.classList.add(
              "active"
            );


            panels[target]
              .classList.add(
                "active"
              );
          }
        );
      }
    );


    // ===========================
    // PARENT PROFILE
    // ===========================

    function getParentProfile() {

      try {

        return JSON.parse(
          localStorage.getItem(
            window.RafiqSetup.parentProfileKey()
          )
        ) || {

          name: "",
          email: "",
          phone: ""
        };

      } catch (error) {

        return {
          name: "",
          email: "",
          phone: ""
        };
      }
    }


    const parentProfile =
      getParentProfile();
    const currentAccount=window.RafiqFamily.user();if(currentAccount){parentProfile.name=parentProfile.name||currentAccount.fullName;parentProfile.email=parentProfile.email||currentAccount.email;parentProfile.phone=parentProfile.phone||currentAccount.phone;}


    parentName.value =
      parentProfile.name ||
      "";


    parentEmail.value =
      parentProfile.email ||
      "";


    parentPhone.value =
      parentProfile.phone ||
      "";


    accountForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const name =
          parentName.value.trim();


        const email =
          parentEmail.value.trim();


        if (
          !name ||
          !email
        ) {

          accountMessage.style.color =
            "#A63A17";


          accountMessage.textContent =
            "Please enter your name and email.";

          return;
        }


        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){accountMessage.style.color='#A63A17';accountMessage.textContent='Please enter a valid email address.';parentEmail.focus();return;}
        const profile = {
          name,
          email,

          phone:
            parentPhone.value.trim()
        };


        try{const users=JSON.parse(localStorage.getItem('rafiqUsers')||'[]'),account=users.find(u=>u.id===window.RafiqSetup.parentOwner()&&u.role==='parent');if(users.some(u=>u.id!==account?.id&&u.role==='parent'&&u.email?.toLowerCase()===email.toLowerCase())){accountMessage.textContent='This email is already registered.';return;}if(account){account.fullName=name;account.email=email.toLowerCase();account.phone=profile.phone;localStorage.setItem('rafiqUsers',JSON.stringify(users));}localStorage.setItem(window.RafiqSetup.parentProfileKey(),JSON.stringify(profile));}catch{accountMessage.style.color='#A63A17';accountMessage.textContent='Could not save your changes. Your entries are still here. Please try again.';return;}


        accountMessage.style.color =
          "#0A6450";


        accountMessage.textContent =
          "Changes saved successfully.";


        window.setTimeout(
          () => {

            accountMessage.textContent =
              "";
          },
          2500
        );

      }
    );


    // ===========================
    // CHILD PROFILES
    // ===========================

    function renderChildren() {

      childrenList.innerHTML =
        "";


      currentChild =
        getCurrentChild();


      children.forEach(
        child => {

          const row =
            document.createElement(
              "div"
            );


          row.className =
            "child-profile-row";


          const age =
            calculateAge(
              child.dateOfBirth
            );


          const isCurrent =
            child.id ===
            currentChild.id;


          row.innerHTML = `
            <div class="child-profile-avatar">
              ${child.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div class="child-profile-info">

              <strong>
                ${escapeHTML(
                  child.name
                )}
              </strong>

              <span>
                ${formatAge(
                  age
                )}
                •
                ${escapeHTML(
                  child.relationship ||
                  "Child"
                )}
              </span>

            </div>

            ${
              isCurrent
                ? `
                  <span class="current-child-badge">
                    Current
                  </span>
                `
                : `
                  <button
                    type="button"
                    class="switch-child-button"
                    data-id="${child.id}"
                  >
                    Switch
                  </button>
                `
            }
          `;


          childrenList.appendChild(
            row
          );
        }
      );


      document
        .querySelectorAll(
          ".switch-child-button"
        )
        .forEach(
          button => {

            button.addEventListener(
              "click",
              () => {

                window.RafiqFamily.select(button.dataset.id);


                    renderSidebarChild();

                renderChildren();
              }
            );

          }
        );
    }


    // ===========================
    // LANGUAGE
    // ===========================

    const languageButtons =
      document.querySelectorAll(
        ".language-option"
      );


    function getLanguage() {

      return (
        localStorage.getItem('rafiqLanguage_'+window.RafiqSetup.parentOwner()) ||
        "en"
      );
    }


    function renderLanguage() {

      const language =
        getLanguage();


      languageButtons.forEach(
        button => {

          button.classList.toggle(
            "active",
            button.dataset.language ===
              language
          );
        }
      );
    }


    languageButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const language =
              button.dataset.language;


            window.RafiqLanguage.setLanguage(language);


            renderLanguage();
          }
        );
      }
    );


    // ===========================
    // SUBSCRIPTION
    // ===========================

    function renderSubscription() {

      const plan = window.RafiqMembership.state().plan;


      if (
        plan === "plus"
      ) {

        currentPlanName.textContent =
          "RAFIQ Plus";


        currentPlanDescription.textContent =
          "Enhanced parenting and development support.";


        planBadge.textContent =
          "Plus";

      } else {

        currentPlanName.textContent =
          "RAFIQ Free";


        currentPlanDescription.textContent =
          "Essential parenting and development support.";


        planBadge.textContent =
          "Free";
      }

    }


    // ===========================
    // ESCAPE HTML
    // ===========================

    function escapeHTML(
      value
    ) {

      const element =
        document.createElement(
          "div"
        );


      element.textContent =
        String(
          value ?? ""
        );


      return element.innerHTML;
    }


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

    function logout() {

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
        "privacyLogoutButton"
      )
      .addEventListener(
        "click",
        logout
      );


    // ===========================
    // INIT
    // ===========================

    const requestedTab = new URLSearchParams(location.search).get('tab');
    if (Object.prototype.hasOwnProperty.call(panels, requestedTab)) {
      document.querySelector('.settings-tab[data-tab="' + requestedTab + '"]').click();
    }

    renderSidebarChild();

    renderChildren();

    renderLanguage();

    renderSubscription();

  }
);