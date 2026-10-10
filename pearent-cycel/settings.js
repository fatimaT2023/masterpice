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

        return JSON.parse(
          localStorage.getItem(
            "rafiqChildren"
          )
        ) || [];

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
        localStorage.getItem(
          "rafiqCurrentChildId"
        );


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

    function calculateAge(
      dateString
    ) {

      const birthDate =
        new Date(
          dateString +
          "T00:00:00"
        );


      const today =
        new Date();


      let years =
        today.getFullYear() -
        birthDate.getFullYear();


      let months =
        today.getMonth() -
        birthDate.getMonth();


      if (
        today.getDate() <
        birthDate.getDate()
      ) {

        months--;
      }


      if (
        months < 0
      ) {

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


    function formatAge(
      age
    ) {

      if (
        age.totalMonths < 12
      ) {

        return (
          age.totalMonths +
          (
            age.totalMonths === 1
              ? " month"
              : " months"
          )
        );
      }


      return (
        age.years +
        (
          age.years === 1
            ? " year old"
            : " years old"
        )
      );
    }


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
            "rafiqParentProfile"
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


        const profile = {
          name,
          email,

          phone:
            parentPhone.value.trim()
        };


        localStorage.setItem(
          "rafiqParentProfile",
          JSON.stringify(
            profile
          )
        );


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

                localStorage.setItem(
                  "rafiqCurrentChildId",
                  button.dataset.id
                );


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
        localStorage.getItem(
          "rafiqLanguage"
        ) ||
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


            localStorage.setItem(
              "rafiqLanguage",
              language
            );


            renderLanguage();
          }
        );
      }
    );


    // ===========================
    // SUBSCRIPTION
    // ===========================

    function renderSubscription() {

      const plan =
        localStorage.getItem(
          "rafiqSubscriptionPlan"
        ) ||
        "free";


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

    renderSidebarChild();

    renderChildren();

    renderLanguage();

    renderSubscription();

  }
);