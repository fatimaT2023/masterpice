document.addEventListener(
  "DOMContentLoaded",
  () => {

    // ===============================
    // ELEMENTS
    // ===============================

    const introView =
      document.getElementById(
        "introView"
      );

    const questionsView =
      document.getElementById(
        "questionsView"
      );

    const resultView =
      document.getElementById(
        "resultView"
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

    const heroChildName =
      document.getElementById(
        "heroChildName"
      );

    const heroDescription =
      document.getElementById(
        "heroDescription"
      );


    const startButton =
      document.getElementById(
        "startScreeningButton"
      );


    const questionCounter =
      document.getElementById(
        "questionCounter"
      );

    const questionPercent =
      document.getElementById(
        "questionPercent"
      );

    const progressFill =
      document.getElementById(
        "progressFill"
      );

    const questionDomain =
      document.getElementById(
        "questionDomain"
      );

    const questionText =
      document.getElementById(
        "questionText"
      );


    const answerButtons =
      document.querySelectorAll(
        ".answer-button"
      );


    const previousButton =
      document.getElementById(
        "previousQuestionButton"
      );

    const nextButton =
      document.getElementById(
        "nextQuestionButton"
      );


    const contextAvatar =
      document.getElementById(
        "contextAvatar"
      );

    const contextChildName =
      document.getElementById(
        "contextChildName"
      );

    const contextChildAge =
      document.getElementById(
        "contextChildAge"
      );


    const resultCard =
      document.getElementById(
        "resultCard"
      );

    const resultIcon =
      document.getElementById(
        "resultIcon"
      );

    const resultTitle =
      document.getElementById(
        "resultTitle"
      );

    const resultDescription =
      document.getElementById(
        "resultDescription"
      );

    const recommendations =
      document.getElementById(
        "recommendations"
      );

    const retakeButton =
      document.getElementById(
        "retakeButton"
      );


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

    const logoutButton =
      document.getElementById(
        "logoutButton"
      );


    // ===============================
    // CHILD DATA
    // ===============================

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


    if (children.length === 0) {

      window.location.href =
        "onboarding.html";

      return;
    }


    const currentId =
      localStorage.getItem(
        "rafiqCurrentChildId"
      );


    const currentChild =
      children.find(
        child =>
          child.id === currentId
      ) || children[0];


    // ===============================
    // AGE
    // ===============================

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
          (age.totalMonths === 1
            ? " month"
            : " months")
        );
      }


      return (
        age.years +
        (age.years === 1
          ? " year old"
          : " years old")
      );
    }


    function getAgeGroup(age) {

      if (age.years <= 3) {
        return "0-3";
      }

      if (age.years <= 6) {
        return "4-6";
      }

      if (age.years <= 12) {
        return "7-12";
      }

      return "13-18";
    }


    const age =
      calculateAge(
        currentChild.dateOfBirth
      );

    const ageGroup =
      getAgeGroup(age);


    // ===============================
    // CHILD UI
    // ===============================

    const initial =
      currentChild.name
        .charAt(0)
        .toUpperCase();


    childAvatar.textContent =
      initial;

    childName.textContent =
      currentChild.name;

    childAge.textContent =
      formatAge(age);


    heroChildName.textContent =
      currentChild.name;


    contextAvatar.textContent =
      initial;

    contextChildName.textContent =
      currentChild.name;

    contextChildAge.textContent =
      formatAge(age);


    heroDescription.textContent =
      `Answer a few short questions about what you have recently noticed in ${currentChild.name}'s development.`;


    // ===============================
    // QUESTIONS
    // ===============================

    /*
      Prototype demonstration questions only.

      These are NOT a validated medical
      screening instrument.
    */

    const questionSets = {

      "0-3": [

        {
          domain: "Communication",
          text:
            "Does your child use sounds, gestures, words, or other ways to communicate needs and interests?"
        },

        {
          domain: "Social Interaction",
          text:
            "Does your child show interest in interacting with familiar people?"
        },

        {
          domain: "Movement",
          text:
            "Is your child developing new movement or coordination skills over time?"
        },

        {
          domain: "Learning",
          text:
            "Does your child explore toys, objects, or activities with curiosity?"
        },

        {
          domain: "Everyday Skills",
          text:
            "Does your child participate in everyday routines such as eating, dressing, or washing?"
        },

        {
          domain: "Development",
          text:
            "Overall, do you feel your child is continuing to gain new skills over time?"
        }

      ],


      "4-6": [

        {
          domain: "Communication",
          text:
            "Can your child communicate everyday needs, ideas, or experiences?"
        },

        {
          domain: "Social Skills",
          text:
            "Does your child usually participate in play or activities with other children?"
        },

        {
          domain: "Behavior",
          text:
            "Can your child usually recover from everyday frustration with support?"
        },

        {
          domain: "Learning",
          text:
            "Can your child follow familiar routines and simple instructions?"
        },

        {
          domain: "Independence",
          text:
            "Does your child show growing independence in everyday activities?"
        },

        {
          domain: "Development",
          text:
            "Overall, do you feel your child is continuing to learn and gain new skills?"
        }

      ],


      "7-12": [

        {
          domain: "Communication",
          text:
            "Can your child usually explain thoughts, needs, or everyday experiences?"
        },

        {
          domain: "Social Skills",
          text:
            "Does your child generally engage with peers and maintain age-appropriate friendships?"
        },

        {
          domain: "Learning",
          text:
            "Can your child usually participate in schoolwork and age-appropriate learning activities?"
        },

        {
          domain: "Attention",
          text:
            "Can your child usually stay engaged with age-appropriate tasks for a reasonable period?"
        },

        {
          domain: "Daily Skills",
          text:
            "Does your child manage increasing everyday responsibilities with appropriate support?"
        },

        {
          domain: "Development",
          text:
            "Overall, do you feel your child is progressing in learning, communication, and independence?"
        }

      ],


      "13-18": [

        {
          domain: "Communication",
          text:
            "Can your teenager usually communicate needs, opinions, and concerns?"
        },

        {
          domain: "Social Development",
          text:
            "Does your teenager generally navigate friendships and social boundaries appropriately?"
        },

        {
          domain: "Daily Skills",
          text:
            "Is your teenager developing increasing independence in everyday responsibilities?"
        },

        {
          domain: "Learning",
          text:
            "Can your teenager generally organize and participate in age-appropriate school responsibilities?"
        },

        {
          domain: "Emotional Wellbeing",
          text:
            "Does your teenager generally have ways to cope with everyday stress with appropriate support?"
        },

        {
          domain: "Development",
          text:
            "Overall, do you feel your teenager continues to develop independence, communication, and life skills?"
        }

      ]

    };


    const questions =
      questionSets[ageGroup];


    let currentQuestion =
      0;

    let answers =
      new Array(
        questions.length
      ).fill(null);


    // ===============================
    // VIEWS
    // ===============================

    function showView(view) {

      [
        introView,
        questionsView,
        resultView
      ].forEach(
        item =>
          item.classList.remove(
            "active"
          )
      );


      view.classList.add(
        "active"
      );


      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }


    // ===============================
    // QUESTION UI
    // ===============================

    function renderQuestion() {

      const question =
        questions[currentQuestion];


      questionCounter.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;


      const percent =
        Math.round(
          ((currentQuestion + 1) /
            questions.length) *
            100
        );


      questionPercent.textContent =
        percent + "%";

      progressFill.style.width =
        percent + "%";


      questionDomain.textContent =
        question.domain.toUpperCase();

      questionText.textContent =
        question.text;


      answerButtons.forEach(
        button => {

          button.classList.remove(
            "selected"
          );


          if (
            button.dataset.answer ===
            answers[currentQuestion]
          ) {

            button.classList.add(
              "selected"
            );
          }

        }
      );


      previousButton.disabled =
        currentQuestion === 0;


      nextButton.disabled =
        !answers[currentQuestion];


      nextButton.textContent =
        currentQuestion ===
        questions.length - 1
          ? "View Result →"
          : "Next →";
    }


    // ===============================
    // ANSWERS
    // ===============================

    answerButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            answers[currentQuestion] =
              button.dataset.answer;


            answerButtons.forEach(
              item =>
                item.classList.remove(
                  "selected"
                )
            );


            button.classList.add(
              "selected"
            );


            nextButton.disabled =
              false;
          }
        );

      }
    );


    previousButton.addEventListener(
      "click",
      () => {

        if (
          currentQuestion > 0
        ) {

          currentQuestion--;

          renderQuestion();
        }

      }
    );


    nextButton.addEventListener(
      "click",
      () => {

        if (
          !answers[currentQuestion]
        ) {
          return;
        }


        if (
          currentQuestion <
          questions.length - 1
        ) {

          currentQuestion++;

          renderQuestion();

        } else {

          showResult();
        }

      }
    );


    // ===============================
    // RESULT
    // ===============================

    function calculateConcernScore() {

      let score = 0;


      answers.forEach(
        answer => {

          if (answer === "sometimes") {
            score += 1;
          }

          if (answer === "no") {
            score += 2;
          }

          if (answer === "unsure") {
            score += 1;
          }

        }
      );


      return score;
    }


    function showResult() {

      const score =
        calculateConcernScore();


      /*
        This classification is ONLY for the
        frontend prototype and is NOT a
        clinically validated scoring system.
      */

      let level;


      if (score <= 2) {

        level = "low";

      } else if (score <= 6) {

        level = "monitor";

      } else {

        level = "evaluation";
      }


      renderResult(level);


      saveResult(
        level,
        score
      );


      showView(
        resultView
      );
    }


    function renderResult(level) {

      resultCard.className =
        "result-card " + level;


      recommendations.innerHTML =
        "";


      if (level === "low") {

        resultIcon.textContent =
          "✓";

        resultTitle.textContent =
          "Low Concern";

        resultDescription.textContent =
          `Your responses do not currently highlight many areas of concern for ${currentChild.name}. Continue observing development and tracking progress over time.`;


        addRecommendation(
          "✓",
          "Continue tracking",
          "Keep using milestones to record development over time."
        );


        addRecommendation(
          "✦",
          "Ask Rafiq AI",
          "Use the AI assistant for everyday parenting and development questions."
        );


        addRecommendation(
          "♡",
          "Trust your observations",
          "If you remain concerned, you can still discuss those concerns with a qualified professional."
        );

      }


      if (level === "monitor") {

        resultIcon.textContent =
          "!";

        resultTitle.textContent =
          "Monitor & Track";

        resultDescription.textContent =
          `Some of your responses suggest areas you may want to continue observing for ${currentChild.name}. This does not mean that a condition is present.`;


        addRecommendation(
          "✓",
          "Track development",
          "Record relevant milestones and changes over the coming weeks."
        );


        addRecommendation(
          "✦",
          "Review your concerns",
          "Use Rafiq guidance to better understand when and where concerns occur."
        );


        addRecommendation(
          "◎",
          "Consider professional guidance",
          "If concerns persist or affect everyday life, consider discussing them with an appropriate qualified professional."
        );

      }


      if (level === "evaluation") {

        resultIcon.textContent =
          "!";

        resultTitle.textContent =
          "Professional Evaluation Recommended";

        resultDescription.textContent =
          `Several responses highlight areas that may benefit from a closer professional look. This result does not diagnose any condition.`;


        addRecommendation(
          "◎",
          "Speak with a qualified professional",
          "A professional can consider your child's full history, development, and individual circumstances."
        );


        addRecommendation(
          "✓",
          "Keep your observations",
          "Your milestone and screening records may help you explain your concerns."
        );


        addRecommendation(
          "♡",
          "Continue supporting your child",
          "Keep routines supportive and avoid treating this screening result as a diagnosis."
        );

      }

    }


    function addRecommendation(
      icon,
      title,
      description
    ) {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "recommendation-item";


      item.innerHTML = `
        <span>${icon}</span>

        <div>
          <strong>
            ${title}
          </strong>

          <p>
            ${description}
          </p>
        </div>
      `;


      recommendations.appendChild(
        item
      );
    }


    // ===============================
    // SAVE RESULT
    // ===============================

    function saveResult(
      level,
      score
    ) {

      const result = {
        childId:
          currentChild.id,

        childName:
          currentChild.name,

        ageGroup,

        level,

        score,

        answers,

        completedAt:
          new Date().toISOString()
      };


      const key =
        "rafiqScreening_" +
        currentChild.id;


      localStorage.setItem(
        key,
        JSON.stringify(result)
      );

    }


    // ===============================
    // START / RETAKE
    // ===============================

    startButton.addEventListener(
      "click",
      () => {

        currentQuestion = 0;

        answers =
          new Array(
            questions.length
          ).fill(null);


        renderQuestion();

        showView(
          questionsView
        );

      }
    );


    retakeButton.addEventListener(
      "click",
      () => {

        currentQuestion = 0;

        answers =
          new Array(
            questions.length
          ).fill(null);


        renderQuestion();

        showView(
          questionsView
        );

      }
    );


    // ===============================
    // SIDEBAR
    // ===============================

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


    // ===============================
    // LOGOUT
    // ===============================

    logoutButton.addEventListener(
      "click",
      () => {

        sessionStorage.clear();

        window.location.href =
          "../piblic-pages/login.html";

      }
    );


    // ===============================
    // INIT
    // ===============================

    showView(
      introView
    );

  }
);