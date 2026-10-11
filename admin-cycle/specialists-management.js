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
    // HELPERS
    // =====================================

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


    function readObject(key) {

      try {

        return JSON.parse(
          localStorage.getItem(key)
        );

      } catch (error) {

        return null;
      }
    }


    function saveSpecialists() {

      localStorage.setItem(
        "rafiqSpecialists",
        JSON.stringify(
          specialists
        )
      );
    }


    // =====================================
    // ELEMENTS
    // =====================================

    const adminSidebarName =
      document.getElementById(
        "adminSidebarName"
      );


    const heroApprovedCount =
      document.getElementById(
        "heroApprovedCount"
      );


    const approvedCount =
      document.getElementById(
        "approvedCount"
      );


    const pendingCount =
      document.getElementById(
        "pendingCount"
      );


    const suspendedCount =
      document.getElementById(
        "suspendedCount"
      );


    const rejectedCount =
      document.getElementById(
        "rejectedCount"
      );


    const approvalNavCount =
      document.getElementById(
        "approvalNavCount"
      );


    const specialistSearch =
      document.getElementById(
        "specialistSearch"
      );


    const specialtyFilter =
      document.getElementById(
        "specialtyFilter"
      );


    const statusFilters =
      document.querySelectorAll(
        ".status-filter"
      );


    const specialistsTableBody =
      document.getElementById(
        "specialistsTableBody"
      );


    const mobileList =
      document.getElementById(
        "mobileList"
      );


    const resultCount =
      document.getElementById(
        "resultCount"
      );


    const emptyState =
      document.getElementById(
        "emptyState"
      );


    // PROFILE MODAL

    const profileModal =
      document.getElementById(
        "profileModal"
      );


    const closeProfileModal =
      document.getElementById(
        "closeProfileModal"
      );


    const closeProfileButton =
      document.getElementById(
        "closeProfileButton"
      );


    const modalAvatar =
      document.getElementById(
        "modalAvatar"
      );


    const modalName =
      document.getElementById(
        "modalName"
      );


    const modalSpecialty =
      document.getElementById(
        "modalSpecialty"
      );


    const modalStatus =
      document.getElementById(
        "modalStatus"
      );


    const modalEmail =
      document.getElementById(
        "modalEmail"
      );


    const modalPhone =
      document.getElementById(
        "modalPhone"
      );


    const modalQualification =
      document.getElementById(
        "modalQualification"
      );


    const modalExperience =
      document.getElementById(
        "modalExperience"
      );


    const modalLicense =
      document.getElementById(
        "modalLicense"
      );


    const modalFee =
      document.getElementById(
        "modalFee"
      );


    const modalTypes =
      document.getElementById(
        "modalTypes"
      );


    const modalLanguages =
      document.getElementById(
        "modalLanguages"
      );


    const modalBio =
      document.getElementById(
        "modalBio"
      );


    const modalId =
      document.getElementById(
        "modalId"
      );


    const modalCreated =
      document.getElementById(
        "modalCreated"
      );


    const modalReviewed =
      document.getElementById(
        "modalReviewed"
      );


    const rejectionBox =
      document.getElementById(
        "rejectionBox"
      );


    const modalRejectionReason =
      document.getElementById(
        "modalRejectionReason"
      );


    const modalAccountAction =
      document.getElementById(
        "modalAccountAction"
      );


    // STATUS MODAL

    const statusModal =
      document.getElementById(
        "statusModal"
      );


    const decisionIcon =
      document.getElementById(
        "decisionIcon"
      );


    const decisionKicker =
      document.getElementById(
        "decisionKicker"
      );


    const decisionTitle =
      document.getElementById(
        "decisionTitle"
      );


    const decisionText =
      document.getElementById(
        "decisionText"
      );


    const suspensionReasonGroup =
      document.getElementById(
        "suspensionReasonGroup"
      );


    const suspensionReason =
      document.getElementById(
        "suspensionReason"
      );


    const reasonError =
      document.getElementById(
        "reasonError"
      );


    const cancelStatusAction =
      document.getElementById(
        "cancelStatusAction"
      );


    const confirmStatusAction =
      document.getElementById(
        "confirmStatusAction"
      );


    // TOAST

    const toast =
      document.getElementById(
        "toast"
      );


    const toastTitle =
      document.getElementById(
        "toastTitle"
      );


    const toastText =
      document.getElementById(
        "toastText"
      );


    // =====================================
    // ADMIN
    // =====================================

    adminSidebarName.textContent =
      sessionStorage.getItem(
        "rafiqAdminName"
      ) ||
      "RAFIQ Admin";


    // =====================================
    // LOAD SPECIALISTS
    // =====================================

    function loadSpecialists() {

      const list =
        readArray(
          "rafiqSpecialists"
        );


      const currentProfile =
        readObject(
          "rafiqSpecialistProfile"
        );


      if (
        currentProfile?.id
      ) {

        const index =
          list.findIndex(
            item =>
              item.id ===
              currentProfile.id
          );


        if (
          index === -1
        ) {

          list.push(
            currentProfile
          );

        } else {

          list[index] = {
            ...list[index],
            ...currentProfile
          };
        }
      }


      return list;
    }


    let specialists =
      loadSpecialists();


    // =====================================
    // STATE
    // =====================================

    let activeStatus =
      "all";


    let searchTerm =
      "";


    let selectedSpecialistId =
      null;


    let pendingAccountAction =
      null;


    // =====================================
    // STATUS
    // =====================================

    function getStatus(
      specialist
    ) {

      return (
        specialist.status ||
        "pending"
      );
    }


    // =====================================
    // INITIALS
    // =====================================

    function getInitials(name) {

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

        return "SP";
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


    // =====================================
    // DATE
    // =====================================

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


    // =====================================
    // PRICE
    // =====================================

    function formatMoney(value) {

      const number =
        Number(value);


      if (
        !Number.isFinite(number)
      ) {

        return "—";
      }


      return `${number.toFixed(2)} JOD`;
    }


    // =====================================
    // ARRAYS
    // =====================================

    function formatArray(
      value
    ) {

      if (
        Array.isArray(value) &&
        value.length > 0
      ) {

        return value
          .map(item => {

            if (
              item === "online"
            ) {
              return "Online";
            }


            if (
              item === "in-person"
            ) {
              return "In-person";
            }


            return item;

          })
          .join(", ");
      }


      return "Not recorded";
    }


    // =====================================
    // ESCAPE
    // =====================================

    function escapeHTML(value) {

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
    // METRICS
    // =====================================

    function renderMetrics() {

      const approved =
        specialists.filter(
          item =>
            getStatus(item) ===
            "approved"
        );


      const pending =
        specialists.filter(
          item =>
            getStatus(item) ===
            "pending"
        );


      const suspended =
        specialists.filter(
          item =>
            getStatus(item) ===
            "suspended"
        );


      const rejected =
        specialists.filter(
          item =>
            getStatus(item) ===
            "rejected"
        );


      heroApprovedCount.textContent =
        approved.length;


      approvedCount.textContent =
        approved.length;


      pendingCount.textContent =
        pending.length;


      suspendedCount.textContent =
        suspended.length;


      rejectedCount.textContent =
        rejected.length;


      if (
        pending.length > 0
      ) {

        approvalNavCount.hidden =
          false;


        approvalNavCount.textContent =
          pending.length > 9
            ? "9+"
            : pending.length;

      } else {

        approvalNavCount.hidden =
          true;
      }
    }


    // =====================================
    // SPECIALTY FILTER
    // =====================================

    function populateSpecialties() {

      const current =
        specialtyFilter.value;


      const values =
        [...new Set(
          specialists
            .map(
              item =>
                item.specialty
            )
            .filter(Boolean)
        )]
          .sort();


      specialtyFilter.innerHTML =
        `<option value="all">All specialties</option>`;


      values.forEach(
        specialty => {

          const option =
            document.createElement(
              "option"
            );


          option.value =
            specialty;


          option.textContent =
            specialty;


          specialtyFilter.appendChild(
            option
          );
        }
      );


      if (
        values.includes(current)
      ) {

        specialtyFilter.value =
          current;
      }
    }


    // =====================================
    // FILTER
    // =====================================

    function getFiltered() {

      const specialty =
        specialtyFilter.value;


      return specialists
        .filter(
          specialist => {

            const status =
              getStatus(
                specialist
              );


            if (
              activeStatus !==
                "all" &&
              status !==
                activeStatus
            ) {

              return false;
            }


            if (
              specialty !==
                "all" &&
              specialist.specialty !==
                specialty
            ) {

              return false;
            }


            if (
              !searchTerm
            ) {

              return true;
            }


            const haystack =
              [
                specialist.fullName,
                specialist.email,
                specialist.phone,
                specialist.specialty,
                specialist.qualification,
                specialist.id
              ]
                .join(" ")
                .toLowerCase();


            return haystack.includes(
              searchTerm
            );
          }
        )
        .sort(
          (a,b) =>
            String(
              a.fullName || ""
            ).localeCompare(
              String(
                b.fullName || ""
              )
            )
        );
    }


    // =====================================
    // RENDER
    // =====================================

    function renderSpecialists() {

      const filtered =
        getFiltered();


      specialistsTableBody.innerHTML =
        "";


      mobileList.innerHTML =
        "";


      resultCount.textContent =
        `${filtered.length} ${
          filtered.length === 1
            ? "specialist"
            : "specialists"
        }`;


      emptyState.hidden =
        filtered.length !== 0;


      filtered.forEach(
        specialist => {

          renderTableRow(
            specialist
          );


          renderMobileCard(
            specialist
          );
        }
      );
    }


    // =====================================
    // TABLE ROW
    // =====================================

    function renderTableRow(
      specialist
    ) {

      const row =
        document.createElement(
          "tr"
        );


      const status =
        getStatus(
          specialist
        );


      const experience =
        Number(
          specialist.experience
        );


      const canSuspend =
        status ===
        "approved";


      const canReactivate =
        status ===
        "suspended";


      row.innerHTML = `
        <td>

          <div class="specialist-cell">

            <div class="specialist-avatar">
              ${escapeHTML(
                getInitials(
                  specialist.fullName
                )
              )}
            </div>


            <div>

              <strong>
                ${escapeHTML(
                  specialist.fullName ||
                  "Specialist"
                )}
              </strong>

              <span>
                ${escapeHTML(
                  specialist.email ||
                  "No email"
                )}
              </span>

            </div>

          </div>

        </td>


        <td>
          ${escapeHTML(
            specialist.specialty ||
            "Not recorded"
          )}
        </td>


        <td>
          ${
            Number.isFinite(
              experience
            )
              ? `${experience} yrs`
              : "—"
          }
        </td>


        <td>
          ${escapeHTML(
            formatMoney(
              specialist.price
            )
          )}
        </td>


        <td>

          <span
            class="status-badge ${status}"
          >
            ${escapeHTML(status)}
          </span>

        </td>


        <td>

          <div class="actions">

            <button
              type="button"
              class="view-button"
            >
              View
            </button>


            ${
              canSuspend
                ? `
                  <button
                    type="button"
                    class="account-button suspend"
                  >
                    Suspend
                  </button>
                `
                : ""
            }


            ${
              canReactivate
                ? `
                  <button
                    type="button"
                    class="account-button reactivate"
                  >
                    Reactivate
                  </button>
                `
                : ""
            }

          </div>

        </td>
      `;


      row
        .querySelector(
          ".view-button"
        )
        .addEventListener(
          "click",
          () => {

            openProfile(
              specialist.id
            );

          }
        );


      const suspend =
        row.querySelector(
          ".suspend"
        );


      if (suspend) {

        suspend.addEventListener(
          "click",
          () => {

            prepareAccountAction(
              specialist.id,
              "suspend"
            );

          }
        );
      }


      const reactivate =
        row.querySelector(
          ".reactivate"
        );


      if (reactivate) {

        reactivate.addEventListener(
          "click",
          () => {

            prepareAccountAction(
              specialist.id,
              "reactivate"
            );

          }
        );
      }


      specialistsTableBody
        .appendChild(
          row
        );
    }


    // =====================================
    // MOBILE CARD
    // =====================================

    function renderMobileCard(
      specialist
    ) {

      const status =
        getStatus(
          specialist
        );


      const card =
        document.createElement(
          "article"
        );


      card.className =
        "mobile-card";


      card.innerHTML = `
        <div class="mobile-card-top">

          <div class="specialist-cell">

            <div class="specialist-avatar">
              ${escapeHTML(
                getInitials(
                  specialist.fullName
                )
              )}
            </div>

            <div>

              <strong>
                ${escapeHTML(
                  specialist.fullName ||
                  "Specialist"
                )}
              </strong>

              <span>
                ${escapeHTML(
                  specialist.specialty ||
                  "Not recorded"
                )}
              </span>

            </div>

          </div>


          <span
            class="status-badge ${status}"
          >
            ${escapeHTML(status)}
          </span>

        </div>


        <div class="mobile-info">

          <div>
            <span>Email</span>

            <strong>
              ${escapeHTML(
                specialist.email ||
                "Not recorded"
              )}
            </strong>
          </div>


          <div>
            <span>Experience</span>

            <strong>
              ${escapeHTML(
                specialist.experience ??
                "—"
              )} yrs
            </strong>
          </div>


          <div>
            <span>Session Fee</span>

            <strong>
              ${escapeHTML(
                formatMoney(
                  specialist.price
                )
              )}
            </strong>
          </div>

        </div>


        <div class="mobile-actions">

          <button
            type="button"
            class="view-button"
          >
            View Details
          </button>


          ${
            status === "approved"
              ? `
                <button
                  type="button"
                  class="account-button suspend"
                >
                  Suspend
                </button>
              `
              : status === "suspended"
                ? `
                  <button
                    type="button"
                    class="account-button reactivate"
                  >
                    Reactivate
                  </button>
                `
                : `
                  <a
                    href="specialist-approvals.html"
                    class="account-button"
                  >
                    Review Status
                  </a>
                `
          }

        </div>
      `;


      card
        .querySelector(
          ".view-button"
        )
        .addEventListener(
          "click",
          () => {

            openProfile(
              specialist.id
            );

          }
        );


      const suspend =
        card.querySelector(
          ".suspend"
        );


      if (suspend) {

        suspend.addEventListener(
          "click",
          () => {

            prepareAccountAction(
              specialist.id,
              "suspend"
            );

          }
        );
      }


      const reactivate =
        card.querySelector(
          ".reactivate"
        );


      if (reactivate) {

        reactivate.addEventListener(
          "click",
          () => {

            prepareAccountAction(
              specialist.id,
              "reactivate"
            );

          }
        );
      }


      mobileList.appendChild(
        card
      );
    }


    // =====================================
    // PROFILE MODAL
    // =====================================

    function openProfile(
      specialistId
    ) {

      const specialist =
        specialists.find(
          item =>
            item.id ===
            specialistId
        );


      if (!specialist) {

        return;
      }


      selectedSpecialistId =
        specialistId;


      const status =
        getStatus(
          specialist
        );


      modalAvatar.textContent =
        getInitials(
          specialist.fullName
        );


      modalName.textContent =
        specialist.fullName ||
        "Specialist";


      modalSpecialty.textContent =
        specialist.specialty ||
        "Not recorded";


      modalStatus.textContent =
        status;


      modalStatus.className =
        `status-badge ${status}`;


      modalEmail.textContent =
        specialist.email ||
        "Not recorded";


      modalPhone.textContent =
        specialist.phone ||
        "Not recorded";


      modalQualification.textContent =
        specialist.qualification ||
        "Not recorded";


      modalExperience.textContent =
        Number.isFinite(
          Number(
            specialist.experience
          )
        )
          ? `${specialist.experience} years`
          : "Not recorded";


      modalLicense.textContent =
        specialist.licenseNumber ||
        "Not recorded";


      modalFee.textContent =
        formatMoney(
          specialist.price
        );


      modalTypes.textContent =
        formatArray(
          specialist.consultationTypes
        );


      modalLanguages.textContent =
        formatArray(
          specialist.languages
        );


      modalBio.textContent =
        specialist.bio ||
        "No professional bio submitted.";


      modalId.textContent =
        specialist.id ||
        "Not recorded";


      modalCreated.textContent =
        formatDate(
          specialist.createdAt
        );


      modalReviewed.textContent =
        formatDate(
          specialist.reviewedAt ||
          specialist.approvedAt ||
          specialist.rejectedAt
        );


      if (
        status === "rejected" &&
        specialist.rejectionReason
      ) {

        rejectionBox.hidden =
          false;


        modalRejectionReason
          .textContent =
            specialist.rejectionReason;

      } else {

        rejectionBox.hidden =
          true;
      }


      if (
        status === "approved"
      ) {

        modalAccountAction.hidden =
          false;


        modalAccountAction.textContent =
          "Suspend Specialist";


        modalAccountAction.className =
          "suspend-button";

      } else if (
        status === "suspended"
      ) {

        modalAccountAction.hidden =
          false;


        modalAccountAction.textContent =
          "Reactivate Specialist";


        modalAccountAction.className =
          "suspend-button reactivate";

      } else {

        modalAccountAction.hidden =
          true;
      }


      profileModal.hidden =
        false;
    }


    function closeProfile() {

      profileModal.hidden =
        true;


      selectedSpecialistId =
        null;
    }


    closeProfileModal
      .addEventListener(
        "click",
        closeProfile
      );


    closeProfileButton
      .addEventListener(
        "click",
        closeProfile
      );


    profileModal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          profileModal
        ) {

          closeProfile();
        }
      }
    );


    modalAccountAction
      .addEventListener(
        "click",
        () => {

          if (
            !selectedSpecialistId
          ) {

            return;
          }


          const specialist =
            specialists.find(
              item =>
                item.id ===
                selectedSpecialistId
            );


          if (!specialist) {

            return;
          }


          const action =
            getStatus(
              specialist
            ) === "approved"
              ? "suspend"
              : "reactivate";


          profileModal.hidden =
            true;


          prepareAccountAction(
            specialist.id,
            action
          );
        }
      );


    // =====================================
    // ACCOUNT ACTION
    // =====================================

    function prepareAccountAction(
      specialistId,
      action
    ) {

      const specialist =
        specialists.find(
          item =>
            item.id ===
            specialistId
        );


      if (!specialist) {

        return;
      }


      pendingAccountAction = {
        specialistId,
        action
      };


      reasonError.textContent =
        "";


      suspensionReason.value =
        "";


      if (
        action === "suspend"
      ) {

        decisionIcon.textContent =
          "!";


        decisionIcon.className =
          "decision-icon";


        decisionKicker.textContent =
          "RESTRICT PLATFORM ACCESS";


        decisionTitle.textContent =
          "Suspend this specialist?";


        decisionText.textContent =
          `${specialist.fullName}'s practice access will be restricted and the specialist should no longer appear as available to parents.`;


        suspensionReasonGroup.hidden =
          false;


        confirmStatusAction.textContent =
          "Suspend Specialist";


        confirmStatusAction.className =
          "confirm-status-button";

      } else {

        decisionIcon.textContent =
          "✓";


        decisionIcon.className =
          "decision-icon reactivate";


        decisionKicker.textContent =
          "RESTORE PLATFORM ACCESS";


        decisionTitle.textContent =
          "Reactivate this specialist?";


        decisionText.textContent =
          `${specialist.fullName}'s approved platform access will be restored.`;


        suspensionReasonGroup.hidden =
          true;


        confirmStatusAction.textContent =
          "Reactivate";


        confirmStatusAction.className =
          "confirm-status-button reactivate";
      }


      statusModal.hidden =
        false;
    }


    cancelStatusAction
      .addEventListener(
        "click",
        () => {

          statusModal.hidden =
            true;


          pendingAccountAction =
            null;
        }
      );


    confirmStatusAction
      .addEventListener(
        "click",
        () => {

          if (
            !pendingAccountAction
          ) {

            return;
          }


          const {
            specialistId,
            action
          } =
            pendingAccountAction;


          const specialist =
            specialists.find(
              item =>
                item.id ===
                specialistId
            );


          if (!specialist) {

            return;
          }


          if (
            action === "suspend"
          ) {

            const reason =
              suspensionReason.value
                .trim();


            if (
              reason.length < 8
            ) {

              reasonError.textContent =
                "Please provide a short administrative reason.";

              return;
            }


            updateStatus(
              specialistId,
              {
                status:
                  "suspended",

                suspendedAt:
                  new Date()
                    .toISOString(),

                suspensionReason:
                  reason
              }
            );


            showToast(
              "Specialist suspended",
              `${specialist.fullName}'s platform access has been restricted.`
            );

          } else {

            updateStatus(
              specialistId,
              {
                status:
                  "approved",

                verificationStatus:
                  "approved",

                reactivatedAt:
                  new Date()
                    .toISOString(),

                suspendedAt:
                  null,

                suspensionReason:
                  null
              }
            );


            showToast(
              "Specialist reactivated",
              `${specialist.fullName}'s approved access has been restored.`
            );
          }


          statusModal.hidden =
            true;


          pendingAccountAction =
            null;


          renderAll();

        }
      );


    // =====================================
    // UPDATE STATUS
    // =====================================

    function updateStatus(
      specialistId,
      changes
    ) {

      specialists =
        specialists.map(
          item =>
            item.id ===
            specialistId
              ? {
                  ...item,
                  ...changes
                }
              : item
        );


      saveSpecialists();


      /*
        Synchronize current Specialist profile.

        This means Specialist Dashboard reacts
        to Admin suspension / reactivation.
      */

      const currentProfile =
        readObject(
          "rafiqSpecialistProfile"
        );


      if (
        currentProfile?.id ===
        specialistId
      ) {

        localStorage.setItem(
          "rafiqSpecialistProfile",
          JSON.stringify({
            ...currentProfile,
            ...changes
          })
        );
      }
    }


    // =====================================
    // FILTER EVENTS
    // =====================================

    specialistSearch
      .addEventListener(
        "input",
        () => {

          searchTerm =
            specialistSearch.value
              .trim()
              .toLowerCase();


          renderSpecialists();
        }
      );


    specialtyFilter
      .addEventListener(
        "change",
        renderSpecialists
      );


    statusFilters.forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            activeStatus =
              button.dataset.status;


            statusFilters.forEach(
              item =>
                item.classList.remove(
                  "active"
                )
            );


            button.classList.add(
              "active"
            );


            renderSpecialists();
          }
        );
      }
    );


    // =====================================
    // TOAST
    // =====================================

    let toastTimer;


    function showToast(
      title,
      text
    ) {

      toastTitle.textContent =
        title;


      toastText.textContent =
        text;


      toast.hidden =
        false;


      clearTimeout(
        toastTimer
      );


      toastTimer =
        setTimeout(
          () => {

            toast.hidden =
              true;

          },
          2800
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
    // ESCAPE
    // =====================================

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key !== "Escape"
        ) {

          return;
        }


        profileModal.hidden =
          true;


        statusModal.hidden =
          true;


        closeSidebar();
      }
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
    // RENDER ALL
    // =====================================

    function renderAll() {

      renderMetrics();

      populateSpecialties();

      renderSpecialists();
    }


    // =====================================
    // INIT
    // =====================================

    renderAll();

  }
);