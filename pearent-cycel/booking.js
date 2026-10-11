document.addEventListener("DOMContentLoaded", () => {

  // =====================================================
  // ELEMENTS
  // =====================================================

  const bookingView =
    document.getElementById("bookingView");

  const missingView =
    document.getElementById("missingView");

  const successView =
    document.getElementById("successView");


  const childAvatar =
    document.getElementById("childAvatar");

  const childName =
    document.getElementById("childName");

  const childAge =
    document.getElementById("childAge");


  const summaryChildAvatar =
    document.getElementById("summaryChildAvatar");

  const summaryChildName =
    document.getElementById("summaryChildName");


  const specialistAvatar =
    document.getElementById("specialistAvatar");

  const specialistName =
    document.getElementById("specialistName");

  const specialistSpecialty =
    document.getElementById("specialistSpecialty");

  const specialistPrice =
    document.getElementById("specialistPrice");


  const consultationOptions =
    document.getElementById("consultationOptions");

  const dateOptions =
    document.getElementById("dateOptions");

  const timeOptions =
    document.getElementById("timeOptions");


  const bookingReason =
    document.getElementById("bookingReason");

  const reasonCount =
    document.getElementById("reasonCount");


  const summarySpecialist =
    document.getElementById("summarySpecialist");

  const summaryType =
    document.getElementById("summaryType");

  const summaryDate =
    document.getElementById("summaryDate");

  const summaryTime =
    document.getElementById("summaryTime");

  const summaryPrice =
    document.getElementById("summaryPrice");


  const bookingError =
    document.getElementById("bookingError");

  const confirmBookingButton =
    document.getElementById("confirmBookingButton");


  // SUCCESS

  const successMessage =
    document.getElementById("successMessage");

  const confirmedSpecialist =
    document.getElementById("confirmedSpecialist");

  const confirmedChild =
    document.getElementById("confirmedChild");

  const confirmedDate =
    document.getElementById("confirmedDate");

  const confirmedTime =
    document.getElementById("confirmedTime");

  const bookingReference =
    document.getElementById("bookingReference");


  // SIDEBAR

  const sidebar =
    document.getElementById("sidebar");

  const sidebarOverlay =
    document.getElementById("sidebarOverlay");

  const menuButton =
    document.getElementById("menuButton");

  const sidebarClose =
    document.getElementById("sidebarClose");

  const logoutButton =
    document.getElementById("logoutButton");


  // =====================================================
  // STORAGE HELPERS
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


  function readObject(key) {

    try {

      return JSON.parse(
        localStorage.getItem(key)
      );

    } catch (error) {

      return null;
    }
  }


  function readSessionObject(key) {

    try {

      return JSON.parse(
        sessionStorage.getItem(key)
      );

    } catch (error) {

      return null;
    }
  }


  // =====================================================
  // VIEWS
  // =====================================================

  function showView(view) {

    [
      bookingView,
      missingView,
      successView
    ].forEach(item => {

      if (item) {
        item.classList.remove("active");
      }

    });


    if (view) {

      view.classList.add("active");
    }


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  // =====================================================
  // CURRENT CHILD
  // =====================================================

  const children =
    readArray("rafiqChildren");


  if (children.length === 0) {

    window.location.href =
      "onboarding.html";

    return;
  }


  const currentChildId =
    localStorage.getItem(
      "rafiqCurrentChildId"
    );


  const currentChild =
    children.find(
      child =>
        child.id === currentChildId
    ) || children[0];


  // =====================================================
  // CHILD AGE
  // =====================================================

  function calculateAge(dateString) {

    if (!dateString) {

      return {
        years: 0,
        months: 0,
        totalMonths: 0
      };
    }


    const birthDate =
      new Date(
        `${dateString}T00:00:00`
      );


    if (
      Number.isNaN(
        birthDate.getTime()
      )
    ) {

      return {
        years: 0,
        months: 0,
        totalMonths: 0
      };
    }


    const today =
      new Date();


    let years =
      today.getFullYear() -
      birthDate.getFullYear();


    let months =
      today.getMonth() -
      birthDate.getMonth();


    if (
      today.getDate() <
      birthDate.getDate()
    ) {

      months--;
    }


    if (months < 0) {

      years--;

      months += 12;
    }


    return {
      years,
      months,
      totalMonths:
        years * 12 + months
    };
  }


  function formatAge(age) {

    if (age.totalMonths < 12) {

      return (
        age.totalMonths +
        (
          age.totalMonths === 1
            ? " month"
            : " months"
        )
      );
    }


    return (
      age.years +
      (
        age.years === 1
          ? " year old"
          : " years old"
      )
    );
  }


  const age =
    calculateAge(
      currentChild.dateOfBirth ||
      currentChild.dob ||
      currentChild.birthDate
    );


  const childInitial =
    String(
      currentChild.name || "C"
    )
      .charAt(0)
      .toUpperCase();


  childAvatar.textContent =
    childInitial;

  childName.textContent =
    currentChild.name;

  childAge.textContent =
    formatAge(age);


  summaryChildAvatar.textContent =
    childInitial;

  summaryChildName.textContent =
    currentChild.name;


  // =====================================================
  // SPECIALIST HELPERS
  // =====================================================

  function getInitials(name) {

    const cleaned =
      String(name || "")
        .replace(
          /^(Dr\.?|Mr\.?|Mrs\.?|Ms\.?)\s+/i,
          ""
        )
        .trim();


    const parts =
      cleaned
        .split(/\s+/)
        .filter(Boolean);


    if (parts.length === 0) {

      return "SP";
    }


    if (parts.length === 1) {

      return parts[0]
        .slice(0, 2)
        .toUpperCase();
    }


    return (
      parts[0][0] +
      parts[
        parts.length - 1
      ][0]
    ).toUpperCase();
  }


  function formatPrice(value) {

    const price =
      Number(value);


    if (
      !Number.isFinite(price)
    ) {

      return "Not specified";
    }


    return Number.isInteger(price)
      ? `${price} JOD`
      : `${price.toFixed(2)} JOD`;
  }


  function formatConsultationType(type) {

    const value =
      String(type || "")
        .toLowerCase();


    if (value === "online") {

      return "Online Consultation";
    }


    return "In-person Consultation";
  }


  // =====================================================
  // SELECTED SPECIALIST SNAPSHOT
  // =====================================================

  const selectedSnapshot =
    readSessionObject(
      "rafiqSelectedSpecialist"
    );


  const selectedSpecialistId =
    sessionStorage.getItem(
      "rafiqSelectedSpecialistId"
    ) ||
    selectedSnapshot?.id ||
    null;


  // =====================================================
  // APPROVED SPECIALIST LOOKUP
  // =====================================================

  function getApprovedSpecialistProfile() {

    if (!selectedSpecialistId) {

      return null;
    }


    const sharedSpecialists =
      readArray(
        "rafiqSpecialists"
      );


    let profile =
      sharedSpecialists.find(
        item =>
          item.id ===
            selectedSpecialistId &&
          item.status ===
            "approved"
      );


    /*
      Prototype compatibility only.

      Normally Parent should find specialists
      through rafiqSpecialists.

      This fallback helps if current specialist
      profile has not been synchronized yet.
    */

    if (!profile) {

      const currentProfile =
        readObject(
          "rafiqSpecialistProfile"
        );


      if (
        currentProfile?.id ===
          selectedSpecialistId &&
        currentProfile.status ===
          "approved"
      ) {

        profile =
          currentProfile;
      }
    }


    return profile || null;
  }


  const approvedProfile =
    getApprovedSpecialistProfile();


  /*
    IMPORTANT:

    We do NOT trust the sessionStorage
    specialist alone.

    The shared specialist profile must
    currently be approved.
  */

  if (
    !selectedSnapshot ||
    !selectedSpecialistId ||
    !approvedProfile
  ) {

    showView(
      missingView
    );

    return;
  }


  // =====================================================
  // NORMALIZED SPECIALIST
  // =====================================================

  const specialist = {

    id:
      approvedProfile.id,


    name:
      approvedProfile.fullName ||
      selectedSnapshot.name ||
      selectedSnapshot.fullName ||
      "Specialist",


    initials:
      approvedProfile.initials ||
      selectedSnapshot.initials ||
      getInitials(
        approvedProfile.fullName ||
        selectedSnapshot.name
      ),


    specialty:
      approvedProfile.specialty ||
      selectedSnapshot.specialty ||
      "Specialist",


    consultationTypes:
      Array.isArray(
        approvedProfile.consultationTypes
      )
        ? approvedProfile.consultationTypes
        : (
            Array.isArray(
              selectedSnapshot.consultationTypes
            )
              ? selectedSnapshot.consultationTypes
              : []
          ),


    price:
      Number.isFinite(
        Number(
          approvedProfile.price
        )
      )
        ? Number(
            approvedProfile.price
          )
        : (
            Number.isFinite(
              parseFloat(
                selectedSnapshot.price
              )
            )
              ? parseFloat(
                  selectedSnapshot.price
                )
              : 0
          )
  };


  // =====================================================
  // SPECIALIST UI
  // =====================================================

  specialistAvatar.textContent =
    specialist.initials;


  specialistName.textContent =
    specialist.name;


  specialistSpecialty.textContent =
    specialist.specialty;


  specialistPrice.textContent =
    formatPrice(
      specialist.price
    );


  summarySpecialist.textContent =
    specialist.name;


  summaryPrice.textContent =
    formatPrice(
      specialist.price
    );


  // =====================================================
  // BOOKING STATE
  // =====================================================

  let selectedType =
    null;

  let selectedDate =
    null;

  let selectedDateLabel =
    null;

  let selectedTime =
    null;


  // =====================================================
  // CONSULTATION TYPES
  // =====================================================

  function renderConsultationTypes() {

    consultationOptions.innerHTML =
      "";


    if (
      specialist.consultationTypes.length === 0
    ) {

      consultationOptions.textContent =
        "This specialist has not configured consultation types yet.";

      return;
    }


    specialist.consultationTypes
      .forEach(type => {

        const button =
          document.createElement(
            "button"
          );


        button.type =
          "button";


        button.className =
          "consultation-option";


        const isOnline =
          type === "online";


        const title =
          isOnline
            ? "Online Consultation"
            : "In-person Consultation";


        const description =
          isOnline
            ? "Remote consultation appointment with the specialist."
            : "Meet the specialist at their practice location.";


        button.innerHTML = `
          <span class="consultation-icon">
            ${isOnline ? "◉" : "⌂"}
          </span>

          <span>
            <strong>
              ${title}
            </strong>

            <span>
              ${description}
            </span>
          </span>
        `;


        button.addEventListener(
          "click",
          () => {

            selectedType =
              type;


            document
              .querySelectorAll(
                ".consultation-option"
              )
              .forEach(item => {

                item.classList.remove(
                  "selected"
                );
              });


            button.classList.add(
              "selected"
            );


            summaryType.textContent =
              title;


            clearError();
          }
        );


        consultationOptions
          .appendChild(
            button
          );
      });
  }


  // =====================================================
  // AVAILABILITY
  // =====================================================

  const availability =
    readObject(
      `rafiqAvailability_${specialist.id}`
    );


  const dayIndexes = {

    sunday: 0,
    sun: 0,

    monday: 1,
    mon: 1,

    tuesday: 2,
    tue: 2,
    tues: 2,

    wednesday: 3,
    wed: 3,

    thursday: 4,
    thu: 4,
    thur: 4,
    thurs: 4,

    friday: 5,
    fri: 5,

    saturday: 6,
    sat: 6
  };


  function normalizeDayIndex(value) {

    if (
      typeof value === "number" &&
      value >= 0 &&
      value <= 6
    ) {

      return value;
    }


    const normalized =
      String(value ?? "")
        .trim()
        .toLowerCase();


    if (
      /^\d$/.test(normalized)
    ) {

      const number =
        Number(normalized);


      return number >= 0 &&
        number <= 6
          ? number
          : null;
    }


    return (
      dayIndexes[
        normalized
      ] ??
      null
    );
  }


  function normalizeScheduleEntry(
    item,
    fallbackDay = null
  ) {

    const source =
      item &&
      typeof item === "object"
        ? item
        : {};


    const dayValue =
      source.dayIndex ??
      source.dayKey ??
      source.dayName ??
      source.day ??
      source.name ??
      fallbackDay;


    return {

      dayIndex:
        normalizeDayIndex(
          dayValue
        ),


      enabled:
        source.enabled !== false &&
        source.active !== false &&
        source.isActive !== false,


      start:
        source.start ||
        source.startTime ||
        source.from ||
        source.open ||
        "",


      end:
        source.end ||
        source.endTime ||
        source.to ||
        source.close ||
        ""
    };
  }


  function getWeeklySchedule() {

    const weekly =
      availability?.weeklySchedule;


    if (!weekly) {

      return [];
    }


    if (
      Array.isArray(weekly)
    ) {

      return weekly
        .map(
          item =>
            normalizeScheduleEntry(
              item
            )
        )
        .filter(
          item =>
            item.dayIndex !== null
        );
    }


    if (
      typeof weekly === "object"
    ) {

      return Object
        .entries(weekly)
        .map(
          ([day, item]) =>
            normalizeScheduleEntry(
              item,
              day
            )
        )
        .filter(
          item =>
            item.dayIndex !== null
        );
    }


    return [];
  }


  const weeklySchedule =
    getWeeklySchedule();


  const slotDuration =
    Number(
      availability?.slotDuration
    ) || 60;


  // =====================================================
  // TIME HELPERS
  // =====================================================

  function parseTimeToMinutes(value) {

    const text =
      String(value || "")
        .trim();


    if (!text) {

      return null;
    }


    const twelveHour =
      text.match(
        /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
      );


    if (twelveHour) {

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

        hours = 0;
      }


      if (
        period === "PM" &&
        hours !== 12
      ) {

        hours += 12;
      }


      return (
        hours * 60 +
        minutes
      );
    }


    const twentyFourHour =
      text.match(
        /^(\d{1,2}):(\d{2})$/
      );


    if (twentyFourHour) {

      return (
        Number(
          twentyFourHour[1]
        ) *
          60 +
        Number(
          twentyFourHour[2]
        )
      );
    }


    return null;
  }


  function formatMinutesAsTime(
    totalMinutes
  ) {

    const hours24 =
      Math.floor(
        totalMinutes / 60
      );


    const minutes =
      totalMinutes % 60;


    const period =
      hours24 >= 12
        ? "PM"
        : "AM";


    const hours12 =
      hours24 % 12 ||
      12;


    return (
      `${hours12}:` +
      `${String(minutes).padStart(
        2,
        "0"
      )} ${period}`
    );
  }


  // =====================================================
  // BOOKINGS
  // =====================================================

  function getBookings() {

    return readArray(
      "rafiqBookings"
    );
  }


  function isSlotBooked(
    dateKey,
    time
  ) {

    const selectedMinutes =
      parseTimeToMinutes(
        time
      );


    return getBookings()
      .some(booking => {

        if (
          booking.specialistId !==
          specialist.id
        ) {

          return false;
        }


        if (
          booking.status ===
          "cancelled"
        ) {

          return false;
        }


        if (
          booking.date !==
          dateKey
        ) {

          return false;
        }


        return (
          parseTimeToMinutes(
            booking.time
          ) ===
          selectedMinutes
        );
      });
  }


  // =====================================================
  // DATE HELPERS
  // =====================================================

  function toLocalDateKey(date) {

    const year =
      date.getFullYear();


    const month =
      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      );


    const day =
      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      );


    return (
      `${year}-${month}-${day}`
    );
  }


  function formatFullDate(date) {

    return date.toLocaleDateString(
      undefined,
      {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
      }
    );
  }


  function getScheduleForDate(
    date
  ) {

    return weeklySchedule.find(
      item =>
        item.dayIndex ===
          date.getDay() &&
        item.enabled
    ) || null;
  }


  // =====================================================
  // AVAILABLE TIMES
  // =====================================================

  function getTimesForDate(date) {

    const schedule =
      getScheduleForDate(
        date
      );


    if (!schedule) {

      return [];
    }


    const start =
      parseTimeToMinutes(
        schedule.start
      );


    const end =
      parseTimeToMinutes(
        schedule.end
      );


    if (
      start === null ||
      end === null ||
      end <= start
    ) {

      return [];
    }


    const dateKey =
      toLocalDateKey(
        date
      );


    const times =
      [];


    for (
      let minutes = start;
      minutes + slotDuration <= end;
      minutes += slotDuration
    ) {

      const time =
        formatMinutesAsTime(
          minutes
        );


      if (
        !isSlotBooked(
          dateKey,
          time
        )
      ) {

        times.push(
          time
        );
      }
    }


    return times;
  }


  // =====================================================
  // FUTURE DATES
  // =====================================================

  function getFutureDates() {

    const dates =
      [];


    /*
      No fake schedule anymore.

      Specialist must configure Availability.
    */

    if (
      !availability ||
      weeklySchedule.length === 0
    ) {

      return dates;
    }


    const today =
      new Date();


    /*
      Look ahead up to 45 days and show
      the first 5 dates that still have
      at least one free slot.
    */

    for (
      let i = 1;
      i <= 45 &&
      dates.length < 5;
      i++
    ) {

      const date =
        new Date(today);


      date.setDate(
        today.getDate() + i
      );


      const freeTimes =
        getTimesForDate(
          date
        );


      if (
        freeTimes.length > 0
      ) {

        dates.push(
          date
        );
      }
    }


    return dates;
  }


  // =====================================================
  // RENDER DATES
  // =====================================================

  function renderDates() {

    dateOptions.innerHTML =
      "";


    timeOptions.innerHTML =
      "";


    const dates =
      getFutureDates();


    if (
      dates.length === 0
    ) {

      dateOptions.textContent =
        "No bookable availability is currently configured for this specialist.";


      timeOptions.textContent =
        "Choose another specialist or check again after the specialist updates their availability.";


      return;
    }


    dates.forEach(date => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "date-button";


      const weekday =
        date.toLocaleDateString(
          undefined,
          {
            weekday: "short"
          }
        );


      const month =
        date.toLocaleDateString(
          undefined,
          {
            month: "short"
          }
        );


      button.innerHTML = `
        <span>
          ${weekday}
        </span>

        <strong>
          ${date.getDate()}
        </strong>

        <small>
          ${month}
        </small>
      `;


      button.addEventListener(
        "click",
        () => {

          selectedDate =
            toLocalDateKey(
              date
            );


          selectedDateLabel =
            formatFullDate(
              date
            );


          selectedTime =
            null;


          document
            .querySelectorAll(
              ".date-button"
            )
            .forEach(item => {

              item.classList.remove(
                "selected"
              );
            });


          button.classList.add(
            "selected"
          );


          summaryDate.textContent =
            selectedDateLabel;


          summaryTime.textContent =
            "Not selected";


          renderTimes(
            date
          );


          clearError();
        }
      );


      dateOptions.appendChild(
        button
      );
    });
  }


  // =====================================================
  // RENDER TIMES
  // =====================================================

  function renderTimes(date) {

    timeOptions.innerHTML =
      "";


    const times =
      getTimesForDate(
        date
      );


    if (
      times.length === 0
    ) {

      timeOptions.textContent =
        "No free time slots remain for this date.";

      return;
    }


    times.forEach(time => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "time-button";


      button.textContent =
        time;


      button.addEventListener(
        "click",
        () => {

          selectedTime =
            time;


          document
            .querySelectorAll(
              ".time-button"
            )
            .forEach(item => {

              item.classList.remove(
                "selected"
              );
            });


          button.classList.add(
            "selected"
          );


          summaryTime.textContent =
            time;


          clearError();
        }
      );


      timeOptions.appendChild(
        button
      );
    });
  }


  // =====================================================
  // TEXTAREA
  // =====================================================

  bookingReason.addEventListener(
    "input",
    () => {

      reasonCount.textContent =
        `${bookingReason.value.length} / 500`;
    }
  );


  // =====================================================
  // ERROR
  // =====================================================

  function clearError() {

    bookingError.textContent =
      "";
  }


  // =====================================================
  // CHECK CURRENT APPROVAL
  // =====================================================

  function isSpecialistStillApproved() {

    const latestProfiles =
      readArray(
        "rafiqSpecialists"
      );


    return latestProfiles.some(
      item =>
        item.id ===
          specialist.id &&
        item.status ===
          "approved"
    );
  }


  // =====================================================
  // VALIDATE BOOKING
  // =====================================================

  function validateBooking() {

    if (
      !isSpecialistStillApproved()
    ) {

      bookingError.textContent =
        "This specialist is no longer available for new bookings.";

      return false;
    }


    if (!selectedType) {

      bookingError.textContent =
        "Please choose a consultation type.";

      return false;
    }


    if (
      !specialist
        .consultationTypes
        .includes(
          selectedType
        )
    ) {

      bookingError.textContent =
        "This consultation type is no longer available.";

      return false;
    }


    if (!selectedDate) {

      bookingError.textContent =
        "Please choose an appointment date.";

      return false;
    }


    if (!selectedTime) {

      bookingError.textContent =
        "Please choose an appointment time.";

      return false;
    }


    /*
      Check again at confirmation time.

      Prevents selecting a slot, then another
      booking taking that same slot before
      confirmation.
    */

    if (
      isSlotBooked(
        selectedDate,
        selectedTime
      )
    ) {

      bookingError.textContent =
        "That time slot is no longer available. Please choose another time.";


      selectedTime =
        null;


      summaryTime.textContent =
        "Not selected";


      const selectedDateObject =
        new Date(
          `${selectedDate}T00:00:00`
        );


      renderTimes(
        selectedDateObject
      );


      return false;
    }


    return true;
  }


  // =====================================================
  // CREATE BOOKING
  // =====================================================

  function createBooking() {

    /*
      Pull the latest approved profile again
      before creating the booking.
    */

    const latestProfile =
      getApprovedSpecialistProfile();


    if (!latestProfile) {

      return null;
    }


    const latestName =
      latestProfile.fullName ||
      specialist.name;


    const latestInitials =
      latestProfile.initials ||
      getInitials(
        latestName
      );


    const latestPrice =
      Number.isFinite(
        Number(
          latestProfile.price
        )
      )
        ? Number(
            latestProfile.price
          )
        : specialist.price;


    const bookingId =
      "RFQ-" +
      Date.now()
        .toString()
        .slice(-7);


    const booking = {

      id:
        bookingId,


      status:
        "confirmed",


      childId:
        currentChild.id,


      childName:
        currentChild.name,


      /*
        CRITICAL:

        Exact ID from the approved shared
        specialist profile.

        This is what allows the specialist
        account to receive this booking.
      */

      specialistId:
        latestProfile.id,


      specialistName:
        latestName,


      specialistInitials:
        latestInitials,


      specialty:
        latestProfile.specialty ||
        specialist.specialty,


      consultationType:
        selectedType,


      date:
        selectedDate,


      dateLabel:
        selectedDateLabel,


      time:
        selectedTime,


      price:
        latestPrice,


      currency:
        "JOD",


      reason:
        bookingReason.value
          .trim(),


      createdAt:
        new Date()
          .toISOString()
    };


    const bookings =
      getBookings();


    bookings.unshift(
      booking
    );


    localStorage.setItem(
      "rafiqBookings",
      JSON.stringify(
        bookings
      )
    );


    // =====================================
    // PARENT NOTIFICATION
    // =====================================

    if (
      window.createRafiqNotification
    ) {

      createRafiqNotification({

        type:
          "booking",

        title:
          "Appointment confirmed",

        message:
          `${latestName} • ${selectedDateLabel} at ${selectedTime}`,

        link:
          "bookings.html",

        childId:
          currentChild.id
      });
    }


    return booking;
  }


  // =====================================================
  // CONFIRM
  // =====================================================

  confirmBookingButton.addEventListener(
    "click",
    () => {

      clearError();


      if (
        !validateBooking()
      ) {

        return;
      }


      const confirmedBooking =
        createBooking();


      if (
        !confirmedBooking
      ) {

        bookingError.textContent =
          "The specialist is no longer approved for booking.";

        return;
      }


      /*
        Selection was only needed while
        building this booking.
      */

      sessionStorage.removeItem(
        "rafiqSelectedSpecialist"
      );


      sessionStorage.removeItem(
        "rafiqSelectedSpecialistId"
      );


      showSuccess(
        confirmedBooking
      );
    }
  );


  // =====================================================
  // SUCCESS
  // =====================================================

  function showSuccess(booking) {

    successMessage.textContent =
      `Your appointment with ${booking.specialistName} has been saved for ${booking.childName}.`;


    confirmedSpecialist.textContent =
      booking.specialistName;


    confirmedChild.textContent =
      booking.childName;


    confirmedDate.textContent =
      booking.dateLabel;


    confirmedTime.textContent =
      booking.time;


    bookingReference.textContent =
      booking.id;


    showView(
      successView
    );
  }


  // =====================================================
  // SIDEBAR
  // =====================================================

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
  // LOGOUT
  // =====================================================

  logoutButton.addEventListener(
    "click",
    () => {

      sessionStorage.clear();


      window.location.href =
        "../piblic-pages/login.html";
    }
  );


  // =====================================================
  // INITIALIZE
  // =====================================================

  renderConsultationTypes();

  renderDates();

  showView(
    bookingView
  );

});