document.addEventListener(
  "DOMContentLoaded",
  () => {

    // ===============================
    // ELEMENTS
    // ===============================

    const lockedView =
      document.getElementById(
        "lockedView"
      );


    const availabilityView =
      document.getElementById(
        "availabilityView"
      );


    const sidebarAvatar =
      document.getElementById(
        "sidebarAvatar"
      );


    const sidebarName =
      document.getElementById(
        "sidebarName"
      );


    const sidebarSpecialty =
      document.getElementById(
        "sidebarSpecialty"
      );


    const availabilityStatus =
      document.getElementById(
        "availabilityStatus"
      );


    const weekList =
      document.getElementById(
        "weekList"
      );


    const slotsPreview =
      document.getElementById(
        "slotsPreview"
      );


    const previewEmpty =
      document.getElementById(
        "previewEmpty"
      );


    const refreshPreview =
      document.getElementById(
        "refreshPreview"
      );


    const saveButton =
      document.getElementById(
        "saveButton"
      );


    const lastUpdated =
      document.getElementById(
        "lastUpdated"
      );


    const saveToast =
      document.getElementById(
        "saveToast"
      );


    // ===============================
    // SPECIALIST
    // ===============================

    function getSpecialist() {

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


    const specialist =
      getSpecialist();


    if (!specialist) {

      window.location.href =
        "specialist-onboarding.html";

      return;
    }


    // ===============================
    // PROFILE INFO
    // ===============================

    function getInitials(
      name
    ) {

      const clean =
        String(name || "")
          .replace(
            /^(Dr\.?|Mr\.?|Mrs\.?|Ms\.?)\s+/i,
            ""
          )
          .trim();


      const parts =
        clean
          .split(/\s+/)
          .filter(Boolean);


      if (
        parts.length < 2
      ) {

        return clean
          .slice(0,2)
          .toUpperCase() ||
          "DR";
      }


      return (
        parts[0][0] +
        parts[
          parts.length - 1
        ][0]
      ).toUpperCase();
    }


    sidebarAvatar.textContent =
      getInitials(
        specialist.fullName
      );


    sidebarName.textContent =
      specialist.fullName;


    sidebarSpecialty.textContent =
      specialist.specialty;


    // ===============================
    // APPROVAL GUARD
    // ===============================

    if (
      specialist.status !==
      "approved"
    ) {

      lockedView.hidden =
        false;


      availabilityView.hidden =
        true;


      return;
    }


    lockedView.hidden =
      true;


    availabilityView.hidden =
      false;


    // ===============================
    // DAYS
    // ===============================

    const days = [

      {
        key: "sunday",
        label: "Sunday"
      },

      {
        key: "monday",
        label: "Monday"
      },

      {
        key: "tuesday",
        label: "Tuesday"
      },

      {
        key: "wednesday",
        label: "Wednesday"
      },

      {
        key: "thursday",
        label: "Thursday"
      },

      {
        key: "friday",
        label: "Friday"
      },

      {
        key: "saturday",
        label: "Saturday"
      }

    ];


    // ===============================
    // DEFAULT AVAILABILITY
    // ===============================

    const defaultSchedule = {

      sunday: {
        enabled: true,
        start: "09:00",
        end: "17:00"
      },

      monday: {
        enabled: true,
        start: "09:00",
        end: "17:00"
      },

      tuesday: {
        enabled: true,
        start: "09:00",
        end: "17:00"
      },

      wednesday: {
        enabled: true,
        start: "09:00",
        end: "17:00"
      },

      thursday: {
        enabled: true,
        start: "09:00",
        end: "17:00"
      },

      friday: {
        enabled: false,
        start: "09:00",
        end: "17:00"
      },

      saturday: {
        enabled: false,
        start: "09:00",
        end: "17:00"
      }
    };


    let schedule =
      JSON.parse(
        JSON.stringify(
          defaultSchedule
        )
      );


    let slotDuration =
      60;


    // ===============================
    // STORAGE
    // ===============================

    const storageKey =
      `rafiqAvailability_${specialist.id}`;


    function getSavedAvailability() {

      try {

        return JSON.parse(
          localStorage.getItem(
            storageKey
          )
        );

      } catch (error) {

        return null;
      }
    }


    const savedAvailability =
      getSavedAvailability();


    if (
      savedAvailability
    ) {

      schedule = {
        ...schedule,
        ...savedAvailability.weeklySchedule
      };


      slotDuration =
        Number(
          savedAvailability.slotDuration
        ) || 60;


      availabilityStatus.textContent =
        "Configured";


      if (
        savedAvailability.updatedAt
      ) {

        lastUpdated.textContent =
          "Last updated " +
          new Date(
            savedAvailability.updatedAt
          ).toLocaleString();
      }

    } else {

      availabilityStatus.textContent =
        "Not configured";
    }


    // ===============================
    // DURATION
    // ===============================

    const durationInputs =
      document.querySelectorAll(
        'input[name="duration"]'
      );


    durationInputs.forEach(
      input => {

        input.checked =
          Number(
            input.value
          ) ===
          slotDuration;


        input.addEventListener(
          "change",
          () => {

            slotDuration =
              Number(
                input.value
              );


            renderPreview();
          }
        );

      }
    );


    // ===============================
    // RENDER WEEK
    // ===============================

    function renderWeek() {

      weekList.innerHTML =
        "";


      days.forEach(
        day => {

          const data =
            schedule[day.key];


          const row =
            document.createElement(
              "div"
            );


          row.className =
            "day-row";


          if (
            data.enabled
          ) {

            row.classList.add(
              "enabled"
            );
          }


          row.innerHTML = `
            <div class="day-main">

              <button
                type="button"
                class="day-toggle"
                aria-label="Toggle ${day.label}"
              ></button>


              <div class="day-name">

                <strong>
                  ${day.label}
                </strong>

                <span>
                  ${
                    data.enabled
                      ? "Available"
                      : "Unavailable"
                  }
                </span>

              </div>

            </div>


            <div class="day-hours">

              <input
                type="time"
                class="start-time"
                value="${data.start}"
              >

              <span>
                to
              </span>

              <input
                type="time"
                class="end-time"
                value="${data.end}"
              >

            </div>
          `;


          const toggle =
            row.querySelector(
              ".day-toggle"
            );


          const startInput =
            row.querySelector(
              ".start-time"
            );


          const endInput =
            row.querySelector(
              ".end-time"
            );


          toggle.addEventListener(
            "click",
            () => {

              data.enabled =
                !data.enabled;


              renderWeek();

              renderPreview();
            }
          );


          startInput.addEventListener(
            "change",
            () => {

              data.start =
                startInput.value;


              renderPreview();
            }
          );


          endInput.addEventListener(
            "change",
            () => {

              data.end =
                endInput.value;


              renderPreview();
            }
          );


          weekList.appendChild(
            row
          );
        }
      );

    }


    // ===============================
    // TIME HELPERS
    // ===============================

    function timeToMinutes(
      time
    ) {

      const [
        hours,
        minutes
      ] =
        time
          .split(":")
          .map(Number);


      return (
        hours * 60 +
        minutes
      );
    }


    function minutesToTime(
      totalMinutes
    ) {

      const hours =
        Math.floor(
          totalMinutes / 60
        );


      const minutes =
        totalMinutes % 60;


      return (
        String(hours)
          .padStart(2,"0") +
        ":" +
        String(minutes)
          .padStart(2,"0")
      );
    }


    function formatTime(
      time
    ) {

      const [
        hourString,
        minute
      ] =
        time.split(":");


      let hour =
        Number(
          hourString
        );


      const period =
        hour >= 12
          ? "PM"
          : "AM";


      hour =
        hour % 12 || 12;


      return (
        hour +
        ":" +
        minute +
        " " +
        period
      );
    }


    // ===============================
    // DATE HELPERS
    // ===============================

    const dayKeysByIndex = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ];


    function dateKey(
      date
    ) {

      const year =
        date.getFullYear();


      const month =
        String(
          date.getMonth() + 1
        ).padStart(
          2,
          "0"
        );


      const day =
        String(
          date.getDate()
        ).padStart(
          2,
          "0"
        );


      return (
        `${year}-${month}-${day}`
      );
    }


    // ===============================
    // GENERATE SLOTS
    // ===============================

    function generatePreviewSlots() {

      const results =
        [];


      const today =
        new Date();


      for (
        let offset = 0;
        offset < 14;
        offset++
      ) {

        const date =
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() +
              offset
          );


        const dayKey =
          dayKeysByIndex[
            date.getDay()
          ];


        const day =
          schedule[
            dayKey
          ];


        if (
          !day ||
          !day.enabled ||
          !day.start ||
          !day.end
        ) {

          continue;
        }


        const start =
          timeToMinutes(
            day.start
          );


        const end =
          timeToMinutes(
            day.end
          );


        if (
          end <= start
        ) {

          continue;
        }


        for (
          let time = start;
          time + slotDuration <= end;
          time += slotDuration
        ) {

          results.push({

            date:
              dateKey(
                date
              ),

            dateLabel:
              date.toLocaleDateString(
                undefined,
                {
                  weekday:
                    "short",

                  month:
                    "short",

                  day:
                    "numeric"
                }
              ),

            time:
              minutesToTime(
                time
              )
          });


          if (
            results.length >= 6
          ) {

            return results;
          }

        }

      }


      return results;
    }


    // ===============================
    // PREVIEW
    // ===============================

    function renderPreview() {

      const slots =
        generatePreviewSlots();


      slotsPreview.innerHTML =
        "";


      previewEmpty.hidden =
        slots.length !== 0;


      if (
        slots.length === 0
      ) {

        return;
      }


      slots.forEach(
        slot => {

          const card =
            document.createElement(
              "div"
            );


          card.className =
            "slot-preview";


          card.innerHTML = `
            <span>
              ${slot.dateLabel}
            </span>

            <strong>
              ${formatTime(
                slot.time
              )}
            </strong>

            <small>
              ${slotDuration} minute session
            </small>
          `;


          slotsPreview.appendChild(
            card
          );
        }
      );

    }


    refreshPreview.addEventListener(
      "click",
      renderPreview
    );


    // ===============================
    // VALIDATION
    // ===============================

    function validateSchedule() {

      const enabledDays =
        Object.values(
          schedule
        ).filter(
          day =>
            day.enabled
        );


      if (
        enabledDays.length === 0
      ) {

        window.alert(
          "Please enable at least one available day."
        );

        return false;
      }


      for (
        const day of enabledDays
      ) {

        if (
          !day.start ||
          !day.end
        ) {

          window.alert(
            "Please complete all working hours."
          );

          return false;
        }


        if (
          timeToMinutes(
            day.end
          ) <=
          timeToMinutes(
            day.start
          )
        ) {

          window.alert(
            "End time must be later than start time."
          );

          return false;
        }


        if (
          (
            timeToMinutes(
              day.end
            ) -
            timeToMinutes(
              day.start
            )
          ) <
          slotDuration
        ) {

          window.alert(
            "A working period must be at least as long as the selected session duration."
          );

          return false;
        }
      }


      return true;
    }


    // ===============================
    // SAVE
    // ===============================

    function saveAvailability() {

      if (
        !validateSchedule()
      ) {

        return;
      }


      const availability = {

        specialistId:
          specialist.id,


        slotDuration,


        weeklySchedule:
          schedule,


        configured:
          true,


        updatedAt:
          new Date()
            .toISOString()
      };


      localStorage.setItem(
        storageKey,
        JSON.stringify(
          availability
        )
      );


      /*
        Update specialist profile too.
      */

      specialist.availabilityConfigured =
        true;


      specialist.availabilityUpdatedAt =
        availability.updatedAt;


      localStorage.setItem(
        "rafiqSpecialistProfile",
        JSON.stringify(
          specialist
        )
      );


      syncGlobalSpecialist(
        specialist
      );


      availabilityStatus.textContent =
        "Configured";


      lastUpdated.textContent =
        "Last updated " +
        new Date(
          availability.updatedAt
        ).toLocaleString();


      showToast();
    }


    saveButton.addEventListener(
      "click",
      saveAvailability
    );


    // ===============================
    // SYNC GLOBAL COLLECTION
    // ===============================

    function syncGlobalSpecialist(
      updatedSpecialist
    ) {

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


      const index =
        specialists.findIndex(
          item =>
            item.id ===
            updatedSpecialist.id
        );


      if (
        index !== -1
      ) {

        specialists[index] =
          updatedSpecialist;

      } else {

        specialists.push(
          updatedSpecialist
        );
      }


      localStorage.setItem(
        "rafiqSpecialists",
        JSON.stringify(
          specialists
        )
      );
    }


    // ===============================
    // TOAST
    // ===============================

    let toastTimer =
      null;


    function showToast() {

      saveToast.hidden =
        false;


      clearTimeout(
        toastTimer
      );


      toastTimer =
        setTimeout(
          () => {

            saveToast.hidden =
              true;

          },
          2500
        );
    }


    // ===============================
    // SIDEBAR
    // ===============================

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


    // ===============================
    // LOGOUT
    // ===============================

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


    // ===============================
    // INIT
    // ===============================

    renderWeek();

    renderPreview();

  }
);