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
  // STORAGE HELPERS
  // =====================================================

  function readJSON(key) {

    try {

      return JSON.parse(
        localStorage.getItem(key)
      );

    } catch (error) {

      return null;
    }
  }


  function readArray(key) {

    const value =
      readJSON(key);


    return Array.isArray(value)
      ? value
      : [];
  }


  function escapeHTML(value) {

    const div =
      document.createElement(
        "div"
      );


    div.textContent =
      String(value ?? "");


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


  const activeSubscriptionsMetric =
    document.getElementById(
      "activeSubscriptionsMetric"
    );


  const totalSubscriptionsMetric =
    document.getElementById(
      "totalSubscriptionsMetric"
    );


  const totalPaymentsMetric =
    document.getElementById(
      "totalPaymentsMetric"
    );


  const revenueMetric =
    document.getElementById(
      "revenueMetric"
    );


  const tabs =
    document.querySelectorAll(
      ".tab"
    );


  const tabViews = {

    overview:
      document.getElementById(
        "overviewView"
      ),

    subscriptions:
      document.getElementById(
        "subscriptionsView"
      ),

    payments:
      document.getElementById(
        "paymentsView"
      )
  };


  // OVERVIEW

  const overviewActive =
    document.getElementById(
      "overviewActive"
    );


  const overviewCancelled =
    document.getElementById(
      "overviewCancelled"
    );


  const overviewOther =
    document.getElementById(
      "overviewOther"
    );


  const overviewSuccessful =
    document.getElementById(
      "overviewSuccessful"
    );


  const overviewFailed =
    document.getElementById(
      "overviewFailed"
    );


  const overviewPending =
    document.getElementById(
      "overviewPending"
    );


  const recentPaymentsList =
    document.getElementById(
      "recentPaymentsList"
    );


  const recentPaymentsEmpty =
    document.getElementById(
      "recentPaymentsEmpty"
    );


  const openPaymentsTab =
    document.getElementById(
      "openPaymentsTab"
    );


  // SUBSCRIPTIONS

  const subscriptionSearch =
    document.getElementById(
      "subscriptionSearch"
    );


  const subscriptionStatusFilter =
    document.getElementById(
      "subscriptionStatusFilter"
    );


  const clearSubscriptionFilters =
    document.getElementById(
      "clearSubscriptionFilters"
    );


  const subscriptionResultCount =
    document.getElementById(
      "subscriptionResultCount"
    );


  const subscriptionTableBody =
    document.getElementById(
      "subscriptionTableBody"
    );


  const subscriptionMobileList =
    document.getElementById(
      "subscriptionMobileList"
    );


  const subscriptionEmpty =
    document.getElementById(
      "subscriptionEmpty"
    );


  // PAYMENTS

  const paymentSearch =
    document.getElementById(
      "paymentSearch"
    );


  const paymentStatusFilter =
    document.getElementById(
      "paymentStatusFilter"
    );


  const clearPaymentFilters =
    document.getElementById(
      "clearPaymentFilters"
    );


  const paymentResultCount =
    document.getElementById(
      "paymentResultCount"
    );


  const paymentTableBody =
    document.getElementById(
      "paymentTableBody"
    );


  const paymentMobileList =
    document.getElementById(
      "paymentMobileList"
    );


  const paymentEmpty =
    document.getElementById(
      "paymentEmpty"
    );


  // MODAL

  const detailsModal =
    document.getElementById(
      "detailsModal"
    );


  const modalKicker =
    document.getElementById(
      "modalKicker"
    );


  const modalTitle =
    document.getElementById(
      "modalTitle"
    );


  const detailsGrid =
    document.getElementById(
      "detailsGrid"
    );


  const modalClose =
    document.getElementById(
      "modalClose"
    );


  const closeDetailsButton =
    document.getElementById(
      "closeDetailsButton"
    );


  // =====================================================
  // NORMALIZE SUBSCRIPTIONS
  // =====================================================

  function loadSubscriptions() {

    const records = [];


    /*
      Support more than one prototype storage shape
      because Parent subscription implementation may
      store either a collection or a current object.
    */

    [
      "rafiqSubscriptions",
      "rafiqSubscriptionHistory"
    ].forEach(key => {

      readArray(key)
        .forEach(item => {

          records.push(item);
        });
    });


    [
      "rafiqSubscription",
      "rafiqCurrentSubscription"
    ].forEach(key => {

      const value =
        readJSON(key);


      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {

        records.push(value);
      }
    });


    const map =
      new Map();


    records.forEach(
      (item, index) => {

        const normalized =
          normalizeSubscription(
            item,
            index
          );


        const key =
          normalized.id;


        if (
          !map.has(key)
        ) {

          map.set(
            key,
            normalized
          );
        }

      }
    );


    return Array.from(
      map.values()
    );
  }


  function normalizeSubscription(
    item,
    index
  ) {

    const id =
      item.id ||
      item.subscriptionId ||
      item.reference ||
      `SUB-${index + 1}`;


    return {

      ...item,

      id,

      parentName:
        item.parentName ||
        item.userName ||
        item.name ||
        item.customerName ||
        "Parent",


      parentEmail:
        item.parentEmail ||
        item.email ||
        item.customerEmail ||
        "",


      planName:
        item.planName ||
        item.plan ||
        item.subscriptionPlan ||
        item.tier ||
        "RAFIQ Plan",


      amount:
        numberOrZero(
          item.amount ??
          item.price ??
          item.planPrice
        ),


      currency:
        item.currency ||
        "JOD",


      status:
        normalizeSubscriptionStatus(
          item.status ||
          item.subscriptionStatus
        ),


      startedAt:
        item.startedAt ||
        item.startDate ||
        item.createdAt ||
        item.subscribedAt ||
        null,


      expiresAt:
        item.expiresAt ||
        item.expiryDate ||
        item.endDate ||
        null
    };
  }


  function normalizeSubscriptionStatus(
    value
  ) {

    const status =
      String(
        value ||
        "active"
      )
        .trim()
        .toLowerCase();


    if (
      [
        "active",
        "cancelled",
        "expired",
        "pending"
      ].includes(status)
    ) {

      return status;
    }


    if (
      status === "canceled"
    ) {

      return "cancelled";
    }


    return "active";
  }


  // =====================================================
  // NORMALIZE PAYMENTS
  // =====================================================

  function loadPayments() {

    const records = [];


    [
      "rafiqPayments",
      "rafiqPaymentHistory",
      "rafiqTransactions"
    ].forEach(key => {

      readArray(key)
        .forEach(item => {

          records.push(item);
        });
    });


    [
      "rafiqLastPayment",
      "rafiqPayment"
    ].forEach(key => {

      const value =
        readJSON(key);


      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {

        records.push(value);
      }
    });


    const map =
      new Map();


    records.forEach(
      (item, index) => {

        const normalized =
          normalizePayment(
            item,
            index
          );


        if (
          !map.has(
            normalized.id
          )
        ) {

          map.set(
            normalized.id,
            normalized
          );
        }

      }
    );


    return Array.from(
      map.values()
    );
  }


  function normalizePayment(
    item,
    index
  ) {

    const id =
      item.id ||
      item.paymentId ||
      item.transactionId ||
      item.reference ||
      `PAY-${index + 1}`;


    return {

      ...item,

      id,

      parentName:
        item.parentName ||
        item.userName ||
        item.name ||
        item.customerName ||
        "Parent",


      parentEmail:
        item.parentEmail ||
        item.email ||
        item.customerEmail ||
        "",


      description:
        item.description ||
        item.planName ||
        item.plan ||
        item.type ||
        "Subscription payment",


      amount:
        numberOrZero(
          item.amount ??
          item.price ??
          item.total
        ),


      currency:
        item.currency ||
        "JOD",


      status:
        normalizePaymentStatus(
          item.status ||
          item.paymentStatus
        ),


      createdAt:
        item.createdAt ||
        item.paidAt ||
        item.paymentDate ||
        item.date ||
        null,


      method:
        item.method ||
        item.paymentMethod ||
        "Demo payment"
    };
  }


  function normalizePaymentStatus(
    value
  ) {

    const status =
      String(
        value ||
        "successful"
      )
        .trim()
        .toLowerCase();


    if (
      [
        "successful",
        "pending",
        "failed"
      ].includes(status)
    ) {

      return status;
    }


    if (
      [
        "paid",
        "completed",
        "success"
      ].includes(status)
    ) {

      return "successful";
    }


    return "pending";
  }


  function numberOrZero(
    value
  ) {

    const number =
      Number(value);


    return Number.isFinite(
      number
    )
      ? number
      : 0;
  }


  // =====================================================
  // DATA
  // =====================================================

  let subscriptions =
    loadSubscriptions();


  let payments =
    loadPayments();


  // =====================================================
  // FORMATTERS
  // =====================================================

  function formatMoney(
    amount,
    currency = "JOD"
  ) {

    const number =
      Number(amount);


    if (
      !Number.isFinite(number)
    ) {

      return "—";
    }


    return (
      Number.isInteger(number)
        ? `${number} ${currency}`
        : `${number.toFixed(2)} ${currency}`
    );
  }


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


  function capitalize(value) {

    const text =
      String(value || "");


    return (
      text.charAt(0)
        .toUpperCase() +
      text.slice(1)
    );
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

    const active =
      subscriptions.filter(
        item =>
          item.status ===
          "active"
      );


    const successfulPayments =
      payments.filter(
        item =>
          item.status ===
          "successful"
      );


    const revenue =
      successfulPayments.reduce(
        (sum, item) =>
          sum +
          numberOrZero(
            item.amount
          ),
        0
      );


    activeSubscriptionsMetric.textContent =
      active.length;


    totalSubscriptionsMetric.textContent =
      subscriptions.length;


    totalPaymentsMetric.textContent =
      payments.length;


    revenueMetric.textContent =
      Number.isInteger(revenue)
        ? `${revenue}`
        : revenue.toFixed(2);


    overviewActive.textContent =
      active.length;


    overviewCancelled.textContent =
      subscriptions.filter(
        item =>
          item.status ===
          "cancelled"
      ).length;


    overviewOther.textContent =
      subscriptions.filter(
        item =>
          ![
            "active",
            "cancelled"
          ].includes(
            item.status
          )
      ).length;


    overviewSuccessful.textContent =
      successfulPayments.length;


    overviewFailed.textContent =
      payments.filter(
        item =>
          item.status ===
          "failed"
      ).length;


    overviewPending.textContent =
      payments.filter(
        item =>
          item.status ===
          "pending"
      ).length;
  }


  // =====================================================
  // TABS
  // =====================================================

  function selectTab(
    tabName
  ) {

    tabs.forEach(tab => {

      tab.classList.toggle(
        "active",
        tab.dataset.tab ===
          tabName
      );
    });


    Object
      .entries(
        tabViews
      )
      .forEach(
        ([name, view]) => {

          view.classList.toggle(
            "active",
            name ===
              tabName
          );
        }
      );


    if (
      tabName ===
      "subscriptions"
    ) {

      renderSubscriptions();
    }


    if (
      tabName ===
      "payments"
    ) {

      renderPayments();
    }
  }


  tabs.forEach(tab => {

    tab.addEventListener(
      "click",
      () => {

        selectTab(
          tab.dataset.tab
        );
      }
    );
  });


  openPaymentsTab.addEventListener(
    "click",
    () => {

      selectTab(
        "payments"
      );
    }
  );


  // =====================================================
  // RECENT PAYMENTS
  // =====================================================

  function renderRecentPayments() {

    recentPaymentsList.innerHTML =
      "";


    const recent =
      payments
        .slice()
        .sort(
          (a, b) =>
            new Date(
              b.createdAt ||
              0
            ) -
            new Date(
              a.createdAt ||
              0
            )
        )
        .slice(
          0,
          5
        );


    recentPaymentsEmpty.hidden =
      recent.length !== 0;


    recent.forEach(payment => {

      const row =
        document.createElement(
          "div"
        );


      row.className =
        "recent-row";


      row.innerHTML = `
        <div>

          <strong>
            ${escapeHTML(
              payment.description
            )}
          </strong>

          <span>
            ${escapeHTML(
              payment.parentName
            )}
            •
            ${escapeHTML(
              formatDate(
                payment.createdAt
              )
            )}
          </span>

        </div>

        <strong>
          ${escapeHTML(
            formatMoney(
              payment.amount,
              payment.currency
            )
          )}
        </strong>

        <span
          class="status-badge ${escapeHTML(
            payment.status
          )}"
        >
          ${escapeHTML(
            capitalize(
              payment.status
            )
          )}
        </span>
      `;


      recentPaymentsList
        .appendChild(
          row
        );
    });
  }


  // =====================================================
  // SUBSCRIPTIONS FILTER
  // =====================================================

  function getFilteredSubscriptions() {

    const search =
      subscriptionSearch.value
        .trim()
        .toLowerCase();


    const status =
      subscriptionStatusFilter.value;


    return subscriptions
      .filter(item => {

        const haystack =
          [
            item.id,
            item.parentName,
            item.parentEmail,
            item.planName
          ]
            .join(" ")
            .toLowerCase();


        return (
          (
            !search ||
            haystack.includes(
              search
            )
          ) &&
          (
            status === "all" ||
            item.status ===
              status
          )
        );
      })
      .sort(
        (a, b) =>
          new Date(
            b.startedAt ||
            0
          ) -
          new Date(
            a.startedAt ||
            0
          )
      );
  }


  function renderSubscriptions() {

    const filtered =
      getFilteredSubscriptions();


    subscriptionTableBody.innerHTML =
      "";


    subscriptionMobileList.innerHTML =
      "";


    subscriptionResultCount.textContent =
      `${filtered.length} ${
        filtered.length === 1
          ? "subscription"
          : "subscriptions"
      }`;


    subscriptionEmpty.hidden =
      filtered.length !== 0;


    filtered.forEach(item => {

      renderSubscriptionRow(
        item
      );


      renderSubscriptionMobile(
        item
      );
    });
  }


  function renderSubscriptionRow(item) {

    const row =
      document.createElement(
        "tr"
      );


    row.innerHTML = `
      <td>
        <span class="record-id">
          ${escapeHTML(
            item.id
          )}
        </span>
      </td>

      <td>
        <div class="main-cell">
          <strong>
            ${escapeHTML(
              item.parentName
            )}
          </strong>
          <span>
            ${escapeHTML(
              item.parentEmail ||
              "Email not recorded"
            )}
          </span>
        </div>
      </td>

      <td>
        ${escapeHTML(
          item.planName
        )}
      </td>

      <td>
        ${escapeHTML(
          formatMoney(
            item.amount,
            item.currency
          )
        )}
      </td>

      <td>
        ${escapeHTML(
          formatDate(
            item.startedAt
          )
        )}
      </td>

      <td>
        <span
          class="status-badge ${escapeHTML(
            item.status
          )}"
        >
          ${escapeHTML(
            capitalize(
              item.status
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

          openSubscriptionDetails(
            item
          );
        }
      );


    subscriptionTableBody
      .appendChild(
        row
      );
  }


  function renderSubscriptionMobile(item) {

    const card =
      document.createElement(
        "article"
      );


    card.className =
      "mobile-card";


    card.innerHTML = `
      <div class="mobile-card-top">

        <h3>
          ${escapeHTML(
            item.planName
          )}
        </h3>

        <span
          class="status-badge ${escapeHTML(
            item.status
          )}"
        >
          ${escapeHTML(
            capitalize(
              item.status
            )
          )}
        </span>

      </div>

      <p>
        ${escapeHTML(
          item.parentName
        )}
        •
        ${escapeHTML(
          formatMoney(
            item.amount,
            item.currency
          )
        )}
      </p>

      <button
        type="button"
        class="view-button"
      >
        View Subscription
      </button>
    `;


    card
      .querySelector(
        ".view-button"
      )
      .addEventListener(
        "click",
        () => {

          openSubscriptionDetails(
            item
          );
        }
      );


    subscriptionMobileList
      .appendChild(
        card
      );
  }


  // =====================================================
  // PAYMENTS FILTER
  // =====================================================

  function getFilteredPayments() {

    const search =
      paymentSearch.value
        .trim()
        .toLowerCase();


    const status =
      paymentStatusFilter.value;


    return payments
      .filter(item => {

        const haystack =
          [
            item.id,
            item.parentName,
            item.parentEmail,
            item.description,
            item.method
          ]
            .join(" ")
            .toLowerCase();


        return (
          (
            !search ||
            haystack.includes(
              search
            )
          ) &&
          (
            status === "all" ||
            item.status ===
              status
          )
        );
      })
      .sort(
        (a, b) =>
          new Date(
            b.createdAt ||
            0
          ) -
          new Date(
            a.createdAt ||
            0
          )
      );
  }


  function renderPayments() {

    const filtered =
      getFilteredPayments();


    paymentTableBody.innerHTML =
      "";


    paymentMobileList.innerHTML =
      "";


    paymentResultCount.textContent =
      `${filtered.length} ${
        filtered.length === 1
          ? "payment"
          : "payments"
      }`;


    paymentEmpty.hidden =
      filtered.length !== 0;


    filtered.forEach(item => {

      renderPaymentRow(
        item
      );


      renderPaymentMobile(
        item
      );
    });
  }


  function renderPaymentRow(item) {

    const row =
      document.createElement(
        "tr"
      );


    row.innerHTML = `
      <td>
        <span class="record-id">
          ${escapeHTML(
            item.id
          )}
        </span>
      </td>

      <td>
        <div class="main-cell">
          <strong>
            ${escapeHTML(
              item.parentName
            )}
          </strong>
          <span>
            ${escapeHTML(
              item.parentEmail ||
              "Email not recorded"
            )}
          </span>
        </div>
      </td>

      <td>
        ${escapeHTML(
          item.description
        )}
      </td>

      <td>
        ${escapeHTML(
          formatMoney(
            item.amount,
            item.currency
          )
        )}
      </td>

      <td>
        ${escapeHTML(
          formatDate(
            item.createdAt
          )
        )}
      </td>

      <td>
        <span
          class="status-badge ${escapeHTML(
            item.status
          )}"
        >
          ${escapeHTML(
            capitalize(
              item.status
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

          openPaymentDetails(
            item
          );
        }
      );


    paymentTableBody
      .appendChild(
        row
      );
  }


  function renderPaymentMobile(item) {

    const card =
      document.createElement(
        "article"
      );


    card.className =
      "mobile-card";


    card.innerHTML = `
      <div class="mobile-card-top">

        <h3>
          ${escapeHTML(
            item.description
          )}
        </h3>

        <span
          class="status-badge ${escapeHTML(
            item.status
          )}"
        >
          ${escapeHTML(
            capitalize(
              item.status
            )
          )}
        </span>

      </div>

      <p>
        ${escapeHTML(
          item.parentName
        )}
        •
        ${escapeHTML(
          formatMoney(
            item.amount,
            item.currency
          )
        )}
      </p>

      <button
        type="button"
        class="view-button"
      >
        View Payment
      </button>
    `;


    card
      .querySelector(
        ".view-button"
      )
      .addEventListener(
        "click",
        () => {

          openPaymentDetails(
            item
          );
        }
      );


    paymentMobileList
      .appendChild(
        card
      );
  }


  // =====================================================
  // DETAILS MODAL
  // =====================================================

  function detailHTML(
    label,
    value
  ) {

    return `
      <article class="detail-card">

        <span>
          ${escapeHTML(label)}
        </span>

        <strong>
          ${escapeHTML(
            value ||
            "Not recorded"
          )}
        </strong>

      </article>
    `;
  }


  function openSubscriptionDetails(item) {

    modalKicker.textContent =
      "SUBSCRIPTION RECORD";


    modalTitle.textContent =
      item.id;


    detailsGrid.innerHTML =
      detailHTML(
        "Parent",
        item.parentName
      ) +

      detailHTML(
        "Email",
        item.parentEmail
      ) +

      detailHTML(
        "Plan",
        item.planName
      ) +

      detailHTML(
        "Status",
        capitalize(
          item.status
        )
      ) +

      detailHTML(
        "Amount",
        formatMoney(
          item.amount,
          item.currency
        )
      ) +

      detailHTML(
        "Started",
        formatDate(
          item.startedAt
        )
      ) +

      detailHTML(
        "Expires",
        formatDate(
          item.expiresAt
        )
      );


    openModal();
  }


  function openPaymentDetails(item) {

    modalKicker.textContent =
      "PAYMENT RECORD";


    modalTitle.textContent =
      item.id;


    detailsGrid.innerHTML =
      detailHTML(
        "Parent",
        item.parentName
      ) +

      detailHTML(
        "Email",
        item.parentEmail
      ) +

      detailHTML(
        "Description",
        item.description
      ) +

      detailHTML(
        "Status",
        capitalize(
          item.status
        )
      ) +

      detailHTML(
        "Amount",
        formatMoney(
          item.amount,
          item.currency
        )
      ) +

      detailHTML(
        "Payment Method",
        item.method
      ) +

      detailHTML(
        "Date",
        formatDate(
          item.createdAt
        )
      );


    openModal();
  }


  function openModal() {

    detailsModal.hidden =
      false;


    document.body.style.overflow =
      "hidden";
  }


  function closeModal() {

    detailsModal.hidden =
      true;


    document.body.style.overflow =
      "";
  }


  modalClose.addEventListener(
    "click",
    closeModal
  );


  closeDetailsButton.addEventListener(
    "click",
    closeModal
  );


  detailsModal.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        detailsModal
      ) {

        closeModal();
      }
    }
  );


  // =====================================================
  // FILTER EVENTS
  // =====================================================

  subscriptionSearch.addEventListener(
    "input",
    renderSubscriptions
  );


  subscriptionStatusFilter.addEventListener(
    "change",
    renderSubscriptions
  );


  clearSubscriptionFilters.addEventListener(
    "click",
    () => {

      subscriptionSearch.value =
        "";


      subscriptionStatusFilter.value =
        "all";


      renderSubscriptions();
    }
  );


  paymentSearch.addEventListener(
    "input",
    renderPayments
  );


  paymentStatusFilter.addEventListener(
    "change",
    renderPayments
  );


  clearPaymentFilters.addEventListener(
    "click",
    () => {

      paymentSearch.value =
        "";


      paymentStatusFilter.value =
        "all";


      renderPayments();
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
        !detailsModal.hidden
      ) {

        closeModal();

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

  renderRecentPayments();

  renderSubscriptions();

  renderPayments();

});