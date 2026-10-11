document.addEventListener(
  "DOMContentLoaded",
  () => {

    // =====================================
    // DEVELOPMENT ROLE GUARD
    // =====================================

    /*
      Prototype only.

      If a role exists and it is not admin,
      block this page.

      Production authorization belongs
      on the backend.
    */

    const role =
      sessionStorage.getItem(
        "rafiqRole"
      );


    if (
      role &&
      role !== "admin"
    ) {

      window.location.href =
        "../piblic-pages/login.html";

      return;
    }


    // =====================================
    // STORAGE HELPERS
    // =====================================

    function readArray(
      key
    ) {

      try {

        const value =
          JSON.parse(
            localStorage.getItem(
              key
            )
          );


        return Array.isArray(
          value
        )
          ? value
          : [];

      } catch (error) {

        return [];
      }

    }


    function readObject(
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


    // =====================================
    // ADMIN IDENTITY
    // =====================================

    const adminName =
      sessionStorage.getItem(
        "rafiqAdminName"
      ) ||
      "RAFIQ Admin";


    document
      .getElementById(
        "adminSidebarName"
      )
      .textContent =
        adminName;


    document
      .getElementById(
        "topbarAdminName"
      )
      .textContent =
        adminName;


    // =====================================
    // ELEMENTS
    // =====================================

    const heroPendingCount =
      document.getElementById(
        "heroPendingCount"
      );


    const heroPendingMessage =
      document.getElementById(
        "heroPendingMessage"
      );


    const pendingMetric =
      document.getElementById(
        "pendingMetric"
      );


    const specialistsMetric =
      document.getElementById(
        "specialistsMetric"
      );


    const bookingsMetric =
      document.getElementById(
        "bookingsMetric"
      );


    const reportsMetric =
      document.getElementById(
        "reportsMetric"
      );


    const upcomingMetric =
      document.getElementById(
        "upcomingMetric"
      );


    const completedMetric =
      document.getElementById(
        "completedMetric"
      );


    const cancelledMetric =
      document.getElementById(
        "cancelledMetric"
      );


    const approvalNavCount =
      document.getElementById(
        "approvalNavCount"
      );


    const notificationDot =
      document.getElementById(
        "notificationDot"
      );


    const approvalList =
      document.getElementById(
        "approvalList"
      );


    const approvalEmpty =
      document.getElementById(
        "approvalEmpty"
      );


    const recentBookings =
      document.getElementById(
        "recentBookings"
      );


    const bookingsEmpty =
      document.getElementById(
        "bookingsEmpty"
      );


    // =====================================
    // SPECIALISTS
    // =====================================

    function getSpecialists() {

      const specialists =
        readArray(
          "rafiqSpecialists"
        );


      /*
        Keep prototype compatible with the
        currently logged-in specialist profile.
      */

      const currentProfile =
        readObject(
          "rafiqSpecialistProfile"
        );


      if (
        currentProfile?.id
      ) {

        const index =
          specialists.findIndex(
            item =>
              item.id ===
              currentProfile.id
          );


        if (
          index === -1
        ) {

          specialists.push(
            currentProfile
          );

        } else {

          specialists[index] = {
            ...specialists[index],
            ...currentProfile
          };
        }

      }


      return specialists;

    }


    const specialists =
      getSpecialists();


    const pendingSpecialists =
      specialists
        .filter(
          item =>
            (
              item.status ||
              "pending"
            ) ===
            "pending"
        )
        .sort(
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


    const approvedSpecialists =
      specialists.filter(
        item =>
          item.status ===
          "approved"
      );


    // =====================================
    // PLATFORM DATA
    // =====================================

    const bookings =
      readArray(
        "rafiqBookings"
      );


    const reports =
      readArray(
        "rafiqSpecialistReports"
      );


    // =====================================
    // BOOKING DATE
    // =====================================

    function parseTime(
      value
    ) {

      const text =
        String(
          value ||
          ""
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

          hours = 0;
        }


        if (
          period === "PM" &&
          hours !== 12
        ) {

          hours += 12;
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

      if (
        !booking.date
      ) {

        return new Date(0);
      }


      const date =
        new Date(
          `${booking.date}T00:00:00`
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
    // BOOKING STATUS
    // =====================================

    function getStatus(
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


      return "upcoming";

    }


    // =====================================
    // METRICS
    // =====================================

    function renderMetrics() {

      const upcoming =
        bookings.filter(
          booking =>
            getStatus(
              booking
            ) ===
            "upcoming"
        );


      const completed =
        bookings.filter(
          booking =>
            getStatus(
              booking
            ) ===
            "completed"
        );


      const cancelled =
        bookings.filter(
          booking =>
            getStatus(
              booking
            ) ===
            "cancelled"
        );


      heroPendingCount.textContent =
        pendingSpecialists.length;


      pendingMetric.textContent =
        pendingSpecialists.length;


      specialistsMetric.textContent =
        approvedSpecialists.length;


      bookingsMetric.textContent =
        bookings.length;


      reportsMetric.textContent =
        reports.length;


      upcomingMetric.textContent =
        upcoming.length;


      completedMetric.textContent =
        completed.length;


      cancelledMetric.textContent =
        cancelled.length;


      if (
        pendingSpecialists.length === 0
      ) {

        heroPendingMessage.textContent =
          "No applications currently require review.";

        approvalNavCount.hidden =
          true;

        notificationDot.hidden =
          true;

      } else {

        heroPendingMessage.textContent =
          pendingSpecialists.length === 1
            ? "1 specialist application requires a verification decision."
            : `${pendingSpecialists.length} specialist applications require verification decisions.`;


        approvalNavCount.hidden =
          false;


        approvalNavCount.textContent =
          pendingSpecialists.length > 9
            ? "9+"
            : pendingSpecialists.length;


        notificationDot.hidden =
          false;
      }

    }


    // =====================================
    // INITIALS
    // =====================================

    function getInitials(
      name
    ) {

      const cleaned =
        String(
          name ||
          ""
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

        return "SP";
      }


      if (
        parts.length === 1
      ) {

        return parts[0]
          .slice(
            0,
            2
          )
          .toUpperCase();
      }


      return (
        parts[0][0] +
        parts[
          parts.length - 1
        ][0]
      ).toUpperCase();

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
          value ??
          ""
        );


      return element.innerHTML;

    }


    // =====================================
    // APPROVAL QUEUE
    // =====================================

    function renderApprovals() {

      approvalList.innerHTML =
        "";


      const preview =
        pendingSpecialists.slice(
          0,
          4
        );


      approvalEmpty.hidden =
        preview.length !== 0;


      preview.forEach(
        specialist => {

          const row =
            document.createElement(
              "article"
            );


          row.className =
            "approval-row";


          const experience =
            Number(
              specialist.experience
            );


          const experienceText =
            Number.isFinite(
              experience
            )
              ? `${experience} yrs experience`
              : "Experience not recorded";


          const documentText =
            specialist.credentialFileName
              ? "Document submitted"
              : "Document metadata unavailable";


          row.innerHTML = `
            <div class="specialist-avatar">
              ${escapeHTML(
                getInitials(
                  specialist.fullName
                )
              )}
            </div>


            <div class="approval-copy">

              <strong>
                ${escapeHTML(
                  specialist.fullName ||
                  "Specialist"
                )}
              </strong>

              <span>
                ${escapeHTML(
                  specialist.specialty ||
                  "Specialty not specified"
                )}
              </span>


              <div class="approval-meta">

                <small>
                  ${escapeHTML(
                    experienceText
                  )}
                </small>

                <small>
                  ${escapeHTML(
                    documentText
                  )}
                </small>

              </div>

            </div>


            <button
              type="button"
              class="review-button"
            >
              Review
            </button>
          `;


          row
            .querySelector(
              ".review-button"
            )
            .addEventListener(
              "click",
              () => {

                sessionStorage.setItem(
                  "rafiqAdminSelectedSpecialistId",
                  specialist.id
                );


                window.location.href =
                  "specialist-approvals.html";

              }
            );


          approvalList.appendChild(
            row
          );

        }
      );

    }


    // =====================================
    // RECENT BOOKINGS
    // =====================================

    function renderRecentBookings() {

      recentBookings.innerHTML =
        "";


      const recent =
        bookings
          .slice()
          .sort(
            (a,b) => {

              const aDate =
                a.createdAt
                  ? new Date(
                      a.createdAt
                    )
                  : getBookingDateTime(
                      a
                    );


              const bDate =
                b.createdAt
                  ? new Date(
                      b.createdAt
                    )
                  : getBookingDateTime(
                      b
                    );


              return bDate - aDate;

            }
          )
          .slice(
            0,
            6
          );


      bookingsEmpty.hidden =
        recent.length !== 0;


      recent.forEach(
        booking => {

          const row =
            document.createElement(
              "article"
            );


          row.className =
            "booking-row";


          const child =
            booking.childName ||
            "Child";


          const status =
            getStatus(
              booking
            );


          const consultationType =
            booking.consultationType ===
            "online"
              ? "Online"
              : "In-person";


          row.innerHTML = `
            <div class="booking-avatar">
              ${escapeHTML(
                child
                  .charAt(0)
                  .toUpperCase()
              )}
            </div>


            <div class="booking-copy">

              <strong>
                ${escapeHTML(
                  child
                )}
                ·
                ${escapeHTML(
                  booking.specialistName ||
                  "Specialist"
                )}
              </strong>

              <span>
                ${escapeHTML(
                  consultationType
                )}
                ·
                ${escapeHTML(
                  booking.dateLabel ||
                  booking.date ||
                  "Date unavailable"
                )}
                ·
                ${escapeHTML(
                  booking.time ||
                  "Time unavailable"
                )}
              </span>

            </div>


            <span
              class="booking-status ${status}"
            >
              ${
                status === "completed"
                  ? "Completed"
                  : status === "cancelled"
                    ? "Cancelled"
                    : "Upcoming"
              }
            </span>
          `;


          recentBookings.appendChild(
            row
          );

        }
      );

    }


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

    renderMetrics();

    renderApprovals();

    renderRecentBookings();

  }
);