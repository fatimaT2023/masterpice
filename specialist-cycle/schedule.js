document.addEventListener(
  "DOMContentLoaded",
  () => {

    // =====================================
    // ELEMENTS
    // =====================================

    const lockedView =
      document.getElementById(
        "lockedView"
      );


    const scheduleView =
      document.getElementById(
        "scheduleView"
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


    const sidebarStatus =
      document.getElementById(
        "sidebarStatus"
      );


    const sidebarStatusText =
      document.getElementById(
        "sidebarStatusText"
      );


    const todayLabel =
      document.getElementById(
        "todayLabel"
      );


    const todayCount =
      document.getElementById(
        "todayCount"
      );


    const weekCount =
      document.getElementById(
        "weekCount"
      );


    const completedCount =
      document.getElementById(
        "completedCount"
      );


    const cancelledCount =
      document.getElementById(
        "cancelledCount"
      );


    const weekStrip =
      document.getElementById(
        "weekStrip"
      );


    const selectedDateTitle =
      document.getElementById(
        "selectedDateTitle"
      );


    const selectedDateCount =
      document.getElementById(
        "selectedDateCount"
      );


    const appointmentsList =
      document.getElementById(
        "appointmentsList"
      );


    const emptyState =
      document.getElementById(
        "emptyState"
      );


    const goTodayButton =
      document.getElementById(
        "goTodayButton"
      );


    // =====================================
    // SPECIALIST
    // =====================================

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


    // =====================================
    // PROFILE
    // =====================================

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


    // =====================================
    // APPROVAL
    // =====================================

    if (
      specialist.status !==
      "approved"
    ) {

      lockedView.hidden =
        false;


      scheduleView.hidden =
        true;


      sidebarStatus.classList.add(
        "pending"
      );


      sidebarStatusText.textContent =
        "Pending Review";


      return;
    }


    lockedView.hidden =
      true;


    scheduleView.hidden =
      false;


    // =====================================
    // BOOKINGS
    // =====================================

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


    let allBookings =
      getBookings();


    function getSpecialistBookings() {

      return allBookings.filter(
        booking =>
          booking.specialistId ===
          specialist.id
      );
    }


    // =====================================
    // DATE HELPERS
    // =====================================

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


      return `${year}-${month}-${day}`;
    }


    function startOfDay(
      date
    ) {

      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
    }


    function isSameDay(
      first,
      second
    ) {

      return (
        first.getFullYear() ===
          second.getFullYear() &&

        first.getMonth() ===
          second.getMonth() &&

        first.getDate() ===
          second.getDate()
      );
    }


    const today =
      startOfDay(
        new Date()
      );


    let selectedDate =
      new Date(
        today
      );


    todayLabel.textContent =
      today.toLocaleDateString(
        undefined,
        {
          weekday:
            "short",

          month:
            "short",

          day:
            "numeric"
        }
      );


    // =====================================
    // TIME
    // =====================================

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


      if (
        match
      ) {

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


    function getBookingDateTime(
      booking
    ) {

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


    // =====================================
    // STATUS
    // =====================================

    function getBookingStatus(
      booking
    ) {

      if (
        booking.status ===
        "cancelled"
      ) {

        return "cancelled";
      }


      if (
        booking.status ===
        "completed"
      ) {

        return "completed";
      }


      if (
        getBookingDateTime(
          booking
        ) <
        new Date()
      ) {

        return "completed";
      }


      return "upcoming";
    }


    // =====================================
    // WEEK DATES
    // =====================================

    function getWeekDates() {

      const dates =
        [];


      for (
        let i = 0;
        i < 7;
        i++
      ) {

        dates.push(
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + i
          )
        );
      }


      return dates;
    }


    const weekDates =
      getWeekDates();


    // =====================================
    // BOOKINGS FOR DATE
    // =====================================

    function getBookingsForDate(
      date
    ) {

      const key =
        dateKey(
          date
        );


      return getSpecialistBookings()
        .filter(
          booking =>
            booking.date ===
            key
        )
        .sort(
          (a,b) =>
            getBookingDateTime(a) -
            getBookingDateTime(b)
        );
    }


    // =====================================
    // SUMMARY
    // =====================================

    function renderSummary() {

      const bookings =
        getSpecialistBookings();


      const todayBookings =
        bookings.filter(
          booking =>
            booking.date ===
            dateKey(
              today
            ) &&
            booking.status !==
            "cancelled"
        );


      const lastWeekDate =
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 6,
          23,
          59,
          59
        );


      const weekBookings =
        bookings.filter(
          booking => {

            const appointment =
              getBookingDateTime(
                booking
              );


            return (
              appointment >=
                today &&

              appointment <=
                lastWeekDate &&

              booking.status !==
                "cancelled"
            );
          }
        );


      const completed =
        bookings.filter(
          booking =>
            getBookingStatus(
              booking
            ) ===
            "completed"
        );


      const cancelled =
        bookings.filter(
          booking =>
            getBookingStatus(
              booking
            ) ===
            "cancelled"
        );


      todayCount.textContent =
        todayBookings.length;


      weekCount.textContent =
        weekBookings.length;


      completedCount.textContent =
        completed.length;


      cancelledCount.textContent =
        cancelled.length;
    }


    // =====================================
    // WEEK STRIP
    // =====================================

    function renderWeekStrip() {

      weekStrip.innerHTML =
        "";


      weekDates.forEach(
        date => {

          const bookings =
            getBookingsForDate(
              date
            );


          const activeCount =
            bookings.filter(
              booking =>
                booking.status !==
                "cancelled"
            ).length;


          const button =
            document.createElement(
              "button"
            );


          button.type =
            "button";


          button.className =
            "day-button";


          if (
            isSameDay(
              date,
              selectedDate
            )
          ) {

            button.classList.add(
              "active"
            );
          }


          if (
            isSameDay(
              date,
              today
            )
          ) {

            button.classList.add(
              "today"
            );
          }


          button.innerHTML = `
            <span class="day-name">
              ${
                date.toLocaleDateString(
                  undefined,
                  {
                    weekday:
                      "short"
                  }
                )
              }
            </span>

            <strong>
              ${date.getDate()}
            </strong>

            <small>
              ${
                date.toLocaleDateString(
                  undefined,
                  {
                    month:
                      "short"
                  }
                )
              }
            </small>

            <span class="day-bookings">
              ${activeCount}
            </span>
          `;


          button.addEventListener(
            "click",
            () => {

              selectedDate =
                new Date(
                  date
                );


              renderWeekStrip();

              renderAppointments();
            }
          );


          weekStrip.appendChild(
            button
          );
        }
      );

    }


    // =====================================
    // ESCAPE
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
          value ?? ""
        );


      return element.innerHTML;
    }


    // =====================================
    // APPOINTMENTS
    // =====================================

    function renderAppointments() {

      const bookings =
        getBookingsForDate(
          selectedDate
        );


      appointmentsList.innerHTML =
        "";


      const title =
        isSameDay(
          selectedDate,
          today
        )
          ? "Today's appointments"
          : selectedDate
              .toLocaleDateString(
                undefined,
                {
                  weekday:
                    "long",

                  month:
                    "long",

                  day:
                    "numeric"
                }
              );


      selectedDateTitle.textContent =
        title;


      selectedDateCount.textContent =
        `${bookings.length} ${
          bookings.length === 1
            ? "appointment"
            : "appointments"
        }`;


      emptyState.hidden =
        bookings.length !== 0;


      if (
        bookings.length === 0
      ) {

        return;
      }


      bookings.forEach(
        booking => {

          const status =
            getBookingStatus(
              booking
            );


          const childName =
            booking.childName ||
            "Child";


          const type =
            booking.consultationType ===
            "online"
              ? "Online"
              : "In-person";


          const card =
            document.createElement(
              "article"
            );


          card.className =
            "appointment-item";


          card.innerHTML = `
            <div class="appointment-time">

              <strong>
                ${escapeHTML(
                  booking.time ||
                  "—"
                )}
              </strong>

              <span>
                ${
                  status === "completed"
                    ? "Completed"
                    : status === "cancelled"
                      ? "Cancelled"
                      : "Scheduled"
                }
              </span>

            </div>


            <div class="child-avatar">
              ${escapeHTML(
                childName
                  .charAt(0)
                  .toUpperCase()
              )}
            </div>


            <div class="appointment-info">

              <h3>
                ${escapeHTML(
                  childName
                )}
              </h3>

              <p>
                ${escapeHTML(
                  booking.reason ||
                  "No consultation reason provided."
                )}
              </p>

              <small>
                ${escapeHTML(
                  booking.id
                )}
              </small>

            </div>


            <div class="appointment-type">

              <span>
                Consultation
              </span>

              <strong>
                ${type}
              </strong>

            </div>


            <div class="appointment-actions">

              <span
                class="status-pill ${status}"
              >
                ${
                  status === "upcoming"
                    ? "Upcoming"
                    : status === "completed"
                      ? "Completed"
                      : "Cancelled"
                }
              </span>


              <button
                type="button"
                class="open-button"
              >
                ${
                  status === "cancelled"
                    ? "View Booking"
                    : status === "completed"
                      ? "View Session"
                      : "Open"
                }
              </button>

            </div>
          `;


          card
            .querySelector(
              ".open-button"
            )
            .addEventListener(
              "click",
              () => {

                openAppointment(
                  booking,
                  status
                );
              }
            );


          appointmentsList.appendChild(
            card
          );
        }
      );

    }


    // =====================================
    // OPEN APPOINTMENT
    // =====================================

    function openAppointment(
      booking,
      status
    ) {

      sessionStorage.setItem(
        "rafiqSelectedSpecialistBooking",
        booking.id
      );


      /*
        Cancelled booking:
        Booking Details only.

        Upcoming/completed:
        Consultation workspace.
      */

      if (
        status === "cancelled"
      ) {

        window.location.href =
          "booking-details.html";

        return;
      }


      window.location.href =
        "consultation.html";
    }


    // =====================================
    // TODAY BUTTON
    // =====================================

    goTodayButton.addEventListener(
      "click",
      () => {

        selectedDate =
          new Date(
            today
          );


        renderWeekStrip();

        renderAppointments();
      }
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


    // =====================================
    // LOGOUT
    // =====================================

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


    // =====================================
    // INIT
    // =====================================

    renderSummary();

    renderWeekStrip();

    renderAppointments();

  }
);