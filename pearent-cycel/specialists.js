document.addEventListener(
  "DOMContentLoaded",
  () => {

    // =====================================
    // ELEMENTS
    // =====================================

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


    // =====================================
    // PROFILE MODAL
    // =====================================

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

    const logoutButton =
      document.getElementById(
        "logoutButton"
      );


    // =====================================
    // STORAGE HELPERS
    // =====================================

    function readArray(
      key
    ) {

      try {

        const value =
          JSON.parse(
            localStorage.getItem(
              key
            )
          );

        return Array.isArray(
          value
        )
          ? value
          : [];

      } catch (error) {

        return [];
      }
    }


    function readObject(
      key
    ) {

      try {

        return JSON.parse(
          localStorage.getItem(
            key
          )
        );

      } catch (error) {

        return null;
      }
    }


    // =====================================
    // CHILD
    // =====================================

    const children =
      readArray(
        "rafiqChildren"
      );


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
      ) ||
      children[0];


    // =====================================
    // CHILD AGE
    // =====================================

    function calculateAge(dateString) { return window.RafiqSetup.ageFromBirth(dateString) || {years:NaN,months:NaN,totalMonths:NaN,days:NaN}; }


    function formatAge(age) { return window.RafiqSetup.formatAge(age); }


    const age =
      calculateAge(
        currentChild.dateOfBirth ||
        currentChild.dob ||
        currentChild.birthDate
      );


    const childInitial =
      String(
        currentChild.name ||
        "C"
      )
        .charAt(0)
        .toUpperCase();


    childAvatar.textContent =
      childInitial;

    childName.textContent =
      currentChild.name;

    childAge.textContent =
      formatAge(
        age
      );


    heroAvatar.textContent =
      childInitial;

    heroChildName.textContent =
      currentChild.name;

    heroProfileName.textContent =
      currentChild.name;

    heroProfileAge.textContent =
      formatAge(
        age
      );


    heroDescription.textContent =
      `Compare areas of support, session fees and languages for ${currentChild.name}'s needs.`;


    // =====================================
    // SPECIALIST HELPERS
    // =====================================

    function getInitials(
      fullName
    ) {

      const cleaned =
        String(
          fullName ||
          ""
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

        return "SP";
      }


      if (
        parts.length === 1
      ) {

        return parts[0]
          .slice(
            0,
            2
          )
          .toUpperCase();
      }


      return (
        parts[0][0] +
        parts[
          parts.length - 1
        ][0]
      ).toUpperCase();
    }


    function normalizeSpecialtyKey(
      profile
    ) {

      if (
        profile.specialtyKey
      ) {

        return String(
          profile.specialtyKey
        ).toLowerCase();
      }


      const specialty =
        String(
          profile.specialty ||
          ""
        ).toLowerCase();


      if (
        specialty.includes(
          "speech"
        )
      ) {

        return "speech";
      }


      if (
        specialty.includes(
          "psych"
        )
      ) {

        return "psychology";
      }


      if (
        specialty.includes(
          "behavior"
        )
      ) {

        return "behavior";
      }


      if (
        specialty.includes(
          "pediatric"
        )
      ) {

        return "pediatrician";
      }


      if (
        specialty.includes(
          "occupational"
        )
      ) {

        return "occupational";
      }


      if (
        specialty.includes(
          "learning"
        )
      ) {

        return "learning";
      }


      if (
        specialty.includes(
          "development"
        )
      ) {

        return "development";
      }


      if (
        specialty.includes(
          "nutrition"
        )
      ) {

        return "nutrition";
      }


      if (
        specialty.includes(
          "family"
        )
      ) {

        return "family";
      }


      return "other";
    }


    function formatConsultationType(
      type
    ) {

      const value =
        String(
          type ||
          ""
        )
          .trim()
          .toLowerCase();


      if (
        value === "online"
      ) {

        return "Online";
      }


      if (
        value === "in-person" ||
        value === "inperson"
      ) {

        return "In-person";
      }


      return String(
        type ||
        ""
      );
    }


    function getConsultationLabel(
      consultationTypes
    ) {

      const types =
        Array.isArray(
          consultationTypes
        )
          ? consultationTypes
          : [];


      if (
        types.length === 0
      ) {

        return "Not specified";
      }


      return types
        .map(
          formatConsultationType
        )
        .join(" & ");
    }


    function getLanguageList(
      languages
    ) {

      if (
        Array.isArray(
          languages
        )
      ) {

        return languages;
      }


      if (
        typeof languages ===
        "string"
      ) {

        return languages
          .split(",")
          .map(
            item =>
              item.trim()
          )
          .filter(Boolean);
      }


      return [];
    }


    function formatLanguage(
      language
    ) {

      const value =
        String(
          language ||
          ""
        ).toLowerCase();


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


      return String(
        language ||
        ""
      );
    }


    function getLanguagesLabel(
      languages
    ) {

      const list =
        getLanguageList(
          languages
        );


      if (
        list.length === 0
      ) {

        return "Not specified";
      }


      return list
        .map(
          formatLanguage
        )
        .join(", ");
    }


    function getSpecialtyAreas(
      specialtyKey,
      profileAreas
    ) {

      if (
        Array.isArray(
          profileAreas
        ) &&
        profileAreas.length > 0
      ) {

        return profileAreas;
      }


      const areasBySpecialty = {

        pediatrician: [
          "Child Health",
          "Growth",
          "Development"
        ],

        psychology: [
          "Emotional Wellbeing",
          "Behavior",
          "Parent Guidance"
        ],

        speech: [
          "Speech",
          "Language Development",
          "Communication"
        ],

        behavior: [
          "Behavior",
          "Daily Routines",
          "Parent Coaching"
        ],

        occupational: [
          "Daily Skills",
          "Sensory Support",
          "Motor Development"
        ],

        learning: [
          "Learning Difficulties",
          "School Support",
          "Study Skills"
        ],

        development: [
          "Development",
          "Milestones",
          "Parent Support"
        ],

        nutrition: [
          "Child Nutrition",
          "Healthy Eating",
          "Family Guidance"
        ],

        family: [
          "Parent Guidance",
          "Family Support",
          "Communication"
        ],

        other: [
          "Child Development",
          "Parent Support"
        ]
      };


      return (
        areasBySpecialty[
          specialtyKey
        ] ||
        areasBySpecialty.other
      );
    }


    function getPriceValue(profile) {
      if (profile.price === null || profile.price === undefined || String(profile.price).trim() === '') return null;
      const value = Number(profile.price);
      return Number.isFinite(value) && value >= 0 ? value : null;
    }

    function formatPrice(
      price
    ) {

      const numeric =
        Number(
          price
        );


      if (price === null || !Number.isFinite(numeric)) {

        return "Not specified";
      }


      return (
        Number.isInteger(
          numeric
        )
          ? `${numeric} JOD`
          : `${numeric.toFixed(2)} JOD`
      );
    }


    function getRatingLabel(
      rating
    ) {

      const value =
        Number(
          rating
        );


      if (
        !Number.isFinite(
          value
        ) ||
        value <= 0
      ) {

        return "New";
      }


      return `★ ${value.toFixed(1)}`;
    }


    // =====================================
    // AVAILABILITY
    // =====================================

    const dayIndexes = {

      sunday: 0,
      sun: 0,

      monday: 1,
      mon: 1,

      tuesday: 2,
      tue: 2,
      tues: 2,

      wednesday: 3,
      wed: 3,

      thursday: 4,
      thu: 4,
      thur: 4,
      thurs: 4,

      friday: 5,
      fri: 5,

      saturday: 6,
      sat: 6
    };


    function formatClockTime(
      value
    ) {

      if (
        !value
      ) {

        return "";
      }


      const parts =
        String(
          value
        )
          .split(":")
          .map(Number);


      if (
        !Number.isFinite(
          parts[0]
        )
      ) {

        return String(
          value
        );
      }


      const hour24 =
        parts[0];

      const minutes =
        Number.isFinite(
          parts[1]
        )
          ? parts[1]
          : 0;


      const period =
        hour24 >= 12
          ? "PM"
          : "AM";


      const hour12 =
        hour24 % 12 ||
        12;


      return (
        `${hour12}:` +
        `${String(
          minutes
        ).padStart(
          2,
          "0"
        )} ${period}`
      );
    }


    function getAvailabilityEntries(
      specialistId
    ) {

      const availability =
        readObject(
          `rafiqAvailability_${specialistId}`
        );


      if (
        !availability ||
        !availability.weeklySchedule
      ) {

        return [];
      }


      const weekly =
        availability.weeklySchedule;


      if (
        Array.isArray(
          weekly
        )
      ) {

        return weekly.map(
          item => ({
            ...item,
            dayName:
              item.dayName ||
              item.day ||
              item.name ||
              item.dayKey ||
              ""
          })
        );
      }


      if (
        typeof weekly ===
        "object"
      ) {

        return Object.entries(
          weekly
        )
          .map(
            ([key, value]) => ({

              ...(
                typeof value ===
                "object"
                  ? value
                  : {}
              ),

              dayName:
                value?.dayName ||
                value?.day ||
                value?.name ||
                key
            })
          );
      }


      return [];
    }


    function getNextAvailability(
      specialistId
    ) {

      const entries =
        getAvailabilityEntries(
          specialistId
        )
          .filter(
            entry =>
              entry.enabled !== false &&
              entry.active !== false
          );


      if (
        entries.length === 0
      ) {

        return "Choose a session to check";
      }


      const today =
        new Date();


      const todayIndex =
        today.getDay();


      const candidates =
        entries
          .map(
            entry => {

              const key =
                String(
                  entry.dayName ||
                  ""
                )
                  .trim()
                  .toLowerCase();


              const dayIndex =
                dayIndexes[key];


              if (
                dayIndex === undefined
              ) {

                return null;
              }


              const offset =
                (
                  dayIndex -
                  todayIndex +
                  7
                ) % 7;


              return {
                ...entry,
                dayIndex,
                offset
              };
            }
          )
          .filter(Boolean)
          .sort(
            (a, b) =>
              a.offset -
              b.offset
          );


      if (
        candidates.length === 0
      ) {

        return "Check session availability";
      }


      const next =
        candidates[0];


      const startTime =
        next.start ||
        next.startTime ||
        next.from ||
        "";


      const date =
        new Date(
          today
        );


      date.setDate(
        today.getDate() +
        next.offset
      );


      const dayLabel =
        next.offset === 0
          ? "Today"
          : next.offset === 1
            ? "Tomorrow"
            : date.toLocaleDateString(
                undefined,
                {
                  weekday: "short"
                }
              );


      const formattedTime =
        formatClockTime(
          startTime
        );


      return formattedTime
        ? `${dayLabel}, ${formattedTime}`
        : dayLabel;
    }


    // =====================================
    // NORMALIZE APPROVED SPECIALIST
    // =====================================

    function normalizeSpecialist(
      profile
    ) {

      const specialtyKey =
        normalizeSpecialtyKey(
          profile
        );


      const consultationTypes =
        Array.isArray(
          profile.consultationTypes
        )
          ? profile.consultationTypes
          : [];


      const languagesList =
        getLanguageList(
          profile.languages
        );


      const price =
        getPriceValue(
          profile
        );


      return {

        // IMPORTANT:
        // Same exact ID created by
        // specialist onboarding / admin approval.
        id:
          profile.id,


        name:
          profile.fullName ||
          profile.name ||
          "Specialist",


        fullName:
          profile.fullName ||
          profile.name ||
          "Specialist",


        initials:
          profile.initials ||
          getInitials(
            profile.fullName ||
            profile.name
          ),


        specialtyKey,


        specialty:
          profile.specialty ||
          "Specialist",


        rating:
          profile.rating ??
          null,


        reviews:
          Number(
            profile.reviews ||
            0
          ),


        experience:
          Number(
            profile.experience ||
            0
          ),


        consultationTypes,


        consultationLabel:
          profile.consultationLabel ||
          getConsultationLabel(
            consultationTypes
          ),


        languages:
          getLanguagesLabel(
            languagesList
          ),


        languagesList,


        availability:
          getNextAvailability(
            profile.id
          ),


        // Keep numeric price.
        // This is better for booking /
        // earnings calculations.
        price,


        priceLabel:
          formatPrice(
            price
          ),


        areas:
          getSpecialtyAreas(
            specialtyKey,
            profile.areas
          ),


        about:
          profile.bio ||
          "Professional profile information is available through RAFIQ.",


        qualification:
          profile.qualification ||
          "",


        licenseNumber:
          profile.licenseNumber ||
          "",


        status:
          profile.status,


        verificationStatus:
          profile.verificationStatus,


        approvedAt:
          profile.approvedAt ||
          null
      };
    }


    // =====================================
    // LOAD APPROVED SPECIALISTS
    // =====================================

    function loadApprovedSpecialists() {

      const sharedProfiles =
        readArray(
          "rafiqSpecialists"
        );


      /*
        rafiqSpecialists is the main shared
        directory used by Admin + Parent.

        We also support the current stored
        specialist profile only if for some
        reason it is missing from the shared
        collection.
      */

      const currentProfile =
        readObject(
          "rafiqSpecialistProfile"
        );


      const map =
        new Map();


      sharedProfiles.forEach(
        profile => {

          if (
            profile?.id
          ) {

            map.set(
              profile.id,
              profile
            );
          }
        }
      );


      if (
        currentProfile?.id &&
        !map.has(
          currentProfile.id
        )
      ) {

        map.set(
          currentProfile.id,
          currentProfile
        );
      }


      return Array
        .from(
          map.values()
        )
        .filter(
          profile =>
            profile.status ===
            "approved"
        )
        .map(
          normalizeSpecialist
        )
        .sort(
          (a, b) =>
            a.name.localeCompare(
              b.name
            )
        );
    }


    let specialists =
      loadApprovedSpecialists();


    // =====================================
    // BUILD SPECIALTY FILTER
    // =====================================

    function populateSpecialtyFilter() {

      if (
        !specialtyFilter
      ) {

        return;
      }


      const currentValue =
        specialtyFilter.value;


      specialtyFilter.innerHTML =
        "";


      const allOption =
        document.createElement(
          "option"
        );


      allOption.value =
        "all";

      allOption.textContent =
        "All specialties";


      specialtyFilter.appendChild(
        allOption
      );


      const specialties =
        new Map();


      specialists.forEach(
        specialist => {

          if (
            !specialties.has(
              specialist.specialtyKey
            )
          ) {

            specialties.set(
              specialist.specialtyKey,
              specialist.specialty
            );
          }
        }
      );


      Array.from(
        specialties.entries()
      )
        .sort(
          (a, b) =>
            a[1].localeCompare(
              b[1]
            )
        )
        .forEach(
          ([key, label]) => {

            const option =
              document.createElement(
                "option"
              );


            option.value =
              key;

            option.textContent =
              label;


            specialtyFilter.appendChild(
              option
            );
          }
        );


      const stillExists =
        Array.from(
          specialtyFilter.options
        )
          .some(
            option =>
              option.value ===
              currentValue
          );


      specialtyFilter.value =
        stillExists
          ? currentValue
          : "all";
    }


    // =====================================
    // FILTERING
    // =====================================

    let consultationFilter =
      "all";


    function getFilteredSpecialists() {

      const search =
        String(
          searchInput?.value ||
          ""
        )
          .trim()
          .toLowerCase();


      const specialty =
        specialtyFilter?.value ||
        "all";


      const requestedId=new URLSearchParams(location.search).get('specialist');
      return specialists.filter(
        specialist => {

          const matchesSearch =
            !search ||

            specialist.name
              .toLowerCase()
              .includes(
                search
              ) ||

            specialist.specialty
              .toLowerCase()
              .includes(
                search
              ) ||

            specialist.areas.some(
              area =>
                String(
                  area
                )
                  .toLowerCase()
                  .includes(
                    search
                  )
            );


          const matchesSpecialty =
            specialty ===
              "all" ||

            specialist.specialtyKey ===
              specialty;


          const matchesType =
            consultationFilter ===
              "all" ||

            specialist
              .consultationTypes
              .includes(
                consultationFilter
              );


          return (
            (!requestedId||specialist.id===requestedId) && matchesSearch &&
            matchesSpecialty &&
            matchesType
          );
        }
      );
    }


    // =====================================
    // ESCAPE HTML
    // =====================================

    function escapeHTML(
      value
    ) {

      const element =
        document.createElement(
          "div"
        );


      element.textContent =
        String(
          value ??
          ""
        );


      return element.innerHTML;
    }


    // =====================================
    // RENDER SPECIALISTS
    // =====================================

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


          const ratingLabel =
            getRatingLabel(
              specialist.rating
            );


          const areaTags =
            specialist.areas
              .slice(
                0,
                3
              )
              .map(
                area =>
                  `<span class="specialist-tag">${escapeHTML(
                    area
                  )}</span>`
              )
              .join("");


          card.innerHTML = `
            <div class="specialist-top">

              <div class="specialist-avatar">
                ${escapeHTML(
                  specialist.initials
                )}
              </div>


              <div class="specialist-main">

                <span class="verified-badge">
                  ✓ Verified
                </span>

                <h3>
                  ${escapeHTML(
                    specialist.name
                  )}
                </h3>

                <p>
                  ${escapeHTML(
                    specialist.specialty
                  )}
                </p>

              </div>


              <span class="rating">
                ${escapeHTML(
                  ratingLabel
                )}
              </span>

            </div>


            <p class="directory-age-note">Age experience: confirm for your child before booking.</p>
            <p class="directory-languages">Languages: ${escapeHTML(specialist.languages)}</p>
            <div class="specialist-tags">
              ${areaTags}
            </div>


            <div class="specialist-details">

              <div class="detail-box">

                <span>
                  Experience
                </span>

                <strong>
                  ${escapeHTML(
                    specialist.experience
                  )} ${
                    specialist.experience === 1
                      ? "year"
                      : "years"
                  }
                </strong>

              </div>


              <div class="detail-box">

                <span>
                  Consultation
                </span>

                <strong>
                  ${escapeHTML(
                    specialist.consultationLabel
                  )}
                </strong>

              </div>


              <div class="detail-box">

                <span>
                  Published hours
                </span>

                <strong class="available">
                  ${escapeHTML(
                    specialist.availability
                  )}
                </strong>

              </div>


              <div class="detail-box">

                <span>
                  Fee per session
                </span>

                <strong>
                  ${escapeHTML(
                    specialist.priceLabel
                  )}
                </strong>

              </div>

            </div>


            <div class="specialist-actions">

              <button
                type="button"
                class="view-button"
                data-id="${escapeHTML(
                  specialist.id
                )}"
              >
                View profile
              </button>


              <button
                type="button"
                class="card-book-button"
                data-id="${escapeHTML(
                  specialist.id
                )}"
              >Choose a session</button>

            </div>
          `;


          specialistGrid.appendChild(
            card
          );
        }
      );


      addCardListeners();
    }


    // =====================================
    // CARD LISTENERS
    // =====================================

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


                if (
                  specialist
                ) {

                  openProfile(
                    specialist
                  );
                }
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


                if (
                  specialist
                ) {

                  goToBooking(
                    specialist
                  );
                }
              }
            );
          }
        );
    }


    // =====================================
    // PROFILE MODAL
    // =====================================

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
        getRatingLabel(
          specialist.rating
        );


      modalExperience.textContent =
        `${specialist.experience} ${
          specialist.experience === 1
            ? "year"
            : "years"
        } experience`;


      modalAbout.textContent =
        specialist.about;


      modalConsultation.textContent =
        specialist.consultationLabel;


      modalLanguages.textContent =
        specialist.languages;


      modalAvailability.textContent =
        specialist.availability;


      modalPrice.textContent =
        specialist.priceLabel;


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


      modalClose?.focus();
    }


    function closeProfile() {

      profileModal.hidden =
        true;


      document.body.style.overflow =
        "";


      activeSpecialist =
        null;
    }


    modalClose?.addEventListener(
      "click",
      closeProfile
    );


    closeProfileButton?.addEventListener(
      "click",
      closeProfile
    );


    profileModal?.addEventListener(
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


    // =====================================
    // BOOKING
    // =====================================

    function goToBooking(
      specialist
    ) {

      /*
        Save both the full normalized
        specialist object and the exact
        approved specialist ID.

        The ID is the important integration:
        Parent booking → Specialist account.
      */

      sessionStorage.setItem(
        "rafiqSelectedSpecialist",
        JSON.stringify(
          specialist
        )
      );


      sessionStorage.setItem(
        "rafiqSelectedSpecialistId",
        specialist.id
      );


      window.location.href =
        "booking.html";
    }


    bookSpecialistButton?.addEventListener(
      "click",
      () => {

        if (
          !activeSpecialist
        ) {

          return;
        }


        goToBooking(
          activeSpecialist
        );
      }
    );


    // =====================================
    // FILTER EVENTS
    // =====================================

    searchInput?.addEventListener(
      "input",
      renderSpecialists
    );


    specialtyFilter?.addEventListener(
      "change",
      renderSpecialists
    );


    typeButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            consultationFilter =
              button.dataset.type ||
              "all";


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


    clearFilters?.addEventListener(
      "click",
      () => {

        if (
          searchInput
        ) {

          searchInput.value =
            "";
        }


        if (
          specialtyFilter
        ) {

          specialtyFilter.value =
            "all";
        }


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


    // =====================================
    // SIDEBAR
    // =====================================

    function openSidebar() {

      sidebar?.classList.add(
        "open"
      );


      sidebarOverlay?.classList.add(
        "show"
      );
    }


    function closeSidebar() {

      sidebar?.classList.remove(
        "open"
      );


      sidebarOverlay?.classList.remove(
        "show"
      );
    }


    menuButton?.addEventListener(
      "click",
      openSidebar
    );


    sidebarClose?.addEventListener(
      "click",
      closeSidebar
    );


    sidebarOverlay?.addEventListener(
      "click",
      closeSidebar
    );


    // =====================================
    // ESCAPE KEY
    // =====================================

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key !==
          "Escape"
        ) {

          return;
        }


        if (
          profileModal &&
          !profileModal.hidden
        ) {

          closeProfile();

        } else {

          closeSidebar();
        }
      }
    );


    // =====================================
    // LOGOUT
    // =====================================

    logoutButton?.addEventListener(
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

    try {
      if (window.RafiqConcernBooking?.read(currentChild.id)?.text.trim()) document.getElementById('directoryConcern').hidden = false;
    } catch (_) { /* A malformed draft must not block browsing. */ }
    document.getElementById('emptyReset')?.addEventListener('click', () => {
      if (new URLSearchParams(location.search).has('specialist')) { window.location.href='specialists.html'; return; }
      clearFilters.click();
    });
    populateSpecialtyFilter();
    const followupId=new URLSearchParams(location.search).get('specialist');
    if(followupId){const notice=document.createElement('div');notice.className='rafiq-age-context';const text=document.createElement('p');text.textContent='Showing the specialist from your report, if still listed. Confirm their age experience, availability and fees before booking.';const all=document.createElement('a');all.href='specialists.html';all.textContent='Browse all specialists';notice.append(text,all);specialistGrid?.before(notice);}
    const requestedName=new URLSearchParams(location.search).get('search');
    if(requestedName&&searchInput)searchInput.value=requestedName.slice(0,120);

    // A directory topic requested by the parent, not a clinical matching score.
    const requestedTopic=new URLSearchParams(location.search).get('specialty');
    if(['speech','occupational','development','psychology','pediatrician'].includes(requestedTopic)&&specialtyFilter){
      const available=Array.from(specialtyFilter.options).some(option=>option.value===requestedTopic);
      specialtyFilter.value=available?requestedTopic:'all';
      const notice=document.createElement('p');notice.className='rafiq-age-context';
      notice.textContent=available?'Showing your selected directory topic. Confirm the specialist’s experience with your child’s age, consultation details and fees before booking.':'No listed specialist has the selected directory topic. Showing all listed specialists; you can also contact your usual clinician. Confirm age experience before booking.';
      specialistGrid?.before(notice);
    }


    renderSpecialists();

  }
);