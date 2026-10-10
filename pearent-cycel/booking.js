document.addEventListener(
  "DOMContentLoaded",
  () => {

    // =================================
    // ELEMENTS
    // =================================

    const bookingView =
      document.getElementById(
        "bookingView"
      );

    const missingView =
      document.getElementById(
        "missingView"
      );

    const successView =
      document.getElementById(
        "successView"
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


    const summaryChildAvatar =
      document.getElementById(
        "summaryChildAvatar"
      );

    const summaryChildName =
      document.getElementById(
        "summaryChildName"
      );


    const specialistAvatar =
      document.getElementById(
        "specialistAvatar"
      );

    const specialistName =
      document.getElementById(
        "specialistName"
      );

    const specialistSpecialty =
      document.getElementById(
        "specialistSpecialty"
      );

    const specialistPrice =
      document.getElementById(
        "specialistPrice"
      );


    const consultationOptions =
      document.getElementById(
        "consultationOptions"
      );

    const dateOptions =
      document.getElementById(
        "dateOptions"
      );

    const timeOptions =
      document.getElementById(
        "timeOptions"
      );


    const bookingReason =
      document.getElementById(
        "bookingReason"
      );

    const reasonCount =
      document.getElementById(
        "reasonCount"
      );


    const summarySpecialist =
      document.getElementById(
        "summarySpecialist"
      );

    const summaryType =
      document.getElementById(
        "summaryType"
      );

    const summaryDate =
      document.getElementById(
        "summaryDate"
      );

    const summaryTime =
      document.getElementById(
        "summaryTime"
      );

    const summaryPrice =
      document.getElementById(
        "summaryPrice"
      );


    const bookingError =
      document.getElementById(
        "bookingError"
      );

    const confirmBookingButton =
      document.getElementById(
        "confirmBookingButton"
      );


    // Success

    const successMessage =
      document.getElementById(
        "successMessage"
      );

    const confirmedSpecialist =
      document.getElementById(
        "confirmedSpecialist"
      );

    const confirmedChild =
      document.getElementById(
        "confirmedChild"
      );

    const confirmedDate =
      document.getElementById(
        "confirmedDate"
      );

    const confirmedTime =
      document.getElementById(
        "confirmedTime"
      );

    const bookingReference =
      document.getElementById(
        "bookingReference"
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
    // VIEWS
    // =================================

    function showView(
      view
    ) {

      [
        bookingView,
        missingView,
        successView
      ].forEach(
        item => {

          item.classList.remove(
            "active"
          );
        }
      );


      view.classList.add(
        "active"
      );


      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }


    // =================================
    // CURRENT CHILD
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


    // =================================
    // CHILD AGE
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


    const age =
      calculateAge(
        currentChild.dateOfBirth
      );


    const childInitial =
      currentChild.name
        .charAt(0)
        .toUpperCase();


    childAvatar.textContent =
      childInitial;

    childName.textContent =
      currentChild.name;

    childAge.textContent =
      formatAge(age);


    summaryChildAvatar.textContent =
      childInitial;

    summaryChildName.textContent =
      currentChild.name;


    // =================================
    // SPECIALIST
    // =================================

    function getSelectedSpecialist() {

      try {

        return JSON.parse(
          sessionStorage.getItem(
            "rafiqSelectedSpecialist"
          )
        );

      } catch (error) {

        return null;
      }
    }


    const specialist =
      getSelectedSpecialist();


    if (!specialist) {

      showView(
        missingView
      );

      return;
    }


    // =================================
    // SPECIALIST UI
    // =================================

    specialistAvatar.textContent =
      specialist.initials;

    specialistName.textContent =
      specialist.name;

    specialistSpecialty.textContent =
      specialist.specialty;

    specialistPrice.textContent =
      specialist.price;


    summarySpecialist.textContent =
      specialist.name;

    summaryPrice.textContent =
      specialist.price;


    // =================================
    // BOOKING STATE
    // =================================

    let selectedType =
      null;

    let selectedDate =
      null;

    let selectedDateLabel =
      null;

    let selectedTime =
      null;


    // =================================
    // CONSULTATION TYPES
    // =================================

    function renderConsultationTypes() {

      consultationOptions.innerHTML =
        "";


      specialist
        .consultationTypes
        .forEach(
          type => {

            const button =
              document.createElement(
                "button"
              );


            button.type =
              "button";


            button.className =
              "consultation-option";


            const isOnline =
              type === "online";


            const title =
              isOnline
                ? "Online Consultation"
                : "In-person Consultation";


            const description =
              isOnline
                ? "Meet through a secure video session."
                : "Visit the specialist at their clinic.";


            button.innerHTML = `
              <span class="consultation-icon">
                ${isOnline ? "◉" : "⌂"}
              </span>

              <span>
                <strong>
                  ${title}
                </strong>

                <span>
                  ${description}
                </span>
              </span>
            `;


            button.addEventListener(
              "click",
              () => {

                selectedType =
                  type;


                document
                  .querySelectorAll(
                    ".consultation-option"
                  )
                  .forEach(
                    item => {

                      item.classList.remove(
                        "selected"
                      );
                    }
                  );


                button.classList.add(
                  "selected"
                );


                summaryType.textContent =
                  title;


                clearError();
              }
            );


            consultationOptions.appendChild(
              button
            );
          }
        );
    }


    // =================================
    // DATES
    // =================================

    function getFutureDates() {

      const dates =
        [];


      const today =
        new Date();


      for (
        let i = 1;
        dates.length < 5;
        i++
      ) {

        const date =
          new Date(today);


        date.setDate(
          today.getDate() + i
        );


        /*
          Skip Friday in this demo
          schedule.
        */

        if (
          date.getDay() === 5
        ) {

          continue;
        }


        dates.push(
          date
        );
      }


      return dates;
    }


    function toLocalDateKey(
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
        year +
        "-" +
        month +
        "-" +
        day
      );
    }


    function formatFullDate(
      date
    ) {

      return date.toLocaleDateString(
        undefined,
        {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric"
        }
      );
    }


    function renderDates() {

      dateOptions.innerHTML =
        "";


      const dates =
        getFutureDates();


      dates.forEach(
        date => {

          const button =
            document.createElement(
              "button"
            );


          button.type =
            "button";

          button.className =
            "date-button";


          const weekday =
            date.toLocaleDateString(
              undefined,
              {
                weekday: "short"
              }
            );


          const month =
            date.toLocaleDateString(
              undefined,
              {
                month: "short"
              }
            );


          button.innerHTML = `
            <span>
              ${weekday}
            </span>

            <strong>
              ${date.getDate()}
            </strong>

            <small>
              ${month}
            </small>
          `;


          button.addEventListener(
            "click",
            () => {

              selectedDate =
                toLocalDateKey(
                  date
                );


              selectedDateLabel =
                formatFullDate(
                  date
                );


              selectedTime =
                null;


              document
                .querySelectorAll(
                  ".date-button"
                )
                .forEach(
                  item => {

                    item.classList.remove(
                      "selected"
                    );
                  }
                );


              button.classList.add(
                "selected"
              );


              summaryDate.textContent =
                selectedDateLabel;


              summaryTime.textContent =
                "Not selected";


              renderTimes(
                date
              );


              clearError();
            }
          );


          dateOptions.appendChild(
            button
          );
        }
      );
    }


    // =================================
    // TIME SLOTS
    // =================================

    function getTimesForDate(
      date
    ) {

      /*
        Demo availability only.
        Later this can come from specialist
        availability in the backend.
      */

      const day =
        date.getDay();


      if (
        day === 6
      ) {

        return [
          "10:00 AM",
          "12:00 PM",
          "2:30 PM",
          "5:00 PM"
        ];
      }


      return [
        "9:00 AM",
        "11:30 AM",
        "3:00 PM",
        "5:30 PM"
      ];
    }


    function renderTimes(
      date
    ) {

      timeOptions.innerHTML =
        "";


      const times =
        getTimesForDate(
          date
        );


      times.forEach(
        time => {

          const button =
            document.createElement(
              "button"
            );


          button.type =
            "button";

          button.className =
            "time-button";

          button.textContent =
            time;


          button.addEventListener(
            "click",
            () => {

              selectedTime =
                time;


              document
                .querySelectorAll(
                  ".time-button"
                )
                .forEach(
                  item => {

                    item.classList.remove(
                      "selected"
                    );
                  }
                );


              button.classList.add(
                "selected"
              );


              summaryTime.textContent =
                time;


              clearError();
            }
          );


          timeOptions.appendChild(
            button
          );
        }
      );
    }


    // =================================
    // TEXTAREA
    // =================================

    bookingReason.addEventListener(
      "input",
      () => {

        reasonCount.textContent =
          bookingReason.value.length +
          " / 500";
      }
    );


    // =================================
    // ERROR
    // =================================

    function clearError() {

      bookingError.textContent =
        "";
    }


    function validateBooking() {

      if (!selectedType) {

        bookingError.textContent =
          "Please choose a consultation type.";

        return false;
      }


      if (!selectedDate) {

        bookingError.textContent =
          "Please choose an appointment date.";

        return false;
      }


      if (!selectedTime) {

        bookingError.textContent =
          "Please choose an appointment time.";

        return false;
      }


      return true;
    }


    // =================================
    // SAVE BOOKING
    // =================================

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


    function createBooking() {

      const bookingId =
        "RFQ-" +
        Date.now()
          .toString()
          .slice(-7);


      const booking = {

        id:
          bookingId,

        status:
          "confirmed",

        childId:
          currentChild.id,

        childName:
          currentChild.name,

        specialistId:
          specialist.id,

        specialistName:
          specialist.name,

        specialistInitials:
          specialist.initials,

        specialty:
          specialist.specialty,

        consultationType:
          selectedType,

        date:
          selectedDate,

        dateLabel:
          selectedDateLabel,

        time:
          selectedTime,

        price:
          specialist.price,

        reason:
          bookingReason.value.trim(),

        createdAt:
          new Date().toISOString()
      };


      const bookings =
        getBookings();


      bookings.unshift(
        booking
      );


      localStorage.setItem(
        "rafiqBookings",
        JSON.stringify(
          bookings
        )
      );
      //notfications
if (
  window.createRafiqNotification
) {

  createRafiqNotification({

    type:
      "booking",

    title:
      "Appointment confirmed",

    message:
      `${specialist.name} • ${selectedDateLabel} at ${selectedTime}`,

    link:
      "bookings.html",

    childId:
      currentChild.id
  });
}

      return booking;
    }


    // =================================
    // CONFIRM
    // =================================

    confirmBookingButton.addEventListener(
      "click",
      () => {

        clearError();


        if (
          !validateBooking()
        ) {
          return;
        }


        const confirmedBooking =
          createBooking();


        sessionStorage.removeItem(
          "rafiqSelectedSpecialist"
        );


        showSuccess(
          confirmedBooking
        );
      }
    );


    // =================================
    // SUCCESS
    // =================================

    function showSuccess(
      booking
    ) {

      successMessage.textContent =
        `Your appointment with ${booking.specialistName} has been saved for ${booking.childName}.`;


      confirmedSpecialist.textContent =
        booking.specialistName;


      confirmedChild.textContent =
        booking.childName;


      confirmedDate.textContent =
        booking.dateLabel;


      confirmedTime.textContent =
        booking.time;


      bookingReference.textContent =
        booking.id;


      showView(
        successView
      );
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
    // INITIALIZE
    // =================================

    renderConsultationTypes();

    renderDates();

    showView(
      bookingView
    );

  }
);