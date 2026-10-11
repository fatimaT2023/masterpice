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


    const clientsView =
      document.getElementById(
        "clientsView"
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


    const heroClientCount =
      document.getElementById(
        "heroClientCount"
      );


    const clientCount =
      document.getElementById(
        "clientCount"
      );


    const activeCount =
      document.getElementById(
        "activeCount"
      );


    const sessionCount =
      document.getElementById(
        "sessionCount"
      );


    const reportCount =
      document.getElementById(
        "reportCount"
      );


    const casesGrid =
      document.getElementById(
        "casesGrid"
      );


    const resultCount =
      document.getElementById(
        "resultCount"
      );


    const casesTitle =
      document.getElementById(
        "casesTitle"
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


    const caseSearch =
      document.getElementById(
        "caseSearch"
      );


    const filterButtons =
      document.querySelectorAll(
        ".filter-button"
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


      clientsView.hidden =
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


    clientsView.hidden =
      false;


    // =====================================
    // STORAGE
    // =====================================

    function readArray(
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


    const allBookings =
      readArray(
        "rafiqBookings"
      );


    const consultations =
      readArray(
        "rafiqConsultations"
      );


    const reports =
      readArray(
        "rafiqSpecialistReports"
      );


    const children =
      readArray(
        "rafiqChildren"
      );


    // =====================================
    // SPECIALIST BOOKINGS
    // =====================================

    function getSpecialistBookings() {

      return allBookings.filter(
        booking =>
          booking.specialistId ===
          specialist.id
      );
    }


    // =====================================
    // TIME / STATUS
    // =====================================

    function parseTime(
      value
    ) {

      const text =
        String(
          value || ""
        ).trim();


      const twelveHour =
        text.match(
          /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
        );


      if (
        twelveHour
      ) {

        let hours =
          Number(
            twelveHour[1]
          );


        const minutes =
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
    // CHILD AGE
    // =====================================

    function calculateAge(
      dateOfBirth
    ) {

      if (!dateOfBirth) {

        return "Age not available";
      }


      const birth =
        new Date(
          dateOfBirth +
          "T00:00:00"
        );


      if (
        Number.isNaN(
          birth.getTime()
        )
      ) {

        return "Age not available";
      }


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

        const safeMonths =
          Math.max(
            months,
            0
          );


        return (
          safeMonths +
          (
            safeMonths === 1
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


    function findChild(
      childId
    ) {

      return children.find(
        child =>
          child.id ===
          childId
      );
    }


    // =====================================
    // BUILD CASES
    // =====================================

    function buildCases() {

      /*
        A cancelled-only booking should not
        create a real client case.

        So we use bookings that were not
        cancelled.
      */

      const validBookings =
        getSpecialistBookings()
          .filter(
            booking =>
              booking.status !==
              "cancelled"
          );


      const map =
        new Map();


      validBookings.forEach(
        booking => {

          /*
            childId is preferred.

            Fallback helps old demo bookings
            if childId happens to be missing.
          */

          const key =
            booking.childId ||
            (
              "name_" +
              String(
                booking.childName ||
                "child"
              ).toLowerCase()
            );


          if (
            !map.has(
              key
            )
          ) {

            map.set(
              key,
              {
                key,
                childId:
                  booking.childId ||
                  null,

                childName:
                  booking.childName ||
                  "Child",

                bookings: []
              }
            );
          }


          map
            .get(
              key
            )
            .bookings
            .push(
              booking
            );
        }
      );


      return Array
        .from(
          map.values()
        )
        .map(
          caseItem =>
            enrichCase(
              caseItem
            )
        )
        .sort(
          (a,b) =>
            b.lastActivity -
            a.lastActivity
        );
    }


    function enrichCase(
      caseItem
    ) {

      const bookings =
        caseItem.bookings
          .slice()
          .sort(
            (a,b) =>
              getBookingDateTime(b) -
              getBookingDateTime(a)
          );


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


      const bookingIds =
        bookings.map(
          booking =>
            booking.id
        );


      const caseConsultations =
        consultations.filter(
          consultation =>
            consultation.specialistId ===
              specialist.id &&
            bookingIds.includes(
              consultation.bookingId
            )
        );


      const caseReports =
        reports.filter(
          report =>
            report.specialistId ===
              specialist.id &&
            bookingIds.includes(
              report.bookingId
            )
        );


      const latestBooking =
        bookings[0] ||
        null;


      const latestCompleted =
        completed
          .slice()
          .sort(
            (a,b) =>
              getBookingDateTime(b) -
              getBookingDateTime(a)
          )[0] ||
        null;


      const nextBooking =
        upcoming
          .slice()
          .sort(
            (a,b) =>
              getBookingDateTime(a) -
              getBookingDateTime(b)
          )[0] ||
        null;


      const latestReport =
        caseReports
          .slice()
          .sort(
            (a,b) =>
              new Date(
                b.submittedAt ||
                0
              ) -
              new Date(
                a.submittedAt ||
                0
              )
          )[0] ||
        null;


      const child =
        caseItem.childId
          ? findChild(
              caseItem.childId
            )
          : null;


      return {

        ...caseItem,

        bookings,

        completed,

        upcoming,

        consultations:
          caseConsultations,

        reports:
          caseReports,

        latestBooking,

        latestCompleted,

        nextBooking,

        latestReport,

        child,

        status:
          upcoming.length > 0
            ? "active"
            : "history",

        lastActivity:
          latestBooking
            ? getBookingDateTime(
                latestBooking
              )
            : new Date(0)
      };
    }


    const cases =
      buildCases();


    // =====================================
    // SUMMARY
    // =====================================

    function renderSummary() {

      const active =
        cases.filter(
          item =>
            item.status ===
            "active"
        );


      const completedSessions =
        cases.reduce(
          (
            total,
            item
          ) =>
            total +
            item.completed.length,
          0
        );


      const totalReports =
        cases.reduce(
          (
            total,
            item
          ) =>
            total +
            item.reports.length,
          0
        );


      heroClientCount.textContent =
        cases.length;


      clientCount.textContent =
        cases.length;


      activeCount.textContent =
        active.length;


      sessionCount.textContent =
        completedSessions;


      reportCount.textContent =
        totalReports;
    }


    // =====================================
    // FILTERING
    // =====================================

    let activeFilter =
      "all";


    let searchTerm =
      "";


    function getFilteredCases() {

      let result =
        cases.slice();


      if (
        activeFilter !==
        "all"
      ) {

        result =
          result.filter(
            item =>
              item.status ===
              activeFilter
          );
      }


      if (
        searchTerm
      ) {

        result =
          result.filter(
            item =>
              String(
                item.childName
              )
                .toLowerCase()
                .includes(
                  searchTerm
                )
          );
      }


      return result;
    }


    // =====================================
    // FORMAT
    // =====================================

    function formatDate(
      booking
    ) {

      if (!booking) {

        return "—";
      }


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


    function formatType(
      type
    ) {

      return (
        type === "online"
          ? "Online"
          : "In-person"
      );
    }


    function escapeHTML(
      value
    ) {

      const temp =
        document.createElement(
          "div"
        );


      temp.textContent =
        String(
          value ?? ""
        );


      return temp.innerHTML;
    }


    // =====================================
    // RENDER CASES
    // =====================================

    function renderCases() {

      const filtered =
        getFilteredCases();


      casesGrid.innerHTML =
        "";


      resultCount.textContent =
        `${filtered.length} ${
          filtered.length === 1
            ? "case"
            : "cases"
        }`;


      const titles = {
        all:
          "All cases",

        active:
          "Active cases",

        history:
          "Case history"
      };


      casesTitle.textContent =
        titles[
          activeFilter
        ];


      if (
        filtered.length === 0
      ) {

        emptyState.hidden =
          false;


        if (
          searchTerm
        ) {

          emptyTitle.textContent =
            "No matching client";


          emptyText.textContent =
            "Try searching for another child name.";

        } else if (
          activeFilter ===
          "active"
        ) {

          emptyTitle.textContent =
            "No active cases";


          emptyText.textContent =
            "Children with upcoming consultations will appear here.";

        } else if (
          activeFilter ===
          "history"
        ) {

          emptyTitle.textContent =
            "No case history yet";


          emptyText.textContent =
            "Completed consultation cases will appear here.";

        } else {

          emptyTitle.textContent =
            "No client cases yet";


          emptyText.textContent =
            "Children from your bookings will appear here automatically.";
        }


        return;
      }


      emptyState.hidden =
        true;


      filtered.forEach(
        caseItem => {

          const card =
            document.createElement(
              "article"
            );


          card.className =
            "case-card";


          const childInitial =
            String(
              caseItem.childName ||
              "C"
            )
              .charAt(0)
              .toUpperCase();


          const age =
            caseItem.child
              ? calculateAge(
                  caseItem.child.dateOfBirth
                )
              : "Age not available";


          const nextAppointment =
            caseItem.nextBooking
              ? (
                  formatDate(
                    caseItem.nextBooking
                  ) +
                  " • " +
                  (
                    caseItem.nextBooking.time ||
                    "—"
                  )
                )
              : "No upcoming appointment";


          const lastSession =
            caseItem.latestCompleted
              ? formatDate(
                  caseItem.latestCompleted
                )
              : "No completed session";


          const consultationType =
            caseItem.latestBooking
              ? formatType(
                  caseItem.latestBooking
                    .consultationType
                )
              : "—";


          card.innerHTML = `
            <div class="case-top">

              <div class="case-client">

                <div class="case-avatar">
                  ${escapeHTML(
                    childInitial
                  )}
                </div>


                <div>

                  <span>
                    CLIENT CASE
                  </span>

                  <h3>
                    ${escapeHTML(
                      caseItem.childName
                    )}
                  </h3>

                  <small>
                    ${escapeHTML(
                      age
                    )}
                  </small>

                </div>

              </div>


              <span
                class="case-status ${caseItem.status}"
              >
                ${
                  caseItem.status ===
                  "active"
                    ? "Active"
                    : "History"
                }
              </span>

            </div>


            <div class="case-stats">

              <div class="case-stat">

                <span>
                  Sessions
                </span>

                <strong>
                  ${caseItem.completed.length}
                </strong>

              </div>


              <div class="case-stat">

                <span>
                  Upcoming
                </span>

                <strong>
                  ${caseItem.upcoming.length}
                </strong>

              </div>


              <div class="case-stat">

                <span>
                  Reports
                </span>

                <strong>
                  ${caseItem.reports.length}
                </strong>

              </div>

            </div>


            <div class="case-details">

              <div class="case-detail-row">

                <span>
                  Next appointment
                </span>

                <strong>
                  ${escapeHTML(
                    nextAppointment
                  )}
                </strong>

              </div>


              <div class="case-detail-row">

                <span>
                  Last session
                </span>

                <strong>
                  ${escapeHTML(
                    lastSession
                  )}
                </strong>

              </div>


              <div class="case-detail-row">

                <span>
                  Consultation type
                </span>

                <strong>
                  ${escapeHTML(
                    consultationType
                  )}
                </strong>

              </div>

            </div>


            <div class="case-actions">

              <button
                type="button"
                class="primary-case-button"
                data-action="session"
              >
                ${
                  caseItem.nextBooking
                    ? "Open Next Session"
                    : "View Latest Session"
                }
              </button>


              <button
                type="button"
                class="secondary-case-button"
                data-action="report"
                ${
                  caseItem.latestReport
                    ? ""
                    : "disabled"
                }
              >
                ${
                  caseItem.latestReport
                    ? "View Latest Report"
                    : "No Report Yet"
                }
              </button>

            </div>
          `;


          const sessionButton =
            card.querySelector(
              '[data-action="session"]'
            );


          sessionButton.addEventListener(
            "click",
            () => {

              openCaseSession(
                caseItem
              );
            }
          );


          const reportButton =
            card.querySelector(
              '[data-action="report"]'
            );


          if (
            caseItem.latestReport
          ) {

            reportButton.addEventListener(
              "click",
              () => {

                openCaseReport(
                  caseItem
                );
              }
            );
          }


          casesGrid.appendChild(
            card
          );
        }
      );

    }


    // =====================================
    // OPEN SESSION
    // =====================================

    function openCaseSession(
      caseItem
    ) {

      /*
        Priority:
        1. Upcoming booking
        2. Latest completed booking
        3. Latest booking
      */

      const targetBooking =
        caseItem.nextBooking ||
        caseItem.latestCompleted ||
        caseItem.latestBooking;


      if (!targetBooking) {

        return;
      }


      sessionStorage.setItem(
        "rafiqSelectedSpecialistBooking",
        targetBooking.id
      );


      if (
        targetBooking.status ===
        "cancelled"
      ) {

        window.location.href =
          "booking-details.html";

        return;
      }


      window.location.href =
        "consultation.html";
    }


    // =====================================
    // OPEN REPORT
    // =====================================

    function openCaseReport(
      caseItem
    ) {

      if (
        !caseItem.latestReport
      ) {

        return;
      }


      sessionStorage.setItem(
        "rafiqSelectedSpecialistBooking",
        caseItem.latestReport.bookingId
      );


      window.location.href =
        "report-form.html";
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


            renderCases();
          }
        );
      }
    );


    // =====================================
    // SEARCH
    // =====================================

    caseSearch.addEventListener(
      "input",
      () => {

        searchTerm =
          caseSearch.value
            .trim()
            .toLowerCase();


        renderCases();
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

    renderCases();

  }
);