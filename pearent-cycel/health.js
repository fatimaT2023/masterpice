document.addEventListener(
  "DOMContentLoaded",
  () => {

    // =================================
    // ELEMENTS
    // =================================

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

    const profileAvatar =
      document.getElementById(
        "profileAvatar"
      );

    const profileChildName =
      document.getElementById(
        "profileChildName"
      );

    const profileChildAge =
      document.getElementById(
        "profileChildAge"
      );

    const profileStage =
      document.getElementById(
        "profileStage"
      );


    const vaccineCount =
      document.getElementById(
        "vaccineCount"
      );

    const noteCount =
      document.getElementById(
        "noteCount"
      );

    const growthCount =
      document.getElementById(
        "growthCount"
      );


    const recentActivity =
      document.getElementById(
        "recentActivity"
      );

    const overviewEmpty =
      document.getElementById(
        "overviewEmpty"
      );


    const vaccinationList =
      document.getElementById(
        "vaccinationList"
      );

    const vaccinationEmpty =
      document.getElementById(
        "vaccinationEmpty"
      );


    const growthList =
      document.getElementById(
        "growthList"
      );

    const growthEmpty =
      document.getElementById(
        "growthEmpty"
      );


    const healthNotesList =
      document.getElementById(
        "healthNotesList"
      );

    const notesEmpty =
      document.getElementById(
        "notesEmpty"
      );


    // Modal

    const recordModal =
      document.getElementById(
        "recordModal"
      );

    const modalClose =
      document.getElementById(
        "modalClose"
      );

    const modalKicker =
      document.getElementById(
        "modalKicker"
      );

    const modalTitle =
      document.getElementById(
        "modalTitle"
      );

    const modalDescription =
      document.getElementById(
        "modalDescription"
      );


    // Forms

    const vaccineForm =
      document.getElementById(
        "vaccineForm"
      );

    const growthForm =
      document.getElementById(
        "growthForm"
      );

    const healthNoteForm =
      document.getElementById(
        "healthNoteForm"
      );


    // Vaccine

    const vaccineName =
      document.getElementById(
        "vaccineName"
      );

    const vaccineDate =
      document.getElementById(
        "vaccineDate"
      );

    const vaccineProvider =
      document.getElementById(
        "vaccineProvider"
      );

    const vaccineNote =
      document.getElementById(
        "vaccineNote"
      );

    const vaccineNameError =
      document.getElementById(
        "vaccineNameError"
      );

    const vaccineDateError =
      document.getElementById(
        "vaccineDateError"
      );


    // Growth

    const growthDate =
      document.getElementById(
        "growthDate"
      );

    const heightInput =
      document.getElementById(
        "heightInput"
      );

    const weightInput =
      document.getElementById(
        "weightInput"
      );

    const growthDateError =
      document.getElementById(
        "growthDateError"
      );

    const growthMeasurementError =
      document.getElementById(
        "growthMeasurementError"
      );


    // Notes

    const noteTitle =
      document.getElementById(
        "noteTitle"
      );

    const noteDate =
      document.getElementById(
        "noteDate"
      );

    const noteCategory =
      document.getElementById(
        "noteCategory"
      );

    const noteDetails =
      document.getElementById(
        "noteDetails"
      );

    const noteTitleError =
      document.getElementById(
        "noteTitleError"
      );

    const noteDateError =
      document.getElementById(
        "noteDateError"
      );

    const noteDetailsError =
      document.getElementById(
        "noteDetailsError"
      );


    // Buttons

    const addHealthButton =
      document.getElementById(
        "addHealthButton"
      );

    const overviewAddVaccine =
      document.getElementById(
        "overviewAddVaccine"
      );

    const overviewAddGrowth =
      document.getElementById(
        "overviewAddGrowth"
      );

    const overviewAddNote =
      document.getElementById(
        "overviewAddNote"
      );

    const addVaccineButton =
      document.getElementById(
        "addVaccineButton"
      );

    const addGrowthButton =
      document.getElementById(
        "addGrowthButton"
      );

    const addNoteButton =
      document.getElementById(
        "addNoteButton"
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


    // =================================
    // CHILD DATA
    // =================================

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
          child.id === currentChildId
      ) || children[0];


    // =================================
    // AGE
    // =================================

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


    function getStage(age) {

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


    const age =
      calculateAge(
        currentChild.dateOfBirth
      );


    // =================================
    // CHILD UI
    // =================================

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


    profileAvatar.textContent =
      initial;

    profileChildName.textContent =
      currentChild.name;

    profileChildAge.textContent =
      formatAge(age);

    profileStage.textContent =
      getStage(age);


    // =================================
    // STORAGE
    // =================================

    const vaccineKey =
      "rafiqVaccinations_" +
      currentChild.id;


    const growthKey =
      "rafiqGrowth_" +
      currentChild.id;


    const healthNotesKey =
      "rafiqHealthNotes_" +
      currentChild.id;


    function readArray(key) {

      try {

        return JSON.parse(
          localStorage.getItem(
            key
          )
        ) || [];

      } catch (error) {

        return [];
      }
    }


    let vaccinations =
      readArray(vaccineKey);


    let growthRecords =
      readArray(growthKey);


    let healthNotes =
      readArray(healthNotesKey);


    function saveAll() {

      localStorage.setItem(
        vaccineKey,
        JSON.stringify(
          vaccinations
        )
      );


      localStorage.setItem(
        growthKey,
        JSON.stringify(
          growthRecords
        )
      );


      localStorage.setItem(
        healthNotesKey,
        JSON.stringify(
          healthNotes
        )
      );
    }


    // =================================
    // DATE
    // =================================

    const todayString =
      new Date()
        .toISOString()
        .split("T")[0];


    vaccineDate.max =
      todayString;

    growthDate.max =
      todayString;

    noteDate.max =
      todayString;


    function formatDate(
      dateString
    ) {

      if (!dateString) {
        return "";
      }


      return new Date(
        dateString +
        "T00:00:00"
      ).toLocaleDateString(
        undefined,
        {
          year: "numeric",
          month: "short",
          day: "numeric"
        }
      );
    }


    // =================================
    // TABS
    // =================================

    const tabButtons =
      document.querySelectorAll(
        ".tab-button"
      );


    const tabContents = {
      overview:
        document.getElementById(
          "overviewTab"
        ),

      vaccinations:
        document.getElementById(
          "vaccinationsTab"
        ),

      notes:
        document.getElementById(
          "notesTab"
        )
    };


    function openTab(
      tabName
    ) {

      tabButtons.forEach(
        button => {

          button.classList.toggle(
            "active",
            button.dataset.tab ===
              tabName
          );
        }
      );


      Object.entries(
        tabContents
      ).forEach(
        ([name, content]) => {

          content.classList.toggle(
            "active",
            name === tabName
          );
        }
      );
    }


    tabButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            openTab(
              button.dataset.tab
            );
          }
        );
      }
    );


    // =================================
    // MODAL
    // =================================

    function hideForms() {

      vaccineForm.hidden =
        true;

      growthForm.hidden =
        true;

      healthNoteForm.hidden =
        true;
    }


    function clearErrors() {

      vaccineNameError.textContent =
        "";

      vaccineDateError.textContent =
        "";

      growthDateError.textContent =
        "";

      growthMeasurementError.textContent =
        "";

      noteTitleError.textContent =
        "";

      noteDateError.textContent =
        "";

      noteDetailsError.textContent =
        "";
    }


    function openModal(
      type
    ) {

      hideForms();

      clearErrors();


      if (type === "vaccine") {

        modalKicker.textContent =
          "VACCINATION RECORD";

        modalTitle.textContent =
          "Add vaccination";

        modalDescription.textContent =
          `Record a vaccine already received by ${currentChild.name}.`;

        vaccineForm.hidden =
          false;

        vaccineForm.reset();
      }


      if (type === "growth") {

        modalKicker.textContent =
          "GROWTH RECORD";

        modalTitle.textContent =
          "Add growth measurement";

        modalDescription.textContent =
          `Save a height or weight measurement for ${currentChild.name}.`;

        growthForm.hidden =
          false;

        growthForm.reset();
      }


      if (type === "note") {

        modalKicker.textContent =
          "HEALTH NOTE";

        modalTitle.textContent =
          "Add health note";

        modalDescription.textContent =
          `Keep a simple health note for ${currentChild.name}.`;

        healthNoteForm.hidden =
          false;

        healthNoteForm.reset();
      }


      recordModal.hidden =
        false;


      document.body.style.overflow =
        "hidden";


      modalClose.focus();
    }


    function closeModal() {

      recordModal.hidden =
        true;

      document.body.style.overflow =
        "";
    }


    modalClose.addEventListener(
      "click",
      closeModal
    );


    recordModal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          recordModal
        ) {

          closeModal();
        }
      }
    );


    // =================================
    // OPEN BUTTONS
    // =================================

    overviewAddVaccine.addEventListener(
      "click",
      () =>
        openModal("vaccine")
    );


    addVaccineButton.addEventListener(
      "click",
      () =>
        openModal("vaccine")
    );


    overviewAddGrowth.addEventListener(
      "click",
      () =>
        openModal("growth")
    );


    addGrowthButton.addEventListener(
      "click",
      () =>
        openModal("growth")
    );


    overviewAddNote.addEventListener(
      "click",
      () =>
        openModal("note")
    );


    addNoteButton.addEventListener(
      "click",
      () =>
        openModal("note")
    );


    addHealthButton.addEventListener(
      "click",
      () =>
        openModal("note")
    );


    // =================================
    // VACCINE SUBMIT
    // =================================

    vaccineForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        clearErrors();


        let valid =
          true;


        if (
          !vaccineName.value.trim()
        ) {

          vaccineNameError.textContent =
            "Please enter the vaccine name.";

          valid = false;
        }


        if (
          !vaccineDate.value
        ) {

          vaccineDateError.textContent =
            "Please select the date received.";

          valid = false;
        }


        if (!valid) {
          return;
        }


        vaccinations.unshift({
          id:
            "vaccine_" +
            Date.now(),

          name:
            vaccineName.value.trim(),

          date:
            vaccineDate.value,

          provider:
            vaccineProvider.value.trim(),

          note:
            vaccineNote.value.trim(),

          createdAt:
            new Date().toISOString()
        });


        saveAll();

        closeModal();

        renderAll();

        openTab(
          "vaccinations"
        );
      }
    );


    // =================================
    // GROWTH SUBMIT
    // =================================

    growthForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        clearErrors();


        let valid =
          true;


        if (
          !growthDate.value
        ) {

          growthDateError.textContent =
            "Please select a date.";

          valid = false;
        }


        if (
          !heightInput.value &&
          !weightInput.value
        ) {

          growthMeasurementError.textContent =
            "Enter at least height or weight.";

          valid = false;
        }


        if (!valid) {
          return;
        }


        growthRecords.unshift({
          id:
            "growth_" +
            Date.now(),

          date:
            growthDate.value,

          height:
            heightInput.value
              ? Number(
                  heightInput.value
                )
              : null,

          weight:
            weightInput.value
              ? Number(
                  weightInput.value
                )
              : null,

          createdAt:
            new Date().toISOString()
        });


        saveAll();

        closeModal();

        renderAll();

        openTab(
          "notes"
        );
      }
    );


    // =================================
    // NOTE SUBMIT
    // =================================

    healthNoteForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        clearErrors();


        let valid =
          true;


        if (
          !noteTitle.value.trim()
        ) {

          noteTitleError.textContent =
            "Please enter a title.";

          valid = false;
        }


        if (
          !noteDate.value
        ) {

          noteDateError.textContent =
            "Please select a date.";

          valid = false;
        }


        if (
          !noteDetails.value.trim()
        ) {

          noteDetailsError.textContent =
            "Please add a short note.";

          valid = false;
        }


        if (!valid) {
          return;
        }


        healthNotes.unshift({
          id:
            "note_" +
            Date.now(),

          title:
            noteTitle.value.trim(),

          date:
            noteDate.value,

          category:
            noteCategory.value,

          details:
            noteDetails.value.trim(),

          createdAt:
            new Date().toISOString()
        });


        saveAll();

        closeModal();

        renderAll();

        openTab(
          "notes"
        );
      }
    );


    // =================================
    // ESCAPE TEXT
    // =================================

    function escapeHTML(
      value
    ) {

      const div =
        document.createElement(
          "div"
        );


      div.textContent =
        String(
          value ?? ""
        );


      return div.innerHTML;
    }


    // =================================
    // SUMMARY
    // =================================

    function renderSummary() {

      vaccineCount.textContent =
        vaccinations.length;

      noteCount.textContent =
        healthNotes.length;

      growthCount.textContent =
        growthRecords.length;
    }


    // =================================
    // VACCINATIONS
    // =================================

    function renderVaccinations() {

      vaccinationList.innerHTML =
        "";


      vaccinationEmpty.hidden =
        vaccinations.length !== 0;


      vaccinations.forEach(
        record => {

          const item =
            document.createElement(
              "article"
            );


          item.className =
            "record-item";


          item.innerHTML = `
            <div class="record-icon vaccine">
              ✓
            </div>

            <div class="record-content">

              <strong>
                ${escapeHTML(
                  record.name
                )}
              </strong>

              <span>
                ${
                  record.provider
                    ? escapeHTML(
                        record.provider
                      )
                    : "Vaccination record"
                }
              </span>

            </div>

            <span class="record-date">
              ${formatDate(
                record.date
              )}
            </span>

            <button
              type="button"
              class="delete-record"
              data-type="vaccine"
              data-id="${record.id}"
            >
              ✕
            </button>
          `;


          vaccinationList.appendChild(
            item
          );
        }
      );
    }


    // =================================
    // GROWTH
    // =================================

    function renderGrowth() {

      growthList.innerHTML =
        "";


      growthEmpty.hidden =
        growthRecords.length !== 0;


      growthRecords.forEach(
        record => {

          const item =
            document.createElement(
              "div"
            );


          item.className =
            "compact-item";


          const measurements =
            [];


          if (
            record.height !== null
          ) {

            measurements.push(
              `${record.height} cm`
            );
          }


          if (
            record.weight !== null
          ) {

            measurements.push(
              `${record.weight} kg`
            );
          }


          item.innerHTML = `
            <div class="record-icon growth">
              ↗
            </div>

            <div class="record-content">

              <strong>
                ${measurements.join(
                  " • "
                )}
              </strong>

              <span>
                ${formatDate(
                  record.date
                )}
              </span>

            </div>

            <button
              type="button"
              class="delete-record"
              data-type="growth"
              data-id="${record.id}"
            >
              ✕
            </button>
          `;


          growthList.appendChild(
            item
          );
        }
      );
    }


    // =================================
    // NOTES
    // =================================

    function renderNotes() {

      healthNotesList.innerHTML =
        "";


      notesEmpty.hidden =
        healthNotes.length !== 0;


      healthNotes.forEach(
        note => {

          const item =
            document.createElement(
              "div"
            );


          item.className =
            "compact-item";


          item.innerHTML = `
            <div class="record-icon note">
              ♡
            </div>

            <div class="record-content">

              <strong>
                ${escapeHTML(
                  note.title
                )}
              </strong>

              <span>
                ${formatDate(
                  note.date
                )}
                •
                ${escapeHTML(
                  note.details
                )}
              </span>

            </div>

            <button
              type="button"
              class="delete-record"
              data-type="note"
              data-id="${note.id}"
            >
              ✕
            </button>
          `;


          healthNotesList.appendChild(
            item
          );
        }
      );
    }


    // =================================
    // RECENT
    // =================================

    function renderRecentActivity() {

      recentActivity.innerHTML =
        "";


      const combined = [
        ...vaccinations.map(
          item => ({
            type: "vaccine",
            title: item.name,
            date: item.date,
            createdAt:
              item.createdAt
          })
        ),

        ...growthRecords.map(
          item => ({
            type: "growth",
            title:
              "Growth measurement",
            date: item.date,
            createdAt:
              item.createdAt
          })
        ),

        ...healthNotes.map(
          item => ({
            type: "note",
            title: item.title,
            date: item.date,
            createdAt:
              item.createdAt
          })
        )
      ];


      combined.sort(
        (a,b) =>
          new Date(
            b.createdAt
          ) -
          new Date(
            a.createdAt
          )
      );


      const latest =
        combined.slice(
          0,
          5
        );


      overviewEmpty.hidden =
        latest.length !== 0;


      latest.forEach(
        item => {

          const row =
            document.createElement(
              "div"
            );


          row.className =
            "activity-item";


          const icon =
            item.type === "vaccine"
              ? "✓"
              : item.type === "growth"
              ? "↗"
              : "♡";


          row.innerHTML = `
            <div class="activity-icon ${item.type}">
              ${icon}
            </div>

            <div class="activity-content">

              <strong>
                ${escapeHTML(
                  item.title
                )}
              </strong>

              <span>
                ${formatDate(
                  item.date
                )}
              </span>

            </div>
          `;


          recentActivity.appendChild(
            row
          );
        }
      );
    }


    // =================================
    // DELETE
    // =================================

    document.addEventListener(
      "click",
      event => {

        const button =
          event.target.closest(
            ".delete-record"
          );


        if (!button) {
          return;
        }


        const id =
          button.dataset.id;


        const type =
          button.dataset.type;


        const confirmed =
          window.confirm(
            "Delete this record?"
          );


        if (!confirmed) {
          return;
        }


        if (
          type === "vaccine"
        ) {

          vaccinations =
            vaccinations.filter(
              item =>
                item.id !== id
            );
        }


        if (
          type === "growth"
        ) {

          growthRecords =
            growthRecords.filter(
              item =>
                item.id !== id
            );
        }


        if (
          type === "note"
        ) {

          healthNotes =
            healthNotes.filter(
              item =>
                item.id !== id
            );
        }


        saveAll();

        renderAll();
      }
    );


    // =================================
    // RENDER
    // =================================

    function renderAll() {

      renderSummary();

      renderVaccinations();

      renderGrowth();

      renderNotes();

      renderRecentActivity();
    }


    // =================================
    // SIDEBAR
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
          event.key !== "Escape"
        ) {
          return;
        }


        if (
          !recordModal.hidden
        ) {

          closeModal();

        } else {

          closeSidebar();
        }
      }
    );


    // =================================
    // LOGOUT
    // =================================

    logoutButton.addEventListener(
      "click",
      () => {

        sessionStorage.clear();


        window.location.href =
          "../piblic-pages/login.html";
      }
    );


    // =================================
    // INIT
    // =================================

    renderAll();

  }
);