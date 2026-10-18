document.addEventListener(
  "DOMContentLoaded",
  () => {

    // ==========================
    // CHILD
    // ==========================

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
      ) || children[0];


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


    // ==========================
    // ELEMENTS
    // ==========================

    const reportView =
      document.getElementById(
        "reportView"
      );

    const emptyReport =
      document.getElementById(
        "emptyReport"
      );


    const heroChildName =
      document.getElementById(
        "heroChildName"
      );

    const specialistAvatar =
      document.getElementById(
        "specialistAvatar"
      );

    const specialistName =
      document.getElementById(
        "specialistName"
      );

    const specialty =
      document.getElementById(
        "specialty"
      );

    const consultationDate =
      document.getElementById(
        "consultationDate"
      );

    const reportChildName =
      document.getElementById(
        "reportChildName"
      );

    const reportSummary =
      document.getElementById(
        "reportSummary"
      );

    const observationsList =
      document.getElementById(
        "observationsList"
      );

    const recommendationsList =
      document.getElementById(
        "recommendationsList"
      );

    const followUpText =
      document.getElementById(
        "followUpText"
      );

    const bookingReference =
      document.getElementById(
        "bookingReference"
      );

    const consultationType =
      document.getElementById(
        "consultationType"
      );

    const reportDate =
      document.getElementById(
        "reportDate"
      );

    const specialistNote =
      document.getElementById(
        "specialistNote"
      );


    // ==========================
    // REPORT ID
    // ==========================

    /*
      My Bookings will store the selected
      report booking ID here before opening
      this page.
    */

    const bookingId =
      sessionStorage.getItem(
        "rafiqSelectedReportBooking"
      );


    function getReports() {

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


    const reports =
      getReports();


    const report =
      reports.find(
        item =>
          item.bookingId === bookingId && item.childId === currentChild.id
      );


    if (!report) {

      reportView.hidden =
        true;

      emptyReport.hidden =
        false;

    } else {

      renderReport(
        report
      );
    }


    // ==========================
    // RENDER REPORT
    // ==========================

    function renderReport(
      report
    ) {

      reportView.hidden =
        false;

      emptyReport.hidden =
        true;


      heroChildName.textContent =
        report.childName;


      specialistAvatar.textContent =
        report.specialistInitials ||
        "DR";


      specialistName.textContent =
        report.specialistName;


      specialty.textContent =
        report.specialty;


      consultationDate.textContent =
        report.consultationDate;


      reportChildName.textContent =
        report.childName;


      reportSummary.textContent =
        report.summary;


      renderList(
        observationsList,
        report.observations
      );


      renderList(
        recommendationsList,
        report.recommendations
      );


      followUpText.textContent =
        report.followUp;


      bookingReference.textContent =
        report.bookingId;


      consultationType.textContent =
        report.consultationType;


      reportDate.textContent =
        report.reportDate;


      specialistNote.textContent =
        report.specialistNote;
    }


    function renderList(
      element,
      values
    ) {

      element.innerHTML =
        "";


      (Array.isArray(values) ? values : []).forEach(
        value => {

          const li =
            document.createElement(
              "li"
            );


          li.textContent =
            value;


          element.appendChild(
            li
          );
        }
      );
    }


    // ==========================
    // SIDEBAR
    // ==========================

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


    // ==========================
    // LOGOUT
    // ==========================

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