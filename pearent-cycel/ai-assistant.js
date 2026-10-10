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


      if (
        age.years < 3 &&
        age.months > 0
      ) {

        return (
          age.years +
          (age.years === 1
            ? " year, "
            : " years, ") +
          age.months +
          (age.months === 1
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


    function getStage(age) {

      if (age.years <= 3) {
        return "Early Years";
      }

      if (age.years <= 6) {
        return "Early Childhood";
      }

      if (age.years <= 12) {
        return "School Age";
      }

      return "Adolescence";
    }


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
      `Rafiq uses ${currentChild.name}'s age and development stage to personalize guidance.`;


    // =====================================
    // QUICK PROMPTS
    // =====================================

    function getPrompts() {

      if (age.years <= 3) {

        return [
          "How can I support early speech development?",
          "How can I improve our bedtime routine?",
          "What activities can I do at home?",
          "How can I encourage communication?"
        ];
      }


      if (age.years <= 6) {

        return [
          "How should I handle frequent tantrums?",
          "How can I encourage independence?",
          "How can I support social skills?",
          "How can I prepare my child for school?"
        ];
      }


      if (age.years <= 12) {

        return [
          "How can I help with school stress?",
          "How should I handle too much screen time?",
          "How can I support better attention?",
          "How can I talk about bullying?"
        ];
      }


      return [
        "How can I communicate better with my teenager?",
        "How should I handle social media boundaries?",
        "How can I support school pressure?",
        "How can I encourage healthy independence?"
      ];
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

    function generateMockResponse(
      question
    ) {

      const lower =
        question.toLowerCase();


      if (
        lower.includes("sleep") ||
        lower.includes("bedtime")
      ) {

        return (
          `For ${currentChild.name}, a consistent bedtime routine can help. ` +
          `Try keeping the same general sleep schedule, reducing stimulating activities before bed, and using a short calming routine such as washing up, reading, and quiet time. ` +
          `If sleep difficulties are persistent or affecting daily wellbeing, consider discussing them with a qualified professional.`
        );
      }


      if (
        lower.includes("tantrum") ||
        lower.includes("behavior")
      ) {

        return (
          `Big emotions can be difficult for both children and parents. ` +
          `Try staying calm, naming the emotion, keeping boundaries short and clear, and discussing what happened after everyone is calmer. ` +
          `Patterns such as hunger, tiredness, transitions, or frustration can also help explain when behaviors happen.`
        );
      }


      if (
        lower.includes("speech") ||
        lower.includes("communication")
      ) {

        return (
          `You can support communication by talking during everyday activities, following ${currentChild.name}'s interests, reading together, and giving enough time to respond. ` +
          `If you are concerned about communication development, Rafiq can help you review milestones or connect with an appropriate specialist.`
        );
      }


      if (
        lower.includes("screen time")
      ) {

        return (
          `A useful approach is to create predictable screen-time boundaries rather than negotiating each time. ` +
          `Try agreeing on when screens are used, keeping some routines screen-free, and offering another activity before the transition.`
        );
      }


      if (
        lower.includes("school") ||
        lower.includes("study")
      ) {

        return (
          `Start by finding out what part of school feels difficult for ${currentChild.name}. ` +
          `It may help to break tasks into smaller steps, create a predictable homework routine, and focus on effort rather than only results.`
        );
      }


      if (
        lower.includes("bully")
      ) {

        return (
          `Listen carefully without blaming ${currentChild.name}, and let them know they can continue talking to you. ` +
          `Write down what happened and consider involving the school or another responsible adult if the behavior continues.`
        );
      }


      return (
        `Thanks for sharing that. Because ${currentChild.name} is in the ${getStage(age).toLowerCase()} stage, context matters. ` +
        `Try observing when the concern happens, what usually happens before it, and what seems to help. ` +
        `You can also use Rafiq's milestones, screening, or specialist support if you want to explore the concern further.`
      );
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