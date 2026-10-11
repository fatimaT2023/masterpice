document.addEventListener(
  "DOMContentLoaded",
  () => {

    // ============================
    // ELEMENTS
    // ============================

    const lockedView =
      document.getElementById(
        "lockedView"
      );


    const emptyView =
      document.getElementById(
        "emptyView"
      );


    const detailsView =
      document.getElementById(
        "detailsView"
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


    const childHeroAvatar =
      document.getElementById(
        "childHeroAvatar"
      );


    const heroChildName =
      document.getElementById(
        "heroChildName"
      );


    const heroSubtitle =
      document.getElementById(
        "heroSubtitle"
      );


    const heroStatus =
      document.getElementById(
        "heroStatus"
      );


    const bookingDate =
      document.getElementById(
        "bookingDate"
      );


    const bookingTime =
      document.getElementById(
        "bookingTime"
      );


    const consultationType =
      document.getElementById(
        "consultationType"
      );


    const sessionFee =
      document.getElementById(
        "sessionFee"
      );


    const clientAvatar =
      document.getElementById(
        "clientAvatar"
      );


    const clientName =
      document.getElementById(
        "clientName"
      );


    const clientContext =
      document.getElementById(
        "clientContext"
      );


    const bookingReason =
      document.getElementById(
        "bookingReason"
      );


    const bookingReference =
      document.getElementById(
        "bookingReference"
      );


    const sideChildName =
      document.getElementById(
        "sideChildName"
      );


    const sideDate =
      document.getElementById(
        "sideDate"
      );


    const sideTime =
      document.getElementById(
        "sideTime"
      );


    const sideType =
      document.getElementById(
        "sideType"
      );


    const consultationActionCard =
      document.getElementById(
        "consultationActionCard"
      );


    const cancelledCard =
      document.getElementById(
        "cancelledCard"
      );


    const actionTitle =
      document.getElementById(
        "actionTitle"
      );


    const actionDescription =
      document.getElementById(
        "actionDescription"
      );


    const consultationButton =
      document.getElementById(
        "consultationButton"
      );


    // ============================
    // SPECIALIST
    // ============================

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


    // ============================
    // PROFILE SIDEBAR
    // ============================

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


    // ============================
    // APPROVAL
    // ============================

    if (
      specialist.status !==
      "approved"
    ) {

      lockedView.hidden =
        false;


      emptyView.hidden =
        true;


      detailsView.hidden =
        true;


      return;
    }


    // ============================
    // SELECTED BOOKING
    // ============================

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


    const bookings =
      getBookings();


    /*
      Important:
      We check both booking ID and specialist ID.

      A specialist must never open another
      specialist's booking just by changing
      sessionStorage manually.
    */

    const booking =
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


    function showEmpty() {

      lockedView.hidden =
        true;


      detailsView.hidden =
        true;


      emptyView.hidden =
        false;
    }


    // ============================
    // STATUS
    // ============================

    function parseTime(
      value
    ) {

      const text =
        String(
          value || ""
        ).trim();


      const match =
        text.match(
          /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
        );


      if (match) {

        let hours =
          Number(
            match[1]
          );


        const minutes =
          Number(
            match[2]
          );


        const period =
          match[3]
            .toUpperCase();


        if (
          period === "AM" &&
          hours === 12
        ) {

          hours =
            0;
        }


        if (
          period === "PM" &&
          hours !== 12
        ) {

          hours +=
            12;
        }


        return {
          hours,
          minutes
        };
      }


      /*
        Supports 24-hour values too.
      */

      const parts =
        text
          .split(":")
          .map(Number);


      return {

        hours:
          Number.isFinite(
            parts[0]
          )
            ? parts[0]
            : 0,

        minutes:
          Number.isFinite(
            parts[1]
          )
            ? parts[1]
            : 0
      };
    }


    function getAppointmentDateTime() {

      const date =
        new Date(
          booking.date +
          "T00:00:00"
        );


      const time =
        parseTime(
          booking.time
        );


      date.setHours(
        time.hours,
        time.minutes,
        0,
        0
      );


      return date;
    }


    function getStatus() {

      if (
        booking.status ===
        "cancelled"
      ) {

        return "cancelled";
      }


      /*
        Once Consultation page explicitly
        completes it, this becomes permanent.
      */

      if (
        booking.status ===
        "completed"
      ) {

        return "completed";
      }


      /*
        For the prototype, a passed appointment
        is displayed as completed/history.

        The Consultation page will later save
        the explicit completed state.
      */

      if (
        getAppointmentDateTime() <
        new Date()
      ) {

        return "completed";
      }


      return "upcoming";
    }


    const status =
      getStatus();


    // ============================
    // FORMATTING
    // ============================

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


    function formatPrice() {

      if (
        typeof booking.price ===
        "number"
      ) {

        return (
          booking.price +
          " JOD"
        );
      }


      return (
        booking.price ||
        specialist.price +
          " JOD"
      );
    }


    // ============================
    // CHILD CONTEXT
    // ============================

    function getChildContext() {

      /*
        In this frontend prototype,
        parent child profiles are in
        the same browser storage.

        Production would retrieve only
        authorized consultation data
        from the backend.
      */

      try {

        const children =
          JSON.parse(
            localStorage.getItem(
              "rafiqChildren"
            )
          ) || [];


        const child =
          children.find(
            item =>
              item.id ===
              booking.childId
          );


        if (!child) {

          return (
            "Consultation client"
          );
        }


        return getAgeLabel(
          child.dateOfBirth
        );

      } catch (error) {

        return (
          "Consultation client"
        );
      }
    }


    function getAgeLabel(
      dateOfBirth
    ) {

      if (!dateOfBirth) {

        return (
          "Consultation client"
        );
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

        const totalMonths =
          Math.max(
            0,
            months
          );


        return (
          totalMonths +
          (
            totalMonths === 1
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


    // ============================
    // RENDER
    // ============================

    function renderBooking() {

      lockedView.hidden =
        true;


      emptyView.hidden =
        true;


      detailsView.hidden =
        false;


      const childName =
        booking.childName ||
        "Child";


      const childInitial =
        childName
          .charAt(0)
          .toUpperCase();


      const date =
        formatDate();


      const type =
        formatType();


      const context =
        getChildContext();


      childHeroAvatar.textContent =
        childInitial;


      heroChildName.textContent =
        childName;


      heroSubtitle.textContent =
        type +
        " consultation";


      heroStatus.textContent =
        status === "upcoming"
          ? "Upcoming"
          : status === "completed"
            ? "Completed"
            : "Cancelled";


      heroStatus.className =
        "status-pill " +
        status;


      bookingDate.textContent =
        date;


      bookingTime.textContent =
        booking.time ||
        "—";


      consultationType.textContent =
        type;


      sessionFee.textContent =
        formatPrice();


      clientAvatar.textContent =
        childInitial;


      clientName.textContent =
        childName;


      clientContext.textContent =
        context;


      bookingReason.textContent =
        booking.reason ||
        "No specific consultation reason was provided by the parent.";


      bookingReference.textContent =
        booking.id;


      sideChildName.textContent =
        childName;


      sideDate.textContent =
        date;


      sideTime.textContent =
        booking.time ||
        "—";


      sideType.textContent =
        type;


      renderAction();
    }


    // ============================
    // ACTION
    // ============================

    function renderAction() {

      if (
        status === "cancelled"
      ) {

        consultationActionCard.hidden =
          true;


        cancelledCard.hidden =
          false;


        return;
      }


      consultationActionCard.hidden =
        false;


      cancelledCard.hidden =
        true;


      if (
        status === "completed"
      ) {

        actionTitle.textContent =
          "Review consultation";


        actionDescription.textContent =
          "Open the consultation workspace to review this completed session or continue to its report.";


        consultationButton.innerHTML =
          `
            View Consultation
            <span>→</span>
          `;

      } else {

        actionTitle.textContent =
          "Prepare for consultation";


        actionDescription.textContent =
          "Open the consultation workspace to review the parent's concern and manage this session.";


        consultationButton.innerHTML =
          `
            Open Consultation
            <span>→</span>
          `;
      }

    }


    consultationButton.addEventListener(
      "click",
      () => {

        sessionStorage.setItem(
          "rafiqSelectedSpecialistBooking",
          booking.id
        );


        window.location.href =
          "consultation.html";
      }
    );


    // ============================
    // SIDEBAR
    // ============================

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


    // ============================
    // LOGOUT
    // ============================

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


    // ============================
    // INIT
    // ============================

    renderBooking();

  }
);