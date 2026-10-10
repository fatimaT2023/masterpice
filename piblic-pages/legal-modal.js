/* =========================================================
   RAFIQ REUSABLE LEGAL MODAL
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTS
     ======================================================= */

  const modal =
    document.getElementById("legalModal");

  if (!modal) {
    return;
  }

  const dialog =
    modal.querySelector(
      ".legal-modal__dialog"
    );

  const tabs =
    Array.from(
      modal.querySelectorAll(
        "[data-legal-tab]"
      )
    );

  const panels =
    Array.from(
      modal.querySelectorAll(
        "[data-legal-panel]"
      )
    );

  const closeButtons =
    modal.querySelectorAll(
      "[data-legal-close]"
    );

  /* =======================================================
     STATE
     ======================================================= */

  const validSections = [
    "privacy",
    "terms",
    "medical"
  ];

  let activeSection =
    "privacy";

  let previouslyFocusedElement =
    null;

  let closeTimer =
    null;

  /* =======================================================
     OPEN FROM ANY:
     data-legal="privacy"
     data-legal="terms"
     data-legal="medical"
     ======================================================= */

  document.addEventListener(
    "click",
    (event) => {

      const trigger =
        event.target.closest(
          "[data-legal]"
        );

      if (!trigger) {
        return;
      }

      event.preventDefault();

      const section =
        trigger.dataset.legal;

      openLegalModal(
        section,
        trigger
      );
    }
  );

  /* =======================================================
     OPEN MODAL
     ======================================================= */

  function openLegalModal(
    section = "privacy",
    trigger = null
  ) {

    if (
      !validSections.includes(
        section
      )
    ) {
      section = "privacy";
    }

    if (closeTimer) {
      window.clearTimeout(
        closeTimer
      );
    }

    previouslyFocusedElement =
      trigger ||
      document.activeElement;

    setActiveLegalTab(
      section
    );

    modal.classList.remove(
      "is-closing"
    );

    modal.classList.add(
      "is-open"
    );

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "legal-modal-open"
    );

    /*
      Wait one frame so the transition
      renders smoothly.
    */
    requestAnimationFrame(
      () => {

        const activeTab =
          modal.querySelector(
            `[data-legal-tab="${section}"]`
          );

        if (activeTab) {
          activeTab.focus();
        }
      }
    );
  }

  /* =======================================================
     CLOSE MODAL
     ======================================================= */

  function closeLegalModal() {

    if (
      !modal.classList.contains(
        "is-open"
      )
    ) {
      return;
    }

    modal.classList.add(
      "is-closing"
    );

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "legal-modal-open"
    );

    closeTimer =
      window.setTimeout(
        () => {

          modal.classList.remove(
            "is-open",
            "is-closing"
          );

          if (
            previouslyFocusedElement &&
            typeof previouslyFocusedElement.focus ===
              "function"
          ) {
            previouslyFocusedElement.focus();
          }

        },
        280
      );
  }

  /* =======================================================
     CLOSE BUTTONS
     Includes:
     - X
     - Got it
     - Overlay
     ======================================================= */

  closeButtons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        closeLegalModal
      );
    }
  );

  /* =======================================================
     TAB SWITCHING
     ======================================================= */

  function setActiveLegalTab(
    section
  ) {

    if (
      !validSections.includes(
        section
      )
    ) {
      section = "privacy";
    }

    activeSection =
      section;

    tabs.forEach(
      (tab) => {

        const isActive =
          tab.dataset.legalTab ===
          section;

        tab.classList.toggle(
          "is-active",
          isActive
        );

        tab.setAttribute(
          "aria-selected",
          String(isActive)
        );

        tab.tabIndex =
          isActive
            ? 0
            : -1;
      }
    );

    panels.forEach(
      (panel) => {

        const isActive =
          panel.dataset.legalPanel ===
          section;

        panel.hidden =
          !isActive;

        panel.classList.toggle(
          "is-active",
          isActive
        );
      }
    );

    /*
      Always return content scroll
      to the top when switching tabs.
    */

    const content =
      modal.querySelector(
        ".legal-modal__content"
      );

    if (content) {
      content.scrollTop = 0;
    }
  }

  tabs.forEach(
    (tab) => {

      tab.addEventListener(
        "click",
        () => {

          setActiveLegalTab(
            tab.dataset.legalTab
          );
        }
      );
    }
  );

  /* =======================================================
     KEYBOARD TAB NAVIGATION
     Arrow Left / Right
     Home / End
     ======================================================= */

  tabs.forEach(
    (tab, index) => {

      tab.addEventListener(
        "keydown",
        (event) => {

          let targetIndex = null;

          if (
            event.key ===
            "ArrowRight"
          ) {

            targetIndex =
              (
                index + 1
              ) %
              tabs.length;
          }

          if (
            event.key ===
            "ArrowLeft"
          ) {

            targetIndex =
              (
                index -
                1 +
                tabs.length
              ) %
              tabs.length;
          }

          if (
            event.key === "Home"
          ) {
            targetIndex = 0;
          }

          if (
            event.key === "End"
          ) {
            targetIndex =
              tabs.length - 1;
          }

          if (
            targetIndex === null
          ) {
            return;
          }

          event.preventDefault();

          const targetTab =
            tabs[targetIndex];

          setActiveLegalTab(
            targetTab.dataset.legalTab
          );

          targetTab.focus();
        }
      );
    }
  );

  /* =======================================================
     ESCAPE TO CLOSE
     ======================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        modal.classList.contains(
          "is-open"
        )
      ) {

        event.preventDefault();

        closeLegalModal();
      }
    }
  );

  /* =======================================================
     SIMPLE FOCUS TRAP
     Keeps keyboard focus inside the modal
     ======================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key !== "Tab" ||
        !modal.classList.contains(
          "is-open"
        )
      ) {
        return;
      }

      const focusableElements =
        Array.from(
          dialog.querySelectorAll(
            [
              "button:not([disabled])",
              "a[href]",
              "input:not([disabled])",
              "select:not([disabled])",
              "textarea:not([disabled])",
              '[tabindex]:not([tabindex="-1"])'
            ].join(",")
          )
        ).filter(
          (element) =>
            !element.hidden &&
            element.offsetParent !== null
        );

      if (
        focusableElements.length === 0
      ) {
        return;
      }

      const firstElement =
        focusableElements[0];

      const lastElement =
        focusableElements[
          focusableElements.length - 1
        ];

      if (
        event.shiftKey &&
        document.activeElement ===
          firstElement
      ) {

        event.preventDefault();

        lastElement.focus();

      } else if (
        !event.shiftKey &&
        document.activeElement ===
          lastElement
      ) {

        event.preventDefault();

        firstElement.focus();
      }
    }
  );

  /* =======================================================
     OPTIONAL GLOBAL API
     Allows manual JS usage:

     RafiqLegal.open("medical")
     RafiqLegal.close()
     ======================================================= */

  window.RafiqLegal = {
    open:
      (section = "privacy") => {
        openLegalModal(
          section
        );
      },

    close:
      () => {
        closeLegalModal();
      },

    setTab:
      (section) => {
        setActiveLegalTab(
          section
        );
      },

    getActiveTab:
      () => activeSection
  };

});