document.addEventListener(
  "DOMContentLoaded",
  () => {

    // =========================
    // ELEMENTS
    // =========================

    const paymentView =
      document.getElementById(
        "paymentView"
      );

    const successView =
      document.getElementById(
        "successView"
      );

    const missingPlanView =
      document.getElementById(
        "missingPlanView"
      );


    const childAvatar =
      document.getElementById(
        "childAvatar"
      );

    const childName =
      document.getElementById(
        "childName"
      );

    const childAge =
      document.getElementById(
        "childAge"
      );


    const planName =
      document.getElementById(
        "planName"
      );

    const planPrice =
      document.getElementById(
        "planPrice"
      );

    const totalPrice =
      document.getElementById(
        "totalPrice"
      );

    const billingCycle =
      document.getElementById(
        "billingCycle"
      );


    const methodButtons =
      document.querySelectorAll(
        ".method-button"
      );

    const cardSection =
      document.getElementById(
        "cardSection"
      );

    const walletSection =
      document.getElementById(
        "walletSection"
      );


    const cardholderName =
      document.getElementById(
        "cardholderName"
      );

    const cardNumber =
      document.getElementById(
        "cardNumber"
      );

    const expiryDate =
      document.getElementById(
        "expiryDate"
      );

    const cvv =
      document.getElementById(
        "cvv"
      );


    const nameError =
      document.getElementById(
        "nameError"
      );

    const cardError =
      document.getElementById(
        "cardError"
      );

    const expiryError =
      document.getElementById(
        "expiryError"
      );

    const cvvError =
      document.getElementById(
        "cvvError"
      );


    const termsCheckbox =
      document.getElementById(
        "termsCheckbox"
      );

    const paymentError =
      document.getElementById(
        "paymentError"
      );

    const payButton =
      document.getElementById(
        "payButton"
      );


    const paymentReference =
      document.getElementById(
        "paymentReference"
      );

    const successAmount =
      document.getElementById(
        "successAmount"
      );

    const successMethod =
      document.getElementById(
        "successMethod"
      );


    // =========================
    // VIEWS
    // =========================

    function showView(
      target
    ) {

      [
        paymentView,
        successView,
        missingPlanView
      ].forEach(
        view => {

          view.classList.remove(
            "active"
          );

        }
      );


      target.classList.add(
        "active"
      );


      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }


    // =========================
    // CHILD
    // =========================

    function getChildren() {

      try {

        return JSON.parse(
          localStorage.getItem(
            "rafiqChildren"
          )
        ) || [];

      } catch (error) {

        return [];
      }
    }


    const children =
      getChildren();


    if (
      children.length === 0
    ) {

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
          child.id ===
          currentChildId
      ) || children[0];


    function calculateAge(
      dateString
    ) {

      const birthDate =
        new Date(
          dateString +
          "T00:00:00"
        );


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


      if (
        months < 0
      ) {

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


    function formatAge(
      age
    ) {

      if (
        age.totalMonths < 12
      ) {

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
        currentChild.dateOfBirth
      );


    childAvatar.textContent =
      currentChild.name
        .charAt(0)
        .toUpperCase();


    childName.textContent =
      currentChild.name;


    childAge.textContent =
      formatAge(age);


    // =========================
    // SELECTED PLAN
    // =========================

    function getSelectedPlan() {

      try {

        return JSON.parse(
          sessionStorage.getItem(
            "rafiqSelectedPlan"
          )
        );

      } catch (error) {

        return null;
      }
    }


    const selectedPlan =
      getSelectedPlan();


    if (!selectedPlan) {

      showView(
        missingPlanView
      );

      return;
    }


    planName.textContent =
      selectedPlan.name;


    planPrice.textContent =
      `${selectedPlan.price} ${selectedPlan.currency}`;


    totalPrice.textContent =
      `${selectedPlan.price} ${selectedPlan.currency}`;


    billingCycle.textContent =
      selectedPlan.billing === "monthly"
        ? "Monthly"
        : selectedPlan.billing;


    // =========================
    // PAYMENT METHOD
    // =========================

    let selectedMethod =
      "card";


    methodButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            selectedMethod =
              button.dataset.method;


            methodButtons.forEach(
              item => {

                item.classList.remove(
                  "active"
                );

              }
            );


            button.classList.add(
              "active"
            );


            if (
              selectedMethod === "card"
            ) {

              cardSection.hidden =
                false;


              walletSection.hidden =
                true;

            } else {

              cardSection.hidden =
                true;


              walletSection.hidden =
                false;
            }


            clearErrors();

          }
        );

      }
    );


    // =========================
    // CARD NUMBER FORMAT
    // =========================

    cardNumber.addEventListener(
      "input",
      () => {

        let value =
          cardNumber.value
            .replace(/\D/g, "")
            .slice(0,16);


        value =
          value.replace(
            /(\d{4})(?=\d)/g,
            "$1 "
          );


        cardNumber.value =
          value;
      }
    );


    // =========================
    // EXPIRY FORMAT
    // =========================

    expiryDate.addEventListener(
      "input",
      () => {

        let value =
          expiryDate.value
            .replace(/\D/g, "")
            .slice(0,4);


        if (
          value.length > 2
        ) {

          value =
            value.slice(0,2) +
            "/" +
            value.slice(2);
        }


        expiryDate.value =
          value;
      }
    );


    // =========================
    // CVV NUMBERS ONLY
    // =========================

    cvv.addEventListener(
      "input",
      () => {

        cvv.value =
          cvv.value
            .replace(/\D/g, "")
            .slice(0,4);
      }
    );


    // =========================
    // ERRORS
    // =========================

    function clearErrors() {

      nameError.textContent =
        "";

      cardError.textContent =
        "";

      expiryError.textContent =
        "";

      cvvError.textContent =
        "";

      paymentError.textContent =
        "";
    }


    // =========================
    // VALIDATION
    // =========================

    function validateCard() {

      clearErrors();


      let valid =
        true;


      if (
        !cardholderName.value.trim()
      ) {

        nameError.textContent =
          "Please enter the cardholder name.";

        valid =
          false;
      }


      const digits =
        cardNumber.value
          .replace(/\s/g, "");


      if (
        !/^\d{16}$/.test(
          digits
        )
      ) {

        cardError.textContent =
          "Enter a 16-digit demo card number.";

        valid =
          false;
      }


      if (
        !/^\d{2}\/\d{2}$/.test(
          expiryDate.value
        )
      ) {

        expiryError.textContent =
          "Use MM/YY format.";

        valid =
          false;

      } else {

        const month =
          Number(
            expiryDate.value
              .split("/")[0]
          );


        if (
          month < 1 ||
          month > 12
        ) {

          expiryError.textContent =
            "Enter a valid month.";

          valid =
            false;
        }
      }


      if (
        !/^\d{3,4}$/.test(
          cvv.value
        )
      ) {

        cvvError.textContent =
          "Enter a valid demo CVV.";

        valid =
          false;
      }


      return valid;
    }


    function validatePayment() {

      if (
        selectedMethod === "card" &&
        !validateCard()
      ) {

        return false;
      }


      if (
        !termsCheckbox.checked
      ) {

        paymentError.textContent =
          "Please confirm that you understand this is a demo payment.";

        return false;
      }


      return true;
    }


    // =========================
    // PAYMENT RECORD
    // =========================

    function createPaymentReference() {

      return (
        "PAY-" +
        Date.now()
          .toString()
          .slice(-8)
      );
    }


    function activateSubscription() {

      const reference =
        createPaymentReference();


      /*
        IMPORTANT:
        We only save subscription/payment metadata.

        Card number, expiry and CVV
        are NOT saved.
      */

      const subscriptionDetails = {

        plan:
          selectedPlan.id,

        planName:
          selectedPlan.name,

        price:
          selectedPlan.price,

        currency:
          selectedPlan.currency,

        billing:
          selectedPlan.billing,

        status:
          "active",

        activatedAt:
          new Date().toISOString(),

        paymentReference:
          reference,

        paymentMethod:
          selectedMethod
      };


      localStorage.setItem(
        "rafiqSubscriptionPlan",
        "plus"
      );


      localStorage.setItem(
        "rafiqSubscriptionDetails",
        JSON.stringify(
          subscriptionDetails
        )
      );


      /*
        Optional payment history.
        Again: no sensitive card data.
      */

      const payments =
        getPayments();


      payments.unshift({

        id:
          reference,

        type:
          "subscription",

        plan:
          selectedPlan.name,

        amount:
          selectedPlan.price,

        currency:
          selectedPlan.currency,

        method:
          selectedMethod,

        status:
          "paid",

        createdAt:
          new Date().toISOString()
      });


      localStorage.setItem(
        "rafiqPayments",
        JSON.stringify(
          payments
        )
      );


      createSubscriptionNotification();


      return reference;
    }


    function getPayments() {

      try {

        return JSON.parse(
          localStorage.getItem(
            "rafiqPayments"
          )
        ) || [];

      } catch (error) {

        return [];
      }
    }


    // =========================
    // NOTIFICATION
    // =========================

    function createSubscriptionNotification() {

      let notifications =
        [];


      try {

        notifications =
          JSON.parse(
            localStorage.getItem(
              "rafiqNotifications"
            )
          ) || [];

      } catch (error) {

        notifications =
          [];
      }


      notifications.unshift({

        id:
          "notification_" +
          Date.now(),

        type:
          "subscription",

        title:
          "RAFIQ Plus activated",

        message:
          "Your RAFIQ Plus subscription is now active.",

        read:
          false,

        createdAt:
          new Date().toISOString()
      });


      localStorage.setItem(
        "rafiqNotifications",
        JSON.stringify(
          notifications
        )
      );
      
    }


    // =========================
    // PAY
    // =========================

    payButton.addEventListener(
      "click",
      () => {

        clearErrors();


        if (
          !validatePayment()
        ) {

          return;
        }


        payButton.disabled =
          true;


        payButton.classList.add(
          "processing"
        );


        payButton.textContent =
          "Processing...";


        /*
          Simulates payment processing.
        */

        window.setTimeout(
          () => {

            const reference =
              activateSubscription();


            /*
              Remove selected plan after
              successful activation.
            */

            sessionStorage.removeItem(
              "rafiqSelectedPlan"
            );


            /*
              Clear sensitive inputs immediately.
            */

            cardholderName.value =
              "";

            cardNumber.value =
              "";

            expiryDate.value =
              "";

            cvv.value =
              "";


            paymentReference.textContent =
              reference;


            successAmount.textContent =
              `${selectedPlan.price} ${selectedPlan.currency}`;


            successMethod.textContent =
              selectedMethod === "card"
                ? "Demo Card"
                : "Demo Wallet";


            showView(
              successView
            );

          },
          900
        );

      }
    );


    // =========================
    // SIDEBAR
    // =========================

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


    // =========================
    // LOGOUT
    // =========================

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


    // =========================
    // INIT
    // =========================

    showView(
      paymentView
    );

  }
);