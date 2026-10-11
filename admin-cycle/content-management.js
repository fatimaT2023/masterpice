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

    function readArray(key) {

      try {

        const value =
          JSON.parse(
            localStorage.getItem(
              key
            )
          );


        return Array.isArray(value)
          ? value
          : [];

      } catch (error) {

        return [];
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


    function hasStorageKey(key) {

      return (
        localStorage.getItem(
          key
        ) !== null
      );
    }


    // =====================================
    // STORAGE KEYS
    // =====================================

    const STORAGE = {

      ageGroups:
        "rafiqContentAgeGroups",

      milestones:
        "rafiqContentMilestones",

      screening:
        "rafiqContentScreening",

      challenges:
        "rafiqContentChallenges",

      educational:
        "rafiqEducationalContent"
    };


    // =====================================
    // STARTER CONTENT
    // =====================================

    const defaultAgeGroups = [

      {
        id: "age_0_3",
        label: "0–3 years",
        shortLabel: "0–3",
        minAge: 0,
        maxAge: 3,
        description:
          "Early development, communication, movement, attachment and daily routines.",
        status: "active",
        system: true
      },

      {
        id: "age_4_6",
        label: "4–6 years",
        shortLabel: "4–6",
        minAge: 4,
        maxAge: 6,
        description:
          "Preschool and early school development, behavior, language and social skills.",
        status: "active",
        system: true
      },

      {
        id: "age_7_12",
        label: "7–12 years",
        shortLabel: "7–12",
        minAge: 7,
        maxAge: 12,
        description:
          "School-age learning, relationships, attention, routines and emotional development.",
        status: "active",
        system: true
      },

      {
        id: "age_13_18",
        label: "13–18 years",
        shortLabel: "13–18",
        minAge: 13,
        maxAge: 18,
        description:
          "Adolescent wellbeing, independence, communication, school pressure and peer relationships.",
        status: "active",
        system: true
      }

    ];


    const defaultMilestones = [

      {
        id: "milestone_001",
        ageGroupId: "age_0_3",
        domain: "Communication",
        title:
          "Uses words or gestures to communicate needs",
        description:
          "A communication milestone used as age-appropriate developmental guidance.",
        status: "active",
        createdAt:
          new Date().toISOString()
      },

      {
        id: "milestone_002",
        ageGroupId: "age_4_6",
        domain: "Social & Emotional",
        title:
          "Participates in cooperative play",
        description:
          "A social-development milestone for preschool and early school-age children.",
        status: "active",
        createdAt:
          new Date().toISOString()
      },

      {
        id: "milestone_003",
        ageGroupId: "age_7_12",
        domain: "Cognitive",
        title:
          "Uses increasingly organized problem-solving",
        description:
          "A general developmental milestone for school-age children.",
        status: "active",
        createdAt:
          new Date().toISOString()
      },

      {
        id: "milestone_004",
        ageGroupId: "age_13_18",
        domain: "Social & Emotional",
        title:
          "Develops greater independence and self-awareness",
        description:
          "A broad adolescent developmental milestone.",
        status: "active",
        createdAt:
          new Date().toISOString()
      }

    ];


    const defaultScreening = [

      {
        id: "screening_001",
        ageGroupId: "age_0_3",
        category: "Communication",
        question:
          "Does your child regularly use sounds, gestures or words to communicate with you?",
        responseScale:
          "yes_no_unsure",
        status: "active",
        createdAt:
          new Date().toISOString()
      },

      {
        id: "screening_002",
        ageGroupId: "age_4_6",
        category: "Social Communication",
        question:
          "Does your child usually engage with other children during play?",
        responseScale:
          "yes_no_unsure",
        status: "active",
        createdAt:
          new Date().toISOString()
      },

      {
        id: "screening_003",
        ageGroupId: "age_7_12",
        category: "Attention",
        question:
          "Does your child frequently struggle to stay focused during age-appropriate tasks?",
        responseScale:
          "yes_no_unsure",
        status: "active",
        createdAt:
          new Date().toISOString()
      },

      {
        id: "screening_004",
        ageGroupId: "age_13_18",
        category: "Emotional Wellbeing",
        question:
          "Have there been persistent changes in mood or everyday functioning that concern you?",
        responseScale:
          "yes_no_unsure",
        status: "active",
        createdAt:
          new Date().toISOString()
      }

    ];


    const defaultChallenges = [

      {
        id: "challenge_001",
        ageGroupId: "age_0_3",
        category: "Development",
        title:
          "Speech & Communication Concerns",
        summary:
          "Guidance for parents who have concerns about early communication development.",
        whatToDo:
          "Use simple language, respond to communication attempts and create regular opportunities for interaction.",
        whatToAvoid:
          "Avoid comparing the child constantly with other children or pressuring them to perform.",
        whenToSeekHelp:
          "Consider professional guidance when concerns are persistent, significant or affecting everyday communication.",
        status: "active",
        createdAt:
          new Date().toISOString()
      },

      {
        id: "challenge_002",
        ageGroupId: "age_4_6",
        category: "Behavior",
        title:
          "Tantrums & Big Emotions",
        summary:
          "Practical guidance for understanding emotional outbursts in younger children.",
        whatToDo:
          "Use predictable routines, calm boundaries and age-appropriate emotion language.",
        whatToAvoid:
          "Avoid escalating arguments or using inconsistent consequences.",
        whenToSeekHelp:
          "Seek professional support when behavior becomes severe, unsafe or consistently disrupts daily functioning.",
        status: "active",
        createdAt:
          new Date().toISOString()
      },

      {
        id: "challenge_003",
        ageGroupId: "age_7_12",
        category: "School",
        title:
          "Learning Difficulties",
        summary:
          "Supportive guidance when a school-age child is struggling academically.",
        whatToDo:
          "Observe patterns, communicate with the school and break tasks into manageable steps.",
        whatToAvoid:
          "Avoid labeling the child as lazy or comparing grades with siblings or classmates.",
        whenToSeekHelp:
          "Professional evaluation may be useful when learning difficulties persist despite appropriate support.",
        status: "active",
        createdAt:
          new Date().toISOString()
      },

      {
        id: "challenge_004",
        ageGroupId: "age_13_18",
        category: "Emotional Wellbeing",
        title:
          "Academic Pressure",
        summary:
          "Guidance for families navigating stress related to school expectations and performance.",
        whatToDo:
          "Keep communication open, support realistic planning and make room for rest.",
        whatToAvoid:
          "Avoid defining the teenager's worth entirely through academic performance.",
        whenToSeekHelp:
          "Seek professional support if stress significantly affects sleep, mood, safety or everyday functioning.",
        status: "active",
        createdAt:
          new Date().toISOString()
      }

    ];


    const defaultEducational = [

      {
        id: "article_001",
        ageGroupId: "all",
        category: "Parenting",
        title:
          "Building Predictable Family Routines",
        excerpt:
          "Simple ways consistent routines can support everyday family life.",
        body:
          "Use clear, realistic routines that fit your family's needs. Keep expectations age-appropriate and adjust routines when circumstances change.",
        status: "published",
        createdAt:
          new Date().toISOString()
      },

      {
        id: "article_002",
        ageGroupId: "age_0_3",
        category: "Communication",
        title:
          "Supporting Early Communication",
        excerpt:
          "Everyday interaction ideas for parents of younger children.",
        body:
          "Talk during daily activities, follow your child's attention and respond to sounds, gestures and words. Keep interaction warm and pressure-free.",
        status: "published",
        createdAt:
          new Date().toISOString()
      },

      {
        id: "article_003",
        ageGroupId: "age_7_12",
        category: "School",
        title:
          "Supporting Healthy Study Habits",
        excerpt:
          "Create realistic routines for homework, breaks and independent learning.",
        body:
          "Use manageable study periods, predictable breaks and supportive feedback. Focus on consistency rather than perfection.",
        status: "draft",
        createdAt:
          new Date().toISOString()
      }

    ];


    // =====================================
    // INITIALIZE CONTENT
    // =====================================

    function initializeContent() {

      if (
        !hasStorageKey(
          STORAGE.ageGroups
        )
      ) {

        writeArray(
          STORAGE.ageGroups,
          defaultAgeGroups
        );
      }


      if (
        !hasStorageKey(
          STORAGE.milestones
        )
      ) {

        writeArray(
          STORAGE.milestones,
          defaultMilestones
        );
      }


      if (
        !hasStorageKey(
          STORAGE.screening
        )
      ) {

        writeArray(
          STORAGE.screening,
          defaultScreening
        );
      }


      if (
        !hasStorageKey(
          STORAGE.challenges
        )
      ) {

        writeArray(
          STORAGE.challenges,
          defaultChallenges
        );
      }


      if (
        !hasStorageKey(
          STORAGE.educational
        )
      ) {

        writeArray(
          STORAGE.educational,
          defaultEducational
        );
      }

    }


    initializeContent();


    // =====================================
    // ADMIN NAME
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

    const approvalNavCount =
      document.getElementById(
        "approvalNavCount"
      );


    const totalContentMetric =
      document.getElementById(
        "totalContentMetric"
      );


    const activeContentMetric =
      document.getElementById(
        "activeContentMetric"
      );


    const inactiveContentMetric =
      document.getElementById(
        "inactiveContentMetric"
      );


    const ageGroupMetric =
      document.getElementById(
        "ageGroupMetric"
      );


    const tabs =
      document.querySelectorAll(
        ".content-tab"
      );


    const sectionKicker =
      document.getElementById(
        "sectionKicker"
      );


    const sectionTitle =
      document.getElementById(
        "sectionTitle"
      );


    const sectionDescription =
      document.getElementById(
        "sectionDescription"
      );


    const addContentButton =
      document.getElementById(
        "addContentButton"
      );


    const addButtonLabel =
      document.getElementById(
        "addButtonLabel"
      );


    const contentSearch =
      document.getElementById(
        "contentSearch"
      );


    const ageGroupFilter =
      document.getElementById(
        "ageGroupFilter"
      );


    const statusFilter =
      document.getElementById(
        "statusFilter"
      );


    const clearFilters =
      document.getElementById(
        "clearFilters"
      );


    const resultCount =
      document.getElementById(
        "resultCount"
      );


    const storageHint =
      document.getElementById(
        "storageHint"
      );


    const contentTableHead =
      document.getElementById(
        "contentTableHead"
      );


    const contentTableBody =
      document.getElementById(
        "contentTableBody"
      );


    const mobileContentList =
      document.getElementById(
        "mobileContentList"
      );


    const emptyState =
      document.getElementById(
        "emptyState"
      );


    const emptyTitle =
      document.getElementById(
        "emptyTitle"
      );


    const emptyText =
      document.getElementById(
        "emptyText"
      );


    // MODAL

    const contentModal =
      document.getElementById(
        "contentModal"
      );


    const modalKicker =
      document.getElementById(
        "modalKicker"
      );


    const modalTitle =
      document.getElementById(
        "modalTitle"
      );


    const modalClose =
      document.getElementById(
        "modalClose"
      );


    const cancelModal =
      document.getElementById(
        "cancelModal"
      );


    const contentForm =
      document.getElementById(
        "contentForm"
      );


    const dynamicFields =
      document.getElementById(
        "dynamicFields"
      );


    const formError =
      document.getElementById(
        "formError"
      );


    const saveContentButton =
      document.getElementById(
        "saveContentButton"
      );


    // DELETE

    const deleteModal =
      document.getElementById(
        "deleteModal"
      );


    const deleteMessage =
      document.getElementById(
        "deleteMessage"
      );


    const cancelDelete =
      document.getElementById(
        "cancelDelete"
      );


    const confirmDelete =
      document.getElementById(
        "confirmDelete"
      );


    // TOAST

    const contentToast =
      document.getElementById(
        "contentToast"
      );


    const toastTitle =
      document.getElementById(
        "toastTitle"
      );


    const toastMessage =
      document.getElementById(
        "toastMessage"
      );


    // =====================================
    // TAB CONFIG
    // =====================================

    const TAB_CONFIG = {

      ageGroups: {

        kicker:
          "AGE PERSONALIZATION",

        title:
          "Age Groups",

        description:
          "Core age ranges used to personalize RAFIQ content.",

        singular:
          "Age Group",

        storage:
          STORAGE.ageGroups,

        addable:
          false
      },


      milestones: {

        kicker:
          "DEVELOPMENT CONTENT",

        title:
          "Milestones",

        description:
          "Manage age-appropriate developmental milestone definitions.",

        singular:
          "Milestone",

        storage:
          STORAGE.milestones,

        addable:
          true
      },


      screening: {

        kicker:
          "EARLY SCREENING",

        title:
          "Screening Questions",

        description:
          "Manage screening questions used for educational early concern checks.",

        singular:
          "Screening Question",

        storage:
          STORAGE.screening,

        addable:
          true
      },


      challenges: {

        kicker:
          "PARENT GUIDANCE",

        title:
          "Challenges",

        description:
          "Manage practical guidance for common parenting and developmental concerns.",

        singular:
          "Challenge",

        storage:
          STORAGE.challenges,

        addable:
          true
      },


      educational: {

        kicker:
          "EDUCATIONAL LIBRARY",

        title:
          "Educational Content",

        description:
          "Create and manage supportive parenting and child-development articles.",

        singular:
          "Article",

        storage:
          STORAGE.educational,

        addable:
          true
      }

    };


    // =====================================
    // STATE
    // =====================================

    let activeTab =
      "ageGroups";


    let editingId =
      null;


    let deletingId =
      null;


    // =====================================
    // AGE GROUPS
    // =====================================

    function getAgeGroups() {

      return readArray(
        STORAGE.ageGroups
      );
    }


    function getAgeGroupLabel(
      ageGroupId
    ) {

      if (
        ageGroupId === "all"
      ) {

        return "All ages";
      }


      const group =
        getAgeGroups()
          .find(
            item =>
              item.id ===
              ageGroupId
          );


      return group
        ? group.label
        : "Unknown age group";
    }


    function populateAgeFilter() {

      ageGroupFilter.innerHTML = `
        <option value="all">
          All age groups
        </option>
      `;


      getAgeGroups()
        .forEach(
          group => {

            const option =
              document.createElement(
                "option"
              );


            option.value =
              group.id;


            option.textContent =
              group.label;


            ageGroupFilter
              .appendChild(
                option
              );

          }
        );
    }


    // =====================================
    // APPROVAL BADGE
    // =====================================

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


    // =====================================
    // METRICS
    // =====================================

    function getAllManagedContent() {

      return [
        ...readArray(
          STORAGE.milestones
        ),
        ...readArray(
          STORAGE.screening
        ),
        ...readArray(
          STORAGE.challenges
        ),
        ...readArray(
          STORAGE.educational
        )
      ];
    }


    function renderMetrics() {

      const all =
        getAllManagedContent();


      const active =
        all.filter(
          item =>
            item.status === "active" ||
            item.status === "published"
        );


      totalContentMetric.textContent =
        all.length;


      activeContentMetric.textContent =
        active.length;


      inactiveContentMetric.textContent =
        all.length -
        active.length;


      ageGroupMetric.textContent =
        getAgeGroups().length;
    }


    // =====================================
    // TAB UI
    // =====================================

    function selectTab(
      tabName
    ) {

      activeTab =
        tabName;


      tabs.forEach(
        tab => {

          tab.classList.toggle(
            "active",
            tab.dataset.tab ===
              tabName
          );

        }
      );


      contentSearch.value =
        "";


      ageGroupFilter.value =
        "all";


      configureStatusFilter();


      const config =
        TAB_CONFIG[
          activeTab
        ];


      sectionKicker.textContent =
        config.kicker;


      sectionTitle.textContent =
        config.title;


      sectionDescription.textContent =
        config.description;


      addContentButton.hidden =
        !config.addable;


      addButtonLabel.textContent =
        `Add ${config.singular}`;


      ageGroupFilter.hidden =
        activeTab ===
        "ageGroups";


      storageHint.textContent =
        config.storage;


      renderContent();
    }


    function configureStatusFilter() {

      if (
        activeTab ===
        "educational"
      ) {

        statusFilter.innerHTML = `
          <option value="all">
            All statuses
          </option>

          <option value="published">
            Published
          </option>

          <option value="draft">
            Draft
          </option>
        `;

      } else {

        statusFilter.innerHTML = `
          <option value="all">
            All statuses
          </option>

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>
        `;
      }

    }


    tabs.forEach(
      tab => {

        tab.addEventListener(
          "click",
          () => {

            selectTab(
              tab.dataset.tab
            );

          }
        );

      }
    );


    // =====================================
    // SEARCH / FILTER
    // =====================================

    function getFilteredItems() {

      const config =
        TAB_CONFIG[
          activeTab
        ];


      const items =
        readArray(
          config.storage
        );


      const search =
        contentSearch.value
          .trim()
          .toLowerCase();


      const selectedAge =
        ageGroupFilter.value;


      const selectedStatus =
        statusFilter.value;


      return items.filter(
        item => {

          const haystack =
            Object
              .values(
                item
              )
              .filter(
                value =>
                  typeof value ===
                  "string" ||
                  typeof value ===
                  "number"
              )
              .join(" ")
              .toLowerCase();


          const matchesSearch =
            !search ||
            haystack.includes(
              search
            );


          const matchesAge =
            activeTab ===
              "ageGroups" ||
            selectedAge ===
              "all" ||
            item.ageGroupId ===
              selectedAge;


          const matchesStatus =
            selectedStatus ===
              "all" ||
            item.status ===
              selectedStatus;


          return (
            matchesSearch &&
            matchesAge &&
            matchesStatus
          );

        }
      );
    }


    contentSearch.addEventListener(
      "input",
      renderContent
    );


    ageGroupFilter.addEventListener(
      "change",
      renderContent
    );


    statusFilter.addEventListener(
      "change",
      renderContent
    );


    clearFilters.addEventListener(
      "click",
      () => {

        contentSearch.value =
          "";


        ageGroupFilter.value =
          "all";


        statusFilter.value =
          "all";


        renderContent();

      }
    );


    // =====================================
    // ESCAPE HTML
    // =====================================

    function escapeHTML(value) {

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
    // RENDER CONTENT
    // =====================================

    function renderContent() {

      const items =
        getFilteredItems();


      resultCount.textContent =
        `${items.length} ${
          items.length === 1
            ? "item"
            : "items"
        }`;


      contentTableHead.innerHTML =
        "";


      contentTableBody.innerHTML =
        "";


      mobileContentList.innerHTML =
        "";


      if (
        items.length === 0
      ) {

        emptyState.hidden =
          false;


        emptyTitle.textContent =
          "No content found";


        emptyText.textContent =
          "Try changing your search or filters.";


        return;
      }


      emptyState.hidden =
        true;


      renderTableHeader();


      items.forEach(
        item => {

          renderDesktopRow(
            item
          );


          renderMobileCard(
            item
          );

        }
      );
    }


    // =====================================
    // TABLE HEADERS
    // =====================================

    function renderTableHeader() {

      let headings =
        [];


      switch (
        activeTab
      ) {

        case "ageGroups":

          headings = [
            "Age Group",
            "Range",
            "Description",
            "Status",
            "Actions"
          ];

          break;


        case "milestones":

          headings = [
            "Milestone",
            "Age Group",
            "Domain",
            "Status",
            "Actions"
          ];

          break;


        case "screening":

          headings = [
            "Question",
            "Age Group",
            "Category",
            "Status",
            "Actions"
          ];

          break;


        case "challenges":

          headings = [
            "Challenge",
            "Age Group",
            "Category",
            "Status",
            "Actions"
          ];

          break;


        case "educational":

          headings = [
            "Article",
            "Audience",
            "Category",
            "Status",
            "Actions"
          ];

          break;
      }


      const row =
        document.createElement(
          "tr"
        );


      headings.forEach(
        heading => {

          const th =
            document.createElement(
              "th"
            );


          th.textContent =
            heading;


          row.appendChild(
            th
          );

        }
      );


      contentTableHead
        .appendChild(
          row
        );
    }


    // =====================================
    // ROW HELPERS
    // =====================================

    function getPrimaryTitle(
      item
    ) {

      if (
        activeTab ===
        "ageGroups"
      ) {

        return item.label;
      }


      if (
        activeTab ===
        "screening"
      ) {

        return item.question;
      }


      return (
        item.title ||
        "Untitled"
      );
    }


    function getDescription(
      item
    ) {

      if (
        activeTab ===
        "educational"
      ) {

        return (
          item.excerpt ||
          ""
        );
      }


      if (
        activeTab ===
        "challenges"
      ) {

        return (
          item.summary ||
          ""
        );
      }


      return (
        item.description ||
        ""
      );
    }


    function getCategory(
      item
    ) {

      return (
        item.domain ||
        item.category ||
        "—"
      );
    }


    // =====================================
    // DESKTOP ROW
    // =====================================

    function renderDesktopRow(
      item
    ) {

      const row =
        document.createElement(
          "tr"
        );


      if (
        activeTab ===
        "ageGroups"
      ) {

        row.innerHTML = `
          <td>
            <div class="content-title-cell">
              <strong>
                ${escapeHTML(
                  item.label
                )}
              </strong>
            </div>
          </td>

          <td>
            <span class="age-pill">
              ${escapeHTML(
                item.minAge
              )}–${escapeHTML(
                item.maxAge
              )}
            </span>
          </td>

          <td>
            <div class="content-title-cell">
              <span>
                ${escapeHTML(
                  item.description
                )}
              </span>
            </div>
          </td>

          <td>
            ${statusHTML(
              item.status
            )}
          </td>

          <td>
            ${actionHTML(
              item,
              false
            )}
          </td>
        `;

      } else {

        row.innerHTML = `
          <td>
            <div class="content-title-cell">
              <strong>
                ${escapeHTML(
                  getPrimaryTitle(
                    item
                  )
                )}
              </strong>

              <span>
                ${escapeHTML(
                  getDescription(
                    item
                  )
                )}
              </span>
            </div>
          </td>

          <td>
            <span class="age-pill">
              ${escapeHTML(
                getAgeGroupLabel(
                  item.ageGroupId
                )
              )}
            </span>
          </td>

          <td>
            <span class="category-pill">
              ${escapeHTML(
                getCategory(
                  item
                )
              )}
            </span>
          </td>

          <td>
            ${statusHTML(
              item.status
            )}
          </td>

          <td>
            ${actionHTML(
              item,
              true
            )}
          </td>
        `;
      }


      attachRowActions(
        row,
        item
      );


      contentTableBody
        .appendChild(
          row
        );
    }


    function statusHTML(
      status
    ) {

      const label =
        status
          .charAt(0)
          .toUpperCase() +
        status.slice(1);


      return `
        <span class="status-badge ${escapeHTML(
          status
        )}">
          ${escapeHTML(
            label
          )}
        </span>
      `;
    }


    function actionHTML(
      item,
      allowDelete
    ) {

      return `
        <div class="table-actions">

          <button
            type="button"
            class="action-button edit"
            data-action="edit"
          >
            Edit
          </button>

          <button
            type="button"
            class="action-button toggle"
            data-action="toggle"
          >
            ${
              item.status ===
                "active" ||
              item.status ===
                "published"
                ? "Hide"
                : "Activate"
            }
          </button>

          ${
            allowDelete
              ? `
                <button
                  type="button"
                  class="action-button delete"
                  data-action="delete"
                >
                  Delete
                </button>
              `
              : ""
          }

        </div>
      `;
    }


    // =====================================
    // MOBILE
    // =====================================

    function renderMobileCard(
      item
    ) {

      const card =
        document.createElement(
          "article"
        );


      card.className =
        "mobile-content-card";


      card.innerHTML = `
        <div class="mobile-card-top">

          <h3>
            ${escapeHTML(
              getPrimaryTitle(
                item
              )
            )}
          </h3>

          ${statusHTML(
            item.status
          )}

        </div>


        <p>
          ${escapeHTML(
            getDescription(
              item
            )
          )}
        </p>


        <div class="mobile-card-meta">

          ${
            activeTab !==
            "ageGroups"
              ? `
                <span class="age-pill">
                  ${escapeHTML(
                    getAgeGroupLabel(
                      item.ageGroupId
                    )
                  )}
                </span>

                <span class="category-pill">
                  ${escapeHTML(
                    getCategory(
                      item
                    )
                  )}
                </span>
              `
              : `
                <span class="age-pill">
                  Ages
                  ${escapeHTML(
                    item.minAge
                  )}–${escapeHTML(
                    item.maxAge
                  )}
                </span>
              `
          }

        </div>


        <div class="mobile-card-actions">

          <button
            type="button"
            class="action-button edit"
            data-action="edit"
          >
            Edit
          </button>


          <button
            type="button"
            class="action-button toggle"
            data-action="toggle"
          >
            ${
              item.status ===
                "active" ||
              item.status ===
                "published"
                ? "Hide"
                : "Activate"
            }
          </button>


          ${
            activeTab !==
            "ageGroups"
              ? `
                <button
                  type="button"
                  class="action-button delete"
                  data-action="delete"
                >
                  Delete
                </button>
              `
              : ""
          }

        </div>
      `;


      attachRowActions(
        card,
        item
      );


      mobileContentList
        .appendChild(
          card
        );
    }


    // =====================================
    // ROW ACTIONS
    // =====================================

    function attachRowActions(
      container,
      item
    ) {

      const editButton =
        container.querySelector(
          '[data-action="edit"]'
        );


      const toggleButton =
        container.querySelector(
          '[data-action="toggle"]'
        );


      const deleteButton =
        container.querySelector(
          '[data-action="delete"]'
        );


      editButton?.addEventListener(
        "click",
        () => {

          openContentModal(
            item
          );

        }
      );


      toggleButton?.addEventListener(
        "click",
        () => {

          toggleItemStatus(
            item.id
          );

        }
      );


      deleteButton?.addEventListener(
        "click",
        () => {

          prepareDelete(
            item.id
          );

        }
      );
    }


    // =====================================
    // TOGGLE
    // =====================================

    function toggleItemStatus(
      itemId
    ) {

      const config =
        TAB_CONFIG[
          activeTab
        ];


      let items =
        readArray(
          config.storage
        );


      items =
        items.map(
          item => {

            if (
              item.id !==
              itemId
            ) {

              return item;
            }


            let nextStatus;


            if (
              activeTab ===
              "educational"
            ) {

              nextStatus =
                item.status ===
                "published"
                  ? "draft"
                  : "published";

            } else {

              nextStatus =
                item.status ===
                "active"
                  ? "inactive"
                  : "active";
            }


            return {

              ...item,

              status:
                nextStatus,

              updatedAt:
                new Date()
                  .toISOString()
            };

          }
        );


      writeArray(
        config.storage,
        items
      );


      renderMetrics();

      renderContent();


      showToast(
        "Status updated",
        `${config.singular} visibility was updated.`
      );
    }


    // =====================================
    // MODAL OPEN
    // =====================================

    addContentButton.addEventListener(
      "click",
      () => {

        openContentModal(
          null
        );

      }
    );


    function openContentModal(
      item
    ) {

      editingId =
        item?.id ||
        null;


      formError.textContent =
        "";


      modalKicker.textContent =
        TAB_CONFIG[
          activeTab
        ].kicker;


      modalTitle.textContent =
        editingId
          ? `Edit ${
              TAB_CONFIG[
                activeTab
              ].singular
            }`
          : `Add ${
              TAB_CONFIG[
                activeTab
              ].singular
            }`;


      saveContentButton.textContent =
        editingId
          ? "Save Changes"
          : "Add Content";


      renderFormFields(
        item
      );


      contentModal.hidden =
        false;


      document.body.style.overflow =
        "hidden";
    }


    // =====================================
    // FORM FIELD HELPERS
    // =====================================

    function ageGroupOptions(
      selected,
      allowAll = false
    ) {

      let html =
        allowAll
          ? `
            <option
              value="all"
              ${
                selected ===
                "all"
                  ? "selected"
                  : ""
              }
            >
              All ages
            </option>
          `
          : "";


      getAgeGroups()
        .filter(
          group =>
            group.status ===
            "active"
        )
        .forEach(
          group => {

            html += `
              <option
                value="${escapeHTML(
                  group.id
                )}"
                ${
                  selected ===
                  group.id
                    ? "selected"
                    : ""
                }
              >
                ${escapeHTML(
                  group.label
                )}
              </option>
            `;

          }
        );


      return html;
    }


    function formField(
      label,
      input,
      full = false,
      help = ""
    ) {

      return `
        <div
          class="form-field ${
            full
              ? "full"
              : ""
          }"
        >

          <label>
            ${label}
          </label>

          ${input}

          ${
            help
              ? `
                <span class="field-help">
                  ${help}
                </span>
              `
              : ""
          }

        </div>
      `;
    }


    // =====================================
    // RENDER FORM
    // =====================================

    function renderFormFields(
      item
    ) {

      dynamicFields.innerHTML =
        "";


      if (
        activeTab ===
        "ageGroups"
      ) {

        dynamicFields.innerHTML =

          formField(
            "Age Group",
            `
              <input
                id="fieldLabel"
                type="text"
                value="${escapeHTML(
                  item?.label ||
                  ""
                )}"
                required
              >
            `
          ) +

          formField(
            "Range",
            `
              <input
                type="text"
                value="${escapeHTML(
                  `${item?.minAge ?? ""}–${item?.maxAge ?? ""} years`
                )}"
                disabled
              >
            `,
            false,
            "Age boundaries are fixed in this prototype."
          ) +

          formField(
            "Description",
            `
              <textarea
                id="fieldDescription"
                required
              >${escapeHTML(
                item?.description ||
                ""
              )}</textarea>
            `,
            true
          ) +

          formField(
            "Status",
            `
              <select
                id="fieldStatus"
              >
                <option
                  value="active"
                  ${
                    item?.status ===
                    "active"
                      ? "selected"
                      : ""
                  }
                >
                  Active
                </option>

                <option
                  value="inactive"
                  ${
                    item?.status ===
                    "inactive"
                      ? "selected"
                      : ""
                  }
                >
                  Inactive
                </option>
              </select>
            `
          );


        return;
      }


      if (
        activeTab ===
        "milestones"
      ) {

        dynamicFields.innerHTML =

          formField(
            "Age Group",
            `
              <select
                id="fieldAgeGroup"
                required
              >
                ${ageGroupOptions(
                  item?.ageGroupId
                )}
              </select>
            `
          ) +

          formField(
            "Development Domain",
            `
              <select
                id="fieldCategory"
                required
              >
                ${selectOptions(
                  [
                    "Physical",
                    "Communication",
                    "Cognitive",
                    "Social & Emotional",
                    "Behavioral"
                  ],
                  item?.domain
                )}
              </select>
            `
          ) +

          formField(
            "Milestone Title",
            `
              <input
                id="fieldTitle"
                type="text"
                maxlength="160"
                value="${escapeHTML(
                  item?.title ||
                  ""
                )}"
                required
              >
            `,
            true
          ) +

          formField(
            "Description",
            `
              <textarea
                id="fieldDescription"
                maxlength="600"
                required
              >${escapeHTML(
                item?.description ||
                ""
              )}</textarea>
            `,
            true
          ) +

          formField(
            "Status",
            statusSelect(
              item?.status
            )
          );


        return;
      }


      if (
        activeTab ===
        "screening"
      ) {

        dynamicFields.innerHTML =

          formField(
            "Age Group",
            `
              <select
                id="fieldAgeGroup"
                required
              >
                ${ageGroupOptions(
                  item?.ageGroupId
                )}
              </select>
            `
          ) +

          formField(
            "Category",
            `
              <select
                id="fieldCategory"
                required
              >
                ${selectOptions(
                  [
                    "Development",
                    "Communication",
                    "Social Communication",
                    "Attention",
                    "Behavior",
                    "Emotional Wellbeing"
                  ],
                  item?.category
                )}
              </select>
            `
          ) +

          formField(
            "Screening Question",
            `
              <textarea
                id="fieldQuestion"
                maxlength="500"
                required
              >${escapeHTML(
                item?.question ||
                ""
              )}</textarea>
            `,
            true,
            "Screening content should not be presented as a medical diagnosis."
          ) +

          formField(
            "Response Scale",
            `
              <select
                id="fieldScale"
              >
                <option
                  value="yes_no_unsure"
                  ${
                    (
                      item?.responseScale ||
                      "yes_no_unsure"
                    ) ===
                    "yes_no_unsure"
                      ? "selected"
                      : ""
                  }
                >
                  Yes / No / Not sure
                </option>
              </select>
            `
          ) +

          formField(
            "Status",
            statusSelect(
              item?.status
            )
          );


        return;
      }


      if (
        activeTab ===
        "challenges"
      ) {

        dynamicFields.innerHTML =

          formField(
            "Age Group",
            `
              <select
                id="fieldAgeGroup"
                required
              >
                ${ageGroupOptions(
                  item?.ageGroupId
                )}
              </select>
            `
          ) +

          formField(
            "Category",
            `
              <select
                id="fieldCategory"
                required
              >
                ${selectOptions(
                  [
                    "Development",
                    "Behavior",
                    "Communication",
                    "School",
                    "Emotional Wellbeing",
                    "Digital Life",
                    "Family"
                  ],
                  item?.category
                )}
              </select>
            `
          ) +

          formField(
            "Challenge Title",
            `
              <input
                id="fieldTitle"
                type="text"
                maxlength="160"
                value="${escapeHTML(
                  item?.title ||
                  ""
                )}"
                required
              >
            `,
            true
          ) +

          formField(
            "Summary",
            `
              <textarea
                id="fieldSummary"
                required
              >${escapeHTML(
                item?.summary ||
                ""
              )}</textarea>
            `,
            true
          ) +

          formField(
            "What Parents Can Do",
            `
              <textarea
                id="fieldWhatToDo"
                required
              >${escapeHTML(
                item?.whatToDo ||
                ""
              )}</textarea>
            `,
            true
          ) +

          formField(
            "What to Avoid",
            `
              <textarea
                id="fieldWhatToAvoid"
                required
              >${escapeHTML(
                item?.whatToAvoid ||
                ""
              )}</textarea>
            `,
            true
          ) +

          formField(
            "When to Seek Professional Help",
            `
              <textarea
                id="fieldSeekHelp"
                required
              >${escapeHTML(
                item?.whenToSeekHelp ||
                ""
              )}</textarea>
            `,
            true
          ) +

          formField(
            "Status",
            statusSelect(
              item?.status
            )
          );


        return;
      }


      if (
        activeTab ===
        "educational"
      ) {

        dynamicFields.innerHTML =

          formField(
            "Audience",
            `
              <select
                id="fieldAgeGroup"
                required
              >
                ${ageGroupOptions(
                  item?.ageGroupId ||
                  "all",
                  true
                )}
              </select>
            `
          ) +

          formField(
            "Category",
            `
              <select
                id="fieldCategory"
                required
              >
                ${selectOptions(
                  [
                    "Parenting",
                    "Development",
                    "Communication",
                    "School",
                    "Emotional Wellbeing",
                    "Digital Safety"
                  ],
                  item?.category
                )}
              </select>
            `
          ) +

          formField(
            "Article Title",
            `
              <input
                id="fieldTitle"
                type="text"
                maxlength="180"
                value="${escapeHTML(
                  item?.title ||
                  ""
                )}"
                required
              >
            `,
            true
          ) +

          formField(
            "Short Excerpt",
            `
              <textarea
                id="fieldExcerpt"
                maxlength="400"
                required
              >${escapeHTML(
                item?.excerpt ||
                ""
              )}</textarea>
            `,
            true
          ) +

          formField(
            "Article Content",
            `
              <textarea
                id="fieldBody"
                required
                style="min-height:160px;"
              >${escapeHTML(
                item?.body ||
                ""
              )}</textarea>
            `,
            true
          ) +

          formField(
            "Publishing Status",
            `
              <select
                id="fieldStatus"
              >
                <option
                  value="published"
                  ${
                    item?.status ===
                    "published"
                      ? "selected"
                      : ""
                  }
                >
                  Published
                </option>

                <option
                  value="draft"
                  ${
                    !item ||
                    item?.status ===
                    "draft"
                      ? "selected"
                      : ""
                  }
                >
                  Draft
                </option>
              </select>
            `
          );
      }

    }


    function statusSelect(
      status
    ) {

      return `
        <select
          id="fieldStatus"
        >

          <option
            value="active"
            ${
              !status ||
              status === "active"
                ? "selected"
                : ""
            }
          >
            Active
          </option>

          <option
            value="inactive"
            ${
              status === "inactive"
                ? "selected"
                : ""
            }
          >
            Inactive
          </option>

        </select>
      `;
    }


    function selectOptions(
      options,
      selected
    ) {

      return options
        .map(
          option => `
            <option
              value="${escapeHTML(
                option
              )}"
              ${
                selected ===
                option
                  ? "selected"
                  : ""
              }
            >
              ${escapeHTML(
                option
              )}
            </option>
          `
        )
        .join("");
    }


    // =====================================
    // CLOSE MODAL
    // =====================================

    function closeContentModal() {

      contentModal.hidden =
        true;


      document.body.style.overflow =
        "";


      editingId =
        null;


      formError.textContent =
        "";
    }


    modalClose.addEventListener(
      "click",
      closeContentModal
    );


    cancelModal.addEventListener(
      "click",
      closeContentModal
    );


    contentModal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          contentModal
        ) {

          closeContentModal();
        }

      }
    );


    // =====================================
    // SAVE FORM
    // =====================================

    contentForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        formError.textContent =
          "";


        const data =
          collectFormData();


        if (!data) {

          return;
        }


        const config =
          TAB_CONFIG[
            activeTab
          ];


        let items =
          readArray(
            config.storage
          );


        const now =
          new Date()
            .toISOString();


        if (
          editingId
        ) {

          items =
            items.map(
              item =>
                item.id ===
                editingId
                  ? {
                      ...item,
                      ...data,
                      updatedAt:
                        now
                    }
                  : item
            );


        } else {

          const prefix =
            activeTab ===
            "educational"
              ? "article"
              : activeTab.slice(
                  0,
                  -1
                );


          items.unshift({

            id:
              `${prefix}_${Date.now()}`,

            ...data,

            createdAt:
              now,

            updatedAt:
              now

          });

        }


        writeArray(
          config.storage,
          items
        );


        closeContentModal();


        renderMetrics();

        renderContent();


        showToast(
          editingId
            ? "Content updated"
            : "Content added",

          `${config.singular} was saved successfully.`
        );

      }
    );


    // =====================================
    // COLLECT FORM DATA
    // =====================================

    function valueOf(
      id
    ) {

      return (
        document
          .getElementById(
            id
          )
          ?.value
          ?.trim() ||
        ""
      );
    }


    function collectFormData() {

      if (
        activeTab ===
        "ageGroups"
      ) {

        const label =
          valueOf(
            "fieldLabel"
          );


        const description =
          valueOf(
            "fieldDescription"
          );


        if (
          !label ||
          !description
        ) {

          formError.textContent =
            "Please complete all required fields.";

          return null;
        }


        return {

          label,

          description,

          status:
            valueOf(
              "fieldStatus"
            )
        };
      }


      if (
        activeTab ===
        "milestones"
      ) {

        const data = {

          ageGroupId:
            valueOf(
              "fieldAgeGroup"
            ),

          domain:
            valueOf(
              "fieldCategory"
            ),

          title:
            valueOf(
              "fieldTitle"
            ),

          description:
            valueOf(
              "fieldDescription"
            ),

          status:
            valueOf(
              "fieldStatus"
            )
        };


        if (
          !data.ageGroupId ||
          !data.domain ||
          !data.title ||
          !data.description
        ) {

          formError.textContent =
            "Please complete all required fields.";

          return null;
        }


        return data;
      }


      if (
        activeTab ===
        "screening"
      ) {

        const data = {

          ageGroupId:
            valueOf(
              "fieldAgeGroup"
            ),

          category:
            valueOf(
              "fieldCategory"
            ),

          question:
            valueOf(
              "fieldQuestion"
            ),

          responseScale:
            valueOf(
              "fieldScale"
            ),

          status:
            valueOf(
              "fieldStatus"
            )
        };


        if (
          !data.ageGroupId ||
          !data.category ||
          !data.question
        ) {

          formError.textContent =
            "Please complete all required fields.";

          return null;
        }


        return data;
      }


      if (
        activeTab ===
        "challenges"
      ) {

        const data = {

          ageGroupId:
            valueOf(
              "fieldAgeGroup"
            ),

          category:
            valueOf(
              "fieldCategory"
            ),

          title:
            valueOf(
              "fieldTitle"
            ),

          summary:
            valueOf(
              "fieldSummary"
            ),

          whatToDo:
            valueOf(
              "fieldWhatToDo"
            ),

          whatToAvoid:
            valueOf(
              "fieldWhatToAvoid"
            ),

          whenToSeekHelp:
            valueOf(
              "fieldSeekHelp"
            ),

          status:
            valueOf(
              "fieldStatus"
            )
        };


        if (
          !data.ageGroupId ||
          !data.category ||
          !data.title ||
          !data.summary ||
          !data.whatToDo ||
          !data.whatToAvoid ||
          !data.whenToSeekHelp
        ) {

          formError.textContent =
            "Please complete all required fields.";

          return null;
        }


        return data;
      }


      if (
        activeTab ===
        "educational"
      ) {

        const data = {

          ageGroupId:
            valueOf(
              "fieldAgeGroup"
            ),

          category:
            valueOf(
              "fieldCategory"
            ),

          title:
            valueOf(
              "fieldTitle"
            ),

          excerpt:
            valueOf(
              "fieldExcerpt"
            ),

          body:
            valueOf(
              "fieldBody"
            ),

          status:
            valueOf(
              "fieldStatus"
            )
        };


        if (
          !data.ageGroupId ||
          !data.category ||
          !data.title ||
          !data.excerpt ||
          !data.body
        ) {

          formError.textContent =
            "Please complete all required fields.";

          return null;
        }


        return data;
      }


      return null;
    }


    // =====================================
    // DELETE
    // =====================================

    function prepareDelete(
      itemId
    ) {

      deletingId =
        itemId;


      const item =
        readArray(
          TAB_CONFIG[
            activeTab
          ].storage
        )
          .find(
            entry =>
              entry.id ===
              itemId
          );


      deleteMessage.textContent =
        `"${getPrimaryTitle(
          item
        )}" will be removed from the local prototype content library.`;


      deleteModal.hidden =
        false;
    }


    cancelDelete.addEventListener(
      "click",
      () => {

        deleteModal.hidden =
          true;


        deletingId =
          null;

      }
    );


    confirmDelete.addEventListener(
      "click",
      () => {

        if (
          !deletingId ||
          activeTab ===
          "ageGroups"
        ) {

          return;
        }


        const config =
          TAB_CONFIG[
            activeTab
          ];


        const items =
          readArray(
            config.storage
          )
            .filter(
              item =>
                item.id !==
                deletingId
            );


        writeArray(
          config.storage,
          items
        );


        deleteModal.hidden =
          true;


        deletingId =
          null;


        renderMetrics();

        renderContent();


        showToast(
          "Content removed",
          `${config.singular} was deleted.`
        );

      }
    );


    deleteModal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          deleteModal
        ) {

          deleteModal.hidden =
            true;

          deletingId =
            null;
        }

      }
    );


    // =====================================
    // TOAST
    // =====================================

    let toastTimer =
      null;


    function showToast(
      title,
      message
    ) {

      toastTitle.textContent =
        title;


      toastMessage.textContent =
        message;


      contentToast.hidden =
        false;


      clearTimeout(
        toastTimer
      );


      toastTimer =
        setTimeout(
          () => {

            contentToast.hidden =
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
    // ESC KEY
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


        if (
          !contentModal.hidden
        ) {

          closeContentModal();

          return;
        }


        if (
          !deleteModal.hidden
        ) {

          deleteModal.hidden =
            true;

          deletingId =
            null;

          return;
        }


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
    // INIT
    // =====================================

    populateAgeFilter();

    renderApprovalBadge();

    renderMetrics();

    configureStatusFilter();

    selectTab(
      "ageGroups"
    );

  }
);