document.addEventListener(
  "DOMContentLoaded",
  () => {

    // =====================================
    // ROLE GUARD
    // =====================================

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
    // STORAGE
    // =====================================

    function readJSON(key) {

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


    function readArray(key) {

      const value =
        readJSON(key);


      return Array.isArray(value)
        ? value
        : [];
    }


    // =====================================
    // ADMIN
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


    // =====================================
    // DOM
    // =====================================

    const $ =
      id =>
        document.getElementById(
          id
        );


    const approvalNavCount =
      $("approvalNavCount");


    const approvedSpecialistsMetric =
      $("approvedSpecialistsMetric");


    const approvedSpecialistsSubtext =
      $("approvedSpecialistsSubtext");


    const bookingsMetric =
      $("bookingsMetric");


    const bookingCompletionSubtext =
      $("bookingCompletionSubtext");


    const reportsMetric =
      $("reportsMetric");


    const revenueMetric =
      $("revenueMetric");


    // PIPELINE

    const approvedValue =
      $("approvedValue");

    const pendingValue =
      $("pendingValue");

    const rejectedValue =
      $("rejectedValue");

    const suspendedValue =
      $("suspendedValue");


    const approvedBar =
      $("approvedBar");

    const pendingBar =
      $("pendingBar");

    const rejectedBar =
      $("rejectedBar");

    const suspendedBar =
      $("suspendedBar");


    // BOOKINGS

    const bookingDonut =
      $("bookingDonut");

    const donutTotal =
      $("donutTotal");

    const confirmedValue =
      $("confirmedValue");

    const completedValue =
      $("completedValue");

    const cancelledValue =
      $("cancelledValue");


    // TYPES

    const onlineValue =
      $("onlineValue");

    const onlinePercent =
      $("onlinePercent");

    const inPersonValue =
      $("inPersonValue");

    const inPersonPercent =
      $("inPersonPercent");

    const completionRate =
      $("completionRate");

    const completionProgress =
      $("completionProgress");


    // CONTENT

    const milestoneContentValue =
      $("milestoneContentValue");

    const screeningContentValue =
      $("screeningContentValue");

    const challengeContentValue =
      $("challengeContentValue");

    const educationContentValue =
      $("educationContentValue");

    const activeContentValue =
      $("activeContentValue");


    // AI

    const knowledgeValue =
      $("knowledgeValue");

    const activeKnowledgeValue =
      $("activeKnowledgeValue");

    const safetyRulesValue =
      $("safetyRulesValue");

    const criticalRulesValue =
      $("criticalRulesValue");


    // BILLING

    const activeSubscriptionsValue =
      $("activeSubscriptionsValue");

    const successfulPaymentsValue =
      $("successfulPaymentsValue");

    const failedPaymentsValue =
      $("failedPaymentsValue");


    // ACTIVITY

    const activityList =
      $("activityList");

    const activityEmpty =
      $("activityEmpty");

    const lastUpdatedLabel =
      $("lastUpdatedLabel");


    // =====================================
    // DATA LOADERS
    // =====================================

    function getSpecialists() {

      const specialists =
        readArray(
          "rafiqSpecialists"
        );


      const current =
        readJSON(
          "rafiqSpecialistProfile"
        );


      if (
        current?.id &&
        !specialists.some(
          item =>
            item.id ===
            current.id
        )
      ) {

        specialists.push(
          current
        );
      }


      return specialists;
    }


    function getBookings() {

      return readArray(
        "rafiqBookings"
      );
    }


    function getReports() {

      return readArray(
        "rafiqSpecialistReports"
      );
    }


    function getPayments() {

      const records =
        [];


      [
        "rafiqPayments",
        "rafiqPaymentHistory",
        "rafiqTransactions"
      ]
        .forEach(
          key => {

            readArray(key)
              .forEach(
                item =>
                  records.push(
                    item
                  )
              );

          }
        );


      [
        "rafiqPayment",
        "rafiqLastPayment"
      ]
        .forEach(
          key => {

            const item =
              readJSON(key);


            if (
              item &&
              typeof item ===
                "object" &&
              !Array.isArray(item)
            ) {

              records.push(
                item
              );
            }

          }
        );


      const map =
        new Map();


      records.forEach(
        (item, index) => {

          const id =
            item.id ||
            item.paymentId ||
            item.transactionId ||
            item.reference ||
            `PAY-${index}`;


          if (
            !map.has(id)
          ) {

            map.set(
              id,
              {
                ...item,
                id,
                status:
                  normalizePaymentStatus(
                    item.status ||
                    item.paymentStatus
                  ),
                amount:
                  numberOrZero(
                    item.amount ??
                    item.price ??
                    item.total
                  ),
                createdAt:
                  item.createdAt ||
                  item.paidAt ||
                  item.paymentDate ||
                  item.date ||
                  null
              }
            );

          }

        }
      );


      return Array.from(
        map.values()
      );
    }


    function getSubscriptions() {

      const records =
        [];


      [
        "rafiqSubscriptions",
        "rafiqSubscriptionHistory"
      ]
        .forEach(
          key => {

            readArray(key)
              .forEach(
                item =>
                  records.push(
                    item
                  )
              );

          }
        );


      [
        "rafiqSubscription",
        "rafiqCurrentSubscription"
      ]
        .forEach(
          key => {

            const item =
              readJSON(key);


            if (
              item &&
              typeof item ===
                "object" &&
              !Array.isArray(item)
            ) {

              records.push(
                item
              );
            }

          }
        );


      return records;
    }


    // =====================================
    // NORMALIZATION
    // =====================================

    function normalizeBookingStatus(
      booking
    ) {

      const status =
        String(
          booking.status ||
          "confirmed"
        )
          .trim()
          .toLowerCase();


      if (
        status ===
        "completed"
      ) {

        return "completed";
      }


      if (
        status ===
        "cancelled"
      ) {

        return "cancelled";
      }


      return "confirmed";
    }


    function normalizeConsultationType(
      value
    ) {

      const type =
        String(
          value ||
          ""
        )
          .trim()
          .toLowerCase();


      if (
        type ===
        "online"
      ) {

        return "online";
      }


      if (
        type ===
          "in-person" ||
        type ===
          "inperson"
      ) {

        return "in-person";
      }


      return "other";
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
        status ===
        "canceled"
      ) {

        return "cancelled";
      }


      return status;
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


    function percent(
      value,
      total
    ) {

      if (
        total <= 0
      ) {

        return 0;
      }


      return Math.round(
        value /
        total *
        100
      );
    }


    // =====================================
    // APPROVAL BADGE
    // =====================================

    function renderApprovalBadge(
      specialists
    ) {

      const pending =
        specialists.filter(
          item =>
            (
              item.status ||
              "pending"
            ) ===
            "pending"
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


    // =====================================
    // SPECIALISTS
    // =====================================

    function renderSpecialists(
      specialists
    ) {

      const counts = {

        approved: 0,
        pending: 0,
        rejected: 0,
        suspended: 0
      };


      specialists.forEach(
        item => {

          const status =
            String(
              item.status ||
              "pending"
            ).toLowerCase();


          if (
            counts[
              status
            ] !== undefined
          ) {

            counts[
              status
            ]++;
          }

        }
      );


      approvedSpecialistsMetric.textContent =
        counts.approved;


      approvedSpecialistsSubtext.textContent =
        `${specialists.length} total ${
          specialists.length === 1
            ? "application"
            : "applications"
        }`;


      approvedValue.textContent =
        counts.approved;

      pendingValue.textContent =
        counts.pending;

      rejectedValue.textContent =
        counts.rejected;

      suspendedValue.textContent =
        counts.suspended;


      const max =
        Math.max(
          counts.approved,
          counts.pending,
          counts.rejected,
          counts.suspended,
          1
        );


      approvedBar.style.width =
        `${counts.approved / max * 100}%`;


      pendingBar.style.width =
        `${counts.pending / max * 100}%`;


      rejectedBar.style.width =
        `${counts.rejected / max * 100}%`;


      suspendedBar.style.width =
        `${counts.suspended / max * 100}%`;

    }


    // =====================================
    // BOOKINGS
    // =====================================

    function renderBookings(
      bookings
    ) {

      const confirmed =
        bookings.filter(
          item =>
            normalizeBookingStatus(
              item
            ) ===
            "confirmed"
        ).length;


      const completed =
        bookings.filter(
          item =>
            normalizeBookingStatus(
              item
            ) ===
            "completed"
        ).length;


      const cancelled =
        bookings.filter(
          item =>
            normalizeBookingStatus(
              item
            ) ===
            "cancelled"
        ).length;


      const total =
        bookings.length;


      const completedPercent =
        percent(
          completed,
          total
        );


      bookingsMetric.textContent =
        total;


      bookingCompletionSubtext.textContent =
        `${completedPercent}% completed`;


      donutTotal.textContent =
        total;


      confirmedValue.textContent =
        confirmed;


      completedValue.textContent =
        completed;


      cancelledValue.textContent =
        cancelled;


      const confirmedDegrees =
        total
          ? confirmed /
            total *
            360
          : 0;


      const completedDegrees =
        total
          ? completed /
            total *
            360
          : 0;


      const cancelledDegrees =
        total
          ? cancelled /
            total *
            360
          : 0;


      const confirmedEnd =
        confirmedDegrees;


      const completedEnd =
        confirmedEnd +
        completedDegrees;


      const cancelledEnd =
        completedEnd +
        cancelledDegrees;


      bookingDonut.style.background =
        total === 0
          ? "var(--line)"
          : `
            conic-gradient(
              #4FB4F3 0deg ${confirmedEnd}deg,
              #0A6450 ${confirmedEnd}deg ${completedEnd}deg,
              #FF6F4D ${completedEnd}deg ${cancelledEnd}deg,
              #F3E5CB ${cancelledEnd}deg 360deg
            )
          `;


      const online =
        bookings.filter(
          item =>
            normalizeConsultationType(
              item.consultationType
            ) ===
            "online"
        ).length;


      const inPerson =
        bookings.filter(
          item =>
            normalizeConsultationType(
              item.consultationType
            ) ===
            "in-person"
        ).length;


      onlineValue.textContent =
        online;


      inPersonValue.textContent =
        inPerson;


      onlinePercent.textContent =
        `${percent(
          online,
          total
        )}%`;


      inPersonPercent.textContent =
        `${percent(
          inPerson,
          total
        )}%`;


      completionRate.textContent =
        `${completedPercent}%`;


      completionProgress.style.width =
        `${completedPercent}%`;

    }


    // =====================================
    // REPORTS
    // =====================================

    function renderReports(
      reports
    ) {

      reportsMetric.textContent =
        reports.length;
    }


    // =====================================
    // CONTENT
    // =====================================

    function renderContent() {

      const milestones =
        readArray(
          "rafiqContentMilestones"
        );


      const screening =
        readArray(
          "rafiqContentScreening"
        );


      const challenges =
        readArray(
          "rafiqContentChallenges"
        );


      const education =
        readArray(
          "rafiqEducationalContent"
        );


      milestoneContentValue.textContent =
        milestones.length;


      screeningContentValue.textContent =
        screening.length;


      challengeContentValue.textContent =
        challenges.length;


      educationContentValue.textContent =
        education.length;


      const all = [
        ...milestones,
        ...screening,
        ...challenges,
        ...education
      ];


      const active =
        all.filter(
          item =>
            item.status ===
              "active" ||
            item.status ===
              "published"
        );


      activeContentValue.textContent =
        active.length;
    }


    // =====================================
    // AI
    // =====================================

    function renderAI() {

      const knowledge =
        readArray(
          "rafiqAIKnowledgeBase"
        );


      const safety =
        readArray(
          "rafiqAISafetyRules"
        );


      knowledgeValue.textContent =
        knowledge.length;


      activeKnowledgeValue.textContent =
        `${
          knowledge.filter(
            item =>
              item.status ===
              "active"
          ).length
        } active`;


      safetyRulesValue.textContent =
        safety.length;


      criticalRulesValue.textContent =
        `${
          safety.filter(
            item =>
              item.severity ===
              "critical"
          ).length
        } critical`;
    }


    // =====================================
    // BILLING
    // =====================================

    function renderBilling(
      payments,
      subscriptions
    ) {

      const successful =
        payments.filter(
          item =>
            item.status ===
            "successful"
        );


      const failed =
        payments.filter(
          item =>
            item.status ===
            "failed"
        );


      const activeSubscriptions =
        subscriptions.filter(
          item =>
            normalizeSubscriptionStatus(
              item.status ||
              item.subscriptionStatus
            ) ===
            "active"
        );


      const revenue =
        successful.reduce(
          (
            total,
            item
          ) =>
            total +
            numberOrZero(
              item.amount
            ),
          0
        );


      revenueMetric.textContent =
        Number.isInteger(
          revenue
        )
          ? revenue
          : revenue.toFixed(
              2
            );


      activeSubscriptionsValue.textContent =
        activeSubscriptions.length;


      successfulPaymentsValue.textContent =
        successful.length;


      failedPaymentsValue.textContent =
        failed.length;
    }


    // =====================================
    // ACTIVITY
    // =====================================

    function renderActivity(
      specialists,
      bookings,
      reports,
      payments
    ) {

      const activity =
        [];


      specialists.forEach(
        specialist => {

          if (
            specialist.createdAt
          ) {

            activity.push({

              type:
                "specialist",

              icon:
                "◎",

              title:
                "Specialist application",

              description:
                `${specialist.fullName || "Specialist"} • ${capitalize(
                  specialist.status ||
                  "pending"
                )}`,

              date:
                specialist.createdAt
            });

          }


          if (
            specialist.approvedAt
          ) {

            activity.push({

              type:
                "specialist",

              icon:
                "✓",

              title:
                "Specialist approved",

              description:
                specialist.fullName ||
                "Specialist",

              date:
                specialist.approvedAt
            });

          }

        }
      );


      bookings.forEach(
        booking => {

          if (
            booking.createdAt
          ) {

            activity.push({

              type:
                "booking",

              icon:
                "▦",

              title:
                "Booking created",

              description:
                `${
                  booking.childName ||
                  "Child"
                } with ${
                  booking.specialistName ||
                  "Specialist"
                }`,

              date:
                booking.createdAt
            });

          }

        }
      );


      reports.forEach(
        report => {

          const date =
            report.submittedAt ||
            report.updatedAt ||
            report.reportDate;


          if (
            date
          ) {

            activity.push({

              type:
                "report",

              icon:
                "◫",

              title:
                "Specialist report submitted",

              description:
                `${
                  report.childName ||
                  "Child"
                } • ${
                  report.specialistName ||
                  "Specialist"
                }`,

              date
            });

          }

        }
      );


      payments.forEach(
        payment => {

          if (
            payment.createdAt
          ) {

            activity.push({

              type:
                "payment",

              icon:
                "$",

              title:
                "Payment record",

              description:
                `${capitalize(
                  payment.status
                )} • ${
                  payment.amount || 0
                } ${
                  payment.currency ||
                  "JOD"
                }`,

              date:
                payment.createdAt
            });

          }

        }
      );


      activity.sort(
        (a,b) =>
          new Date(
            b.date
          ) -
          new Date(
            a.date
          )
      );


      const latest =
        activity.slice(
          0,
          8
        );


      activityList.innerHTML =
        "";


      activityEmpty.hidden =
        latest.length !== 0;


      latest.forEach(
        item => {

          const row =
            document.createElement(
              "article"
            );


          row.className =
            "activity-row";


          row.innerHTML = `
            <div class="activity-icon ${escapeHTML(
              item.type
            )}">
              ${escapeHTML(
                item.icon
              )}
            </div>

            <div class="activity-copy">

              <strong>
                ${escapeHTML(
                  item.title
                )}
              </strong>

              <span>
                ${escapeHTML(
                  item.description
                )}
              </span>

            </div>

            <time>
              ${escapeHTML(
                formatActivityDate(
                  item.date
                )
              )}
            </time>
          `;


          activityList.appendChild(
            row
          );

        }
      );

    }


    // =====================================
    // HELPERS
    // =====================================

    function formatActivityDate(
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

        return "—";
      }


      return date.toLocaleDateString(
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


    function capitalize(
      value
    ) {

      const text =
        String(
          value ||
          ""
        );


      return (
        text
          .charAt(0)
          .toUpperCase() +
        text.slice(1)
      );
    }


    function escapeHTML(
      value
    ) {

      const div =
        document.createElement(
          "div"
        );


      div.textContent =
        String(
          value ??
          ""
        );


      return div.innerHTML;
    }


    // =====================================
    // REFRESH
    // =====================================

    function refreshAnalytics() {

      const specialists =
        getSpecialists();


      const bookings =
        getBookings();


      const reports =
        getReports();


      const payments =
        getPayments();


      const subscriptions =
        getSubscriptions();


      renderApprovalBadge(
        specialists
      );


      renderSpecialists(
        specialists
      );


      renderBookings(
        bookings
      );


      renderReports(
        reports
      );


      renderContent();


      renderAI();


      renderBilling(
        payments,
        subscriptions
      );


      renderActivity(
        specialists,
        bookings,
        reports,
        payments
      );


      lastUpdatedLabel.textContent =
        `Updated ${new Date().toLocaleTimeString(
          undefined,
          {
            hour:
              "2-digit",

            minute:
              "2-digit"
          }
        )}`;

    }


    $("refreshButton")
      .addEventListener(
        "click",
        refreshAnalytics
      );


    // =====================================
    // SIDEBAR
    // =====================================

    const sidebar =
      $("sidebar");


    const sidebarOverlay =
      $("sidebarOverlay");


    const menuButton =
      $("menuButton");


    const sidebarClose =
      $("sidebarClose");


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
          event.key ===
          "Escape"
        ) {

          closeSidebar();
        }

      }
    );


    // =====================================
    // LOGOUT
    // =====================================

    $("logoutButton")
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

    refreshAnalytics();

  }
);