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

        return window.RafiqSetup.readChildren() || [];

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
      (window.RafiqFamily ? window.RafiqFamily.selected() : localStorage.getItem('rafiqCurrentChildId'));


    const currentChild =
      children.find(
        child =>
          child.id ===
          currentChildId
      ) || children[0];


    function calculateAge(dateString) { return window.RafiqSetup.ageFromBirth(dateString) || {years:NaN,months:NaN,totalMonths:NaN,days:NaN}; }


    function formatAge(age) { return window.RafiqSetup.formatAge(age); }


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


    const requestedPlan=getSelectedPlan();
    const selectedPlan=requestedPlan?.id==='plus'?{id:'plus',name:'RAFIQ Plus',price:window.RafiqMembership.config.price,currency:'JOD',billing:'monthly',familyId:requestedPlan.familyId||window.RafiqMembership.familyId()}:null;


    if (!selectedPlan) {

      showView(
        missingPlanView
      );

      return;
    }


    const existingFamily=window.RafiqMembership.state(new Date(),selectedPlan.familyId);
    if(existingFamily.active||!existingFamily.canManage){showView(missingPlanView);const notice=document.createElement('p');notice.textContent=existingFamily.active?'Your family already has an active subscription. No second payment is needed.':'Only the billing manager can purchase or change the family plan.';const back=document.createElement('a');back.href='subscription.html?family='+encodeURIComponent(selectedPlan.familyId);back.textContent='View family subscription';missingPlanView.replaceChildren(notice,back);return;}
    document.querySelectorAll('a[href="subscription.html"]').forEach(link=>link.href='subscription.html?family='+encodeURIComponent(selectedPlan.familyId));
    const familyLabel=document.createElement('p');familyLabel.textContent='Family workspace: '+(window.RafiqFamily.user(window.RafiqFamily.family(selectedPlan.familyId).ownerId)?.fullName||'My family');planName.before(familyLabel);
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
      const reference=createPaymentReference();
      const record=window.RafiqMembership.activate({id:'subscription_'+reference,familyId:selectedPlan.familyId,planName:'RAFIQ Plus',price:window.RafiqMembership.config.price,currency:'JOD',billing:'monthly',paymentReference:reference,paymentMethod:selectedMethod});
      const payments=getPayments();payments.unshift({id:reference,subscriptionId:record.id,familyId:record.familyId,parentId:record.payerId,payerId:record.payerId,type:'subscription',plan:record.planName,amount:record.price,currency:record.currency,method:selectedMethod,status:'paid',createdAt:record.activatedAt});localStorage.setItem('rafiqPayments',JSON.stringify(payments));
      if(window.createRafiqNotification)window.createRafiqNotification({type:'subscription',title:'Family Plus activated',message:'Your family subscription is active for all linked caregivers.',familyId:record.familyId,link:'subscription.html'});
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

            let reference;
            try{reference=activateSubscription();}catch(error){paymentError.textContent=error.message||'Could not activate the demo plan. No real money was collected. Please try again.';payButton.disabled=false;payButton.textContent='Try demo payment again';return;}


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