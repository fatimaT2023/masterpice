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


    const bookingsView =
      document.getElementById(
        "bookingsView"
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


    const todayDate =
      document.getElementById(
        "todayDate"
      );


    const upcomingCount =
      document.getElementById(
        "upcomingCount"
      );


    const completedCount =
      document.getElementById(
        "completedCount"
      );


    const cancelledCount =
      document.getElementById(
        "cancelledCount"
      );


    const totalCount =
      document.getElementById(
        "totalCount"
      );


    const bookingsList =
      document.getElementById(
        "bookingsList"
      );


    const emptyState =
      document.getElementById(
        "emptyState"
      );


    const emptyTitle =
      document.getElementById(
        "emptyTitle"
      );


    const emptyText =
      document.getElementById(
        "emptyText"
      );


    const bookingSearch =
      document.getElementById(
        "bookingSearch"
      );


    const filterButtons =
      document.querySelectorAll(
        ".filter-button"
      );


    const listTitle =
      document.getElementById(
        "listTitle"
      );


    const resultCount =
      document.getElementById(
        "resultCount"
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
      fullName
    ) {

      const cleaned =
        String(
          fullName || ""
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
    // APPROVAL GUARD
    // =====================================

    if (
      specialist.status !==
      "approved"
    ) {

      lockedView.hidden =
        false;


      bookingsView.hidden =
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


    bookingsView.hidden =
      false;


    // =====================================
    // DATE
    // =====================================

    todayDate.textContent =
      new Date()
        .toLocaleDateString(
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
    // BOOKINGS STORAGE
    // =====================================

    function getAllBookings() {

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
      getAllBookings();


    /*
      Critical:
      Specialist sees only bookings
      belonging to their profile.
    */

    function getSpecialistBookings() {

      return allBookings.filter(
        booking =>
          booking.specialistId ===
          specialist.id
      );
    }


    // =====================================
    // BOOKING DATE + TIME
    // =====================================

    function parse12HourTime(
      timeString
    ) {

      if (!timeString) {

        return {
          hours: 23,
          minutes: 59
        };
      }


      const match =
        String(
          timeString
        )
          .trim()
          .match(
            /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
          );


      /*
        Fallback for 24-hour format.
      */

      if (!match) {

        const parts =
          String(
            timeString
          )
            .split(":")
            .map(Number);


        if (
          parts.length >= 2 &&
          Number.isFinite(
            parts[0]
          ) &&
          Number.isFinite(
            parts[1]
          )
        ) {

          return {
            hours:
              parts[0],

            minutes:
              parts[1]
          };
        }


        return {
          hours: 23,
          minutes: 59
        };
      }


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


    function getBookingDateTime(
      booking
    ) {

      const date =
        new Date(
          booking.date +
          "T00:00:00"
        );


      const time =
        parse12HourTime(
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


      const appointment =
        getBookingDateTime(
          booking
        );


      if (
        appointment <
        new Date()
      ) {

        return "completed";
      }


      return "upcoming";
    }


    // =====================================
    // FORMAT DATE
    // =====================================

    function formatDate(
      booking
    ) {

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


    function formatConsultationType(
      type
    ) {

      return (
        type === "online"
          ? "Online"
          : "In-person"
      );
    }


    // =====================================
    // FILTER
    // =====================================

    let activeFilter =
      "all";


    let searchTerm =
      "";


    function getFilteredBookings() {

      let bookings =
        getSpecialistBookings();


      if (
        activeFilter !== "all"
      ) {

        bookings =
          bookings.filter(
            booking =>
              getBookingStatus(
                booking
              ) ===
              activeFilter
          );
      }


      if (
        searchTerm
      ) {

        const term =
          searchTerm.toLowerCase();


        bookings =
          bookings.filter(
            booking => {

              return (
                String(
                  booking.childName ||
                  ""
                )
                  .toLowerCase()
                  .includes(term) ||

                String(
                  booking.id ||
                  ""
                )
                  .toLowerCase()
                  .includes(term) ||

                String(
                  booking.reason ||
                  ""
                )
                  .toLowerCase()
                  .includes(term)
              );
            }
          );
      }


      /*
        Upcoming first by nearest appointment.
        Older/completed naturally move later.
      */

      bookings.sort(
        (a,b) => {

          const statusA =
            getBookingStatus(a);


          const statusB =
            getBookingStatus(b);


          const order = {
            upcoming: 0,
            completed: 1,
            cancelled: 2
          };


          if (
            order[statusA] !==
            order[statusB]
          ) {

            return (
              order[statusA] -
              order[statusB]
            );
          }


          if (
            statusA === "upcoming"
          ) {

            return (
              getBookingDateTime(a) -
              getBookingDateTime(b)
            );
          }


          return (
            getBookingDateTime(b) -
            getBookingDateTime(a)
          );
        }
      );


      return bookings;
    }


    // =====================================
    // SUMMARY
    // =====================================

    function renderSummary() {

      const bookings =
        getSpecialistBookings();


      const upcoming =
        bookings.filter(
          booking =>
            getBookingStatus(
              booking
            ) ===
            "upcoming"
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


      upcomingCount.textContent =
        upcoming.length;


      completedCount.textContent =
        completed.length;


      cancelledCount.textContent =
        cancelled.length;


      totalCount.textContent =
        bookings.length;
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
          value ?? ""
        );


      return element.innerHTML;
    }


    // =====================================
    // RENDER BOOKINGS
    // =====================================

    function renderBookings() {

      const bookings =
        getFilteredBookings();


      bookingsList.innerHTML =
        "";


      resultCount.textContent =
        `${bookings.length} ${
          bookings.length === 1
            ? "booking"
            : "bookings"
        }`;


      const titleMap = {

        all:
          "All bookings",

        upcoming:
          "Upcoming bookings",

        completed:
          "Completed consultations",

        cancelled:
          "Cancelled bookings"
      };


      listTitle.textContent =
        titleMap[
          activeFilter
        ];


      if (
        bookings.length === 0
      ) {

        emptyState.hidden =
          false;


        if (
          searchTerm
        ) {

          emptyTitle.textContent =
            "No matching bookings";


          emptyText.textContent =
            "Try another child name or booking reference.";

        } else if (
          activeFilter ===
          "upcoming"
        ) {

          emptyTitle.textContent =
            "No upcoming bookings";


          emptyText.textContent =
            "New parent appointments will appear here.";

        } else if (
          activeFilter ===
          "completed"
        ) {

          emptyTitle.textContent =
            "No completed consultations";


          emptyText.textContent =
            "Completed sessions will appear here.";

        } else if (
          activeFilter ===
          "cancelled"
        ) {

          emptyTitle.textContent =
            "No cancelled bookings";


          emptyText.textContent =
            "Cancelled appointments will appear here.";

        } else {

          emptyTitle.textContent =
            "No bookings yet";


          emptyText.textContent =
            "Once parents book an appointment with you, it will appear here.";
        }


        return;
      }


      emptyState.hidden =
        true;


      bookings.forEach(
        booking => {

          const status =
            getBookingStatus(
              booking
            );


          const card =
            document.createElement(
              "article"
            );


          card.className =
            "booking-item";


          const childInitial =
            String(
              booking.childName ||
              "C"
            )
              .charAt(0)
              .toUpperCase();


          const concern =
            booking.reason
              ? booking.reason
              : "No consultation reason provided";


          card.innerHTML = `
            <div class="child-avatar">
              ${escapeHTML(
                childInitial
              )}
            </div>


            <div class="booking-main">

              <h3>
                ${escapeHTML(
                  booking.childName ||
                  "Child"
                )}
              </h3>

              <p>
                ${escapeHTML(
                  concern
                )}
              </p>

              <span class="reference">
                ${escapeHTML(
                  booking.id
                )}
              </span>

            </div>


            <div class="booking-meta">

              <span>
                Date
              </span>

              <strong>
                ${escapeHTML(
                  formatDate(
                    booking
                  )
                )}
              </strong>

            </div>


            <div class="booking-meta">

              <span>
                Time
              </span>

              <strong>
                ${escapeHTML(
                  booking.time
                )}
              </strong>

            </div>


            <div class="booking-meta">

              <span>
                Consultation
              </span>

              <strong>
                ${escapeHTML(
                  formatConsultationType(
                    booking.consultationType
                  )
                )}
              </strong>

            </div>


            <div class="booking-actions">

              <span
                class="status-badge ${status}"
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
                class="view-booking-button"
                data-id="${escapeHTML(
                  booking.id
                )}"
              >
                View Booking
              </button>

            </div>
          `;


          card
            .querySelector(
              ".view-booking-button"
            )
            .addEventListener(
              "click",
              () => {

                openBookingDetails(
                  booking.id
                );
              }
            );


          bookingsList.appendChild(
            card
          );
        }
      );

    }


    // =====================================
    // BOOKING DETAILS HANDOFF
    // =====================================

    function openBookingDetails(
      bookingId
    ) {

      /*
        Next screen reads this value.
      */

      sessionStorage.setItem(
        "rafiqSelectedSpecialistBooking",
        bookingId
      );


      window.location.href =
        "booking-details.html";
    }


    // =====================================
    // FILTER EVENTS
    // =====================================

    filterButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            activeFilter =
              button.dataset.filter;


            filterButtons.forEach(
              item => {

                item.classList.remove(
                  "active"
                );
              }
            );


            button.classList.add(
              "active"
            );


            renderBookings();
          }
        );
      }
    );


    // =====================================
    // SEARCH
    // =====================================

    bookingSearch.addEventListener(
      "input",
      () => {

        searchTerm =
          bookingSearch.value
            .trim()
            .toLowerCase();


        renderBookings();
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

    renderBookings();

  }
);