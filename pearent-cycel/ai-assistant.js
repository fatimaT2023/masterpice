document.addEventListener(
  "DOMContentLoaded",
  () => {

    // =====================================
    // ELEMENTS
    // =====================================

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


    const contextChildName =
      document.getElementById(
        "contextChildName"
      );

    const contextDescription =
      document.getElementById(
        "contextDescription"
      );

    const contextAge =
      document.getElementById(
        "contextAge"
      );

    const contextStage =
      document.getElementById(
        "contextStage"
      );


    const headerChildInitial =
      document.getElementById(
        "headerChildInitial"
      );

    const headerChildName =
      document.getElementById(
        "headerChildName"
      );


    const quickPrompts =
      document.getElementById(
        "quickPrompts"
      );


    const messages =
      document.getElementById(
        "messages"
      );

    const typingIndicator =
      document.getElementById(
        "typingIndicator"
      );


    const chatForm =
      document.getElementById(
        "chatForm"
      );

    const messageInput =
      document.getElementById(
        "messageInput"
      );

    const sendButton =
      document.getElementById(
        "sendButton"
      );

    const characterCount =
      document.getElementById(
        "characterCount"
      );


    const clearChatButton =
      document.getElementById(
        "clearChatButton"
      );


    const emergencyOverlay =
      document.getElementById(
        "emergencyOverlay"
      );

    const emergencyClose =
      document.getElementById(
        "emergencyClose"
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


    // =====================================
    // CHILD STORAGE
    // =====================================

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


    function getCurrentChild() {

      const currentId =
        localStorage.getItem(
          "rafiqCurrentChildId"
        );


      const selected =
        children.find(
          child =>
            child.id === currentId
        );


      return selected || children[0];
    }


    const currentChild =
      getCurrentChild();


    // =====================================
    // AGE
    // =====================================

    function calculateAge(dateString) { return window.RafiqSetup.ageFromBirth(dateString) || {years:NaN,months:NaN,totalMonths:NaN,days:NaN}; }


    function formatAge(age) { return window.RafiqSetup.formatAge(age); }


    function getStage(age) { return window.RafiqSetup.bandForAge(age)?.label || 'Outside the current 0–6 age range'; }


    const age =
      calculateAge(
        currentChild.dateOfBirth
      );


    // =====================================
    // CHILD UI
    // =====================================

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


    contextChildName.textContent =
      currentChild.name;

    contextAge.textContent =
      formatAge(age);

    contextStage.textContent =
      getStage(age);


    headerChildInitial.textContent =
      initial;

    headerChildName.textContent =
      currentChild.name;


    contextDescription.textContent =
      'Age context: '+formatAge(age)+'. This preview can help organize your questions; it does not provide an age-specific assessment.';


    // =====================================
    // QUICK PROMPTS
    // =====================================

    function getPrompts() {
 const context=window.RafiqSetup.childContext(currentChild),m=context.development?.totalMonths;
 if(!context.supported)return ['Help me organize questions for a specialist','How do I find my saved records?'];
 if(context.needsDueDate||context.beforeDueDate)return ['What should I ask my care team about corrected age?','Help me describe what I have noticed'];
 if(m<2)return ['Help me describe a question about my newborn','What should I note before our next visit?','How can I record a moment together?'];
 if(m<6)return ['Help me describe my baby’s responses during play','What should I ask about my baby’s current stage?','Help me organize a feeding or sleep question'];
 if(m<12)return ['Help me describe what my baby explores','Help me record a communication observation','What should I ask at our next visit?'];
 if(m<24)return ['Help me describe my toddler’s communication','Help me organize a question about play','Help me record a daily routine observation'];
 if(m<48)return ['Help me describe a play or conversation moment','Help me organize a question about routines','What would I like to discuss with a specialist?'];
 return ['Help me describe a friendship or play observation','Help me organize a question about school routines','Help me record a moment of independence'];
 }


    function renderPrompts() {

      quickPrompts.innerHTML = "";


      getPrompts().forEach(
        prompt => {

          const button =
            document.createElement(
              "button"
            );


          button.type =
            "button";

          button.className =
            "quick-prompt";

          button.textContent =
            prompt;


          button.addEventListener(
            "click",
            () => {

              sendUserMessage(
                prompt
              );
            }
          );


          quickPrompts.appendChild(
            button
          );

        }
      );
    }


    // =====================================
    // CHAT STORAGE
    // =====================================

    const chatStorageKey =
      "rafiqChat_" +
      currentChild.id;


    function getSavedChat() {

      try {

        return JSON.parse(
          localStorage.getItem(
            chatStorageKey
          )
        ) || [];

      } catch (error) {

        return [];
      }
    }


    let chatHistory =
      getSavedChat();


    function saveChat() {

      localStorage.setItem(
        chatStorageKey,
        JSON.stringify(
          chatHistory
        )
      );
    }


    // =====================================
    // MESSAGES
    // =====================================

    function escapeHTML(value) {

      const div =
        document.createElement(
          "div"
        );

      div.textContent =
        String(value);

      return div.innerHTML;
    }


    function formatTime(
      date = new Date()
    ) {

      return date.toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      );
    }


    function createMessageElement(
      message
    ) {

      const row =
        document.createElement(
          "div"
        );


      row.className =
        "message-row " +
        message.sender;


      if (
        message.sender === "ai"
      ) {

        const avatar =
          document.createElement(
            "div"
          );

        avatar.className =
          "message-avatar ai";

        avatar.textContent =
          "✦";

        row.appendChild(
          avatar
        );
      }


      const bubble =
        document.createElement(
          "div"
        );

      bubble.className =
        "message-bubble";


      bubble.innerHTML = `
        ${escapeHTML(message.text)}

        <span class="message-time">
          ${escapeHTML(message.time)}
        </span>
      `;


      row.appendChild(
        bubble
      );


      return row;
    }


    function renderMessages() {

      messages.innerHTML = "";


      chatHistory.forEach(
        message => {

          messages.appendChild(
            createMessageElement(
              message
            )
          );

        }
      );


      scrollToBottom();
    }


    function addMessage(
      sender,
      text
    ) {

      const message = {
        sender,
        text,
        time:
          formatTime()
      };


      chatHistory.push(
        message
      );


      saveChat();


      messages.appendChild(
        createMessageElement(
          message
        )
      );


      scrollToBottom();
    }


    function scrollToBottom() {

      messages.scrollTop =
        messages.scrollHeight;
    }


    // =====================================
    // INITIAL GREETING
    // =====================================

    function addInitialGreeting() {

      if (
        chatHistory.length > 0
      ) {
        return;
      }


      const greeting =
        `Hi! I'm Rafiq AI. I'm here to support you with everyday parenting questions about ${currentChild.name}. ` +
        `You can ask me about development, behavior, routines, school, communication, or other parenting concerns.`;


      addMessage(
        "ai",
        greeting
      );
    }


    // =====================================
    // SAFETY RULES
    // =====================================

    /*
      Demo safety layer.

      IMPORTANT:
      This is not a medical diagnostic system.

      In a production system this safety layer
      should be reviewed and maintained by
      qualified professionals.
    */

    const emergencyKeywords = [
      "not breathing",
      "can't breathe",
      "cannot breathe",
      "difficulty breathing",
      "unconscious",
      "won't wake up",
      "not waking up",
      "severe bleeding",
      "seizure",
      "choking",
      "poison",
      "overdose",
      "collapsed"
    ];


    function containsEmergencySignal(
      text
    ) {

      const normalized =
        text.toLowerCase();


      return emergencyKeywords.some(
        keyword =>
          normalized.includes(
            keyword
          )
      );
    }


    function showEmergencyModal() {

      emergencyOverlay.hidden =
        false;

      document.body.style.overflow =
        "hidden";

      emergencyClose.focus();
    }


    function closeEmergencyModal() {

      emergencyOverlay.hidden =
        true;

      document.body.style.overflow =
        "";
    }


    emergencyClose.addEventListener(
      "click",
      closeEmergencyModal
    );


    emergencyOverlay.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          emergencyOverlay
        ) {

          closeEmergencyModal();
        }

      }
    );


    // =====================================
    // MOCK AI RESPONSE
    // =====================================

    function generateMockResponse(question) {
 const context=window.RafiqSetup.childContext(currentChild);
 const label=context.basis==='corrected'?'corrected age '+window.RafiqSetup.formatAge(context.development):window.RafiqSetup.formatAge(context.chronological);
 return 'For '+currentChild.name+' ('+label+'), let’s organize what you’ve noticed. What happened, when did you first notice it, and what would you like help understanding? You can save an observation under Growth & milestones or discuss it with a specialist. This preview does not assess development or generate age-specific medical advice.';
 }


    // =====================================
    // SEND MESSAGE
    // =====================================

    function sendUserMessage(
      text
    ) {

      const cleanText =
        text.trim();


      if (!cleanText) {
        return;
      }


      addMessage(
        "user",
        cleanText
      );


      messageInput.value =
        "";

      updateCharacterCount();

      resizeTextarea();


      /*
        Safety check happens BEFORE
        normal AI response.
      */

      if (
        containsEmergencySignal(
          cleanText
        )
      ) {

        addMessage(
          "ai",
          "This may require urgent medical attention. Rafiq cannot safely assess an emergency through chat. Please seek urgent medical care or contact local emergency services if your child may be in immediate danger."
        );


        showEmergencyModal();

        return;
      }


      typingIndicator.hidden =
        false;

      sendButton.disabled =
        true;


      scrollToBottom();


      window.setTimeout(
        () => {

          typingIndicator.hidden =
            true;


          const response =
            generateMockResponse(
              cleanText
            );


          addMessage(
            "ai",
            response
          );


          sendButton.disabled =
            false;


          messageInput.focus();

        },
        850
      );
    }


    // =====================================
    // FORM
    // =====================================

    chatForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        sendUserMessage(
          messageInput.value
        );

      }
    );


    messageInput.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter" &&
          !event.shiftKey
        ) {

          event.preventDefault();


          chatForm.requestSubmit();
        }

      }
    );


    // =====================================
    // TEXTAREA
    // =====================================

    function resizeTextarea() {

      messageInput.style.height =
        "auto";


      messageInput.style.height =
        Math.min(
          messageInput.scrollHeight,
          120
        ) + "px";
    }


    function updateCharacterCount() {

      characterCount.textContent =
        messageInput.value.length +
        " / 500";
    }


    messageInput.addEventListener(
      "input",
      () => {

        resizeTextarea();

        updateCharacterCount();

      }
    );


    // =====================================
    // CLEAR CHAT
    // =====================================

    clearChatButton.addEventListener(
      "click",
      () => {

        const confirmed =
          window.confirm(
            "Clear this conversation?"
          );


        if (!confirmed) {
          return;
        }


        chatHistory = [];


        localStorage.removeItem(
          chatStorageKey
        );


        messages.innerHTML = "";


        addInitialGreeting();

      }
    );


    // =====================================
    // SIDEBAR
    // =====================================

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
            !emergencyOverlay.hidden
          ) {

            closeEmergencyModal();

          } else {

            closeSidebar();
          }

        }

      }
    );

const aiPrefill =
  sessionStorage.getItem(
    "rafiqAIPrefill"
  );

if (aiPrefill) {

  messageInput.value =
    aiPrefill;

  sessionStorage.removeItem(
    "rafiqAIPrefill"
  );

  resizeTextarea();

  updateCharacterCount();
}
    // =====================================
    // INITIALIZE
    // =====================================

    renderPrompts();

    renderMessages();

    addInitialGreeting();

    updateCharacterCount();

  }
);
const logoutButton =
  document.getElementById("logoutButton");

logoutButton.addEventListener(
  "click",
  () => {

    // نمسح بيانات الجلسة فقط
    sessionStorage.clear();

    // ما نمسح بيانات الطفل من localStorage
    window.location.href =
      "../piblic-pages/login.html";
  })