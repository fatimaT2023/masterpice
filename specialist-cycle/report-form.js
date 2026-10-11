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


    const notCompletedView =
      document.getElementById(
        "notCompletedView"
      );


    const reportView =
      document.getElementById(
        "reportView"
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


    const reportStatus =
      document.getElementById(
        "reportStatus"
      );


    const summaryChild =
      document.getElementById(
        "summaryChild"
      );


    const summaryDate =
      document.getElementById(
        "summaryDate"
      );


    const summaryType =
      document.getElementById(
        "summaryType"
      );


    const summaryReference =
      document.getElementById(
        "summaryReference"
      );


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


    const privateObservations =
      document.getElementById(
        "privateObservations"
      );


    const privateNextSteps =
      document.getElementById(
        "privateNextSteps"
      );


    // FORM

    const reportSummary =
      document.getElementById(
        "reportSummary"
      );


    const reportObservations =
      document.getElementById(
        "reportObservations"
      );


    const reportRecommendations =
      document.getElementById(
        "reportRecommendations"
      );


    const followUp =
      document.getElementById(
        "followUp"
      );


    const specialistNote =
      document.getElementById(
        "specialistNote"
      );


    // COUNTS

    const summaryCount =
      document.getElementById(
        "summaryCount"
      );


    const observationsCount =
      document.getElementById(
        "observationsCount"
      );


    const recommendationsCount =
      document.getElementById(
        "recommendationsCount"
      );


    const followUpCount =
      document.getElementById(
        "followUpCount"
      );


    const specialistNoteCount =
      document.getElementById(
        "specialistNoteCount"
      );


    // ERRORS

    const summaryError =
      document.getElementById(
        "summaryError"
      );


    const observationsError =
      document.getElementById(
        "observationsError"
      );


    const recommendationsError =
      document.getElementById(
        "recommendationsError"
      );


    const followUpError =
      document.getElementById(
        "followUpError"
      );


    // ACTIONS

    const actionTitle =
      document.getElementById(
        "actionTitle"
      );


    const draftStatus =
      document.getElementById(
        "draftStatus"
      );


    const saveDraftButton =
      document.getElementById(
        "saveDraftButton"
      );


    const submitReportButton =
      document.getElementById(
        "submitReportButton"
      );


    const draftWorkflow =
      document.getElementById(
        "draftWorkflow"
      );


    const submitWorkflow =
      document.getElementById(
        "submitWorkflow"
      );


    const submitWorkflowText =
      document.getElementById(
        "submitWorkflowText"
      );


    // MODAL

    const submitModal =
      document.getElementById(
        "submitModal"
      );


    const cancelSubmitButton =
      document.getElementById(
        "cancelSubmitButton"
      );


    const confirmSubmitButton =
      document.getElementById(
        "confirmSubmitButton"
      );


    // TOAST

    const saveToast =
      document.getElementById(
        "saveToast"
      );


    const toastTitle =
      document.getElementById(
        "toastTitle"
      );


    const toastMessage =
      document.getElementById(
        "toastMessage"
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


    const specialistInitials =
      getInitials(
        specialist.fullName
      );


    sidebarAvatar.textContent =
      specialistInitials;


    sidebarName.textContent =
      specialist.fullName;


    sidebarSpecialty.textContent =
      specialist.specialty;


    // ======================================
    // APPROVAL GUARD
    // ======================================

    if (
      specialist.status !==
      "approved"
    ) {

      showOnly(
        lockedView
      );

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

      showOnly(
        emptyView
      );

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


    const bookings =
      getBookings();


    const booking =
      bookings.find(
        item =>
          item.id ===
            selectedBookingId &&

          item.specialistId ===
            specialist.id
      );


    if (!booking) {

      showOnly(
        emptyView
      );

      return;
    }


    if (
      booking.status !==
      "completed"
    ) {

      showOnly(
        notCompletedView
      );

      return;
    }


    // ======================================
    // CONSULTATION
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


    const consultation =
      getConsultations()
        .find(
          item =>
            item.bookingId ===
              booking.id &&

            item.specialistId ===
              specialist.id
        );


    if (!consultation) {

      showOnly(
        emptyView
      );

      return;
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


    // ======================================
    // REPORT STORAGE
    // ======================================

    function getSubmittedReports() {

      try {

        return JSON.parse(
          localStorage.getItem(
            "rafiqSpecialistReports"
          )
        ) || [];

      } catch (error) {

        return [];
      }
    }


    function getDrafts() {

      try {

        return JSON.parse(
          localStorage.getItem(
            "rafiqSpecialistReportDrafts"
          )
        ) || [];

      } catch (error) {

        return [];
      }
    }


    const submittedReport =
      getSubmittedReports()
        .find(
          report =>
            report.bookingId ===
            booking.id
        );


    let drafts =
      getDrafts();


    let draft =
      drafts.find(
        item =>
          item.bookingId ===
            booking.id
      );


    // ======================================
    // HELPERS
    // ======================================

    function showOnly(
      element
    ) {

      lockedView.hidden =
        true;


      emptyView.hidden =
        true;


      notCompletedView.hidden =
        true;


      reportView.hidden =
        true;


      element.hidden =
        false;
    }


    function formatBookingDate() {

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
            month:
              "short",

            day:
              "numeric",

            year:
              "numeric"
          }
        );
    }


    function formatReportDate() {

      return new Date()
        .toLocaleDateString(
          undefined,
          {
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

        months += 12;
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


    function textToList(
      text
    ) {

      return String(
        text || ""
      )
        .split(/\n+/)
        .map(
          item =>
            item
              .replace(
                /^[-•*\d.)\s]+/,
                ""
              )
              .trim()
        )
        .filter(Boolean);
    }


    // ======================================
    // RENDER BASIC INFO
    // ======================================

    showOnly(
      reportView
    );


    const childNameValue =
      booking.childName ||
      "Child";


    const childInitial =
      childNameValue
        .charAt(0)
        .toUpperCase();


    summaryChild.textContent =
      childNameValue;


    summaryDate.textContent =
      formatBookingDate();


    summaryType.textContent =
      formatType();


    summaryReference.textContent =
      booking.id;


    childAvatar.textContent =
      childInitial;


    childName.textContent =
      childNameValue;


    childAge.textContent =
      child
        ? calculateAge(
            child.dateOfBirth
          )
        : "Consultation client";


    privateObservations.textContent =
      consultation.observations ||
      "No observations recorded.";


    privateNextSteps.textContent =
      consultation.nextSteps ||
      "No initial next steps recorded.";


    // ======================================
    // LOAD DATA
    // ======================================

    if (
      submittedReport
    ) {

      reportSummary.value =
        submittedReport.summary ||
        "";


      reportObservations.value =
        (
          submittedReport.observations ||
          []
        ).join("\n");


      reportRecommendations.value =
        (
          submittedReport.recommendations ||
          []
        ).join("\n");


      followUp.value =
        submittedReport.followUp ||
        "";


      specialistNote.value =
        submittedReport.specialistNote ||
        "";


      renderSubmittedState();

    } else if (
      draft
    ) {

      reportSummary.value =
        draft.summary ||
        "";


      reportObservations.value =
        draft.observationsText ||
        "";


      reportRecommendations.value =
        draft.recommendationsText ||
        "";


      followUp.value =
        draft.followUp ||
        "";


      specialistNote.value =
        draft.specialistNote ||
        "";


      draftStatus.textContent =
        "Draft restored from your previous work.";
    }


    // ======================================
    // COUNTERS
    // ======================================

    function updateCounts() {

      summaryCount.textContent =
        `${reportSummary.value.length} / 1800`;


      observationsCount.textContent =
        `${reportObservations.value.length} / 2200`;


      recommendationsCount.textContent =
        `${reportRecommendations.value.length} / 2200`;


      followUpCount.textContent =
        `${followUp.value.length} / 1000`;


      specialistNoteCount.textContent =
        `${specialistNote.value.length} / 1000`;
    }


    [
      reportSummary,
      reportObservations,
      reportRecommendations,
      followUp,
      specialistNote
    ].forEach(
      field => {

        field.addEventListener(
          "input",
          () => {

            updateCounts();


            if (
              !submittedReport
            ) {

              draftStatus.textContent =
                "You have unsaved changes.";
            }
          }
        );
      }
    );


    updateCounts();


    // ======================================
    // VALIDATION
    // ======================================

    function clearErrors() {

      summaryError.textContent =
        "";


      observationsError.textContent =
        "";


      recommendationsError.textContent =
        "";


      followUpError.textContent =
        "";
    }


    function validateReport() {

      clearErrors();


      let valid =
        true;


      if (
        reportSummary.value
          .trim()
          .length < 30
      ) {

        summaryError.textContent =
          "Please provide a professional summary of at least 30 characters.";


        valid =
          false;
      }


      if (
        textToList(
          reportObservations.value
        ).length === 0
      ) {

        observationsError.textContent =
          "Add at least one key observation.";


        valid =
          false;
      }


      if (
        textToList(
          reportRecommendations.value
        ).length === 0
      ) {

        recommendationsError.textContent =
          "Add at least one recommendation.";


        valid =
          false;
      }


      if (
        followUp.value
          .trim()
          .length < 10
      ) {

        followUpError.textContent =
          "Please provide a follow-up plan.";


        valid =
          false;
      }


      return valid;
    }


    // ======================================
    // SAVE DRAFT
    // ======================================

    function saveDraft() {

      if (
        submittedReport
      ) {

        return;
      }


      drafts =
        getDrafts();


      const data = {

        id:
          draft?.id ||
          "report_draft_" +
          Date.now(),


        bookingId:
          booking.id,


        consultationId:
          consultation.id,


        specialistId:
          specialist.id,


        childId:
          booking.childId,


        summary:
          reportSummary.value.trim(),


        observationsText:
          reportObservations.value.trim(),


        recommendationsText:
          reportRecommendations.value.trim(),


        followUp:
          followUp.value.trim(),


        specialistNote:
          specialistNote.value.trim(),


        updatedAt:
          new Date()
            .toISOString()
      };


      const index =
        drafts.findIndex(
          item =>
            item.bookingId ===
            booking.id
        );


      if (
        index !== -1
      ) {

        drafts[index] =
          data;

      } else {

        drafts.push(
          data
        );
      }


      localStorage.setItem(
        "rafiqSpecialistReportDrafts",
        JSON.stringify(
          drafts
        )
      );


      draft =
        data;


      draftStatus.textContent =
        "Draft saved " +
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


      showToast(
        "Draft saved",
        "Your consultation report draft has been saved."
      );
    }


    saveDraftButton.addEventListener(
      "click",
      saveDraft
    );


    // ======================================
    // SUBMIT OPEN MODAL
    // ======================================

    submitReportButton.addEventListener(
      "click",
      () => {

        if (
          submittedReport
        ) {

          return;
        }


        if (
          !validateReport()
        ) {

          const firstError =
            document.querySelector(
              ".field-error:not(:empty)"
            );


          if (
            firstError
          ) {

            firstError.scrollIntoView({
              behavior:
                "smooth",

              block:
                "center"
            });
          }


          return;
        }


        submitModal.hidden =
          false;
      }
    );


    cancelSubmitButton.addEventListener(
      "click",
      () => {

        submitModal.hidden =
          true;
      }
    );


    submitModal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          submitModal
        ) {

          submitModal.hidden =
            true;
        }
      }
    );


    // ======================================
    // FINAL SUBMIT
    // ======================================

    confirmSubmitButton.addEventListener(
      "click",
      submitFinalReport
    );


    function submitFinalReport() {

      if (
        !validateReport()
      ) {

        submitModal.hidden =
          true;

        return;
      }


      const submittedAt =
        new Date()
          .toISOString();


      /*
        This shape matches the Parent
        specialist-report.js page.
      */

      const report = {

        id:
          "report_" +
          Date.now(),


        bookingId:
          booking.id,


        consultationId:
          consultation.id,


        childId:
          booking.childId,


        childName:
          booking.childName,


        specialistId:
          specialist.id,


        specialistName:
          specialist.fullName,


        specialistInitials:
          specialistInitials,


        specialty:
          specialist.specialty,


        consultationDate:
          formatBookingDate(),


        consultationType:
          formatType(),


        reportDate:
          formatReportDate(),


        summary:
          reportSummary.value.trim(),


        observations:
          textToList(
            reportObservations.value
          ),


        recommendations:
          textToList(
            reportRecommendations.value
          ),


        followUp:
          followUp.value.trim(),


        specialistNote:
          specialistNote.value.trim(),


        status:
          "submitted",


        submittedAt:
          submittedAt
      };


      let reports =
        getSubmittedReports();


      const existingIndex =
        reports.findIndex(
          item =>
            item.bookingId ===
            booking.id
        );


      if (
        existingIndex !== -1
      ) {

        reports[
          existingIndex
        ] =
          report;

      } else {

        reports.push(
          report
        );
      }


      localStorage.setItem(
        "rafiqSpecialistReports",
        JSON.stringify(
          reports
        )
      );


      // Remove draft after submission

      drafts =
        getDrafts()
          .filter(
            item =>
              item.bookingId !==
              booking.id
          );


      localStorage.setItem(
        "rafiqSpecialistReportDrafts",
        JSON.stringify(
          drafts
        )
      );


      // Parent notification

      createParentReportNotification();


      submitModal.hidden =
        true;


      showToast(
        "Report submitted",
        "The consultation report is now available to the parent."
      );


      window.setTimeout(
        () => {

          window.location.reload();

        },
        900
      );
    }


    // ======================================
    // PARENT NOTIFICATION
    // ======================================

    function createParentReportNotification() {

      let notifications =
        [];


      try {

        notifications =
          JSON.parse(
            localStorage.getItem(
              "rafiqNotifications"
            )
          ) || [];

      } catch (error) {

        notifications =
          [];
      }


      /*
        Prevent duplicate report notification
        for the same booking.
      */

      const sourceId =
        `report_${booking.id}`;


      const alreadyExists =
        notifications.some(
          item =>
            item.sourceId ===
            sourceId
        );


      if (
        alreadyExists
      ) {

        return;
      }


      notifications.unshift({

        id:
          "notification_" +
          Date.now(),


        sourceId:
          sourceId,


        type:
          "report",


        title:
          "Specialist report is ready",


        message:
          `${specialist.fullName} submitted the consultation report for ${booking.childName}.`,


        /*
          Parent notification opens
          My Bookings.

          From there Parent clicks
          View Report.
        */

        link:
          "bookings.html",


        childId:
          booking.childId,


        read:
          false,


        createdAt:
          new Date()
            .toISOString()
      });


      localStorage.setItem(
        "rafiqNotifications",
        JSON.stringify(
          notifications.slice(
            0,
            50
          )
        )
      );
    }


    // ======================================
    // SUBMITTED STATE
    // ======================================

    function renderSubmittedState() {

      reportStatus.textContent =
        "Submitted";


      reportStatus.className =
        "report-status submitted";


      actionTitle.textContent =
        "Report submitted successfully.";


      draftStatus.textContent =
        "This report is now available to the parent.";


      [
        reportSummary,
        reportObservations,
        reportRecommendations,
        followUp,
        specialistNote
      ].forEach(
        field => {

          field.disabled =
            true;
        }
      );


      saveDraftButton.disabled =
        true;


      submitReportButton.disabled =
        true;


      saveDraftButton.textContent =
        "Submitted";


      submitReportButton.innerHTML =
        `
          Report Submitted
          <span>✓</span>
        `;


      draftWorkflow.classList.remove(
        "active"
      );


      draftWorkflow.classList.add(
        "complete"
      );


      draftWorkflow
        .querySelector(
          ":scope > span"
        )
        .textContent =
          "✓";


      submitWorkflow.classList.add(
        "complete"
      );


      submitWorkflow
        .querySelector(
          ":scope > span"
        )
        .textContent =
          "✓";


      submitWorkflowText.textContent =
        "Available to parent";
    }


    // ======================================
    // TOAST
    // ======================================

    let toastTimer =
      null;


    function showToast(
      title,
      message
    ) {

      toastTitle.textContent =
        title;


      toastMessage.textContent =
        message;


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
          2600
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

  }
);