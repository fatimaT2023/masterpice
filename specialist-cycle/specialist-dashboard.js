document.addEventListener(
  "DOMContentLoaded",
  () => {

    // =================================
    // ELEMENTS
    // =================================

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


    const topbarStatus =
      document.getElementById(
        "topbarStatus"
      );

    const topbarStatusText =
      document.getElementById(
        "topbarStatusText"
      );


    const approvalBanner =
      document.getElementById(
        "approvalBanner"
      );

    const approvalKicker =
      document.getElementById(
        "approvalKicker"
      );

    const approvalTitle =
      document.getElementById(
        "approvalTitle"
      );

    const approvalDescription =
      document.getElementById(
        "approvalDescription"
      );

    const approvalAction =
      document.getElementById(
        "approvalAction"
      );


    const heroName =
      document.getElementById(
        "heroName"
      );

    const heroMessage =
      document.getElementById(
        "heroMessage"
      );

    const heroAvatar =
      document.getElementById(
        "heroAvatar"
      );

    const heroSpecialty =
      document.getElementById(
        "heroSpecialty"
      );

    const heroExperience =
      document.getElementById(
        "heroExperience"
      );


    const todayCount =
      document.getElementById(
        "todayCount"
      );

    const upcomingCount =
      document.getElementById(
        "upcomingCount"
      );

    const completedCount =
      document.getElementById(
        "completedCount"
      );

    const earningsValue =
      document.getElementById(
        "earningsValue"
      );


    const todaySchedule =
      document.getElementById(
        "todaySchedule"
      );

    const todayEmpty =
      document.getElementById(
        "todayEmpty"
      );


    const upcomingList =
      document.getElementById(
        "upcomingList"
      );

    const upcomingEmpty =
      document.getElementById(
        "upcomingEmpty"
      );

    const upcomingEmptyText =
      document.getElementById(
        "upcomingEmptyText"
      );


    const profileSpecialty =
      document.getElementById(
        "profileSpecialty"
      );

    const profileConsultation =
      document.getElementById(
        "profileConsultation"
      );

    const profileLanguages =
      document.getElementById(
        "profileLanguages"
      );

    const profileFee =
      document.getElementById(
        "profileFee"
      );


    const lockedToast =
      document.getElementById(
        "lockedToast"
      );


    // =================================
    // PROFILE
    // =================================

    function getSpecialistProfile() {

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
      getSpecialistProfile();


    if (!specialist) {

      window.location.href =
        "specialist-onboarding.html";

      return;
    }


    const specialistId =
      specialist.id;


    // =================================
    // NAME HELPERS
    // =================================

    function getFirstName(
      fullName
    ) {

      const cleaned =
        String(fullName || "")
          .replace(
            /^(Dr\.?|Mr\.?|Mrs\.?|Ms\.?)\s+/i,
            ""
          )
          .trim();


      return (
        cleaned.split(" ")[0] ||
        "Specialist"
      );
    }


    function getInitials(
      fullName
    ) {

      const cleaned =
        String(fullName || "")
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
        parts[parts.length - 1][0]
      ).toUpperCase();
    }


    const initials =
      getInitials(
        specialist.fullName
      );


    // =================================
    // PROFILE UI
    // =================================

    sidebarAvatar.textContent =
      initials;


    sidebarName.textContent =
      specialist.fullName;


    sidebarSpecialty.textContent =
      specialist.specialty;


    heroAvatar.textContent =
      initials;


    heroName.textContent =
      getFirstName(
        specialist.fullName
      );


    heroSpecialty.textContent =
      specialist.specialty;


    const experience =
      Number(
        specialist.experience || 0
      );


    heroExperience.textContent =
      `${experience} ${
        experience === 1
          ? "year"
          : "years"
      } experience`;


    profileSpecialty.textContent =
      specialist.specialty;


    profileConsultation.textContent =
      specialist.consultationLabel ||
      (
        specialist.consultationTypes ||
        []
      )
        .map(
          type =>
            type === "online"
              ? "Online"
              : "In-person"
        )
        .join(" & ") ||
      "Not set";


    profileLanguages.textContent =
      (
        specialist.languages ||
        []
      ).join(", ") ||
      "Not set";


    profileFee.textContent =
      `${specialist.price || 0} ${
        specialist.currency ||
        "JOD"
      }`;


    // =================================
    // STATUS
    // =================================

    const profileStatus =
      specialist.status ||
      "pending";


    const isApproved =
      profileStatus ===
      "approved";


    function renderStatus() {

      sidebarStatus.classList.remove(
        "approved",
        "rejected"
      );


      topbarStatus.classList.remove(
        "approved",
        "rejected"
      );


      approvalBanner.classList.remove(
        "approved",
        "rejected"
      );


      if (
        profileStatus === "approved"
      ) {

        sidebarStatus.classList.add(
          "approved"
        );


        topbarStatus.classList.add(
          "approved"
        );


        sidebarStatusText.textContent =
          "Approved";


        topbarStatusText.textContent =
          "Approved Specialist";


        approvalBanner.classList.add(
          "approved"
        );


        approvalKicker.textContent =
          "PROFILE APPROVED";


        approvalTitle.textContent =
          "Your specialist profile is active.";


        approvalDescription.textContent =
          "You can now manage availability, receive parent bookings and complete consultations through RAFIQ.";


        approvalAction.textContent =
          "Manage Availability";


        approvalAction.href =
          "availability.html";


        heroMessage.textContent =
          "Manage your upcoming appointments, availability and consultation activity from one place.";

      } else if (
        profileStatus === "rejected"
      ) {

        sidebarStatus.classList.add(
          "rejected"
        );


        topbarStatus.classList.add(
          "rejected"
        );


        approvalBanner.classList.add(
          "rejected"
        );


        sidebarStatusText.textContent =
          "Needs Attention";


        topbarStatusText.textContent =
          "Profile Needs Attention";


        approvalKicker.textContent =
          "PROFILE REVIEW";


        approvalTitle.textContent =
          "Your specialist profile needs attention.";


        approvalDescription.textContent =
          "Review your professional information and any feedback before submitting updated details.";


        approvalAction.textContent =
          "Review Profile";


        approvalAction.href =
          "specialist-settings.html";


        heroMessage.textContent =
          "Your practice tools remain unavailable until your specialist profile is approved.";

      } else {

        sidebarStatusText.textContent =
          "Pending Review";


        topbarStatusText.textContent =
          "Pending Review";


        approvalKicker.textContent =
          "PROFILE UNDER REVIEW";


        approvalTitle.textContent =
          "Your specialist profile is pending approval.";


        approvalDescription.textContent =
          "RAFIQ administration will review your professional information before your profile becomes visible to parents.";


        approvalAction.textContent =
          "Review Profile";


        approvalAction.href =
          "specialist-settings.html";


        heroMessage.textContent =
          "Your profile has been submitted. Practice tools will become available after RAFIQ administration approves your account.";
      }

    }


    // =================================
    // BOOKINGS
    // =================================

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


    const allBookings =
      getBookings();


    const specialistBookings =
      allBookings.filter(
        booking =>
          booking.specialistId ===
          specialistId
      );


    // =================================
    // DATE HELPERS
    // =================================

    function getDateOnly(
      date
    ) {

      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
    }


    function bookingDateObject(
      booking
    ) {

      return new Date(
        `${booking.date}T00:00:00`
      );
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


      const bookingDate =
        bookingDateObject(
          booking
        );


      const today =
        getDateOnly(
          new Date()
        );


      if (
        getDateOnly(
          bookingDate
        ) < today
      ) {

        return "completed";
      }


      return "upcoming";
    }


    function isToday(
      booking
    ) {

      const bookingDate =
        bookingDateObject(
          booking
        );


      const today =
        new Date();


      return (
        bookingDate.getFullYear() ===
          today.getFullYear() &&

        bookingDate.getMonth() ===
          today.getMonth() &&

        bookingDate.getDate() ===
          today.getDate()
      );
    }


    function formatBookingDate(
      booking
    ) {

      if (
        booking.dateLabel
      ) {

        return booking.dateLabel;
      }


      const date =
        bookingDateObject(
          booking
        );


      return date.toLocaleDateString(
        undefined,
        {
          month: "short",
          day: "numeric",
          year: "numeric"
        }
      );
    }


    function typeLabel(
      type
    ) {

      return type === "online"
        ? "Online"
        : "In-person";
    }


    // =================================
    // EARNINGS
    // =================================

    function parsePrice(
      value
    ) {

      if (
        typeof value === "number"
      ) {

        return value;
      }


      const parsed =
        parseFloat(
          String(value || "")
            .replace(
              /[^\d.]/g,
              ""
            )
        );


      return Number.isFinite(
        parsed
      )
        ? parsed
        : 0;
    }


    function getCompletedEarnings() {

      return specialistBookings
        .filter(
          booking =>
            getBookingStatus(
              booking
            ) === "completed"
        )
        .reduce(
          (sum, booking) =>
            sum +
            parsePrice(
              booking.price
            ),
          0
        );
    }


    // =================================
    // METRICS
    // =================================

    function renderMetrics() {

      if (!isApproved) {

        todayCount.textContent =
          "0";


        upcomingCount.textContent =
          "0";


        completedCount.textContent =
          "0";


        earningsValue.textContent =
          "0 JOD";


        return;
      }


      const activeBookings =
        specialistBookings.filter(
          booking =>
            booking.status !==
            "cancelled"
        );


      const todayBookings =
        activeBookings.filter(
          booking =>
            isToday(
              booking
            ) &&
            getBookingStatus(
              booking
            ) === "upcoming"
        );


      const upcoming =
        activeBookings.filter(
          booking =>
            getBookingStatus(
              booking
            ) === "upcoming"
        );


      const completed =
        activeBookings.filter(
          booking =>
            getBookingStatus(
              booking
            ) === "completed"
        );


      todayCount.textContent =
        todayBookings.length;


      upcomingCount.textContent =
        upcoming.length;


      completedCount.textContent =
        completed.length;


      earningsValue.textContent =
        `${getCompletedEarnings()} JOD`;
    }


    // =================================
    // ESCAPE
    // =================================

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


    // =================================
    // TODAY SCHEDULE
    // =================================

    function renderTodaySchedule() {

      todaySchedule.innerHTML =
        "";


      if (!isApproved) {

        todayEmpty.hidden =
          false;


        todayEmpty.querySelector(
          "strong"
        ).textContent =
          "Schedule unavailable";


        todayEmpty.querySelector(
          "p"
        ).textContent =
          "Your schedule will become available after profile approval.";


        return;
      }


      const bookings =
        specialistBookings
          .filter(
            booking =>
              booking.status !==
                "cancelled" &&
              isToday(
                booking
              ) &&
              getBookingStatus(
                booking
              ) === "upcoming"
          );


      todayEmpty.hidden =
        bookings.length !== 0;


      bookings.forEach(
        booking => {

          const item =
            document.createElement(
              "article"
            );


          item.className =
            "schedule-item";


          item.innerHTML = `
            <div class="schedule-time">

              <strong>
                ${escapeHTML(
                  booking.time
                )}
              </strong>

              <span>
                Today
              </span>

            </div>


            <div class="schedule-info">

              <h3>
                ${escapeHTML(
                  booking.childName
                )}
              </h3>

              <p>
                ${escapeHTML(
                  booking.reason ||
                  "Consultation"
                )}
              </p>

            </div>


            <span class="consultation-badge">
              ${typeLabel(
                booking.consultationType
              )}
            </span>
          `;


          item.addEventListener(
            "click",
            () => {

              openConsultation(
                booking
              );
            }
          );


          item.style.cursor =
            "pointer";


          todaySchedule.appendChild(
            item
          );
        }
      );

    }


    // =================================
    // UPCOMING
    // =================================

    function renderUpcoming() {

      upcomingList.innerHTML =
        "";


      if (!isApproved) {

        upcomingEmpty.hidden =
          false;


        upcomingEmptyText.textContent =
          "Bookings will appear here after your specialist profile is approved.";


        return;
      }


      const bookings =
        specialistBookings
          .filter(
            booking =>
              booking.status !==
                "cancelled" &&
              getBookingStatus(
                booking
              ) === "upcoming"
          )
          .sort(
            (a,b) =>
              bookingDateObject(a) -
              bookingDateObject(b)
          )
          .slice(
            0,
            5
          );


      upcomingEmpty.hidden =
        bookings.length !== 0;


      bookings.forEach(
        booking => {

          const item =
            document.createElement(
              "article"
            );


          item.className =
            "upcoming-item";


          const childInitial =
            String(
              booking.childName ||
              "C"
            )
              .charAt(0)
              .toUpperCase();


          item.innerHTML = `
            <div class="child-avatar">
              ${escapeHTML(
                childInitial
              )}
            </div>


            <div class="upcoming-child">

              <h3>
                ${escapeHTML(
                  booking.childName
                )}
              </h3>

              <p>
                ${escapeHTML(
                  booking.reason ||
                  "Parent consultation"
                )}
              </p>

            </div>


            <div class="upcoming-meta">

              <span>
                Date
              </span>

              <strong>
                ${escapeHTML(
                  formatBookingDate(
                    booking
                  )
                )}
              </strong>

            </div>


            <div class="upcoming-meta">

              <span>
                Time
              </span>

              <strong>
                ${escapeHTML(
                  booking.time
                )}
              </strong>

            </div>


            <div class="upcoming-meta">

              <span>
                Type
              </span>

              <strong>
                ${typeLabel(
                  booking.consultationType
                )}
              </strong>

            </div>


            <button
              type="button"
              class="view-button"
              data-id="${escapeHTML(
                booking.id
              )}"
            >
              View
            </button>
          `;


          item
            .querySelector(
              ".view-button"
            )
            .addEventListener(
              "click",
              () => {

                openConsultation(
                  booking
                );
              }
            );


          upcomingList.appendChild(
            item
          );
        }
      );

    }


    // =================================
    // CONSULTATION HANDOFF
    // =================================

    function openConsultation(
      booking
    ) {

      sessionStorage.setItem(
        "rafiqSelectedSpecialistBooking",
        booking.id
      );


      window.location.href =
        "consultation.html";
    }


    // =================================
    // LOCK PENDING TOOLS
    // =================================

    let toastTimer =
      null;


    function showLockedToast() {

      lockedToast.hidden =
        false;


      window.clearTimeout(
        toastTimer
      );


      toastTimer =
        window.setTimeout(
          () => {

            lockedToast.hidden =
              true;
          },
          2800
        );
    }


    function setupPracticeLocks() {

      if (isApproved) {
        return;
      }


      document
        .querySelectorAll(
          ".practice-link"
        )
        .forEach(
          link => {

            link.classList.add(
              "locked"
            );


            link.addEventListener(
              "click",
              event => {

                event.preventDefault();

                showLockedToast();
              }
            );
          }
        );

    }


    // =================================
    // SIDEBAR
    // =================================

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


    // =================================
    // LOGOUT
    // =================================

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


    // =================================
    // INIT
    // =================================

    renderStatus();

    renderMetrics();

    renderTodaySchedule();

    renderUpcoming();

    setupPracticeLocks();

  }
);
