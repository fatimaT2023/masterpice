document.addEventListener("DOMContentLoaded", () => {

  // =====================================================
  // ROLE GUARD
  // =====================================================

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


  // =====================================================
  // HELPERS
  // =====================================================

  function readArray(key) {

    try {

      const value =
        JSON.parse(
          localStorage.getItem(key)
        );


      return Array.isArray(value)
        ? value
        : [];

    } catch (error) {

      return [];
    }
  }


  function escapeHTML(value) {

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


  // =====================================================
  // ADMIN
  // =====================================================

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


  // =====================================================
  // ELEMENTS
  // =====================================================

  const approvalNavCount =
    document.getElementById(
      "approvalNavCount"
    );


  const totalMetric =
    document.getElementById(
      "totalMetric"
    );


  const confirmedMetric =
    document.getElementById(
      "confirmedMetric"
    );


  const completedMetric =
    document.getElementById(
      "completedMetric"
    );


  const cancelledMetric =
    document.getElementById(
      "cancelledMetric"
    );


  const bookingSearch =
    document.getElementById(
      "bookingSearch"
    );


  const statusFilter =
    document.getElementById(
      "statusFilter"
    );


  const typeFilter =
    document.getElementById(
      "typeFilter"
    );


  const clearFilters =
    document.getElementById(
      "clearFilters"
    );


  const resultCount =
    document.getElementById(
      "resultCount"
    );


  const bookingTableBody =
    document.getElementById(
      "bookingTableBody"
    );


  const mobileList =
    document.getElementById(
      "mobileList"
    );


  const emptyState =
    document.getElementById(
      "emptyState"
    );


  // MODAL

  const bookingModal =
    document.getElementById(
      "bookingModal"
    );


  const modalClose =
    document.getElementById(
      "modalClose"
    );


  const closeModalButton =
    document.getElementById(
      "closeModalButton"
    );


  const modalBookingId =
    document.getElementById(
      "modalBookingId"
    );


  const modalStatus =
    document.getElementById(
      "modalStatus"
    );


  const modalCreated =
    document.getElementById(
      "modalCreated"
    );


  const modalChild =
    document.getElementById(
      "modalChild"
    );


  const modalChildId =
    document.getElementById(
      "modalChildId"
    );


  const modalSpecialist =
    document.getElementById(
      "modalSpecialist"
    );


  const modalSpecialty =
    document.getElementById(
      "modalSpecialty"
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


  const modalFee =
    document.getElementById(
      "modalFee"
    );


  const openSpecialistButton =
    document.getElementById(
      "openSpecialistButton"
    );


  // =====================================================
  // DATA
  // =====================================================

  let bookings =
    readArray(
      "rafiqBookings"
    );


  let activeBooking =
    null;


  // =====================================================
  // STATUS
  // =====================================================

  function normalizeStatus(booking) {

    const status =
      String(
        booking.status ||
        "confirmed"
      ).toLowerCase();


    if (
      status === "completed"
    ) {

      return "completed";
    }


    if (
      status === "cancelled"
    ) {

      return "cancelled";
    }


    return "confirmed";
  }


  function statusLabel(status) {

    if (
      status === "completed"
    ) {

      return "Completed";
    }


    if (
      status === "cancelled"
    ) {

      return "Cancelled";
    }


    return "Confirmed";
  }


  // =====================================================
  // TYPE
  // =====================================================

  function normalizeType(value) {

    const type =
      String(
        value || ""
      )
        .trim()
        .toLowerCase();


    if (
      type === "online"
    ) {

      return "online";
    }


    if (
      type === "in-person" ||
      type === "inperson"
    ) {

      return "in-person";
    }


    return type;
  }


  function typeLabel(value) {

    return normalizeType(value) ===
      "online"
        ? "Online"
        : "In-person";
  }


  // =====================================================
  // DATE
  // =====================================================

  function formatDate(value) {

    if (!value) {

      return "Not recorded";
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return String(value);
    }


    return date.toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric"
      }
    );
  }


  function formatCreated(value) {

    if (!value) {

      return "Created date not recorded";
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return String(value);
    }


    return (
      "Created " +
      date.toLocaleDateString(
        undefined,
        {
          month: "short",
          day: "numeric",
          year: "numeric"
        }
      )
    );
  }


  // =====================================================
  // PRICE
  // =====================================================

  function formatPrice(value) {

    const amount =
      Number(value);


    if (
      !Number.isFinite(amount)
    ) {

      return "—";
    }


    return Number.isInteger(amount)
      ? `${amount} JOD`
      : `${amount.toFixed(2)} JOD`;
  }


  // =====================================================
  // APPROVAL BADGE
  // =====================================================

  function renderApprovalBadge() {

    const pending =
      readArray(
        "rafiqSpecialists"
      )
        .filter(
          specialist =>
            (
              specialist.status ||
              "pending"
            ) === "pending"
        );


    if (
      pending.length === 0
    ) {

      approvalNavCount.hidden =
        true;

      return;
    }


    approvalNavCount.hidden =
      false;


    approvalNavCount.textContent =
      pending.length > 9
        ? "9+"
        : pending.length;
  }


  // =====================================================
  // METRICS
  // =====================================================

  function renderMetrics() {

    totalMetric.textContent =
      bookings.length;


    confirmedMetric.textContent =
      bookings.filter(
        booking =>
          normalizeStatus(
            booking
          ) === "confirmed"
      ).length;


    completedMetric.textContent =
      bookings.filter(
        booking =>
          normalizeStatus(
            booking
          ) === "completed"
      ).length;


    cancelledMetric.textContent =
      bookings.filter(
        booking =>
          normalizeStatus(
            booking
          ) === "cancelled"
      ).length;
  }


  // =====================================================
  // FILTER
  // =====================================================

  function getFilteredBookings() {

    const search =
      bookingSearch.value
        .trim()
        .toLowerCase();


    const status =
      statusFilter.value;


    const type =
      typeFilter.value;


    return bookings
      .filter(booking => {

        const haystack =
          [
            booking.id,
            booking.childName,
            booking.childId,
            booking.specialistName,
            booking.specialistId,
            booking.specialty
          ]
            .join(" ")
            .toLowerCase();


        const matchesSearch =
          !search ||
          haystack.includes(
            search
          );


        const matchesStatus =
          status === "all" ||
          normalizeStatus(
            booking
          ) === status;


        const matchesType =
          type === "all" ||
          normalizeType(
            booking.consultationType
          ) === type;


        return (
          matchesSearch &&
          matchesStatus &&
          matchesType
        );
      })
      .sort(
        (a, b) => {

          const first =
            new Date(
              b.createdAt ||
              b.date ||
              0
            );


          const second =
            new Date(
              a.createdAt ||
              a.date ||
              0
            );


          return first - second;
        }
      );
  }


  // =====================================================
  // RENDER
  // =====================================================

  function renderBookings() {

    const filtered =
      getFilteredBookings();


    bookingTableBody.innerHTML =
      "";


    mobileList.innerHTML =
      "";


    resultCount.textContent =
      `${filtered.length} ${
        filtered.length === 1
          ? "booking"
          : "bookings"
      }`;


    emptyState.hidden =
      filtered.length !== 0;


    filtered.forEach(
      booking => {

        renderDesktopRow(
          booking
        );


        renderMobileCard(
          booking
        );
      }
    );
  }


  // =====================================================
  // DESKTOP
  // =====================================================

  function renderDesktopRow(
    booking
  ) {

    const row =
      document.createElement(
        "tr"
      );


    const status =
      normalizeStatus(
        booking
      );


    row.innerHTML = `
      <td>
        <span class="booking-id">
          ${escapeHTML(
            booking.id ||
            "No ID"
          )}
        </span>
      </td>


      <td>

        <div class="person-cell">

          <strong>
            ${escapeHTML(
              booking.childName ||
              "Child"
            )}
          </strong>

          <span>
            ${escapeHTML(
              booking.childId ||
              "No child ID"
            )}
          </span>

        </div>

      </td>


      <td>

        <div class="person-cell">

          <strong>
            ${escapeHTML(
              booking.specialistName ||
              "Specialist"
            )}
          </strong>

          <span>
            ${escapeHTML(
              booking.specialty ||
              "Specialty unavailable"
            )}
          </span>

        </div>

      </td>


      <td>

        <div class="person-cell">

          <strong>
            ${escapeHTML(
              booking.dateLabel ||
              booking.date ||
              "No date"
            )}
          </strong>

          <span>
            ${escapeHTML(
              booking.time ||
              "No time"
            )}
          </span>

        </div>

      </td>


      <td>

        <span class="type-badge">
          ${escapeHTML(
            typeLabel(
              booking.consultationType
            )
          )}
        </span>

      </td>


      <td>
        ${escapeHTML(
          formatPrice(
            booking.price
          )
        )}
      </td>


      <td>

        <span
          class="status-badge ${status}"
        >
          ${escapeHTML(
            statusLabel(
              status
            )
          )}
        </span>

      </td>


      <td>

        <button
          type="button"
          class="view-button"
        >
          View
        </button>

      </td>
    `;


    row
      .querySelector(
        ".view-button"
      )
      .addEventListener(
        "click",
        () => {

          openBookingModal(
            booking
          );
        }
      );


    bookingTableBody
      .appendChild(
        row
      );
  }


  // =====================================================
  // MOBILE
  // =====================================================

  function renderMobileCard(
    booking
  ) {

    const card =
      document.createElement(
        "article"
      );


    card.className =
      "mobile-card";


    const status =
      normalizeStatus(
        booking
      );


    card.innerHTML = `
      <div class="mobile-card-top">

        <h3>
          ${escapeHTML(
            booking.id ||
            "Booking"
          )}
        </h3>

        <span
          class="status-badge ${status}"
        >
          ${escapeHTML(
            statusLabel(
              status
            )
          )}
        </span>

      </div>


      <p>
        ${escapeHTML(
          booking.childName ||
          "Child"
        )}
        with
        ${escapeHTML(
          booking.specialistName ||
          "Specialist"
        )}
      </p>


      <div class="mobile-meta">

        <span class="type-badge">
          ${escapeHTML(
            typeLabel(
              booking.consultationType
            )
          )}
        </span>

        <span class="category-pill">
          ${escapeHTML(
            booking.dateLabel ||
            booking.date ||
            "No date"
          )}
        </span>

        <span class="category-pill">
          ${escapeHTML(
            booking.time ||
            "No time"
          )}
        </span>

      </div>


      <button
        type="button"
        class="view-button"
      >
        View Booking
      </button>
    `;


    card
      .querySelector(
        ".view-button"
      )
      .addEventListener(
        "click",
        () => {

          openBookingModal(
            booking
          );
        }
      );


    mobileList.appendChild(
      card
    );
  }


  // =====================================================
  // BOOKING MODAL
  // =====================================================

  function openBookingModal(
    booking
  ) {

    activeBooking =
      booking;


    const status =
      normalizeStatus(
        booking
      );


    modalBookingId.textContent =
      booking.id ||
      "Booking";


    modalStatus.className =
      `status-badge ${status}`;


    modalStatus.textContent =
      statusLabel(
        status
      );


    modalCreated.textContent =
      formatCreated(
        booking.createdAt
      );


    modalChild.textContent =
      booking.childName ||
      "Child";


    modalChildId.textContent =
      booking.childId ||
      "Child ID unavailable";


    modalSpecialist.textContent =
      booking.specialistName ||
      "Specialist";


    modalSpecialty.textContent =
      booking.specialty ||
      "Specialty unavailable";


    modalDate.textContent =
      booking.dateLabel ||
      formatDate(
        booking.date
      );


    modalTime.textContent =
      booking.time ||
      "Time unavailable";


    modalType.textContent =
      typeLabel(
        booking.consultationType
      );


    modalFee.textContent =
      formatPrice(
        booking.price
      );


    bookingModal.hidden =
      false;


    document.body.style.overflow =
      "hidden";
  }


  function closeBookingModal() {

    bookingModal.hidden =
      true;


    document.body.style.overflow =
      "";


    activeBooking =
      null;
  }


  modalClose.addEventListener(
    "click",
    closeBookingModal
  );


  closeModalButton.addEventListener(
    "click",
    closeBookingModal
  );


  bookingModal.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        bookingModal
      ) {

        closeBookingModal();
      }
    }
  );


  // =====================================================
  // OPEN SPECIALIST
  // =====================================================

  openSpecialistButton.addEventListener(
    "click",
    () => {

      if (
        !activeBooking?.specialistId
      ) {

        return;
      }


      sessionStorage.setItem(
        "rafiqAdminSelectedSpecialistId",
        activeBooking.specialistId
      );


      window.location.href =
        "specialists-management.html";
    }
  );


  // =====================================================
  // FILTER EVENTS
  // =====================================================

  bookingSearch.addEventListener(
    "input",
    renderBookings
  );


  statusFilter.addEventListener(
    "change",
    renderBookings
  );


  typeFilter.addEventListener(
    "change",
    renderBookings
  );


  clearFilters.addEventListener(
    "click",
    () => {

      bookingSearch.value =
        "";


      statusFilter.value =
        "all";


      typeFilter.value =
        "all";


      renderBookings();
    }
  );


  // =====================================================
  // SIDEBAR
  // =====================================================

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


  // =====================================================
  // ESCAPE
  // =====================================================

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key !==
        "Escape"
      ) {

        return;
      }


      if (
        !bookingModal.hidden
      ) {

        closeBookingModal();

        return;
      }


      closeSidebar();
    }
  );


  // =====================================================
  // LOGOUT
  // =====================================================

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


  // =====================================================
  // INIT
  // =====================================================

  renderApprovalBadge();

  renderMetrics();

  renderBookings();

});