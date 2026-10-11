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


    function writeArray(
      key,
      value
    ) {

      localStorage.setItem(
        key,
        JSON.stringify(
          value
        )
      );

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
    // ELEMENTS
    // =====================================

    const heroPendingCount =
      document.getElementById(
        "heroPendingCount"
      );


    const heroPendingText =
      document.getElementById(
        "heroPendingText"
      );


    const approvalNavCount =
      document.getElementById(
        "approvalNavCount"
      );


    const queueCount =
      document.getElementById(
        "queueCount"
      );


    const queueSearch =
      document.getElementById(
        "queueSearch"
      );


    const applicationList =
      document.getElementById(
        "applicationList"
      );


    const queueEmpty =
      document.getElementById(
        "queueEmpty"
      );


    const selectState =
      document.getElementById(
        "selectState"
      );


    const applicationDetail =
      document.getElementById(
        "applicationDetail"
      );


    // DETAIL

    const detailAvatar =
      document.getElementById(
        "detailAvatar"
      );


    const detailName =
      document.getElementById(
        "detailName"
      );


    const detailSpecialty =
      document.getElementById(
        "detailSpecialty"
      );


    const detailId =
      document.getElementById(
        "detailId"
      );


    const detailCreated =
      document.getElementById(
        "detailCreated"
      );


    const detailVerification =
      document.getElementById(
        "detailVerification"
      );


    const reviewFullName =
      document.getElementById(
        "reviewFullName"
      );


    const reviewEmail =
      document.getElementById(
        "reviewEmail"
      );


    const reviewPhone =
      document.getElementById(
        "reviewPhone"
      );


    const reviewSpecialty =
      document.getElementById(
        "reviewSpecialty"
      );


    const reviewQualification =
      document.getElementById(
        "reviewQualification"
      );


    const reviewExperience =
      document.getElementById(
        "reviewExperience"
      );


    const reviewLicense =
      document.getElementById(
        "reviewLicense"
      );


    const reviewBio =
      document.getElementById(
        "reviewBio"
      );


    const reviewConsultationTypes =
      document.getElementById(
        "reviewConsultationTypes"
      );


    const reviewLanguages =
      document.getElementById(
        "reviewLanguages"
      );


    const reviewFee =
      document.getElementById(
        "reviewFee"
      );


    const documentName =
      document.getElementById(
        "documentName"
      );


    const documentState =
      document.getElementById(
        "documentState"
      );


    // BUTTONS

    const approveButton =
      document.getElementById(
        "approveButton"
      );


    const rejectButton =
      document.getElementById(
        "rejectButton"
      );


    // APPROVE MODAL

    const approveModal =
      document.getElementById(
        "approveModal"
      );


    const approveModalText =
      document.getElementById(
        "approveModalText"
      );


    const cancelApprove =
      document.getElementById(
        "cancelApprove"
      );


    const confirmApprove =
      document.getElementById(
        "confirmApprove"
      );


    // REJECT MODAL

    const rejectModal =
      document.getElementById(
        "rejectModal"
      );


    const rejectionReason =
      document.getElementById(
        "rejectionReason"
      );


    const reasonError =
      document.getElementById(
        "reasonError"
      );


    const reasonCount =
      document.getElementById(
        "reasonCount"
      );


    const cancelReject =
      document.getElementById(
        "cancelReject"
      );


    const confirmReject =
      document.getElementById(
        "confirmReject"
      );


    // TOAST

    const decisionToast =
      document.getElementById(
        "decisionToast"
      );


    const toastIcon =
      document.getElementById(
        "toastIcon"
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
    // LOAD SPECIALISTS
    // =====================================

    function loadSpecialists() {

      const specialists =
        readArray(
          "rafiqSpecialists"
        );


      /*
        Prototype compatibility:
        ensure current specialist profile is
        represented in shared specialists.
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


    let specialists =
      loadSpecialists();


    // =====================================
    // STATE
    // =====================================

    let selectedSpecialistId =
      sessionStorage.getItem(
        "rafiqAdminSelectedSpecialistId"
      );


    let searchTerm =
      "";


    // =====================================
    // PENDING
    // =====================================

    function getPendingSpecialists() {

      return specialists
        .filter(
          specialist =>
            (
              specialist.status ||
              "pending"
            ) ===
            "pending"
        )
        .filter(
          specialist => {

            if (
              !searchTerm
            ) {

              return true;
            }


            const haystack =
              [
                specialist.fullName,
                specialist.email,
                specialist.specialty,
                specialist.qualification,
                specialist.licenseNumber
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
    // DATE
    // =====================================

    function formatDate(
      value
    ) {

      if (
        !value
      ) {

        return "Not recorded";
      }


      const date =
        new Date(
          value
        );


      if (
        Number.isNaN(
          date.getTime()
        )
      ) {

        return String(
          value
        );
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


    // =====================================
    // FORMAT LABELS
    // =====================================

    function formatConsultationType(
      value
    ) {

      const normalized =
        String(
          value ||
          ""
        ).toLowerCase();


      if (
        normalized ===
        "online"
      ) {

        return "Online";
      }


      if (
        normalized ===
        "in-person" ||
        normalized ===
        "inperson"
      ) {

        return "In-person";
      }


      return value;

    }


    function formatLanguage(
      value
    ) {

      const normalized =
        String(
          value ||
          ""
        ).toLowerCase();


      if (
        normalized ===
        "arabic"
      ) {

        return "Arabic";
      }


      if (
        normalized ===
        "english"
      ) {

        return "English";
      }


      return value;

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
    // COUNTS
    // =====================================

    function renderCounts() {

      const pending =
        specialists.filter(
          item =>
            (
              item.status ||
              "pending"
            ) ===
            "pending"
        );


      heroPendingCount.textContent =
        pending.length;


      queueCount.textContent =
        pending.length;


      if (
        pending.length === 0
      ) {

        heroPendingText.textContent =
          "No applications waiting";


        approvalNavCount.hidden =
          true;

      } else {

        heroPendingText.textContent =
          pending.length === 1
            ? "1 application waiting"
            : `${pending.length} applications waiting`;


        approvalNavCount.hidden =
          false;


        approvalNavCount.textContent =
          pending.length > 9
            ? "9+"
            : pending.length;

      }

    }


    // =====================================
    // QUEUE
    // =====================================

    function renderQueue() {

      const pending =
        getPendingSpecialists();


      applicationList.innerHTML =
        "";


      queueEmpty.hidden =
        pending.length !== 0;


      pending.forEach(
        specialist => {

          const button =
            document.createElement(
              "button"
            );


          button.type =
            "button";


          button.className =
            "application-button";


          if (
            specialist.id ===
            selectedSpecialistId
          ) {

            button.classList.add(
              "active"
            );
          }


          button.innerHTML = `
            <div class="queue-avatar">
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
                  "Specialty not specified"
                )}
              </span>

              <small>
                Pending verification
              </small>

            </div>
          `;


          button.addEventListener(
            "click",
            () => {

              selectSpecialist(
                specialist.id
              );

            }
          );


          applicationList.appendChild(
            button
          );

        }
      );


      /*
        If current selection is no longer
        pending, clear it.
      */

      const stillPending =
        specialists.some(
          item =>
            item.id ===
              selectedSpecialistId &&
            (
              item.status ||
              "pending"
            ) ===
              "pending"
        );


      if (
        selectedSpecialistId &&
        !stillPending
      ) {

        selectedSpecialistId =
          null;


        sessionStorage.removeItem(
          "rafiqAdminSelectedSpecialistId"
        );


        showSelectState();

      }

    }


    // =====================================
    // SELECT
    // =====================================

    function selectSpecialist(
      specialistId
    ) {

      selectedSpecialistId =
        specialistId;


      sessionStorage.setItem(
        "rafiqAdminSelectedSpecialistId",
        specialistId
      );


      renderQueue();

      renderSelectedSpecialist();

    }


    // =====================================
    // RENDER TAGS
    // =====================================

    function renderTags(
      container,
      values,
      formatter
    ) {

      container.innerHTML =
        "";


      const safeValues =
        Array.isArray(
          values
        )
          ? values
          : [];


      if (
        safeValues.length === 0
      ) {

        const tag =
          document.createElement(
            "span"
          );


        tag.className =
          "review-tag";


        tag.textContent =
          "Not recorded";


        container.appendChild(
          tag
        );


        return;
      }


      safeValues.forEach(
        value => {

          const tag =
            document.createElement(
              "span"
            );


          tag.className =
            "review-tag";


          tag.textContent =
            formatter(
              value
            );


          container.appendChild(
            tag
          );

        }
      );

    }


    // =====================================
    // RENDER SELECTED
    // =====================================

    function renderSelectedSpecialist() {

      const specialist =
        specialists.find(
          item =>
            item.id ===
            selectedSpecialistId
        );


      if (
        !specialist ||
        (
          specialist.status &&
          specialist.status !==
            "pending"
        )
      ) {

        showSelectState();

        return;
      }


      selectState.hidden =
        true;


      applicationDetail.hidden =
        false;


      const initials =
        getInitials(
          specialist.fullName
        );


      detailAvatar.textContent =
        initials;


      detailName.textContent =
        specialist.fullName ||
        "Specialist";


      detailSpecialty.textContent =
        specialist.specialty ||
        "Specialty not specified";


      detailId.textContent =
        specialist.id ||
        "Not recorded";


      detailCreated.textContent =
        formatDate(
          specialist.createdAt
        );


      detailVerification.textContent =
        specialist.verificationStatus ||
        "pending";


      reviewFullName.textContent =
        specialist.fullName ||
        "Not recorded";


      reviewEmail.textContent =
        specialist.email ||
        "Not recorded";


      reviewPhone.textContent =
        specialist.phone ||
        "Not recorded";


      reviewSpecialty.textContent =
        specialist.specialty ||
        "Not recorded";


      reviewQualification.textContent =
        specialist.qualification ||
        "Not recorded";


      const experience =
        Number(
          specialist.experience
        );


      reviewExperience.textContent =
        Number.isFinite(
          experience
        )
          ? `${experience} ${
              experience === 1
                ? "year"
                : "years"
            }`
          : "Not recorded";


      reviewLicense.textContent =
        specialist.licenseNumber ||
        "Not recorded";


      reviewBio.textContent =
        specialist.bio ||
        "No professional bio submitted.";


      renderTags(
        reviewConsultationTypes,
        specialist.consultationTypes,
        formatConsultationType
      );


      renderTags(
        reviewLanguages,
        specialist.languages,
        formatLanguage
      );


      const fee =
        Number(
          specialist.price
        );


      reviewFee.textContent =
        Number.isFinite(
          fee
        )
          ? `${fee.toFixed(2)} JOD`
          : "Not recorded";


      if (
        specialist.credentialFileName
      ) {

        documentName.textContent =
          specialist.credentialFileName;


        documentState.textContent =
          "Submitted";

      } else {

        documentName.textContent =
          "No file name recorded";


        documentState.textContent =
          "Not Recorded";

      }

    }


    function showSelectState() {

      selectState.hidden =
        false;


      applicationDetail.hidden =
        true;

    }


    // =====================================
    // SEARCH
    // =====================================

    queueSearch.addEventListener(
      "input",
      () => {

        searchTerm =
          queueSearch.value
            .trim()
            .toLowerCase();


        renderQueue();

      }
    );


    // =====================================
    // APPROVE
    // =====================================

    approveButton.addEventListener(
      "click",
      () => {

        const specialist =
          getSelectedSpecialist();


        if (!specialist) {

          return;
        }


        approveModalText.textContent =
          `${specialist.fullName || "This specialist"} will be marked as verified and approved for RAFIQ practice access.`;


        approveModal.hidden =
          false;

      }
    );


    cancelApprove.addEventListener(
      "click",
      () => {

        approveModal.hidden =
          true;

      }
    );


    confirmApprove.addEventListener(
      "click",
      () => {

        const specialist =
          getSelectedSpecialist();


        if (!specialist) {

          return;
        }


        const now =
          new Date()
            .toISOString();


        updateSpecialistDecision(
          specialist.id,
          {

            status:
              "approved",

            verificationStatus:
              "approved",

            approvedAt:
              now,

            reviewedAt:
              now,

            rejectedAt:
              null,

            rejectionReason:
              null

          }
        );


        approveModal.hidden =
          true;


        showToast(
          "✓",
          "Specialist approved",
          `${specialist.fullName || "The specialist"} now has approved practice status.`
        );


        afterDecision();

      }
    );


    // =====================================
    // REJECT
    // =====================================

    rejectButton.addEventListener(
      "click",
      () => {

        const specialist =
          getSelectedSpecialist();


        if (!specialist) {

          return;
        }


        rejectionReason.value =
          "";


        reasonError.textContent =
          "";


        reasonCount.textContent =
          "0 / 500";


        rejectModal.hidden =
          false;

      }
    );


    rejectionReason.addEventListener(
      "input",
      () => {

        reasonCount.textContent =
          `${rejectionReason.value.length} / 500`;


        reasonError.textContent =
          "";

      }
    );


    cancelReject.addEventListener(
      "click",
      () => {

        rejectModal.hidden =
          true;

      }
    );


    confirmReject.addEventListener(
      "click",
      () => {

        const specialist =
          getSelectedSpecialist();


        if (!specialist) {

          return;
        }


        const reason =
          rejectionReason.value
            .trim();


        if (
          reason.length < 10
        ) {

          reasonError.textContent =
            "Please provide a clear reason of at least 10 characters.";

          return;
        }


        const now =
          new Date()
            .toISOString();


        updateSpecialistDecision(
          specialist.id,
          {

            status:
              "rejected",

            verificationStatus:
              "rejected",

            rejectedAt:
              now,

            reviewedAt:
              now,

            approvedAt:
              null,

            rejectionReason:
              reason

          }
        );


        rejectModal.hidden =
          true;


        showToast(
          "!",
          "Application rejected",
          `${specialist.fullName || "The specialist"} was moved out of the pending queue.`
        );


        afterDecision();

      }
    );


    // =====================================
    // SELECTED SPECIALIST
    // =====================================

    function getSelectedSpecialist() {

      return specialists.find(
        item =>
          item.id ===
          selectedSpecialistId
      ) || null;

    }


    // =====================================
    // UPDATE DECISION
    // =====================================

    function updateSpecialistDecision(
      specialistId,
      changes
    ) {

      /*
        1. Update shared specialist collection.
      */

      specialists =
        specialists.map(
          specialist =>
            specialist.id ===
            specialistId
              ? {
                  ...specialist,
                  ...changes
                }
              : specialist
        );


      writeArray(
        "rafiqSpecialists",
        specialists
      );


      /*
        2. If this is the currently stored
           specialist profile, sync it too.

        This makes Specialist Dashboard react
        immediately to admin approval.
      */

      const currentProfile =
        readObject(
          "rafiqSpecialistProfile"
        );


      if (
        currentProfile?.id ===
        specialistId
      ) {

        const updatedProfile = {
          ...currentProfile,
          ...changes
        };


        localStorage.setItem(
          "rafiqSpecialistProfile",
          JSON.stringify(
            updatedProfile
          )
        );

      }


      /*
        Important:
        Admin does NOT modify:
        name
        specialty
        license
        qualification
        bio
        price
        etc.

        Admin only changes verification /
        platform access state.
      */

    }


    // =====================================
    // AFTER DECISION
    // =====================================

    function afterDecision() {

      selectedSpecialistId =
        null;


      sessionStorage.removeItem(
        "rafiqAdminSelectedSpecialistId"
      );


      renderCounts();

      renderQueue();

      selectNextPending();

    }


    function selectNextPending() {

      const pending =
        getPendingSpecialists();


      if (
        pending.length > 0
      ) {

        selectSpecialist(
          pending[0].id
        );

      } else {

        showSelectState();

      }

    }


    // =====================================
    // TOAST
    // =====================================

    let toastTimer =
      null;


    function showToast(
      icon,
      title,
      message
    ) {

      toastIcon.textContent =
        icon;


      toastTitle.textContent =
        title;


      toastText.textContent =
        message;


      decisionToast.hidden =
        false;


      clearTimeout(
        toastTimer
      );


      toastTimer =
        setTimeout(
          () => {

            decisionToast.hidden =
              true;

          },
          3000
        );

    }


    // =====================================
    // MODAL BACKDROP CLOSE
    // =====================================

    approveModal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          approveModal
        ) {

          approveModal.hidden =
            true;

        }

      }
    );


    rejectModal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          rejectModal
        ) {

          rejectModal.hidden =
            true;

        }

      }
    );


    // =====================================
    // ESCAPE KEY
    // =====================================

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key !==
          "Escape"
        ) {

          return;
        }


        approveModal.hidden =
          true;


        rejectModal.hidden =
          true;


        closeSidebar();

      }
    );


    // =====================================
    // MOBILE SIDEBAR
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

    renderCounts();

    renderQueue();


    /*
      If Dashboard Review button selected an
      application, open it automatically.
    */

    const selectedExists =
      specialists.some(
        specialist =>
          specialist.id ===
            selectedSpecialistId &&
          (
            specialist.status ||
            "pending"
          ) ===
            "pending"
      );


    if (
      selectedExists
    ) {

      renderSelectedSpecialist();

    } else {

      const pending =
        getPendingSpecialists();


      /*
        For convenience, automatically select
        the first pending application.
      */

      if (
        pending.length > 0
      ) {

        selectSpecialist(
          pending[0].id
        );

      } else {

        showSelectState();

      }

    }

  }
);