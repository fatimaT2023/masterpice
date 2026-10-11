document.addEventListener(
  "DOMContentLoaded",
  () => {

    // =====================================
    // SPECIALIST
    // =====================================

    function safeObject(
      key
    ) {

      try {

        return JSON.parse(
          localStorage.getItem(
            key
          )
        );

      } catch (error) {

        return null;
      }
    }


    function safeArray(
      key
    ) {

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


    const specialist =
      safeObject(
        "rafiqSpecialistProfile"
      );


    if (!specialist) {

      return;
    }


    const topbar =
      document.querySelector(
        ".topbar"
      );


    if (!topbar) {

      return;
    }


    // =====================================
    // STORAGE
    // =====================================

    const STORAGE_KEY =
      `rafiqSpecialistNotifications_${specialist.id}`;


    const SETTINGS_KEY =
      `rafiqSpecialistSettings_${specialist.id}`;


    // =====================================
    // SETTINGS
    // =====================================

    function getSettings() {

      const saved =
        safeObject(
          SETTINGS_KEY
        );


      return {

        notifications: {

          newBooking:
            saved?.notifications
              ?.newBooking ??
            true,


          bookingChanges:
            saved?.notifications
              ?.bookingChanges ??
            true,


          reminders:
            saved?.notifications
              ?.reminders ??
            true,


          reportFollowUp:
            saved?.notifications
              ?.reportFollowUp ??
            true,


          earnings:
            saved?.notifications
              ?.earnings ??
            false
        },


        channels: {

          inApp:
            saved?.channels
              ?.inApp ??
            true,


          email:
            saved?.channels
              ?.email ??
            false
        }
      };

    }


    let settings =
      getSettings();


    // =====================================
    // NOTIFICATION STORAGE
    // =====================================

    function getNotifications() {

      return safeArray(
        STORAGE_KEY
      );
    }


    function saveNotifications(
      notifications
    ) {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          notifications.slice(
            0,
            100
          )
        )
      );

    }


    // =====================================
    // HELPERS
    // =====================================

    function bookingBelongsToSpecialist(
      booking
    ) {

      return (
        booking.specialistId ===
        specialist.id
      );
    }


    function getReports() {

      return safeArray(
        "rafiqSpecialistReports"
      );

    }


    function reportExists(
      bookingId
    ) {

      return getReports()
        .some(
          report =>
            report.bookingId ===
              bookingId &&
            report.specialistId ===
              specialist.id
        );

    }


    function getBookingDateTime(
      booking
    ) {

      if (!booking.date) {

        return null;
      }


      const date =
        new Date(
          booking.date +
          "T00:00:00"
        );


      const value =
        String(
          booking.time ||
          ""
        ).trim();


      const twelveHour =
        value.match(
          /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
        );


      let hours =
        0;


      let minutes =
        0;


      if (
        twelveHour
      ) {

        hours =
          Number(
            twelveHour[1]
          );


        minutes =
          Number(
            twelveHour[2]
          );


        const period =
          twelveHour[3]
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

      } else {

        const parts =
          value
            .split(":")
            .map(Number);


        if (
          Number.isFinite(
            parts[0]
          )
        ) {

          hours =
            parts[0];
        }


        if (
          Number.isFinite(
            parts[1]
          )
        ) {

          minutes =
            parts[1];
        }
      }


      date.setHours(
        hours,
        minutes,
        0,
        0
      );


      return date;

    }


    function formatBookingDate(
      booking
    ) {

      if (
        booking.dateLabel
      ) {

        return booking.dateLabel;
      }


      if (
        !booking.date
      ) {

        return "Appointment";
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
              "numeric"
          }
        );

    }


    function getBookingPrice(
      booking
    ) {

      const bookingPrice =
        Number(
          booking.price
        );


      if (
        Number.isFinite(
          bookingPrice
        )
      ) {

        return bookingPrice;
      }


      const profilePrice =
        Number(
          specialist.price
        );


      return Number.isFinite(
        profilePrice
      )
        ? profilePrice
        : 0;

    }


    // =====================================
    // ADD IF MISSING
    // =====================================

    function addNotification(
      notifications,
      notification
    ) {

      const exists =
        notifications.some(
          item =>
            item.id ===
            notification.id
        );


      if (
        exists
      ) {

        return;
      }


      notifications.push(
        notification
      );

    }


    // =====================================
    // GENERATE PRACTICE NOTIFICATIONS
    // =====================================

    function syncNotifications() {

      let notifications =
        getNotifications();


      const bookings =
        safeArray(
          "rafiqBookings"
        )
          .filter(
            bookingBelongsToSpecialist
          );


      const now =
        new Date();


      bookings.forEach(
        booking => {

          const childName =
            booking.childName ||
            "Client";


          // ==============================
          // NEW BOOKING
          // ==============================

          if (
            settings.notifications
              .newBooking
          ) {

            addNotification(
              notifications,
              {

                id:
                  `booking_new_${booking.id}`,


                type:
                  "booking",


                title:
                  "New booking received",


                message:
                  `${childName} • ${formatBookingDate(
                    booking
                  )} • ${booking.time || "Time not set"}`,


                bookingId:
                  booking.id,


                read:
                  false,


                createdAt:
                  booking.createdAt ||
                  now.toISOString(),


                destination:
                  "booking-details.html"
              }
            );

          }


          // ==============================
          // CANCELLED
          // ==============================

          if (
            booking.status ===
              "cancelled" &&
            settings.notifications
              .bookingChanges
          ) {

            addNotification(
              notifications,
              {

                id:
                  `booking_cancelled_${booking.id}`,


                type:
                  "cancelled",


                title:
                  "Booking cancelled",


                message:
                  `${childName}'s appointment on ${formatBookingDate(
                    booking
                  )} has been cancelled.`,


                bookingId:
                  booking.id,


                read:
                  false,


                createdAt:
                  booking.cancelledAt ||
                  booking.updatedAt ||
                  now.toISOString(),


                destination:
                  "booking-details.html"
              }
            );

          }


          // ==============================
          // UPCOMING REMINDER
          // ==============================

          if (
            booking.status !==
              "cancelled" &&
            booking.status !==
              "completed" &&
            settings.notifications
              .reminders
          ) {

            const appointment =
              getBookingDateTime(
                booking
              );


            if (
              appointment
            ) {

              const diff =
                appointment.getTime() -
                now.getTime();


              const hours =
                diff /
                (
                  1000 *
                  60 *
                  60
                );


              if (
                hours >= 0 &&
                hours <= 24
              ) {

                addNotification(
                  notifications,
                  {

                    id:
                      `booking_reminder_${booking.id}`,


                    type:
                      "reminder",


                    title:
                      "Consultation reminder",


                    message:
                      `${childName}'s consultation is scheduled for ${booking.time || "today"}.`,


                    bookingId:
                      booking.id,


                    read:
                      false,


                    createdAt:
                      now.toISOString(),


                    destination:
                      "booking-details.html"
                  }
                );

              }

            }

          }


          // ==============================
          // REPORT FOLLOW-UP
          // ==============================

          if (
            booking.status ===
              "completed" &&
            !reportExists(
              booking.id
            ) &&
            settings.notifications
              .reportFollowUp
          ) {

            addNotification(
              notifications,
              {

                id:
                  `report_needed_${booking.id}`,


                type:
                  "report",


                title:
                  "Consultation report needed",


                message:
                  `The completed consultation for ${childName} still needs a professional report.`,


                bookingId:
                  booking.id,


                read:
                  false,


                createdAt:
                  booking.completedAt ||
                  now.toISOString(),


                destination:
                  "report-form.html"
              }
            );

          }


          // ==============================
          // EARNING
          // ==============================

          if (
            booking.status ===
              "completed" &&
            settings.notifications
              .earnings
          ) {

            const amount =
              getBookingPrice(
                booking
              );


            addNotification(
              notifications,
              {

                id:
                  `earning_${booking.id}`,


                type:
                  "earning",


                title:
                  "Earning recorded",


                message:
                  `${amount.toFixed(
                    2
                  )} JOD was recorded for ${childName}'s completed consultation.`,


                bookingId:
                  booking.id,


                read:
                  false,


                createdAt:
                  booking.completedAt ||
                  now.toISOString(),


                destination:
                  "earnings.html"
              }
            );

          }

        }
      );


      /*
        Sort newest first.
      */

      notifications.sort(
        (a,b) =>
          new Date(
            b.createdAt ||
            0
          ) -
          new Date(
            a.createdAt ||
            0
          )
      );


      saveNotifications(
        notifications
      );


      return notifications;

    }


    let notifications =
      syncNotifications();


    // =====================================
    // CREATE TOPBAR STRUCTURE
    // =====================================

    function buildNotificationUI() {

      /*
        We wrap existing right-side
        topbar action(s) with the bell.
      */

      let actions =
        topbar.querySelector(
          ".specialist-topbar-actions"
        );


      if (!actions) {

        actions =
          document.createElement(
            "div"
          );


        actions.className =
          "specialist-topbar-actions";


        const children =
          Array.from(
            topbar.children
          );


        const rightSideChildren =
          children.filter(
            element =>
              !element.classList
                .contains(
                  "topbar-left"
                )
          );


        rightSideChildren.forEach(
          element => {

            actions.appendChild(
              element
            );
          }
        );


        topbar.appendChild(
          actions
        );

      }


      const center =
        document.createElement(
          "div"
        );


      center.className =
        "notification-center";


      center.innerHTML = `
        <button
          type="button"
          class="notification-bell"
          id="specialistNotificationBell"
          aria-label="Notifications"
          aria-expanded="false"
        >

          <span
            class="notification-bell-icon"
          >
            ♢
          </span>

          <span
            class="notification-badge"
            id="specialistNotificationBadge"
            hidden
          >
            0
          </span>

        </button>


        <div
          class="notification-dropdown"
          id="specialistNotificationDropdown"
          hidden
        >

          <div class="notification-dropdown-header">

            <div>

              <span>
                PRACTICE UPDATES
              </span>

              <h3>
                Notifications
              </h3>

            </div>


            <button
              type="button"
              class="notification-mark-all"
              id="specialistMarkAllRead"
            >
              Mark all read
            </button>

          </div>


          <div
            class="notification-list"
            id="specialistNotificationList"
          ></div>


          <div class="notification-dropdown-footer">
            Notifications are generated from RAFIQ practice activity.
          </div>

        </div>
      `;


      /*
        Bell first, existing action after it.
      */

      actions.insertBefore(
        center,
        actions.firstChild
      );

    }


    buildNotificationUI();


    // =====================================
    // UI ELEMENTS
    // =====================================

    const notificationBell =
      document.getElementById(
        "specialistNotificationBell"
      );


    const notificationBadge =
      document.getElementById(
        "specialistNotificationBadge"
      );


    const notificationDropdown =
      document.getElementById(
        "specialistNotificationDropdown"
      );


    const notificationList =
      document.getElementById(
        "specialistNotificationList"
      );


    const markAllButton =
      document.getElementById(
        "specialistMarkAllRead"
      );


    // =====================================
    // FORMAT TIME
    // =====================================

    function formatRelativeTime(
      value
    ) {

      const date =
        new Date(
          value
        );


      if (
        Number.isNaN(
          date.getTime()
        )
      ) {

        return "";
      }


      const diff =
        Date.now() -
        date.getTime();


      const minutes =
        Math.floor(
          diff /
          (
            1000 *
            60
          )
        );


      if (
        minutes < 1
      ) {

        return "Now";
      }


      if (
        minutes < 60
      ) {

        return `${minutes}m`;
      }


      const hours =
        Math.floor(
          minutes /
          60
        );


      if (
        hours < 24
      ) {

        return `${hours}h`;
      }


      const days =
        Math.floor(
          hours /
          24
        );


      if (
        days <= 7
      ) {

        return `${days}d`;
      }


      return date.toLocaleDateString(
        undefined,
        {
          month:
            "short",

          day:
            "numeric"
        }
      );

    }


    // =====================================
    // ICON
    // =====================================

    function getIcon(
      type
    ) {

      const icons = {

        booking:
          "◷",

        cancelled:
          "✕",

        reminder:
          "◷",

        report:
          "◫",

        earning:
          "◇",

        approval:
          "✓"
      };


      return (
        icons[type] ||
        "♢"
      );

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
    // RENDER
    // =====================================

    function renderNotifications() {

      settings =
        getSettings();


      notifications =
        getNotifications();


      const unread =
        notifications.filter(
          item =>
            !item.read
        );


      if (
        settings.channels
          .inApp === false
      ) {

        notificationBadge.hidden =
          true;


        markAllButton.disabled =
          true;


        notificationList.innerHTML = `
          <div class="notification-disabled">

            <span>
              ♢
            </span>

            <strong>
              In-app notifications are off
            </strong>

            <p>
              Enable in-app notifications from your specialist settings.
            </p>

            <a
              href="specialist-settings.html"
              class="notification-settings-link"
            >
              Open Settings
            </a>

          </div>
        `;


        return;
      }


      markAllButton.disabled =
        unread.length === 0;


      if (
        unread.length > 0
      ) {

        notificationBadge.hidden =
          false;


        notificationBadge.textContent =
          unread.length > 9
            ? "9+"
            : unread.length;

      } else {

        notificationBadge.hidden =
          true;
      }


      notificationList.innerHTML =
        "";


      if (
        notifications.length === 0
      ) {

        notificationList.innerHTML = `
          <div class="notification-empty">

            <div class="notification-empty-icon">
              ♢
            </div>

            <strong>
              You're all caught up
            </strong>

            <p>
              New bookings, reminders and practice updates will appear here.
            </p>

          </div>
        `;


        return;
      }


      notifications
        .slice(
          0,
          10
        )
        .forEach(
          notification => {

            const button =
              document.createElement(
                "button"
              );


            button.type =
              "button";


            button.className =
              "notification-item";


            if (
              !notification.read
            ) {

              button.classList.add(
                "unread"
              );
            }


            button.innerHTML = `
              <div
                class="notification-icon ${escapeHTML(
                  notification.type
                )}"
              >
                ${escapeHTML(
                  getIcon(
                    notification.type
                  )
                )}
              </div>


              <div class="notification-copy">

                <strong>
                  ${escapeHTML(
                    notification.title
                  )}
                </strong>

                <p>
                  ${escapeHTML(
                    notification.message
                  )}
                </p>

              </div>


              <span class="notification-time">
                ${escapeHTML(
                  formatRelativeTime(
                    notification.createdAt
                  )
                )}
              </span>
            `;


            button.addEventListener(
              "click",
              () => {

                openNotification(
                  notification.id
                );
              }
            );


            notificationList.appendChild(
              button
            );

          }
        );

    }


    // =====================================
    // OPEN NOTIFICATION
    // =====================================

    function openNotification(
      notificationId
    ) {

      notifications =
        getNotifications();


      const notification =
        notifications.find(
          item =>
            item.id ===
            notificationId
        );


      if (
        !notification
      ) {

        return;
      }


      notification.read =
        true;


      saveNotifications(
        notifications
      );


      if (
        notification.bookingId
      ) {

        sessionStorage.setItem(
          "rafiqSelectedSpecialistBooking",
          notification.bookingId
        );
      }


      renderNotifications();


      if (
        notification.destination
      ) {

        window.location.href =
          notification.destination;
      }

    }


    // =====================================
    // MARK ALL READ
    // =====================================

    markAllButton.addEventListener(
      "click",
      event => {

        event.stopPropagation();


        notifications =
          getNotifications()
            .map(
              notification => ({
                ...notification,

                read:
                  true
              })
            );


        saveNotifications(
          notifications
        );


        renderNotifications();

      }
    );


    // =====================================
    // BELL TOGGLE
    // =====================================

    notificationBell.addEventListener(
      "click",
      event => {

        event.stopPropagation();


        const opening =
          notificationDropdown.hidden;


        notificationDropdown.hidden =
          !opening;


        notificationBell.setAttribute(
          "aria-expanded",
          String(
            opening
          )
        );


        if (
          opening
        ) {

          /*
            Re-sync every time the bell
            is opened so newest practice
            activity appears.
          */

          notifications =
            syncNotifications();


          renderNotifications();
        }

      }
    );


    notificationDropdown.addEventListener(
      "click",
      event => {

        event.stopPropagation();

      }
    );


    document.addEventListener(
      "click",
      () => {

        notificationDropdown.hidden =
          true;


        notificationBell.setAttribute(
          "aria-expanded",
          "false"
        );

      }
    );


    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key ===
          "Escape"
        ) {

          notificationDropdown.hidden =
            true;


          notificationBell.setAttribute(
            "aria-expanded",
            "false"
          );
        }

      }
    );


    // =====================================
    // INITIAL RENDER
    // =====================================

    renderNotifications();

  }
);