document.addEventListener(
  "DOMContentLoaded",
  () => {

    // ======================================
    // ELEMENTS
    // ======================================

    const lockedView =
      document.getElementById(
        "lockedView"
      );


    const emptyView =
      document.getElementById(
        "emptyView"
      );


    const cancelledView =
      document.getElementById(
        "cancelledView"
      );


    const consultationView =
      document.getElementById(
        "consultationView"
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


    const childAvatar =
      document.getElementById(
        "childAvatar"
      );


    const childName =
      document.getElementById(
        "childName"
      );


    const consultationMeta =
      document.getElementById(
        "consultationMeta"
      );


    const sessionStatus =
      document.getElementById(
        "sessionStatus"
      );


    const bookingReference =
      document.getElementById(
        "bookingReference"
      );


    const bookingDate =
      document.getElementById(
        "bookingDate"
      );


    const bookingTime =
      document.getElementById(
        "bookingTime"
      );


    const bookingType =
      document.getElementById(
        "bookingType"
      );


    const parentConcern =
      document.getElementById(
        "parentConcern"
      );


    const sideChildAvatar =
      document.getElementById(
        "sideChildAvatar"
      );


    const sideChildName =
      document.getElementById(
        "sideChildName"
      );


    const childAge =
      document.getElementById(
        "childAge"
      );


    const sessionNotes =
      document.getElementById(
        "sessionNotes"
      );


    const observations =
      document.getElementById(
        "observations"
      );


    const nextSteps =
      document.getElementById(
        "nextSteps"
      );


    const notesCount =
      document.getElementById(
        "notesCount"
      );


    const observationsCount =
      document.getElementById(
        "observationsCount"
      );


    const nextStepsCount =
      document.getElementById(
        "nextStepsCount"
      );


    const saveStatus =
      document.getElementById(
        "saveStatus"
      );


    const saveNotesButton =
      document.getElementById(
        "saveNotesButton"
      );


    const consultationProgress =
      document.getElementById(
        "consultationProgress"
      );


    const consultationProgressText =
      document.getElementById(
        "consultationProgressText"
      );


    const reportProgress =
      document.getElementById(
        "reportProgress"
      );


    const reportProgressText =
      document.getElementById(
        "reportProgressText"
      );


    const completeCard =
      document.getElementById(
        "completeCard"
      );


    const completeButton =
      document.getElementById(
        "completeButton"
      );


    const reportTitle =
      document.getElementById(
        "reportTitle"
      );


    const reportDescription =
      document.getElementById(
        "reportDescription"
      );


    const reportButton =
      document.getElementById(
        "reportButton"
      );


    const completeModal =
      document.getElementById(
        "completeModal"
      );


    const cancelCompleteButton =
      document.getElementById(
        "cancelCompleteButton"
      );


    const confirmCompleteButton =
      document.getElementById(
        "confirmCompleteButton"
      );


    const saveToast =
      document.getElementById(
        "saveToast"
      );


    // ======================================
    // SPECIALIST
    // ======================================

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


    // ======================================
    // PROFILE
    // ======================================

    function getInitials(
      name
    ) {

      const cleaned =
        String(
          name || ""
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

        return "DR";
      }


      if (
        parts.length === 1
      ) {

        return parts[0]
          .slice(0,2)
          .toUpperCase();
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


    // ======================================
    // APPROVAL
    // ======================================

    if (
      specialist.status !==
      "approved"
    ) {

      lockedView.hidden =
        false;


      emptyView.hidden =
        true;


      cancelledView.hidden =
        true;


      consultationView.hidden =
        true;


      return;
    }


    // ======================================
    // BOOKING
    // ======================================

    const selectedBookingId =
      sessionStorage.getItem(
        "rafiqSelectedSpecialistBooking"
      );


    if (!selectedBookingId) {

      showEmpty();

      return;
    }


    function getBookings() {

      try {

        return JSON.parse(
          localStorage.getItem(
            "rafiqBookings"
          )
        ) || [];

      } catch (error) {

        return [];
      }
    }


    let bookings =
      getBookings();


    let booking =
      bookings.find(
        item =>
          item.id ===
            selectedBookingId &&

          item.specialistId ===
            specialist.id
      );


    if (!booking) {

      showEmpty();

      return;
    }


    if (
      booking.status ===
      "cancelled"
    ) {

      showCancelled();

      return;
    }


    function showEmpty() {

      lockedView.hidden =
        true;


      cancelledView.hidden =
        true;


      consultationView.hidden =
        true;


      emptyView.hidden =
        false;
    }


    function showCancelled() {

      lockedView.hidden =
        true;


      emptyView.hidden =
        true;


      consultationView.hidden =
        true;


      cancelledView.hidden =
        false;
    }


    // ======================================
    // CONSULTATION STORAGE
    // ======================================

    function getConsultations() {

      try {

        return JSON.parse(
          localStorage.getItem(
            "rafiqConsultations"
          )
        ) || [];

      } catch (error) {

        return [];
      }
    }


    function saveConsultations(
      consultations
    ) {

      localStorage.setItem(
        "rafiqConsultations",
        JSON.stringify(
          consultations
        )
      );
    }


    let consultations =
      getConsultations();


    let consultation =
      consultations.find(
        item =>
          item.bookingId ===
            booking.id &&

          item.specialistId ===
            specialist.id
      );


    /*
      Create consultation workspace
      first time specialist opens it.
    */

    if (!consultation) {

      consultation = {

        id:
          "consultation_" +
          Date.now(),


        bookingId:
          booking.id,


        specialistId:
          specialist.id,


        childId:
          booking.childId,


        childName:
          booking.childName,


        status:
          booking.status ===
          "completed"
            ? "completed"
            : "in_progress",


        sessionNotes:
          "",


        observations:
          "",


        nextSteps:
          "",


        createdAt:
          new Date()
            .toISOString(),


        updatedAt:
          new Date()
            .toISOString(),


        completedAt:
          booking.status ===
          "completed"
            ? (
                booking.completedAt ||
                null
              )
            : null
      };


      consultations.push(
        consultation
      );


      saveConsultations(
        consultations
      );
    }


    // ======================================
    // FORMAT BOOKING
    // ======================================

    function formatDate() {

      if (
        booking.dateLabel
      ) {

        return booking.dateLabel;
      }


      return new Date(
        booking.date +
        "T00:00:00"
      )
        .toLocaleDateString(
          undefined,
          {
            weekday:
              "short",

            month:
              "short",

            day:
              "numeric",

            year:
              "numeric"
          }
        );
    }


    function formatType() {

      return (
        booking.consultationType ===
        "online"
          ? "Online"
          : "In-person"
      );
    }


    // ======================================
    // CHILD
    // ======================================

    function getChild() {

      try {

        const children =
          JSON.parse(
            localStorage.getItem(
              "rafiqChildren"
            )
          ) || [];


        return (
          children.find(
            child =>
              child.id ===
              booking.childId
          ) ||
          null
        );

      } catch (error) {

        return null;
      }
    }


    const child =
      getChild();


    function calculateAge(
      dateOfBirth
    ) {

      if (!dateOfBirth) {

        return "Consultation client";
      }


      const birth =
        new Date(
          dateOfBirth +
          "T00:00:00"
        );


      const today =
        new Date();


      let years =
        today.getFullYear() -
        birth.getFullYear();


      let months =
        today.getMonth() -
        birth.getMonth();


      if (
        today.getDate() <
        birth.getDate()
      ) {

        months--;
      }


      if (
        months < 0
      ) {

        years--;

        months +=
          12;
      }


      if (
        years < 1
      ) {

        return (
          Math.max(
            months,
            0
          ) +
          (
            months === 1
              ? " month old"
              : " months old"
          )
        );
      }


      return (
        years +
        (
          years === 1
            ? " year old"
            : " years old"
        )
      );
    }


    // ======================================
    // REPORT
    // ======================================

    function getExistingReport() {

      try {

        const reports =
          JSON.parse(
            localStorage.getItem(
              "rafiqSpecialistReports"
            )
          ) || [];


        return (
          reports.find(
            report =>
              report.bookingId ===
              booking.id
          ) ||
          null
        );

      } catch (error) {

        return null;
      }
    }


    // ======================================
    // RENDER BASE INFO
    // ======================================

    function renderConsultation() {

      lockedView.hidden =
        true;


      emptyView.hidden =
        true;


      cancelledView.hidden =
        true;


      consultationView.hidden =
        false;


      const name =
        booking.childName ||
        "Child";


      const initial =
        name
          .charAt(0)
          .toUpperCase();


      const date =
        formatDate();


      const type =
        formatType();


      childAvatar.textContent =
        initial;


      sideChildAvatar.textContent =
        initial;


      childName.textContent =
        name;


      sideChildName.textContent =
        name;


      childAge.textContent =
        child
          ? calculateAge(
              child.dateOfBirth
            )
          : "Consultation client";


      consultationMeta.textContent =
        `${type} • ${date} • ${booking.time}`;


      bookingReference.textContent =
        booking.id;


      bookingDate.textContent =
        date;


      bookingTime.textContent =
        booking.time ||
        "—";


      bookingType.textContent =
        type;


      parentConcern.textContent =
        booking.reason ||
        "No specific consultation reason was provided by the parent.";


      sessionNotes.value =
        consultation.sessionNotes ||
        "";


      observations.value =
        consultation.observations ||
        "";


      nextSteps.value =
        consultation.nextSteps ||
        "";


      updateCounts();

      renderWorkflow();
    }


    // ======================================
    // CHARACTER COUNTS
    // ======================================

    function updateCounts() {

      notesCount.textContent =
        `${sessionNotes.value.length} / 3000`;


      observationsCount.textContent =
        `${observations.value.length} / 2000`;


      nextStepsCount.textContent =
        `${nextSteps.value.length} / 1500`;
    }


    [
      sessionNotes,
      observations,
      nextSteps
    ].forEach(
      field => {

        field.addEventListener(
          "input",
          () => {

            updateCounts();


            saveStatus.textContent =
              "You have unsaved changes.";
          }
        );
      }
    );


    // ======================================
    // SAVE NOTES
    // ======================================

    function saveNotes(
      showMessage = true
    ) {

      consultations =
        getConsultations();


      const index =
        consultations.findIndex(
          item =>
            item.id ===
            consultation.id
        );


      consultation.sessionNotes =
        sessionNotes.value.trim();


      consultation.observations =
        observations.value.trim();


      consultation.nextSteps =
        nextSteps.value.trim();


      consultation.updatedAt =
        new Date()
          .toISOString();


      if (
        index !== -1
      ) {

        consultations[index] =
          consultation;

      } else {

        consultations.push(
          consultation
        );
      }


      saveConsultations(
        consultations
      );


      saveStatus.textContent =
        "Saved " +
        new Date()
          .toLocaleTimeString(
            undefined,
            {
              hour:
                "numeric",

              minute:
                "2-digit"
            }
          );


      if (
        showMessage
      ) {

        showToast();
      }
    }


    saveNotesButton.addEventListener(
      "click",
      () => {

        saveNotes(
          true
        );
      }
    );


    // ======================================
    // COMPLETE CONSULTATION
    // ======================================

    completeButton.addEventListener(
      "click",
      () => {

        completeModal.hidden =
          false;
      }
    );


    cancelCompleteButton.addEventListener(
      "click",
      () => {

        completeModal.hidden =
          true;
      }
    );


    completeModal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          completeModal
        ) {

          completeModal.hidden =
            true;
        }
      }
    );


    confirmCompleteButton.addEventListener(
      "click",
      () => {

        /*
          Always save latest notes first.
        */

        saveNotes(
          false
        );


        const completedAt =
          new Date()
            .toISOString();


        // CONSULTATION

        consultation.status =
          "completed";


        consultation.completedAt =
          completedAt;


        consultation.updatedAt =
          completedAt;


        consultations =
          getConsultations();


        const consultationIndex =
          consultations.findIndex(
            item =>
              item.id ===
              consultation.id
          );


        if (
          consultationIndex !== -1
        ) {

          consultations[
            consultationIndex
          ] =
            consultation;
        }


        saveConsultations(
          consultations
        );


        // BOOKING

        bookings =
          getBookings();


        const bookingIndex =
          bookings.findIndex(
            item =>
              item.id ===
              booking.id
          );


        if (
          bookingIndex !== -1
        ) {

          bookings[
            bookingIndex
          ].status =
            "completed";


          bookings[
            bookingIndex
          ].completedAt =
            completedAt;


          localStorage.setItem(
            "rafiqBookings",
            JSON.stringify(
              bookings
            )
          );


          booking =
            bookings[
              bookingIndex
            ];
        }


        completeModal.hidden =
          true;


        renderWorkflow();
      }
    );


    // ======================================
    // WORKFLOW
    // ======================================

    function renderWorkflow() {

      const completed =
        consultation.status ===
          "completed" ||
        booking.status ===
          "completed";


      const report =
        getExistingReport();


      if (
        completed
      ) {

        sessionStatus.textContent =
          "Completed";


        sessionStatus.classList.add(
          "completed"
        );


        consultationProgress.classList.remove(
          "active"
        );


        consultationProgress.classList.add(
          "completed"
        );


        consultationProgress
          .querySelector(
            ":scope > span"
          )
          .textContent =
            "✓";


        consultationProgressText.textContent =
          "Session completed";


        reportProgress.classList.add(
          "active"
        );


        reportProgressText.textContent =
          report
            ? "Report submitted"
            : "Ready to prepare";


        completeCard.hidden =
          true;


        reportButton.disabled =
          false;


        /*
          Keep notes readable but no further editing
          after professional session completion.
        */

        sessionNotes.disabled =
          true;


        observations.disabled =
          true;


        nextSteps.disabled =
          true;


        saveNotesButton.disabled =
          true;


        saveNotesButton.textContent =
          "Session Completed";


        if (
          report
        ) {

          reportProgress.classList.remove(
            "active"
          );


          reportProgress.classList.add(
            "completed"
          );


          reportProgress
            .querySelector(
              ":scope > span"
            )
            .textContent =
              "✓";


          reportTitle.textContent =
            "Report submitted";


          reportDescription.textContent =
            "The professional consultation report has been submitted for this session.";


          reportButton.innerHTML =
            `
              View Consultation Report
              <span>→</span>
            `;

        } else {

          reportTitle.textContent =
            "Prepare consultation report";


          reportDescription.textContent =
            "Use your completed consultation notes to prepare the report shared with the parent.";


          reportButton.innerHTML =
            `
              Write Consultation Report
              <span>→</span>
            `;
        }

      } else {

        sessionStatus.textContent =
          "In Progress";


        reportButton.disabled =
          true;


        reportTitle.textContent =
          "Report locked";


        reportDescription.textContent =
          "Complete the consultation before preparing the professional report.";
      }

    }


    // ======================================
    // REPORT BUTTON
    // ======================================

    reportButton.addEventListener(
      "click",
      () => {

        if (
          reportButton.disabled
        ) {

          return;
        }


        sessionStorage.setItem(
          "rafiqSelectedSpecialistBooking",
          booking.id
        );


        window.location.href =
          "report-form.html";
      }
    );


    // ======================================
    // TOAST
    // ======================================

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


    // ======================================
    // SIDEBAR
    // ======================================

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


    // ======================================
    // LOGOUT
    // ======================================

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


    // ======================================
    // INIT
    // ======================================

    renderConsultation();

  }
);