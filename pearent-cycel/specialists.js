document.addEventListener(
  "DOMContentLoaded",
  () => {

    // =========================
    // ELEMENTS
    // =========================

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


    const heroAvatar =
      document.getElementById(
        "heroAvatar"
      );

    const heroChildName =
      document.getElementById(
        "heroChildName"
      );

    const heroProfileName =
      document.getElementById(
        "heroProfileName"
      );

    const heroProfileAge =
      document.getElementById(
        "heroProfileAge"
      );

    const heroDescription =
      document.getElementById(
        "heroDescription"
      );


    const searchInput =
      document.getElementById(
        "searchInput"
      );

    const specialtyFilter =
      document.getElementById(
        "specialtyFilter"
      );

    const typeButtons =
      document.querySelectorAll(
        ".type-button"
      );

    const clearFilters =
      document.getElementById(
        "clearFilters"
      );


    const specialistGrid =
      document.getElementById(
        "specialistGrid"
      );

    const resultCount =
      document.getElementById(
        "resultCount"
      );

    const emptyState =
      document.getElementById(
        "emptyState"
      );


    // Modal

    const profileModal =
      document.getElementById(
        "profileModal"
      );

    const modalClose =
      document.getElementById(
        "modalClose"
      );

    const closeProfileButton =
      document.getElementById(
        "closeProfileButton"
      );

    const modalAvatar =
      document.getElementById(
        "modalAvatar"
      );

    const modalName =
      document.getElementById(
        "modalName"
      );

    const modalSpecialty =
      document.getElementById(
        "modalSpecialty"
      );

    const modalRating =
      document.getElementById(
        "modalRating"
      );

    const modalExperience =
      document.getElementById(
        "modalExperience"
      );

    const modalAbout =
      document.getElementById(
        "modalAbout"
      );

    const modalAreas =
      document.getElementById(
        "modalAreas"
      );

    const modalConsultation =
      document.getElementById(
        "modalConsultation"
      );

    const modalLanguages =
      document.getElementById(
        "modalLanguages"
      );

    const modalAvailability =
      document.getElementById(
        "modalAvailability"
      );

    const modalPrice =
      document.getElementById(
        "modalPrice"
      );

    const bookSpecialistButton =
      document.getElementById(
        "bookSpecialistButton"
      );


    // Sidebar

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

    const logoutButton =
      document.getElementById(
        "logoutButton"
      );


    // =========================
    // CHILD
    // =========================

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


    // =========================
    // AGE
    // =========================

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

      if (age.totalMonths < 12) {

        return (
          age.totalMonths +
          (age.totalMonths === 1
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


    const age =
      calculateAge(
        currentChild.dateOfBirth
      );


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


    heroAvatar.textContent =
      initial;

    heroChildName.textContent =
      currentChild.name;

    heroProfileName.textContent =
      currentChild.name;

    heroProfileAge.textContent =
      formatAge(age);


    heroDescription.textContent =
      `Browse professionals and choose the type of support that best fits ${currentChild.name}'s needs.`;


    // =========================
    // DEMO SPECIALISTS
    // =========================

    const specialists = [

      {
        id: "sp_001",

        name:
          "Dr. Lina Haddad",

        initials:
          "LH",

        specialtyKey:
          "speech",

        specialty:
          "Speech & Language Specialist",

        rating:
          4.9,

        experience:
          8,

        consultationTypes: [
          "online",
          "in-person"
        ],

        consultationLabel:
          "Online & In-person",

        languages:
          "Arabic, English",

        availability:
          "Tomorrow",

        price:
          "30 JOD",

        areas: [
          "Speech Delay",
          "Language Development",
          "Communication",
          "Early Childhood"
        ],

        about:
          "Supports children and families with speech, language and communication concerns through age-appropriate assessment and parent guidance."
      },


      {
        id: "sp_002",

        name:
          "Dr. Omar Khalil",

        initials:
          "OK",

        specialtyKey:
          "psychology",

        specialty:
          "Child Psychologist",

        rating:
          4.8,

        experience:
          10,

        consultationTypes: [
          "online"
        ],

        consultationLabel:
          "Online",

        languages:
          "Arabic, English",

        availability:
          "Mon, 4:00 PM",

        price:
          "35 JOD",

        areas: [
          "Emotional Wellbeing",
          "Behavior",
          "Parent Guidance",
          "Adolescence"
        ],

        about:
          "Works with children, teenagers and parents around emotional wellbeing, behavior, communication and family concerns."
      },


      {
        id: "sp_003",

        name:
          "Sara Nasser",

        initials:
          "SN",

        specialtyKey:
          "behavior",

        specialty:
          "Behavioral Specialist",

        rating:
          4.7,

        experience:
          6,

        consultationTypes: [
          "online",
          "in-person"
        ],

        consultationLabel:
          "Online & In-person",

        languages:
          "Arabic",

        availability:
          "Today, 6:00 PM",

        price:
          "25 JOD",

        areas: [
          "Behavior",
          "Daily Routines",
          "Parent Coaching",
          "Early Childhood"
        ],

        about:
          "Helps families understand behavioral patterns and build practical routines, boundaries and supportive parenting strategies."
      },


      {
        id: "sp_004",

        name:
          "Dr. Yazan Saleh",

        initials:
          "YS",

        specialtyKey:
          "pediatrician",

        specialty:
          "Pediatrician",

        rating:
          4.9,

        experience:
          12,

        consultationTypes: [
          "in-person"
        ],

        consultationLabel:
          "In-person",

        languages:
          "Arabic, English",

        availability:
          "Tue, 11:00 AM",

        price:
          "40 JOD",

        areas: [
          "Child Health",
          "Development",
          "Growth",
          "Parent Concerns"
        ],

        about:
          "Provides general pediatric consultation and supports families with child health, growth and developmental concerns."
      },


      {
        id: "sp_005",

        name:
          "Maya Abu Ali",

        initials:
          "MA",

        specialtyKey:
          "learning",

        specialty:
          "Learning Difficulties Specialist",

        rating:
          4.8,

        experience:
          7,

        consultationTypes: [
          "online",
          "in-person"
        ],

        consultationLabel:
          "Online & In-person",

        languages:
          "Arabic, English",

        availability:
          "Wed, 3:30 PM",

        price:
          "28 JOD",

        areas: [
          "Learning Difficulties",
          "School Support",
          "Attention",
          "Study Skills"
        ],

        about:
          "Supports school-age children and families with learning challenges, study routines and educational support strategies."
      },


      {
        id: "sp_006",

        name:
          "Rana Mahmoud",

        initials:
          "RM",

        specialtyKey:
          "development",

        specialty:
          "Child Development Specialist",

        rating:
          4.9,

        experience:
          9,

        consultationTypes: [
          "online"
        ],

        consultationLabel:
          "Online",

        languages:
          "Arabic, English",

        availability:
          "Tomorrow, 1:00 PM",

        price:
          "32 JOD",

        areas: [
          "Development",
          "Milestones",
          "Early Concerns",
          "Parent Support"
        ],

        about:
          "Supports parents in understanding developmental progress, milestones, early concerns and appropriate next steps."
      }

    ];


    // =========================
    // FILTERING
    // =========================

    let consultationFilter =
      "all";


    function getFilteredSpecialists() {

      const search =
        searchInput.value
          .trim()
          .toLowerCase();


      const specialty =
        specialtyFilter.value;


      return specialists.filter(
        specialist => {

          const matchesSearch =
            !search ||
            specialist.name
              .toLowerCase()
              .includes(search) ||
            specialist.specialty
              .toLowerCase()
              .includes(search) ||
            specialist.areas
              .some(
                area =>
                  area
                    .toLowerCase()
                    .includes(search)
              );


          const matchesSpecialty =
            specialty === "all" ||
            specialist.specialtyKey ===
              specialty;


          const matchesType =
            consultationFilter === "all" ||
            specialist
              .consultationTypes
              .includes(
                consultationFilter
              );


          return (
            matchesSearch &&
            matchesSpecialty &&
            matchesType
          );
        }
      );
    }


    // =========================
    // RENDER
    // =========================

    function renderSpecialists() {

      const filtered =
        getFilteredSpecialists();


      specialistGrid.innerHTML =
        "";


      resultCount.textContent =
        `${filtered.length} ${
          filtered.length === 1
            ? "specialist"
            : "specialists"
        }`;


      emptyState.hidden =
        filtered.length !== 0;


      filtered.forEach(
        specialist => {

          const card =
            document.createElement(
              "article"
            );


          card.className =
            "specialist-card";


          card.innerHTML = `
            <div class="specialist-top">

              <div class="specialist-avatar">
                ${specialist.initials}
              </div>

              <div class="specialist-main">

                <span class="verified-badge">
                  ✓ Verified
                </span>

                <h3>
                  ${specialist.name}
                </h3>

                <p>
                  ${specialist.specialty}
                </p>

              </div>

              <span class="rating">
                ★ ${specialist.rating}
              </span>

            </div>


            <div class="specialist-tags">

              ${specialist.areas
                .slice(0,3)
                .map(
                  area =>
                    `<span class="specialist-tag">${area}</span>`
                )
                .join("")}

            </div>


            <div class="specialist-details">

              <div class="detail-box">
                <span>
                  Experience
                </span>

                <strong>
                  ${specialist.experience} years
                </strong>
              </div>


              <div class="detail-box">
                <span>
                  Consultation
                </span>

                <strong>
                  ${specialist.consultationLabel}
                </strong>
              </div>


              <div class="detail-box">
                <span>
                  Next Available
                </span>

                <strong class="available">
                  ${specialist.availability}
                </strong>
              </div>


              <div class="detail-box">
                <span>
                  Session Fee
                </span>

                <strong>
                  ${specialist.price}
                </strong>
              </div>

            </div>


            <div class="specialist-actions">

              <button
                type="button"
                class="view-button"
                data-id="${specialist.id}"
              >
                View Profile
              </button>

              <button
                type="button"
                class="card-book-button"
                data-id="${specialist.id}"
              >
                Book
              </button>

            </div>
          `;


          specialistGrid.appendChild(
            card
          );
        }
      );


      addCardListeners();
    }


    // =========================
    // CARD LISTENERS
    // =========================

    function addCardListeners() {

      document
        .querySelectorAll(
          ".view-button"
        )
        .forEach(
          button => {

            button.addEventListener(
              "click",
              () => {

                const specialist =
                  specialists.find(
                    item =>
                      item.id ===
                      button.dataset.id
                  );


                openProfile(
                  specialist
                );
              }
            );
          }
        );


      document
        .querySelectorAll(
          ".card-book-button"
        )
        .forEach(
          button => {

            button.addEventListener(
              "click",
              () => {

                const specialist =
                  specialists.find(
                    item =>
                      item.id ===
                      button.dataset.id
                  );


                goToBooking(
                  specialist
                );
              }
            );
          }
        );
    }


    // =========================
    // PROFILE MODAL
    // =========================

    let activeSpecialist =
      null;


    function openProfile(
      specialist
    ) {

      activeSpecialist =
        specialist;


      modalAvatar.textContent =
        specialist.initials;

      modalName.textContent =
        specialist.name;

      modalSpecialty.textContent =
        specialist.specialty;

      modalRating.textContent =
        `★ ${specialist.rating}`;

      modalExperience.textContent =
        `${specialist.experience} years experience`;

      modalAbout.textContent =
        specialist.about;

      modalConsultation.textContent =
        specialist.consultationLabel;

      modalLanguages.textContent =
        specialist.languages;

      modalAvailability.textContent =
        specialist.availability;

      modalPrice.textContent =
        specialist.price;


      modalAreas.innerHTML =
        "";


      specialist.areas.forEach(
        area => {

          const tag =
            document.createElement(
              "span"
            );

          tag.className =
            "modal-tag";

          tag.textContent =
            area;

          modalAreas.appendChild(
            tag
          );
        }
      );


      profileModal.hidden =
        false;


      document.body.style.overflow =
        "hidden";


      modalClose.focus();
    }


    function closeProfile() {

      profileModal.hidden =
        true;

      document.body.style.overflow =
        "";

      activeSpecialist =
        null;
    }


    modalClose.addEventListener(
      "click",
      closeProfile
    );


    closeProfileButton.addEventListener(
      "click",
      closeProfile
    );


    profileModal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          profileModal
        ) {

          closeProfile();
        }
      }
    );


    // =========================
    // BOOKING
    // =========================

    function goToBooking(
      specialist
    ) {

      /*
        Save selected specialist temporarily
        for the booking page.
      */

      sessionStorage.setItem(
        "rafiqSelectedSpecialist",
        JSON.stringify(
          specialist
        )
      );


      window.location.href =
        "booking.html";
    }


    bookSpecialistButton.addEventListener(
      "click",
      () => {

        if (!activeSpecialist) {
          return;
        }


        goToBooking(
          activeSpecialist
        );
      }
    );


    // =========================
    // FILTER EVENTS
    // =========================

    searchInput.addEventListener(
      "input",
      renderSpecialists
    );


    specialtyFilter.addEventListener(
      "change",
      renderSpecialists
    );


    typeButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            consultationFilter =
              button.dataset.type;


            typeButtons.forEach(
              item => {

                item.classList.remove(
                  "active"
                );
              }
            );


            button.classList.add(
              "active"
            );


            renderSpecialists();
          }
        );
      }
    );


    clearFilters.addEventListener(
      "click",
      () => {

        searchInput.value =
          "";

        specialtyFilter.value =
          "all";

        consultationFilter =
          "all";


        typeButtons.forEach(
          button => {

            button.classList.toggle(
              "active",
              button.dataset.type ===
                "all"
            );
          }
        );


        renderSpecialists();
      }
    );


    // =========================
    // SIDEBAR
    // =========================

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
          event.key !== "Escape"
        ) {
          return;
        }


        if (
          !profileModal.hidden
        ) {

          closeProfile();

        } else {

          closeSidebar();
        }
      }
    );


    // =========================
    // LOGOUT
    // =========================

    logoutButton.addEventListener(
      "click",
      () => {

        sessionStorage.clear();

        window.location.href =
          "../piblic-pages/login.html";
      }
    );


    // =========================
    // INIT
    // =========================

    renderSpecialists();

  }
);