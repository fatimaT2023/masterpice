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


    const earningsView =
      document.getElementById(
        "earningsView"
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


    // HERO

    const heroTotal =
      document.getElementById(
        "heroTotal"
      );


    const heroSessions =
      document.getElementById(
        "heroSessions"
      );


    // SUMMARY

    const totalEarnings =
      document.getElementById(
        "totalEarnings"
      );


    const monthEarnings =
      document.getElementById(
        "monthEarnings"
      );


    const completedSessions =
      document.getElementById(
        "completedSessions"
      );


    const averageSession =
      document.getElementById(
        "averageSession"
      );


    // RECENT

    const recentEarningsList =
      document.getElementById(
        "recentEarningsList"
      );


    const recentEmpty =
      document.getElementById(
        "recentEmpty"
      );


    const viewHistoryButton =
      document.getElementById(
        "viewHistoryButton"
      );


    // BREAKDOWN

    const onlineSessions =
      document.getElementById(
        "onlineSessions"
      );


    const onlineEarnings =
      document.getElementById(
        "onlineEarnings"
      );


    const inPersonSessions =
      document.getElementById(
        "inPersonSessions"
      );


    const inPersonEarnings =
      document.getElementById(
        "inPersonEarnings"
      );


    const breakdownTotal =
      document.getElementById(
        "breakdownTotal"
      );


    // TABS

    const tabButtons =
      document.querySelectorAll(
        ".tab-button"
      );


    const overviewPanel =
      document.getElementById(
        "overviewPanel"
      );


    const historyPanel =
      document.getElementById(
        "historyPanel"
      );


    // HISTORY

    const historySearch =
      document.getElementById(
        "historySearch"
      );


    const paymentTableBody =
      document.getElementById(
        "paymentTableBody"
      );


    const paymentMobileList =
      document.getElementById(
        "paymentMobileList"
      );


    const historyEmpty =
      document.getElementById(
        "historyEmpty"
      );


    const historyEmptyTitle =
      document.getElementById(
        "historyEmptyTitle"
      );


    const historyEmptyText =
      document.getElementById(
        "historyEmptyText"
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


      earningsView.hidden =
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


    earningsView.hidden =
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


    const bookings =
      readArray(
        "rafiqBookings"
      );


    // =====================================
    // COMPLETED BOOKINGS
    // =====================================

    /*
      Important:

      Earnings only use EXPLICITLY completed
      bookings.

      A booking does not become an earning
      just because its date has passed.

      consultation.js explicitly sets:
      booking.status = "completed"
    */

    const completedBookings =
      bookings
        .filter(
          booking =>
            booking.specialistId ===
              specialist.id &&
            booking.status ===
              "completed"
        )
        .sort(
          (a,b) =>
            getCompletionDate(b) -
            getCompletionDate(a)
        );


    // =====================================
    // PRICE
    // =====================================

    function getBookingPrice(
      booking
    ) {

      const value =
        Number(
          booking.price
        );


      if (
        Number.isFinite(
          value
        )
      ) {

        return value;
      }


      const specialistPrice =
        Number(
          specialist.price
        );


      return Number.isFinite(
        specialistPrice
      )
        ? specialistPrice
        : 0;
    }


    function formatMoney(
      value
    ) {

      return (
        Number(
          value || 0
        ).toFixed(2) +
        " JOD"
      );
    }


    // =====================================
    // DATE
    // =====================================

    function getCompletionDate(
      booking
    ) {

      if (
        booking.completedAt
      ) {

        const completed =
          new Date(
            booking.completedAt
          );


        if (
          !Number.isNaN(
            completed.getTime()
          )
        ) {

          return completed;
        }
      }


      if (
        booking.date
      ) {

        return new Date(
          booking.date +
          "T00:00:00"
        );
      }


      return new Date(0);
    }


    function formatDate(
      booking
    ) {

      return getCompletionDate(
        booking
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


    function isCurrentMonth(
      booking
    ) {

      const date =
        getCompletionDate(
          booking
        );


      const today =
        new Date();


      return (
        date.getFullYear() ===
          today.getFullYear() &&

        date.getMonth() ===
          today.getMonth()
      );
    }


    // =====================================
    // TOTALS
    // =====================================

    const total =
      completedBookings.reduce(
        (
          sum,
          booking
        ) =>
          sum +
          getBookingPrice(
            booking
          ),
        0
      );


    const monthTotal =
      completedBookings
        .filter(
          isCurrentMonth
        )
        .reduce(
          (
            sum,
            booking
          ) =>
            sum +
            getBookingPrice(
              booking
            ),
          0
        );


    const average =
      completedBookings.length
        ? total /
          completedBookings.length
        : 0;


    // =====================================
    // RENDER SUMMARY
    // =====================================

    function renderSummary() {

      heroTotal.textContent =
        formatMoney(
          total
        );


      heroSessions.textContent =
        `${completedBookings.length} ${
          completedBookings.length === 1
            ? "completed session"
            : "completed sessions"
        }`;


      totalEarnings.textContent =
        formatMoney(
          total
        );


      monthEarnings.textContent =
        formatMoney(
          monthTotal
        );


      completedSessions.textContent =
        completedBookings.length;


      averageSession.textContent =
        formatMoney(
          average
        );
    }


    // =====================================
    // BREAKDOWN
    // =====================================

    function renderBreakdown() {

      const online =
        completedBookings.filter(
          booking =>
            booking.consultationType ===
            "online"
        );


      const inPerson =
        completedBookings.filter(
          booking =>
            booking.consultationType !==
            "online"
        );


      const onlineTotal =
        online.reduce(
          (
            sum,
            booking
          ) =>
            sum +
            getBookingPrice(
              booking
            ),
          0
        );


      const inPersonTotal =
        inPerson.reduce(
          (
            sum,
            booking
          ) =>
            sum +
            getBookingPrice(
              booking
            ),
          0
        );


      onlineSessions.textContent =
        `${online.length} ${
          online.length === 1
            ? "session"
            : "sessions"
        }`;


      onlineEarnings.textContent =
        formatMoney(
          onlineTotal
        );


      inPersonSessions.textContent =
        `${inPerson.length} ${
          inPerson.length === 1
            ? "session"
            : "sessions"
        }`;


      inPersonEarnings.textContent =
        formatMoney(
          inPersonTotal
        );


      breakdownTotal.textContent =
        formatMoney(
          total
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
    // RECENT EARNINGS
    // =====================================

    function renderRecent() {

      recentEarningsList.innerHTML =
        "";


      const recent =
        completedBookings.slice(
          0,
          5
        );


      recentEmpty.hidden =
        recent.length !== 0;


      if (
        recent.length === 0
      ) {

        return;
      }


      recent.forEach(
        booking => {

          const item =
            document.createElement(
              "div"
            );


          item.className =
            "recent-item";


          const child =
            booking.childName ||
            "Child";


          const type =
            booking.consultationType ===
            "online"
              ? "Online"
              : "In-person";


          item.innerHTML = `
            <div class="recent-icon">
              ${escapeHTML(
                child
                  .charAt(0)
                  .toUpperCase()
              )}
            </div>


            <div class="recent-info">

              <strong>
                ${escapeHTML(
                  child
                )}
              </strong>

              <span>
                ${escapeHTML(
                  type
                )}
                consultation •
                ${escapeHTML(
                  booking.id
                )}
              </span>

            </div>


            <div class="recent-amount">

              <strong>
                ${escapeHTML(
                  formatMoney(
                    getBookingPrice(
                      booking
                    )
                  )
                )}
              </strong>

              <span>
                ${escapeHTML(
                  formatDate(
                    booking
                  )
                )}
              </span>

            </div>
          `;


          recentEarningsList.appendChild(
            item
          );
        }
      );

    }


    // =====================================
    // HISTORY
    // =====================================

    let historySearchTerm =
      "";


    function getFilteredHistory() {

      if (
        !historySearchTerm
      ) {

        return completedBookings;
      }


      return completedBookings.filter(
        booking => {

          const child =
            String(
              booking.childName ||
              ""
            ).toLowerCase();


          const id =
            String(
              booking.id ||
              ""
            ).toLowerCase();


          const type =
            String(
              booking.consultationType ||
              ""
            ).toLowerCase();


          return (
            child.includes(
              historySearchTerm
            ) ||
            id.includes(
              historySearchTerm
            ) ||
            type.includes(
              historySearchTerm
            )
          );
        }
      );
    }


    function renderHistory() {

      const history =
        getFilteredHistory();


      paymentTableBody.innerHTML =
        "";


      paymentMobileList.innerHTML =
        "";


      if (
        history.length === 0
      ) {

        historyEmpty.hidden =
          false;


        if (
          historySearchTerm
        ) {

          historyEmptyTitle.textContent =
            "No matching transactions";


          historyEmptyText.textContent =
            "Try searching with another child name or booking reference.";

        } else {

          historyEmptyTitle.textContent =
            "No payment history yet";


          historyEmptyText.textContent =
            "Completed session earnings will appear here.";
        }


        return;
      }


      historyEmpty.hidden =
        true;


      history.forEach(
        booking => {

          renderDesktopRow(
            booking
          );


          renderMobilePayment(
            booking
          );
        }
      );

    }


    // =====================================
    // DESKTOP ROW
    // =====================================

    function renderDesktopRow(
      booking
    ) {

      const row =
        document.createElement(
          "tr"
        );


      const child =
        booking.childName ||
        "Child";


      const type =
        booking.consultationType ===
        "online"
          ? "Online"
          : "In-person";


      row.innerHTML = `
        <td>
          ${escapeHTML(
            formatDate(
              booking
            )
          )}
        </td>


        <td>

          <div class="table-client">

            <strong>
              ${escapeHTML(
                child
              )}
            </strong>

            <span>
              Consultation
            </span>

          </div>

        </td>


        <td>
          ${escapeHTML(
            booking.id
          )}
        </td>


        <td>
          ${escapeHTML(
            type
          )}
        </td>


        <td>

          <span class="payment-status">
            Recorded
          </span>

        </td>


        <td class="payment-amount">
          ${escapeHTML(
            formatMoney(
              getBookingPrice(
                booking
              )
            )
          )}
        </td>
      `;


      paymentTableBody.appendChild(
        row
      );

    }


    // =====================================
    // MOBILE PAYMENT
    // =====================================

    function renderMobilePayment(
      booking
    ) {

      const card =
        document.createElement(
          "article"
        );


      card.className =
        "payment-mobile-card";


      const type =
        booking.consultationType ===
        "online"
          ? "Online"
          : "In-person";


      card.innerHTML = `
        <div class="payment-mobile-top">

          <h3>
            ${escapeHTML(
              booking.childName ||
              "Child"
            )}
          </h3>

          <strong>
            ${escapeHTML(
              formatMoney(
                getBookingPrice(
                  booking
                )
              )
            )}
          </strong>

        </div>


        <div class="payment-mobile-meta">

          <div>

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


          <div>

            <span>
              Booking
            </span>

            <strong>
              ${escapeHTML(
                booking.id
              )}
            </strong>

          </div>


          <div>

            <span>
              Type
            </span>

            <strong>
              ${escapeHTML(
                type
              )}
            </strong>

          </div>


          <div>

            <span>
              Status
            </span>

            <strong>
              Recorded
            </strong>

          </div>

        </div>
      `;


      paymentMobileList.appendChild(
        card
      );

    }


    // =====================================
    // HISTORY SEARCH
    // =====================================

    historySearch.addEventListener(
      "input",
      () => {

        historySearchTerm =
          historySearch.value
            .trim()
            .toLowerCase();


        renderHistory();
      }
    );


    // =====================================
    // TABS
    // =====================================

    function openTab(
      tabName
    ) {

      tabButtons.forEach(
        button => {

          button.classList.toggle(
            "active",
            button.dataset.tab ===
              tabName
          );
        }
      );


      overviewPanel.hidden =
        tabName !==
        "overview";


      historyPanel.hidden =
        tabName !==
        "history";
    }


    tabButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            openTab(
              button.dataset.tab
            );
          }
        );
      }
    );


    viewHistoryButton.addEventListener(
      "click",
      () => {

        openTab(
          "history"
        );


        historyPanel.scrollIntoView({
          behavior:
            "smooth",

          block:
            "start"
        });
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

    renderBreakdown();

    renderRecent();

    renderHistory();

  }
);