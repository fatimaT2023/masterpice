document.addEventListener(
  "DOMContentLoaded",
  () => {

    // ===============================
    // ELEMENTS
    // ===============================

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


    const heroChildName =
      document.getElementById(
        "heroChildName"
      );

    const heroText =
      document.getElementById(
        "heroText"
      );


    const progressPercent =
      document.getElementById(
        "progressPercent"
      );

    const progressFill =
      document.getElementById(
        "progressFill"
      );

    const progressMessage =
      document.getElementById(
        "progressMessage"
      );


    const achievedCount =
      document.getElementById(
        "achievedCount"
      );

    const notYetCount =
      document.getElementById(
        "notYetCount"
      );

    const notSureCount =
      document.getElementById(
        "notSureCount"
      );

    const untrackedCount =
      document.getElementById(
        "untrackedCount"
      );


    const milestoneList =
      document.getElementById(
        "milestoneList"
      );

    const stageTitle =
      document.getElementById(
        "stageTitle"
      );

    const stageChip =
      document.getElementById(
        "stageChip"
      );


    const filterButtons =
      document.querySelectorAll(
        ".filter-button"
      );


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


    // ===============================
    // CHILDREN
    // ===============================

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


    if (children.length === 0) {

      window.location.href =
        "onboarding.html";

      return;
    }


    function getCurrentChild() {

      const currentId =
        localStorage.getItem(
          "rafiqCurrentChildId"
        );


      return (
        children.find(
          child =>
            child.id === currentId
        ) ||
        children[0]
      );
    }


    const currentChild =
      getCurrentChild();


    // ===============================
    // AGE
    // ===============================

    function calculateAge(dateString) { return window.RafiqSetup.ageFromBirth(dateString) || {years:NaN,months:NaN,totalMonths:NaN,days:NaN}; }


    function formatAge(age) { return window.RafiqSetup.formatAge(age); }


    const age =
      calculateAge(
        currentChild.dateOfBirth
      );


    // ===============================
    // AGE GROUP
    // ===============================

    function getAgeGroup(age) {

      if (age.years <= 3) {
        return "0-3";
      }

      if (age.years <= 6) {
        return "4-6";
      }

      if (age.years <= 12) {
        return "7-12";
      }

      return "13-18";
    }


    function getStageName(group) {

      const stages = {
        "0-3": "Early Years",
        "4-6": "Early Childhood",
        "7-12": "School Age",
        "13-18": "Adolescence"
      };


      return stages[group];
    }


    const ageGroup =
      getAgeGroup(age);


    // ===============================
    // DEMO TRACKING DATA
    // ===============================

    /*
      These are illustrative prototype tracking
      items, not validated diagnostic criteria.
    */

    const milestoneData = {

      "0-3": [

        {
          id: "early-communication-1",
          domain: "communication",
          icon: "◌",
          title:
            "Uses sounds, gestures or words to communicate",
          description:
            "Notice how your child tries to express needs, interests and attention."
        },

        {
          id: "early-social-1",
          domain: "social",
          icon: "♡",
          title:
            "Engages with familiar people",
          description:
            "Observe eye contact, shared play, smiles and interest in familiar people."
        },

        {
          id: "early-movement-1",
          domain: "movement",
          icon: "↗",
          title:
            "Builds movement and coordination skills",
          description:
            "Notice changes in sitting, walking, reaching, climbing or hand use."
        },

        {
          id: "early-learning-1",
          domain: "learning",
          icon: "✦",
          title:
            "Explores toys and everyday objects",
          description:
            "Observe curiosity, cause-and-effect play and interest in new objects."
        },

        {
          id: "early-daily-1",
          domain: "daily",
          icon: "✓",
          title:
            "Participates in everyday routines",
          description:
            "Notice involvement in eating, dressing, washing and simple routines."
        }

      ],


      "4-6": [

        {
          id: "childhood-communication-1",
          domain: "communication",
          icon: "◌",
          title:
            "Communicates ideas and everyday experiences",
          description:
            "Notice how your child explains needs, events, stories and questions."
        },

        {
          id: "childhood-social-1",
          domain: "social",
          icon: "♡",
          title:
            "Participates in play with other children",
          description:
            "Observe taking turns, sharing ideas and joining group play."
        },

        {
          id: "childhood-movement-1",
          domain: "movement",
          icon: "↗",
          title:
            "Uses growing coordination in play",
          description:
            "Notice running, jumping, drawing, building and other coordinated activities."
        },

        {
          id: "childhood-learning-1",
          domain: "learning",
          icon: "✦",
          title:
            "Follows routines and simple sequences",
          description:
            "Observe memory, simple problem-solving and understanding everyday instructions."
        },

        {
          id: "childhood-daily-1",
          domain: "daily",
          icon: "✓",
          title:
            "Shows growing independence",
          description:
            "Notice participation in dressing, tidying, eating and personal routines."
        }

      ],


      "7-12": [

        {
          id: "school-communication-1",
          domain: "communication",
          icon: "◌",
          title:
            "Explains thoughts, questions and experiences",
          description:
            "Notice how your child communicates at home, school and with peers."
        },

        {
          id: "school-social-1",
          domain: "social",
          icon: "♡",
          title:
            "Builds and maintains friendships",
          description:
            "Observe cooperation, conflict resolution and understanding other perspectives."
        },

        {
          id: "school-movement-1",
          domain: "movement",
          icon: "↗",
          title:
            "Uses coordination in daily activities",
          description:
            "Notice confidence in play, sports, handwriting and practical tasks."
        },

        {
          id: "school-learning-1",
          domain: "learning",
          icon: "✦",
          title:
            "Organizes and completes age-appropriate tasks",
          description:
            "Observe attention, planning, school routines and problem-solving."
        },

        {
          id: "school-daily-1",
          domain: "daily",
          icon: "✓",
          title:
            "Takes responsibility for regular routines",
          description:
            "Notice independence with belongings, hygiene, homework and simple responsibilities."
        }

      ],


      "13-18": [

        {
          id: "teen-communication-1",
          domain: "communication",
          icon: "◌",
          title:
            "Expresses opinions and discusses complex topics",
          description:
            "Notice communication about school, relationships, choices and emotions."
        },

        {
          id: "teen-social-1",
          domain: "social",
          icon: "♡",
          title:
            "Navigates friendships and social boundaries",
          description:
            "Observe communication, peer relationships and respect for boundaries."
        },

        {
          id: "teen-movement-1",
          domain: "movement",
          icon: "↗",
          title:
            "Maintains healthy activity and self-care routines",
          description:
            "Notice participation in movement, daily routines and physical self-care."
        },

        {
          id: "teen-learning-1",
          domain: "learning",
          icon: "✦",
          title:
            "Plans and manages increasing responsibilities",
          description:
            "Observe school organization, decision-making and longer-term planning."
        },

        {
          id: "teen-daily-1",
          domain: "daily",
          icon: "✓",
          title:
            "Develops greater everyday independence",
          description:
            "Notice responsibility for schedules, personal care and age-appropriate decisions."
        }

      ]

    };


    const currentMilestones =
      milestoneData[ageGroup];


    // ===============================
    // STORAGE
    // ===============================

    const storageKey =
      "rafiqMilestones_" +
      currentChild.id;


    function getSavedStatuses() {

      try {

        return JSON.parse(
          localStorage.getItem(
            storageKey
          )
        ) || {};

      } catch (error) {

        return {};
      }
    }


    let statuses =
      getSavedStatuses();


    function saveStatuses() {

      localStorage.setItem(
        storageKey,
        JSON.stringify(
          statuses
        )
      );
    }


    // ===============================
    // CHILD INFO
    // ===============================

    function renderChildInfo() {

      const initial =
        currentChild.name
          .charAt(0)
          .toUpperCase();


      childAvatar.textContent =
        initial;

      childName.textContent =
        currentChild.name;

      childAge.textContent =
        formatAge(age);


      heroChildName.textContent =
        currentChild.name;


      stageTitle.textContent =
        `${getStageName(ageGroup)} development`;

      stageChip.textContent =
        `${ageGroup} years`;


      if (ageGroup === "0-3") {

        heroText.textContent =
          `Track ${currentChild.name}'s early communication, movement, social interaction, learning and everyday routines.`;

      } else if (
        ageGroup === "4-6"
      ) {

        heroText.textContent =
          `Follow ${currentChild.name}'s growing language, independence, social skills, learning and everyday development.`;

      } else if (
        ageGroup === "7-12"
      ) {

        heroText.textContent =
          `Keep a simple record of ${currentChild.name}'s communication, learning, friendships, independence and daily skills.`;

      } else {

        heroText.textContent =
          `Support ${currentChild.name}'s growing independence, communication, planning, social development and daily responsibilities.`;
      }

    }


    // ===============================
    // DOMAIN LABELS
    // ===============================

    function getDomainLabel(
      domain
    ) {

      const labels = {
        communication:
          "Communication",

        social:
          "Social",

        movement:
          "Movement",

        learning:
          "Learning",

        daily:
          "Daily Skills"
      };


      return labels[domain];
    }


    // ===============================
    // RENDER
    // ===============================

    let activeFilter =
      "all";


    function renderMilestones() {

      milestoneList.innerHTML =
        "";


      const filtered =
        activeFilter === "all"
          ? currentMilestones
          : currentMilestones.filter(
              milestone =>
                milestone.domain ===
                activeFilter
            );


      filtered.forEach(
        milestone => {

          const card =
            document.createElement(
              "article"
            );


          card.className =
            "milestone-card";


          const selectedStatus =
            statuses[milestone.id] ||
            "";


          card.innerHTML = `
            <div class="domain-icon ${milestone.domain}">
              ${milestone.icon}
            </div>

            <div class="milestone-copy">

              <span class="milestone-domain">
                ${getDomainLabel(
                  milestone.domain
                )}
              </span>

              <h3>
                ${milestone.title}
              </h3>

              <p>
                ${milestone.description}
              </p>

            </div>

            <div class="status-buttons">

              <button
                type="button"
                class="status-button ${
                  selectedStatus ===
                  "achieved"
                    ? "selected"
                    : ""
                }"
                data-id="${milestone.id}"
                data-status="achieved"
              >
                ✓ Achieved
              </button>

              <button
                type="button"
                class="status-button ${
                  selectedStatus ===
                  "not-yet"
                    ? "selected"
                    : ""
                }"
                data-id="${milestone.id}"
                data-status="not-yet"
              >
                ○ Not Yet
              </button>

              <button
                type="button"
                class="status-button ${
                  selectedStatus ===
                  "not-sure"
                    ? "selected"
                    : ""
                }"
                data-id="${milestone.id}"
                data-status="not-sure"
              >
                ? Not Sure
              </button>

            </div>
          `;


          milestoneList.appendChild(
            card
          );

        }
      );


      addStatusListeners();

      updateSummary();
    }


    // ===============================
    // STATUS
    // ===============================

    function addStatusListeners() {

      document
        .querySelectorAll(
          ".status-button"
        )
        .forEach(
          button => {

            button.addEventListener(
              "click",
              () => {

                const id =
                  button.dataset.id;

                const status =
                  button.dataset.status;


                /*
                  Clicking the selected option
                  again removes the status.
                */

                if (
                  statuses[id] ===
                  status
                ) {

                  delete statuses[id];

                } else {

                  statuses[id] =
                    status;
                }


                saveStatuses();

                renderMilestones();

              }
            );

          }
        );

    }


    // ===============================
    // SUMMARY
    // ===============================

    function updateSummary() {

      let achieved = 0;
      let notYet = 0;
      let notSure = 0;


      currentMilestones.forEach(
        milestone => {

          const status =
            statuses[milestone.id];


          if (
            status === "achieved"
          ) {
            achieved++;
          }


          if (
            status === "not-yet"
          ) {
            notYet++;
          }


          if (
            status === "not-sure"
          ) {
            notSure++;
          }

        }
      );


      const tracked =
        achieved +
        notYet +
        notSure;


      const total =
        currentMilestones.length;


      const untracked =
        total - tracked;


      const percent =
        total === 0
          ? 0
          : Math.round(
              (tracked / total) *
              100
            );


      achievedCount.textContent =
        achieved;

      notYetCount.textContent =
        notYet;

      notSureCount.textContent =
        notSure;

      untrackedCount.textContent =
        untracked;


      progressPercent.textContent =
        percent + "%";


      progressFill.style.width =
        percent + "%";


      if (percent === 0) {

        progressMessage.textContent =
          "Start tracking milestones below.";

      } else if (
        percent < 100
      ) {

        progressMessage.textContent =
          `${tracked} of ${total} items reviewed.`;

      } else {

        progressMessage.textContent =
          "You've reviewed all current tracking items.";
      }

    }


    // ===============================
    // FILTERS
    // ===============================

    filterButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            activeFilter =
              button.dataset.filter;


            filterButtons.forEach(
              item => {

                item.classList.remove(
                  "active"
                );

              }
            );


            button.classList.add(
              "active"
            );


            renderMilestones();

          }
        );

      }
    );


    // ===============================
    // MOBILE SIDEBAR
    // ===============================

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
        }

      }
    );


    // ===============================
    // INITIALIZE
    // ===============================

    renderChildInfo();

    renderMilestones();

  }
);

const logoutButton =
  document.getElementById("logoutButton");

logoutButton.addEventListener(
  "click",
  () => {

    // نمسح بيانات الجلسة فقط
    sessionStorage.clear();

    // ما نمسح بيانات الطفل من localStorage
    window.location.href =
      "../piblic-pages/login.html";
  }
);