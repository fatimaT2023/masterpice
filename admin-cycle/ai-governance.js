document.addEventListener("DOMContentLoaded", () => {

  // =====================================================
  // ROLE GUARD
  // =====================================================

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


  function writeArray(
    key,
    value
  ) {

    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  }


  const KNOWLEDGE_KEY =
    "rafiqAIKnowledgeBase";


  const SAFETY_KEY =
    "rafiqAISafetyRules";


  // =====================================================
  // DEFAULT KNOWLEDGE
  // =====================================================

  const defaultKnowledge = [

    {
      id: "knowledge_001",

      title:
        "Supporting Healthy Child Development",

      category:
        "Development",

      ageGroup:
        "all",

      content:
        "Development varies between children. Parents can observe patterns over time, provide supportive age-appropriate opportunities, and discuss persistent concerns with a qualified professional.",

      sourceLabel:
        "RAFIQ reviewed guidance",

      status:
        "active",

      createdAt:
        new Date().toISOString()
    },


    {
      id: "knowledge_002",

      title:
        "Responding to Tantrums",

      category:
        "Behavior",

      ageGroup:
        "4-6",

      content:
        "During emotional outbursts, caregivers can stay calm, maintain predictable boundaries and help the child name emotions after the situation settles.",

      sourceLabel:
        "Parent guidance",

      status:
        "active",

      createdAt:
        new Date().toISOString()
    },


    {
      id: "knowledge_003",

      title:
        "Supporting School-age Learning",

      category:
        "Learning",

      ageGroup:
        "7-12",

      content:
        "When learning difficulties persist, parents can observe patterns, coordinate with teachers and consider professional evaluation when appropriate.",

      sourceLabel:
        "Educational guidance",

      status:
        "active",

      createdAt:
        new Date().toISOString()
    },


    {
      id: "knowledge_004",

      title:
        "Communicating With Teenagers",

      category:
        "Emotional Wellbeing",

      ageGroup:
        "13-18",

      content:
        "Open communication with adolescents can include listening without immediate judgment, respecting increasing independence and remaining available for support.",

      sourceLabel:
        "Parent guidance",

      status:
        "active",

      createdAt:
        new Date().toISOString()
    }

  ];


  // =====================================================
  // DEFAULT SAFETY RULES
  // =====================================================

  const defaultSafety = [

    {
      id:
        "safety_breathing",

      title:
        "Severe Breathing Difficulty",

      severity:
        "critical",

      triggerTerms: [
        "difficulty breathing",
        "can't breathe",
        "cannot breathe",
        "not breathing"
      ],

      action:
        "emergency",

      response:
        "Possible emergency. Seek urgent medical attention or contact local emergency services immediately.",

      status:
        "active",

      createdAt:
        new Date().toISOString()
    },


    {
      id:
        "safety_unconscious",

      title:
        "Loss of Consciousness",

      severity:
        "critical",

      triggerTerms: [
        "unconscious",
        "not waking up",
        "won't wake up",
        "passed out"
      ],

      action:
        "emergency",

      response:
        "Possible emergency. Seek immediate medical help or contact local emergency services.",

      status:
        "active",

      createdAt:
        new Date().toISOString()
    },


    {
      id:
        "safety_self_harm",

      title:
        "Self-harm or Suicide Concern",

      severity:
        "critical",

      triggerTerms: [
        "hurt myself",
        "kill myself",
        "suicide",
        "self harm",
        "self-harm"
      ],

      action:
        "emergency",

      response:
        "This may require urgent support. Stay with the person when possible and seek immediate professional or emergency assistance.",

      status:
        "active",

      createdAt:
        new Date().toISOString()
    },


    {
      id:
        "safety_abuse",

      title:
        "Possible Abuse or Immediate Danger",

      severity:
        "critical",

      triggerTerms: [
        "being abused",
        "someone hits my child",
        "sexual abuse",
        "immediate danger"
      ],

      action:
        "urgent_support",

      response:
        "Safety comes first. If a child may be in immediate danger, contact appropriate emergency or child-protection services.",

      status:
        "active",

      createdAt:
        new Date().toISOString()
    },


    {
      id:
        "safety_professional",

      title:
        "Persistent Developmental Concern",

      severity:
        "warning",

      triggerTerms: [
        "developmental delay",
        "speech delay",
        "not developing",
        "should I see a specialist"
      ],

      action:
        "professional",

      response:
        "RAFIQ cannot diagnose developmental conditions. Consider discussing persistent concerns with an appropriate qualified professional.",

      status:
        "active",

      createdAt:
        new Date().toISOString()
    }

  ];


  // =====================================================
  // INITIALIZE
  // =====================================================

  if (
    localStorage.getItem(
      KNOWLEDGE_KEY
    ) === null
  ) {

    writeArray(
      KNOWLEDGE_KEY,
      defaultKnowledge
    );
  }


  if (
    localStorage.getItem(
      SAFETY_KEY
    ) === null
  ) {

    writeArray(
      SAFETY_KEY,
      defaultSafety
    );
  }


  // =====================================================
  // ADMIN
  // =====================================================

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


  // =====================================================
  // ELEMENTS
  // =====================================================

  const approvalNavCount =
    document.getElementById(
      "approvalNavCount"
    );


  const knowledgeCount =
    document.getElementById(
      "knowledgeCount"
    );


  const activeKnowledgeCount =
    document.getElementById(
      "activeKnowledgeCount"
    );


  const safetyCount =
    document.getElementById(
      "safetyCount"
    );


  const criticalCount =
    document.getElementById(
      "criticalCount"
    );


  const tabs =
    document.querySelectorAll(
      ".tab"
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


  const governanceNoticeText =
    document.getElementById(
      "governanceNoticeText"
    );


  const addButton =
    document.getElementById(
      "addButton"
    );


  const addButtonText =
    document.getElementById(
      "addButtonText"
    );


  const searchInput =
    document.getElementById(
      "searchInput"
    );


  const categoryFilter =
    document.getElementById(
      "categoryFilter"
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


  const storageLabel =
    document.getElementById(
      "storageLabel"
    );


  const tableHead =
    document.getElementById(
      "tableHead"
    );


  const tableBody =
    document.getElementById(
      "tableBody"
    );


  const mobileList =
    document.getElementById(
      "mobileList"
    );


  const emptyState =
    document.getElementById(
      "emptyState"
    );


  // EDITOR

  const editorModal =
    document.getElementById(
      "editorModal"
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


  const cancelEditor =
    document.getElementById(
      "cancelEditor"
    );


  const editorForm =
    document.getElementById(
      "editorForm"
    );


  const formFields =
    document.getElementById(
      "formFields"
    );


  const formError =
    document.getElementById(
      "formError"
    );


  // DELETE

  const deleteModal =
    document.getElementById(
      "deleteModal"
    );


  const deleteText =
    document.getElementById(
      "deleteText"
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

  const toast =
    document.getElementById(
      "toast"
    );


  const toastTitle =
    document.getElementById(
      "toastTitle"
    );


  const toastMessage =
    document.getElementById(
      "toastMessage"
    );


  // =====================================================
  // STATE
  // =====================================================

  let activeTab =
    "knowledge";


  let editingId =
    null;


  let deletingId =
    null;


  // =====================================================
  // BADGE
  // =====================================================

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


  // =====================================================
  // METRICS
  // =====================================================

  function renderMetrics() {

    const knowledge =
      readArray(
        KNOWLEDGE_KEY
      );


    const safety =
      readArray(
        SAFETY_KEY
      );


    knowledgeCount.textContent =
      knowledge.length;


    activeKnowledgeCount.textContent =
      knowledge.filter(
        item =>
          item.status ===
          "active"
      ).length;


    safetyCount.textContent =
      safety.length;


    criticalCount.textContent =
      safety.filter(
        item =>
          item.severity ===
          "critical"
      ).length;
  }


  // =====================================================
  // TAB
  // =====================================================

  tabs.forEach(tab => {

    tab.addEventListener(
      "click",
      () => {

        activeTab =
          tab.dataset.tab;


        tabs.forEach(item => {

          item.classList.toggle(
            "active",
            item === tab
          );
        });


        resetFilters();

        configureTab();

        renderItems();
      }
    );

  });


  function configureTab() {

    if (
      activeTab ===
      "knowledge"
    ) {

      sectionKicker.textContent =
        "CURATED GUIDANCE";


      sectionTitle.textContent =
        "AI Knowledge Base";


      sectionDescription.textContent =
        "Reviewed guidance that can support the RAFIQ parent assistant.";


      governanceNoticeText.textContent =
        "Knowledge entries should be educational, cautious and suitable for parent guidance. They must not present AI output as diagnosis or medical certainty.";


      addButtonText.textContent =
        "Add Knowledge";


      searchInput.placeholder =
        "Search knowledge...";


      storageLabel.textContent =
        "rafiqAIKnowledgeBase";

    } else {

      sectionKicker.textContent =
        "SAFETY LAYER";


      sectionTitle.textContent =
        "Safety & Red Flags";


      sectionDescription.textContent =
        "Manage high-priority phrases and response rules for potentially unsafe situations.";


      governanceNoticeText.textContent =
        "Safety rules are a prototype support layer, not a complete emergency detection system. Production safety requires backend controls, testing and professional review.";


      addButtonText.textContent =
        "Add Safety Rule";


      searchInput.placeholder =
        "Search safety rules...";


      storageLabel.textContent =
        "rafiqAISafetyRules";
    }


    populateCategoryFilter();
  }


  // =====================================================
  // CATEGORIES
  // =====================================================

  function populateCategoryFilter() {

    categoryFilter.innerHTML =
      `<option value="all">All categories</option>`;


    const items =
      activeTab ===
        "knowledge"
          ? readArray(
              KNOWLEDGE_KEY
            )
          : readArray(
              SAFETY_KEY
            );


    const values =
      new Set();


    items.forEach(item => {

      const value =
        activeTab ===
          "knowledge"
            ? item.category
            : item.severity;


      if (value) {

        values.add(
          value
        );
      }
    });


    Array.from(values)
      .sort()
      .forEach(value => {

        const option =
          document.createElement(
            "option"
          );


        option.value =
          value;


        option.textContent =
          activeTab === "safety"
            ? capitalize(value)
            : value;


        categoryFilter.appendChild(
          option
        );

      });
  }


  // =====================================================
  // FILTERS
  // =====================================================

  function resetFilters() {

    searchInput.value =
      "";


    statusFilter.value =
      "all";
  }


  clearFilters.addEventListener(
    "click",
    () => {

      searchInput.value =
        "";

      categoryFilter.value =
        "all";

      statusFilter.value =
        "all";

      renderItems();
    }
  );


  searchInput.addEventListener(
    "input",
    renderItems
  );


  categoryFilter.addEventListener(
    "change",
    renderItems
  );


  statusFilter.addEventListener(
    "change",
    renderItems
  );


  function getFilteredItems() {

    const items =
      activeTab ===
        "knowledge"
          ? readArray(
              KNOWLEDGE_KEY
            )
          : readArray(
              SAFETY_KEY
            );


    const search =
      searchInput.value
        .trim()
        .toLowerCase();


    const category =
      categoryFilter.value;


    const status =
      statusFilter.value;


    return items.filter(item => {

      const haystack =
        JSON.stringify(
          item
        ).toLowerCase();


      const matchSearch =
        !search ||
        haystack.includes(
          search
        );


      const categoryValue =
        activeTab ===
          "knowledge"
            ? item.category
            : item.severity;


      const matchCategory =
        category ===
          "all" ||
        categoryValue ===
          category;


      const matchStatus =
        status ===
          "all" ||
        item.status ===
          status;


      return (
        matchSearch &&
        matchCategory &&
        matchStatus
      );
    });
  }


  // =====================================================
  // RENDER
  // =====================================================

  function renderItems() {

    const items =
      getFilteredItems();


    resultCount.textContent =
      `${items.length} ${
        items.length === 1
          ? "item"
          : "items"
      }`;


    tableHead.innerHTML =
      "";


    tableBody.innerHTML =
      "";


    mobileList.innerHTML =
      "";


    emptyState.hidden =
      items.length !== 0;


    renderTableHead();


    items.forEach(item => {

      renderRow(
        item
      );


      renderMobile(
        item
      );
    });
  }


  function renderTableHead() {

    const headings =
      activeTab === "knowledge"
        ? [
            "Knowledge Entry",
            "Category",
            "Audience",
            "Status",
            "Actions"
          ]
        : [
            "Safety Rule",
            "Severity",
            "Response Action",
            "Status",
            "Actions"
          ];


    const row =
      document.createElement(
        "tr"
      );


    headings.forEach(text => {

      const th =
        document.createElement(
          "th"
        );


      th.textContent =
        text;


      row.appendChild(
        th
      );
    });


    tableHead.appendChild(
      row
    );
  }


  function renderRow(item) {

    const row =
      document.createElement(
        "tr"
      );


    if (
      activeTab ===
      "knowledge"
    ) {

      row.innerHTML = `
        <td>
          <div class="item-main">

            <strong>
              ${escapeHTML(item.title)}
            </strong>

            <span>
              ${escapeHTML(item.content)}
            </span>

          </div>
        </td>

        <td>
          <span class="category-pill">
            ${escapeHTML(item.category)}
          </span>
        </td>

        <td>
          ${escapeHTML(
            formatAgeGroup(
              item.ageGroup
            )
          )}
        </td>

        <td>
          ${statusHTML(
            item.status
          )}
        </td>

        <td>
          ${actionsHTML(
            item
          )}
        </td>
      `;

    } else {

      row.innerHTML = `
        <td>
          <div class="item-main">

            <strong>
              ${escapeHTML(item.title)}
            </strong>

            <span>
              ${escapeHTML(
                item.triggerTerms.join(", ")
              )}
            </span>

          </div>
        </td>

        <td>
          <span class="severity-pill ${escapeHTML(
            item.severity
          )}">
            ${escapeHTML(
              capitalize(
                item.severity
              )
            )}
          </span>
        </td>

        <td>
          <span class="action-pill">
            ${escapeHTML(
              formatAction(
                item.action
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
          ${actionsHTML(
            item
          )}
        </td>
      `;
    }


    attachActions(
      row,
      item
    );


    tableBody.appendChild(
      row
    );
  }


  function renderMobile(item) {

    const card =
      document.createElement(
        "article"
      );


    card.className =
      "mobile-card";


    card.innerHTML = `
      <h3>
        ${escapeHTML(
          item.title
        )}
      </h3>

      <p>
        ${
          activeTab === "knowledge"
            ? escapeHTML(
                item.content
              )
            : escapeHTML(
                item.triggerTerms.join(", ")
              )
        }
      </p>

      <div class="mobile-meta">

        ${
          activeTab === "knowledge"
            ? `
              <span class="category-pill">
                ${escapeHTML(
                  item.category
                )}
              </span>
            `
            : `
              <span class="severity-pill ${escapeHTML(
                item.severity
              )}">
                ${escapeHTML(
                  capitalize(
                    item.severity
                  )
                )}
              </span>

              <span class="action-pill">
                ${escapeHTML(
                  formatAction(
                    item.action
                  )
                )}
              </span>
            `
        }

        ${statusHTML(
          item.status
        )}

      </div>


      <div class="mobile-actions">

        <button
          class="action-button edit"
          data-action="edit"
        >
          Edit
        </button>

        <button
          class="action-button toggle"
          data-action="toggle"
        >
          ${
            item.status ===
              "active"
                ? "Disable"
                : "Activate"
          }
        </button>

        <button
          class="action-button delete"
          data-action="delete"
        >
          Delete
        </button>

      </div>
    `;


    attachActions(
      card,
      item
    );


    mobileList.appendChild(
      card
    );
  }


  function statusHTML(status) {

    return `
      <span class="status-pill ${escapeHTML(
        status
      )}">
        ${escapeHTML(
          capitalize(
            status
          )
        )}
      </span>
    `;
  }


  function actionsHTML(item) {

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
              "active"
                ? "Disable"
                : "Activate"
          }
        </button>

        <button
          type="button"
          class="action-button delete"
          data-action="delete"
        >
          Delete
        </button>

      </div>
    `;
  }


  function attachActions(
    container,
    item
  ) {

    container
      .querySelector(
        '[data-action="edit"]'
      )
      ?.addEventListener(
        "click",
        () => {

          openEditor(
            item
          );
        }
      );


    container
      .querySelector(
        '[data-action="toggle"]'
      )
      ?.addEventListener(
        "click",
        () => {

          toggleStatus(
            item.id
          );
        }
      );


    container
      .querySelector(
        '[data-action="delete"]'
      )
      ?.addEventListener(
        "click",
        () => {

          prepareDelete(
            item
          );
        }
      );
  }


  // =====================================================
  // OPEN EDITOR
  // =====================================================

  addButton.addEventListener(
    "click",
    () => {

      openEditor(
        null
      );
    }
  );


  function openEditor(item) {

    editingId =
      item?.id ||
      null;


    formError.textContent =
      "";


    modalKicker.textContent =
      activeTab ===
        "knowledge"
          ? "KNOWLEDGE BASE"
          : "SAFETY RULE";


    modalTitle.textContent =
      editingId
        ? (
            activeTab ===
              "knowledge"
                ? "Edit Knowledge"
                : "Edit Safety Rule"
          )
        : (
            activeTab ===
              "knowledge"
                ? "Add Knowledge"
                : "Add Safety Rule"
          );


    if (
      activeTab ===
      "knowledge"
    ) {

      renderKnowledgeForm(
        item
      );

    } else {

      renderSafetyForm(
        item
      );
    }


    editorModal.hidden =
      false;


    document.body.style.overflow =
      "hidden";
  }


  // =====================================================
  // KNOWLEDGE FORM
  // =====================================================

  function renderKnowledgeForm(item) {

    formFields.innerHTML = `

      ${formField(
        "Title",
        `
          <input
            id="fieldTitle"
            type="text"
            maxlength="180"
            value="${escapeHTML(
              item?.title || ""
            )}"
          >
        `,
        true
      )}


      ${formField(
        "Category",
        `
          <select id="fieldCategory">

            ${optionsHTML(
              [
                "Development",
                "Behavior",
                "Communication",
                "Learning",
                "Emotional Wellbeing",
                "Parenting",
                "Digital Safety"
              ],
              item?.category
            )}

          </select>
        `
      )}


      ${formField(
        "Age Group",
        `
          <select id="fieldAgeGroup">

            ${optionsHTML(
              [
                "all",
                "0-3",
                "4-6",
                "7-12",
                "13-18"
              ],
              item?.ageGroup ||
              "all",
              true
            )}

          </select>
        `
      )}


      ${formField(
        "Guidance Content",
        `
          <textarea
            id="fieldContent"
            maxlength="1500"
          >${escapeHTML(
            item?.content || ""
          )}</textarea>
        `,
        true,
        "Use supportive educational language. Avoid diagnosis or guarantees."
      )}


      ${formField(
        "Source / Review Label",
        `
          <input
            id="fieldSource"
            type="text"
            maxlength="150"
            value="${escapeHTML(
              item?.sourceLabel ||
              ""
            )}"
          >
        `,
        true
      )}


      ${formField(
        "Status",
        statusSelect(
          item?.status
        )
      )}

    `;
  }


  // =====================================================
  // SAFETY FORM
  // =====================================================

  function renderSafetyForm(item) {

    formFields.innerHTML = `

      ${formField(
        "Rule Name",
        `
          <input
            id="fieldTitle"
            type="text"
            maxlength="180"
            value="${escapeHTML(
              item?.title || ""
            )}"
          >
        `,
        true
      )}


      ${formField(
        "Severity",
        `
          <select id="fieldSeverity">

            <option
              value="warning"
              ${
                item?.severity ===
                "warning"
                  ? "selected"
                  : ""
              }
            >
              Warning
            </option>

            <option
              value="critical"
              ${
                !item ||
                item?.severity ===
                "critical"
                  ? "selected"
                  : ""
              }
            >
              Critical
            </option>

          </select>
        `
      )}


      ${formField(
        "Response Action",
        `
          <select id="fieldAction">

            <option
              value="professional"
              ${
                item?.action ===
                "professional"
                  ? "selected"
                  : ""
              }
            >
              Recommend Professional Support
            </option>

            <option
              value="urgent_support"
              ${
                item?.action ===
                "urgent_support"
                  ? "selected"
                  : ""
              }
            >
              Urgent Safety Guidance
            </option>

            <option
              value="emergency"
              ${
                item?.action ===
                "emergency"
                  ? "selected"
                  : ""
              }
            >
              Emergency Guidance
            </option>

          </select>
        `
      )}


      ${formField(
        "Trigger Terms",
        `
          <textarea
            id="fieldTriggers"
            maxlength="1000"
          >${escapeHTML(
            Array.isArray(
              item?.triggerTerms
            )
              ? item.triggerTerms.join(
                  ", "
                )
              : ""
          )}</textarea>
        `,
        true,
        "Separate phrases with commas. This is a prototype keyword layer only."
      )}


      ${formField(
        "Safety Response",
        `
          <textarea
            id="fieldResponse"
            maxlength="1200"
          >${escapeHTML(
            item?.response || ""
          )}</textarea>
        `,
        true
      )}


      ${formField(
        "Status",
        statusSelect(
          item?.status
        )
      )}

    `;
  }


  // =====================================================
  // FORM HELPERS
  // =====================================================

  function formField(
    label,
    input,
    full = false,
    help = ""
  ) {

    return `
      <div class="form-field ${
        full
          ? "full"
          : ""
      }">

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


  function statusSelect(
    status
  ) {

    return `
      <select id="fieldStatus">

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
            status ===
            "inactive"
              ? "selected"
              : ""
          }
        >
          Inactive
        </option>

      </select>
    `;
  }


  function optionsHTML(
    values,
    selected,
    ageLabels = false
  ) {

    return values
      .map(value => {

        let label =
          value;


        if (ageLabels) {

          label =
            formatAgeGroup(
              value
            );
        }


        return `
          <option
            value="${escapeHTML(
              value
            )}"
            ${
              value === selected
                ? "selected"
                : ""
            }
          >
            ${escapeHTML(
              label
            )}
          </option>
        `;

      })
      .join("");
  }


  // =====================================================
  // SAVE
  // =====================================================

  editorForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const data =
        activeTab ===
          "knowledge"
            ? collectKnowledgeData()
            : collectSafetyData();


      if (!data) {

        return;
      }


      const key =
        activeTab ===
          "knowledge"
            ? KNOWLEDGE_KEY
            : SAFETY_KEY;


      let items =
        readArray(
          key
        );


      const now =
        new Date()
          .toISOString();


      if (editingId) {

        items =
          items.map(item =>

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

        items.unshift({

          id:
            `${
              activeTab ===
              "knowledge"
                ? "knowledge"
                : "safety"
            }_${Date.now()}`,

          ...data,

          createdAt:
            now,

          updatedAt:
            now
        });

      }


      writeArray(
        key,
        items
      );


      closeEditor();


      renderMetrics();

      populateCategoryFilter();

      renderItems();


      showToast(
        "Governance updated",
        activeTab ===
          "knowledge"
            ? "Knowledge entry was saved."
            : "Safety rule was saved."
      );
    }
  );


  function collectKnowledgeData() {

    const title =
      valueOf(
        "fieldTitle"
      );


    const category =
      valueOf(
        "fieldCategory"
      );


    const ageGroup =
      valueOf(
        "fieldAgeGroup"
      );


    const content =
      valueOf(
        "fieldContent"
      );


    const sourceLabel =
      valueOf(
        "fieldSource"
      );


    const status =
      valueOf(
        "fieldStatus"
      );


    if (
      !title ||
      !category ||
      !content
    ) {

      formError.textContent =
        "Please complete the required knowledge fields.";

      return null;
    }


    return {

      title,
      category,
      ageGroup,
      content,
      sourceLabel,
      status
    };
  }


  function collectSafetyData() {

    const title =
      valueOf(
        "fieldTitle"
      );


    const severity =
      valueOf(
        "fieldSeverity"
      );


    const action =
      valueOf(
        "fieldAction"
      );


    const response =
      valueOf(
        "fieldResponse"
      );


    const status =
      valueOf(
        "fieldStatus"
      );


    const triggerTerms =
      valueOf(
        "fieldTriggers"
      )
        .split(",")
        .map(
          item =>
            item
              .trim()
              .toLowerCase()
        )
        .filter(Boolean);


    if (
      !title ||
      !severity ||
      !action ||
      !response ||
      triggerTerms.length === 0
    ) {

      formError.textContent =
        "Please complete all safety rule fields.";

      return null;
    }


    return {

      title,
      severity,
      triggerTerms,
      action,
      response,
      status
    };
  }


  function valueOf(id) {

    return (
      document
        .getElementById(id)
        ?.value
        ?.trim() ||
      ""
    );
  }


  // =====================================================
  // TOGGLE
  // =====================================================

  function toggleStatus(id) {

    const key =
      activeTab ===
        "knowledge"
          ? KNOWLEDGE_KEY
          : SAFETY_KEY;


    const items =
      readArray(
        key
      )
        .map(item => {

          if (
            item.id !== id
          ) {

            return item;
          }


          return {

            ...item,

            status:
              item.status ===
                "active"
                  ? "inactive"
                  : "active",

            updatedAt:
              new Date()
                .toISOString()
          };
        });


    writeArray(
      key,
      items
    );


    renderMetrics();

    renderItems();


    showToast(
      "Status updated",
      "Governance item visibility was updated."
    );
  }


  // =====================================================
  // DELETE
  // =====================================================

  function prepareDelete(item) {

    deletingId =
      item.id;


    deleteText.textContent =
      `"${item.title}" will be removed from the local governance library.`;


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

      if (!deletingId) {

        return;
      }


      const key =
        activeTab ===
          "knowledge"
            ? KNOWLEDGE_KEY
            : SAFETY_KEY;


      const items =
        readArray(
          key
        )
          .filter(
            item =>
              item.id !==
              deletingId
          );


      writeArray(
        key,
        items
      );


      deleteModal.hidden =
        true;


      deletingId =
        null;


      renderMetrics();

      populateCategoryFilter();

      renderItems();


      showToast(
        "Item removed",
        "The governance item was deleted."
      );
    }
  );


  // =====================================================
  // CLOSE EDITOR
  // =====================================================

  function closeEditor() {

    editorModal.hidden =
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
    closeEditor
  );


  cancelEditor.addEventListener(
    "click",
    closeEditor
  );


  editorModal.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        editorModal
      ) {

        closeEditor();
      }
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


  // =====================================================
  // HELPERS
  // =====================================================

  function capitalize(value) {

    const text =
      String(
        value || ""
      );


    return (
      text.charAt(0)
        .toUpperCase() +
      text.slice(1)
    );
  }


  function formatAgeGroup(value) {

    const labels = {

      all:
        "All ages",

      "0-3":
        "0–3 years",

      "4-6":
        "4–6 years",

      "7-12":
        "7–12 years",

      "13-18":
        "13–18 years"
    };


    return (
      labels[value] ||
      value
    );
  }


  function formatAction(value) {

    const labels = {

      professional:
        "Professional Support",

      urgent_support:
        "Urgent Guidance",

      emergency:
        "Emergency Guidance"
    };


    return (
      labels[value] ||
      value
    );
  }


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


  // =====================================================
  // TOAST
  // =====================================================

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


  // =====================================================
  // SIDEBAR
  // =====================================================

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


  // =====================================================
  // ESC
  // =====================================================

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
        !editorModal.hidden
      ) {

        closeEditor();

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


  // =====================================================
  // LOGOUT
  // =====================================================

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


  // =====================================================
  // INIT
  // =====================================================

  renderApprovalBadge();

  renderMetrics();

  configureTab();

  renderItems();

});