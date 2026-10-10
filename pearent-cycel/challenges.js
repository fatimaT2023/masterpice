document.addEventListener(
  "DOMContentLoaded",
  () => {

    // =========================
    // ELEMENTS
    // =========================

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


    const heroAvatar =
      document.getElementById(
        "heroAvatar"
      );

    const heroChildName =
      document.getElementById(
        "heroChildName"
      );

    const heroChildStage =
      document.getElementById(
        "heroChildStage"
      );

    const heroDescription =
      document.getElementById(
        "heroDescription"
      );


    const sectionTitle =
      document.getElementById(
        "sectionTitle"
      );

    const challengeGrid =
      document.getElementById(
        "challengeGrid"
      );

    const resultCount =
      document.getElementById(
        "resultCount"
      );

    const emptyState =
      document.getElementById(
        "emptyState"
      );


    const challengeSearch =
      document.getElementById(
        "challengeSearch"
      );

    const filterButtons =
      document.querySelectorAll(
        ".filter-button"
      );


    // Modal

    const challengeModal =
      document.getElementById(
        "challengeModal"
      );

    const modalClose =
      document.getElementById(
        "modalClose"
      );

    const doneButton =
      document.getElementById(
        "doneButton"
      );

    const askAIButton =
      document.getElementById(
        "askAIButton"
      );


    const modalIcon =
      document.getElementById(
        "modalIcon"
      );

    const modalCategory =
      document.getElementById(
        "modalCategory"
      );

    const modalTitle =
      document.getElementById(
        "modalTitle"
      );

    const modalIntro =
      document.getElementById(
        "modalIntro"
      );

    const modalSigns =
      document.getElementById(
        "modalSigns"
      );

    const modalReasons =
      document.getElementById(
        "modalReasons"
      );

    const modalTry =
      document.getElementById(
        "modalTry"
      );

    const modalAvoid =
      document.getElementById(
        "modalAvoid"
      );

    const modalProfessional =
      document.getElementById(
        "modalProfessional"
      );


    // Sidebar

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


    // =========================
    // CHILD DATA
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


    // =========================
    // AGE
    // =========================

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


    function getStageName(group) {

      const names = {
        "0-3": "Early Years • 0–3",
        "4-6": "Early Childhood • 4–6",
        "7-12": "School Age • 7–12",
        "13-18": "Adolescence • 13–18"
      };


      return names[group];
    }


    const age =
      calculateAge(
        currentChild.dateOfBirth
      );


    const ageGroup =
      getAgeGroup(age);


    // =========================
    // CHILD UI
    // =========================

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


    heroAvatar.textContent =
      initial;

    heroChildName.textContent =
      currentChild.name;

    heroChildStage.textContent =
      getStageName(ageGroup);


    heroDescription.textContent =
      `Explore common parenting challenges for ${currentChild.name}'s current development stage.`;

    sectionTitle.textContent =
      `Common challenges for ${getStageName(ageGroup)}`;


    // =========================
    // DATA
    // =========================

    const challengeData = {

      "0-3": [

        {
          id: "sleep",
          title: "Sleep & Bedtime",
          category: "routine",
          icon: "☾",
          summary:
            "Support calmer sleep routines and difficult bedtimes.",
          intro:
            "Sleep patterns can change often during the early years.",
          signs:
            "Frequent bedtime resistance, difficulty settling, waking during the night, or irregular sleep routines.",
          reasons: [
            "Changes in routine",
            "Overtiredness",
            "Developmental changes",
            "Difficulty transitioning from activity to sleep"
          ],
          try: [
            "Keep a predictable bedtime sequence",
            "Use calm activities before sleep",
            "Keep bedtime expectations simple",
            "Notice patterns across several days"
          ],
          avoid: [
            "Changing the routine every night",
            "Highly stimulating activities just before bed",
            "Turning bedtime into a long negotiation"
          ],
          professional:
            "Consider speaking with a qualified health professional if sleep difficulties are persistent, severe, or affecting the child's wellbeing."
        },

        {
          id: "tantrums",
          title: "Tantrums",
          category: "behavior",
          icon: "!",
          summary:
            "Understand big emotions and respond with calm boundaries.",
          intro:
            "Young children are still learning how to manage frustration and strong emotions.",
          signs:
            "Crying, shouting, dropping to the floor, hitting objects, or strong resistance during transitions.",
          reasons: [
            "Tiredness or hunger",
            "Difficulty communicating needs",
            "Frustration",
            "Transitions between activities"
          ],
          try: [
            "Stay calm and use few words",
            "Name the emotion simply",
            "Keep safe limits consistent",
            "Talk about what happened after the child is calm"
          ],
          avoid: [
            "Long explanations during the tantrum",
            "Shouting back",
            "Changing every boundary to immediately stop the crying"
          ],
          professional:
            "Consider professional guidance if behaviors are unusually intense, frequent, unsafe, or seriously disrupt everyday life."
        },

        {
          id: "feeding",
          title: "Picky Eating",
          category: "routine",
          icon: "◇",
          summary:
            "Reduce mealtime pressure and build predictable routines.",
          intro:
            "Food preferences can change during early childhood.",
          signs:
            "Refusing foods, wanting only a small range of foods, or becoming upset around meals.",
          reasons: [
            "Preference for familiar foods",
            "Changing appetite",
            "Sensory preferences",
            "Wanting more independence"
          ],
          try: [
            "Offer familiar and new foods together",
            "Keep meals predictable",
            "Allow time to explore foods",
            "Keep the atmosphere calm"
          ],
          avoid: [
            "Forcing bites",
            "Using shame or threats",
            "Turning every meal into a conflict"
          ],
          professional:
            "Seek appropriate professional advice if eating concerns affect growth, nutrition, swallowing, safety, or overall health."
        },

        {
          id: "separation",
          title: "Separation Anxiety",
          category: "emotions",
          icon: "♡",
          summary:
            "Support your child through difficult goodbyes.",
          intro:
            "Separation can feel difficult while a young child builds security and predictability.",
          signs:
            "Crying at goodbye, clinging, refusing to stay with another caregiver, or becoming worried before separation.",
          reasons: [
            "Unfamiliar situations",
            "Changes in caregivers",
            "Developmental awareness of separation",
            "Changes in routine"
          ],
          try: [
            "Use a short predictable goodbye",
            "Tell the child when you will return in simple terms",
            "Practice brief separations",
            "Keep routines consistent"
          ],
          avoid: [
            "Leaving secretly",
            "Long repeated goodbyes",
            "Making promises you cannot keep"
          ],
          professional:
            "Professional support may help if anxiety is persistent, severe, or prevents normal age-appropriate activities."
        }

      ],


      "4-6": [

        {
          id: "tantrums",
          title: "Big Emotions",
          category: "emotions",
          icon: "♡",
          summary:
            "Help your child understand and manage strong feelings.",
          intro:
            "Children at this age are still building emotional regulation skills.",
          signs:
            "Crying, yelling, strong frustration, or difficulty calming after disappointment.",
          reasons: [
            "Frustration",
            "Tiredness",
            "Difficulty expressing feelings",
            "Unexpected changes"
          ],
          try: [
            "Name emotions without judging them",
            "Keep boundaries calm and clear",
            "Practice calming strategies when the child is already calm",
            "Look for repeated triggers"
          ],
          avoid: [
            "Shaming emotions",
            "Expecting adult-level self-control",
            "Arguing during an emotional outburst"
          ],
          professional:
            "Consider professional support if emotional or behavioral concerns are persistent, unusually intense, unsafe, or interfere with everyday functioning."
        },

        {
          id: "independence",
          title: "Wanting to Do Everything Alone",
          category: "behavior",
          icon: "↗",
          summary:
            "Support growing independence without losing boundaries.",
          intro:
            "Wanting control and independence is common during early childhood.",
          signs:
            "Refusing help, insisting on choices, or becoming upset when adults take over.",
          reasons: [
            "Growing independence",
            "Wanting control",
            "Learning new skills",
            "Frustration when tasks are difficult"
          ],
          try: [
            "Offer two acceptable choices",
            "Give extra time for simple tasks",
            "Let your child help with routines",
            "Step in only when necessary"
          ],
          avoid: [
            "Doing everything for the child",
            "Giving unlimited choices",
            "Turning independence into a power struggle"
          ],
          professional:
            "Seek professional guidance when behavior is consistently unsafe or severely interferes with daily routines."
        },

        {
          id: "sharing",
          title: "Sharing & Taking Turns",
          category: "social",
          icon: "◎",
          summary:
            "Build cooperation through practice and simple expectations.",
          intro:
            "Social cooperation develops gradually with practice.",
          signs:
            "Difficulty sharing toys, interrupting play, or becoming upset when waiting.",
          reasons: [
            "Still learning perspective-taking",
            "Excitement about preferred toys",
            "Difficulty waiting",
            "Limited practice with group play"
          ],
          try: [
            "Practice short turns",
            "Use simple language such as 'your turn, my turn'",
            "Praise cooperative behavior",
            "Prepare the child before group activities"
          ],
          avoid: [
            "Calling the child selfish",
            "Forcing long periods of sharing",
            "Comparing the child with others"
          ],
          professional:
            "If social communication concerns are persistent across settings, consider discussing them with an appropriate professional."
        },

        {
          id: "school-ready",
          title: "School Readiness",
          category: "school",
          icon: "✦",
          summary:
            "Build routines that make school transitions easier.",
          intro:
            "School readiness includes routines, communication, independence, and social participation.",
          signs:
            "Worry about school, difficulty separating, trouble following routines, or resistance to school preparation.",
          reasons: [
            "Unfamiliar expectations",
            "Separation worries",
            "Changes in routine",
            "Need for more practice with independence"
          ],
          try: [
            "Practice the morning routine",
            "Talk positively and realistically about school",
            "Encourage simple independence",
            "Keep sleep and wake times predictable"
          ],
          avoid: [
            "Using school as a threat",
            "Creating unrealistic pressure",
            "Comparing readiness with other children"
          ],
          professional:
            "If school difficulties are significant or persistent, discuss them with the school and an appropriate professional."
        }

      ],


      "7-12": [

        {
          id: "screen-time",
          title: "Screen Time",
          category: "routine",
          icon: "▣",
          summary:
            "Create predictable boundaries around devices.",
          intro:
            "Screen use can become difficult when expectations change from day to day.",
          signs:
            "Arguments about stopping devices, avoiding other activities, or repeatedly negotiating screen limits.",
          reasons: [
            "Highly engaging content",
            "Inconsistent boundaries",
            "Boredom",
            "Using screens as the main transition activity"
          ],
          try: [
            "Agree on screen times in advance",
            "Give a warning before screen time ends",
            "Keep some routines screen-free",
            "Offer another activity after screens"
          ],
          avoid: [
            "Negotiating the rule every time",
            "Sudden unpredictable changes",
            "Using screens for every difficult emotion"
          ],
          professional:
            "Consider professional guidance if screen use significantly affects sleep, school, relationships, or daily functioning."
        },

        {
          id: "homework",
          title: "Homework Stress",
          category: "school",
          icon: "✦",
          summary:
            "Break school tasks into smaller, calmer steps.",
          intro:
            "Homework difficulties can involve attention, frustration, workload, or uncertainty.",
          signs:
            "Avoiding homework, frequent arguments, crying, rushing, or taking unusually long to complete tasks.",
          reasons: [
            "Task feels too difficult",
            "Tiredness after school",
            "Distractions",
            "Difficulty planning where to begin"
          ],
          try: [
            "Use short work periods",
            "Break large tasks into smaller steps",
            "Create a consistent workspace",
            "Focus on effort and strategy"
          ],
          avoid: [
            "Doing the work for the child",
            "Comparing grades with siblings",
            "Turning homework into a nightly conflict"
          ],
          professional:
            "Persistent learning, attention, or school difficulties may benefit from discussion with the school or an appropriate specialist."
        },

        {
          id: "bullying",
          title: "Bullying Concerns",
          category: "social",
          icon: "♡",
          summary:
            "Listen carefully and help your child seek safe support.",
          intro:
            "Children may not always tell adults immediately when peer relationships become difficult.",
          signs:
            "Avoiding school, changes in mood, losing belongings, friendship changes, or mentioning repeated peer problems.",
          reasons: [
            "Peer conflict",
            "Social group changes",
            "Repeated harmful behavior from others",
            "Fear of making the situation worse"
          ],
          try: [
            "Listen without blaming",
            "Ask what would help the child feel safer",
            "Document repeated incidents",
            "Involve the school or responsible adults when appropriate"
          ],
          avoid: [
            "Telling the child to simply ignore everything",
            "Blaming them for what happened",
            "Promising secrecy when safety may be involved"
          ],
          professional:
            "Seek additional support if the situation affects safety, emotional wellbeing, school attendance, or daily functioning."
        },

        {
          id: "attention",
          title: "Difficulty Staying Focused",
          category: "school",
          icon: "◌",
          summary:
            "Use structure and observation before assuming the reason.",
          intro:
            "Attention can vary based on the task, environment, sleep, stress, and many other factors.",
          signs:
            "Frequently leaving tasks unfinished, losing track of instructions, or struggling to begin work.",
          reasons: [
            "Distractions",
            "Task difficulty",
            "Tiredness",
            "Stress or lack of interest"
          ],
          try: [
            "Reduce distractions",
            "Give one instruction at a time",
            "Use short work periods",
            "Notice which settings make attention easier or harder"
          ],
          avoid: [
            "Calling the child lazy",
            "Assuming one cause without evaluation",
            "Using punishment as the only strategy"
          ],
          professional:
            "If attention concerns are persistent across settings and affect learning or daily life, consider professional evaluation."
        }

      ],


      "13-18": [

        {
          id: "communication",
          title: "Communication With Your Teen",
          category: "social",
          icon: "◌",
          summary:
            "Keep communication open while respecting growing independence.",
          intro:
            "Teenagers often want more privacy and independence while still needing connection.",
          signs:
            "Short answers, avoiding conversations, frequent arguments, or feeling misunderstood.",
          reasons: [
            "Growing independence",
            "Need for privacy",
            "Stress",
            "Different expectations between parent and teenager"
          ],
          try: [
            "Choose calm moments to talk",
            "Listen before giving advice",
            "Use clear boundaries without long lectures",
            "Show interest without constant questioning"
          ],
          avoid: [
            "Turning every conversation into a lesson",
            "Demanding immediate disclosure",
            "Mocking or dismissing concerns"
          ],
          professional:
            "If communication problems involve significant distress, safety concerns, or major changes in functioning, consider professional support."
        },

        {
          id: "school-pressure",
          title: "Academic Pressure",
          category: "school",
          icon: "✦",
          summary:
            "Support effort, planning, rest, and realistic expectations.",
          intro:
            "Academic stress may increase as responsibilities and future decisions become more important.",
          signs:
            "Frequent worry about grades, avoiding work, irritability, sleep changes, or feeling overwhelmed.",
          reasons: [
            "Heavy workload",
            "Fear of failure",
            "High expectations",
            "Difficulty planning tasks"
          ],
          try: [
            "Break priorities into manageable steps",
            "Protect sleep and rest",
            "Focus on effort and learning",
            "Ask what kind of support is actually helpful"
          ],
          avoid: [
            "Comparing grades with others",
            "Treating one result as a measure of worth",
            "Ignoring signs of significant stress"
          ],
          professional:
            "Professional support may be appropriate when stress becomes persistent, severe, or interferes with sleep, school, relationships, or wellbeing."
        },

        {
          id: "social-media",
          title: "Social Media Boundaries",
          category: "routine",
          icon: "▣",
          summary:
            "Create clear expectations while keeping communication open.",
          intro:
            "Healthy digital boundaries work best when expectations are clear and discussed.",
          signs:
            "Late-night use, conflict about devices, comparison with others, or difficulty disengaging.",
          reasons: [
            "Social connection",
            "Fear of missing out",
            "Habit",
            "Unclear household boundaries"
          ],
          try: [
            "Agree on device-free times",
            "Discuss privacy and online behavior",
            "Model balanced device use",
            "Review rules as the teenager grows"
          ],
          avoid: [
            "Rules that change without explanation",
            "Using surveillance as the only communication strategy",
            "Ignoring online safety concerns"
          ],
          professional:
            "Seek appropriate support if online experiences involve threats, exploitation, severe distress, or significant impact on daily life."
        },

        {
          id: "independence",
          title: "Independence & Boundaries",
          category: "behavior",
          icon: "↗",
          summary:
            "Increase responsibility gradually while keeping safety limits clear.",
          intro:
            "Adolescence involves increasing independence and negotiation of family boundaries.",
          signs:
            "Arguments about privacy, curfews, responsibilities, choices, or family rules.",
          reasons: [
            "Normal growing independence",
            "Different expectations",
            "Need for trust",
            "Developing decision-making skills"
          ],
          try: [
            "Explain which rules are about safety",
            "Negotiate age-appropriate responsibilities",
            "Increase freedom alongside responsibility",
            "Review agreements together"
          ],
          avoid: [
            "Controlling every small decision",
            "Removing all boundaries",
            "Using humiliation during conflict"
          ],
          professional:
            "Professional support may help when family conflict is persistent, severe, unsafe, or significantly affects everyday functioning."
        }

      ]

    };


    const challenges =
      challengeData[ageGroup];


    // =========================
    // FILTER / SEARCH
    // =========================

    let currentFilter =
      "all";


    function getFilteredChallenges() {

      const search =
        challengeSearch.value
          .trim()
          .toLowerCase();


      return challenges.filter(
        challenge => {

          const matchesFilter =
            currentFilter === "all" ||
            challenge.category ===
              currentFilter;


          const matchesSearch =
            !search ||
            challenge.title
              .toLowerCase()
              .includes(search) ||
            challenge.summary
              .toLowerCase()
              .includes(search);


          return (
            matchesFilter &&
            matchesSearch
          );
        }
      );
    }


    // =========================
    // RENDER CARDS
    // =========================

    function renderChallenges() {

      challengeGrid.innerHTML =
        "";


      const filtered =
        getFilteredChallenges();


      resultCount.textContent =
        `${filtered.length} ${
          filtered.length === 1
            ? "topic"
            : "topics"
        }`;


      emptyState.hidden =
        filtered.length !== 0;


      filtered.forEach(
        challenge => {

          const card =
            document.createElement(
              "article"
            );


          card.className =
            "challenge-card";


          card.innerHTML = `
            <div class="challenge-icon ${challenge.category}">
              ${challenge.icon}
            </div>

            <span class="challenge-category">
              ${getCategoryLabel(
                challenge.category
              )}
            </span>

            <h3>
              ${challenge.title}
            </h3>

            <p>
              ${challenge.summary}
            </p>

            <div class="challenge-footer">
              <span>View guidance</span>
              <span>→</span>
            </div>
          `;


          card.addEventListener(
            "click",
            () => {

              openChallenge(
                challenge
              );
            }
          );


          challengeGrid.appendChild(
            card
          );
        }
      );

    }


    function getCategoryLabel(
      category
    ) {

      const labels = {
        behavior: "Behavior",
        routine: "Routines",
        emotions: "Emotions",
        social: "Social",
        school: "School"
      };


      return labels[category] ||
        category;
    }


    challengeSearch.addEventListener(
      "input",
      renderChallenges
    );


    filterButtons.forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            currentFilter =
              button.dataset.filter;


            filterButtons.forEach(
              item => {

                item.classList.remove(
                  "active"
                );
              }
            );


            button.classList.add(
              "active"
            );


            renderChallenges();
          }
        );

      }
    );


    // =========================
    // MODAL
    // =========================

    let activeChallenge =
      null;


    function renderList(
      element,
      values
    ) {

      element.innerHTML = "";


      values.forEach(
        value => {

          const li =
            document.createElement(
              "li"
            );

          li.textContent =
            value;

          element.appendChild(
            li
          );
        }
      );

    }


    function openChallenge(
      challenge
    ) {

      activeChallenge =
        challenge;


      modalIcon.textContent =
        challenge.icon;

      modalIcon.className =
        `modal-icon ${challenge.category}`;


      modalCategory.textContent =
        getCategoryLabel(
          challenge.category
        ).toUpperCase();


      modalTitle.textContent =
        challenge.title;


      modalIntro.textContent =
        challenge.intro;


      modalSigns.textContent =
        challenge.signs;


      renderList(
        modalReasons,
        challenge.reasons
      );


      renderList(
        modalTry,
        challenge.try
      );


      renderList(
        modalAvoid,
        challenge.avoid
      );


      modalProfessional.textContent =
        challenge.professional;


      challengeModal.hidden =
        false;


      document.body.style.overflow =
        "hidden";


      modalClose.focus();
    }


    function closeChallenge() {

      challengeModal.hidden =
        true;


      document.body.style.overflow =
        "";


      activeChallenge =
        null;
    }


    modalClose.addEventListener(
      "click",
      closeChallenge
    );


    doneButton.addEventListener(
      "click",
      closeChallenge
    );


    challengeModal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          challengeModal
        ) {

          closeChallenge();
        }
      }
    );


    // =========================
    // ASK AI
    // =========================

    askAIButton.addEventListener(
      "click",
      () => {

        if (!activeChallenge) {
          return;
        }


        /*
          Save a suggested question so the
          AI page can use it later if desired.
        */

        sessionStorage.setItem(
          "rafiqAIPrefill",
          `I want guidance about ${activeChallenge.title.toLowerCase()} for ${currentChild.name}.`
        );


        window.location.href =
          "ai-assistant.html";
      }
    );


    // =========================
    // SIDEBAR
    // =========================

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
          event.key === "Escape"
        ) {

          if (
            !challengeModal.hidden
          ) {

            closeChallenge();

          } else {

            closeSidebar();
          }
        }

      }
    );


    // =========================
    // LOGOUT
    // =========================

    logoutButton.addEventListener(
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

    renderChallenges();

  }
);