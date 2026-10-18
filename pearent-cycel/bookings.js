document.addEventListener(
  "DOMContentLoaded",
  () => {

    // =============================
    // ELEMENTS
    // =============================

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


    const bookingsList =
      document.getElementById(
        "bookingsList"
      );

    const emptyState =
      document.getElementById(
        "emptyState"
      );

    const emptyMessage =
      document.getElementById(
        "emptyMessage"
      );


    const filterButtons =
      document.querySelectorAll(
        ".filter-button"
      );


    // Modal

    const detailsModal =
      document.getElementById(
        "detailsModal"
      );

    const modalClose =
      document.getElementById(
        "modalClose"
      );

    const doneButton =
      document.getElementById(
        "doneButton"
      );


    const modalAvatar =
      document.getElementById(
        "modalAvatar"
      );

    const modalSpecialistName =
      document.getElementById(
        "modalSpecialistName"
      );

    const modalSpecialty =
      document.getElementById(
        "modalSpecialty"
      );

    const modalChild =
      document.getElementById(
        "modalChild"
      );

    const modalStatus =
      document.getElementById(
        "modalStatus"
      );

    const modalDate =
      document.getElementById(
        "modalDate"
      );

    const modalTime =
      document.getElementById(
        "modalTime"
      );

    const modalType =
      document.getElementById(
        "modalType"
      );

    const modalPrice =
      document.getElementById(
        "modalPrice"
      );

    const modalReason =
      document.getElementById(
        "modalReason"
      );

    const modalReference =
      document.getElementById(
        "modalReference"
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


    // =============================
    // CHILD
    // =============================

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


    // =============================
    // AGE
    // =============================

    function calculateAge(dateString) { return window.RafiqSetup.ageFromBirth(dateString) || {years:NaN,months:NaN,totalMonths:NaN,days:NaN}; }


    function formatAge(age) { return window.RafiqSetup.formatAge(age); }


    const age =
      calculateAge(
        currentChild.dateOfBirth
      );


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


    // =============================
    // BOOKINGS STORAGE
    // =============================

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


    function saveBookings() {

      localStorage.setItem(
        "rafiqBookings",
        JSON.stringify(
          bookings
        )
      );
    }


    // =============================
    // STATUS
    // =============================

    function getBookingStatus(
      booking
    ) {

      if (
        booking.status ===
        "cancelled"
      ) {

        return "cancelled";
      }


      const bookingDate =
        new Date(
          booking.date +
          "T23:59:59"
        );


      const now =
        new Date();


      if (
        bookingDate < now
      ) {

        return "completed";
      }


      return "upcoming";
    }


    function getStatusLabel(
      status
    ) {

      if (
        status === "upcoming"
      ) {
        return "Upcoming";
      }


      if (
        status === "completed"
      ) {
        return "Completed";
      }


      return "Cancelled";
    }


    // =============================
    // CURRENT FILTER
    // =============================

    let currentFilter =
      "all";


    function getVisibleBookings() {

      /*
        Only show bookings related to
        the currently selected child.
      */

      const childBookings =
        bookings.filter(
          booking =>
            booking.childId ===
              currentChild.id
        );


      if (
        currentFilter === "all"
      ) {

        return childBookings;
      }


      return childBookings.filter(
        booking =>
          getBookingStatus(
            booking
          ) === currentFilter
      );
    }


    // =============================
    // SUMMARY
    // =============================

    function updateSummary() {

      const childBookings =
        bookings.filter(
          booking =>
            booking.childId ===
              currentChild.id
        );


      let upcoming = 0;
      let completed = 0;
      let cancelled = 0;


      childBookings.forEach(
        booking => {

          const status =
            getBookingStatus(
              booking
            );


          if (
            status === "upcoming"
          ) {
            upcoming++;
          }


          if (
            status === "completed"
          ) {
            completed++;
          }


          if (
            status === "cancelled"
          ) {
            cancelled++;
          }

        }
      );


      upcomingCount.textContent =
        upcoming;

      completedCount.textContent =
        completed;

      cancelledCount.textContent =
        cancelled;
    }


    // =============================
    // ESCAPE
    // =============================

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


    // =============================
    // TYPE LABEL
    // =============================

    function getTypeLabel(
      type
    ) {

      if (
        type === "online"
      ) {

        return "Online";
      }


      return "In-person";
    }


    // =============================
    // RENDER BOOKINGS
    // =============================

    function renderBookings() {

      bookingsList.innerHTML =
        "";


      const visible =
        getVisibleBookings();


      emptyState.hidden =
        visible.length !== 0;


      if (
        visible.length === 0
      ) {

        if (
          currentFilter === "upcoming"
        ) {

          emptyMessage.textContent =
            "You don't have any upcoming appointments.";

        } else if (
          currentFilter === "completed"
        ) {

          emptyMessage.textContent =
            "You don't have any completed appointments yet.";

        } else if (
          currentFilter === "cancelled"
        ) {

          emptyMessage.textContent =
            "You don't have any cancelled appointments.";

        } else {

          emptyMessage.textContent =
            "When you book a specialist, your appointments will appear here.";
        }
      }


      visible.forEach(
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
            "booking-card";


          card.innerHTML = `
            <div class="booking-card-top">

              <div class="specialist-avatar">
                ${escapeHTML(
                  booking.specialistInitials ||
                  "DR"
                )}
              </div>


              <div class="specialist-info">

                <h3>
                  ${escapeHTML(
                    booking.specialistName
                  )}
                </h3>

                <p>
                  ${escapeHTML(
                    booking.specialty
                  )}
                </p>

              </div>


              <span class="status-badge ${status}">
                ${getStatusLabel(
                  status
                )}
              </span>

            </div>


            <div class="booking-details">

              <div class="booking-detail">

                <span>
                  Child
                </span>

                <strong>
                  ${escapeHTML(
                    booking.childName
                  )}
                </strong>

              </div>


              <div class="booking-detail">

                <span>
                  Date
                </span>

                <strong>
                  ${escapeHTML(
                    booking.dateLabel
                  )}
                </strong>

              </div>


              <div class="booking-detail">

                <span>
                  Time
                </span>

                <strong>
                  ${escapeHTML(
                    booking.time
                  )}
                </strong>

              </div>


              <div class="booking-detail">

                <span>
                  Type
                </span>

                <strong>
                  ${getTypeLabel(
                    booking.consultationType
                  )}
                </strong>

              </div>


              <div class="booking-detail">

                <span>
                  Fee
                </span>

                <strong>
                  ${escapeHTML(
                    booking.price
                  )}
                </strong>

              </div>

            </div>


            <div class="booking-card-footer">

              <span class="booking-reference">
                Reference:
                <strong>
                  ${escapeHTML(
                    booking.id
                  )}
                </strong>
              </span>


              <div class="booking-actions">

                <button
                  type="button"
                  class="details-button"
                  data-id="${booking.id}"
                >
                  View Details
                </button>

                ${
                  status === "upcoming"
                    ? `
                      <button
                        type="button"
                        class="cancel-button"
                        data-id="${booking.id}"
                      >
                        Cancel Booking
                      </button>
                    `
                    : ""
                }

              </div>

            </div>
          `;


          bookingsList.appendChild(
            card
          );

        }
      );


      addBookingListeners();

      updateSummary();
    }


    // =============================
    // BUTTON LISTENERS
    // =============================

    function addBookingListeners() {

      document
        .querySelectorAll(
          ".details-button"
        )
        .forEach(
          button => {

            button.addEventListener(
              "click",
              () => {

                const booking =
                  bookings.find(
                    item =>
                      item.id ===
                        button.dataset.id
                  );


                if (booking) {

                  openDetails(
                    booking
                  );
                }

              }
            );

          }
        );


      document
        .querySelectorAll(
          ".cancel-button"
        )
        .forEach(
          button => {

            button.addEventListener(
              "click",
              () => {

                cancelBooking(
                  button.dataset.id
                );
              }
            );

          }
        );
    }


    // =============================
    // CANCEL
    // =============================

    function cancelBooking(
      bookingId
    ) {

      const confirmed =
        window.confirm(
          "Are you sure you want to cancel this appointment?"
        );


      if (!confirmed) {
        return;
      }


      const booking =
        bookings.find(
          item =>
            item.id === bookingId
        );


      if (!booking) {
        return;
      }


      booking.status =
        "cancelled";


      booking.cancelledAt =
        new Date().toISOString();


      saveBookings();
      window.RafiqFinance?.reconcile();
      window.dispatchEvent(new Event('rafiq-finance-change'));
if (
  window.createRafiqNotification
) {

  createRafiqNotification({

    type:
      "cancelled",

    title:
      "Appointment cancelled",

    message:
      `Your appointment with ${booking.specialistName} has been cancelled.`,

    link:
      "bookings.html",

    childId:
      booking.childId
  });
}
      renderBookings();
    }


    // =============================
    // DETAILS MODAL
    // =============================

    function openDetails(
      booking
    ) {

      const status =
        getBookingStatus(
          booking
        );


      modalAvatar.textContent =
        booking.specialistInitials ||
        "DR";


      modalSpecialistName.textContent =
        booking.specialistName;


      modalSpecialty.textContent =
        booking.specialty;


      modalChild.textContent =
        booking.childName;


      modalStatus.textContent =
        getStatusLabel(
          status
        );


      modalDate.textContent =
        booking.dateLabel;


      modalTime.textContent =
        booking.time;


      modalType.textContent =
        getTypeLabel(
          booking.consultationType
        );


      modalPrice.textContent =
        booking.price;


      modalReason.textContent =
        booking.reason
          ? booking.reason
          : "No consultation note was added.";


      modalReference.textContent =
        booking.id;


      detailsModal.hidden =
        false;


      document.body.style.overflow =
        "hidden";


      modalClose.focus();
    }


    function closeDetails() {

      detailsModal.hidden =
        true;


      document.body.style.overflow =
        "";
    }


    modalClose.addEventListener(
      "click",
      closeDetails
    );


    doneButton.addEventListener(
      "click",
      closeDetails
    );


    detailsModal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          detailsModal
        ) {

          closeDetails();
        }

      }
    );


    // =============================
    // FILTERS
    // =============================

    filterButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            currentFilter =
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


    // =============================
    // SIDEBAR
    // =============================

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
          !detailsModal.hidden
        ) {

          closeDetails();

        } else {

          closeSidebar();
        }

      }
    );


    // =============================
    // LOGOUT
    // =============================

    logoutButton.addEventListener(
      "click",
      () => {

        sessionStorage.clear();


        window.location.href =
          "../piblic-pages/login.html";

      }
    );


    // =============================
    // INITIALIZE
    // =============================

    renderBookings();

  }
);