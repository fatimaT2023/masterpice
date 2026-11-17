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
    if (sendButton) {
      sendButton.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;
    }

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

        return window.RafiqSetup.readChildren() || [];

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
        (window.RafiqFamily ? window.RafiqFamily.selected() : localStorage.getItem('rafiqCurrentChildId'));


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
      window.RafiqFamily.privateChatKey(currentChild.id);


    let chatReadFailed=false;
    function chatStorageError(){
      let status=document.getElementById('parentAIStorageError');
      if(!status){status=document.createElement('p');status.id='parentAIStorageError';status.className='parent-ai-storage-error';status.setAttribute('role','alert');status.dataset.noTranslate='';chatForm.before(status);}
      status.textContent=(window.RafiqLanguage?.getLanguage?.()||document.documentElement.lang)==='ar'?'تعذّر حفظ المحادثة. سجلاتكم السابقة ما انمسحت. أعيدوا المحاولة أو امسحوا المحادثة بإرادتكم.':'The conversation could not be saved. Existing records were not removed. Retry, or explicitly clear this conversation.';
    }
    function getSavedChat(){
      try{const saved=JSON.parse(localStorage.getItem(chatStorageKey)||'[]');if(!Array.isArray(saved)||saved.some(message=>!message||!['user','ai'].includes(message.sender)||typeof message.text!=='string'))throw Error('Invalid conversation');return saved;}
      catch{chatReadFailed=true;return [];}
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


    function createMessageElement(message) {
      const row = document.createElement("div");
      row.className = "message-row " + message.sender;

      if (message.sender === "ai") {
        const avatar = document.createElement("div");
        avatar.className = "message-avatar ai";
        avatar.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>`;
        row.appendChild(avatar);
      }

      const wrapper = document.createElement("div");
      wrapper.className = "message-content-wrapper";

      const bubble = document.createElement("div");
      bubble.className = "message-bubble";

      const textEl = document.createElement("div");
      textEl.className = "message-text";
      textEl.dataset.noTranslate='';
      textEl.textContent = message.demoText?.[(window.RafiqLanguage?.getLanguage?.()||document.documentElement.lang)==='ar'?'ar':'en']||message.text;

      const meta = document.createElement("div");
      meta.className = "message-meta";
      const time = document.createElement("span");
      time.className = "message-time";
      time.textContent = message.time;
      meta.appendChild(time);

      bubble.append(textEl, meta);
      wrapper.appendChild(bubble);
      const service=window.RafiqParentAIDemo.services[message.demoServiceKey];
      if(message.sender==='ai'&&service){const a=document.createElement('a');a.className='parent-ai-service-link';a.dataset.noTranslate='';a.href=service.href;a.textContent=service.label[(window.RafiqLanguage?.getLanguage?.()||document.documentElement.lang)==='ar'?'ar':'en'];wrapper.append(a);}


      if (message.sender === "ai") {
        const actions = document.createElement("div");
        actions.className = "message-actions";
        const share = document.createElement("button");
        share.type = "button";
        share.className = "message-action-btn chat-save-pill";
        share.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg><span>Save to child record</span>`;
        share.addEventListener("click", () => {
          try {
            if (!confirm("Share this message with the other caregivers linked to this child?")) return;
            const result = window.RafiqFamily.shareAI(currentChild.id, message.demoText?{...message,text:textEl.textContent}:message);
            share.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${result.duplicate ? "Already saved" : "Saved to record"}</span>`;
            share.disabled = true;
            share.classList.add("saved");
          } catch (error) {
            alert(error.message);
          }
        });
        actions.appendChild(share);
        wrapper.appendChild(actions);
      }

      row.appendChild(wrapper);
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


    function addMessage(sender,text,metadata={}){
      if(chatReadFailed){chatStorageError();return false;}
      const message={id:crypto.randomUUID(),sender,text,time:formatTime()};
      if(metadata.demoText)message.demoText=metadata.demoText;
      if(window.RafiqParentAIDemo.services[metadata.demoServiceKey])message.demoServiceKey=metadata.demoServiceKey;
      chatHistory.push(message);
      try{saveChat();}catch{chatHistory.pop();chatStorageError();return false;}
      messages.appendChild(createMessageElement(message));scrollToBottom();return true;
    }

    function scrollToBottom() {

      messages.scrollTop =
        messages.scrollHeight;
    }


    // =====================================
    // INITIAL GREETING
    // =====================================

    function addInitialGreeting(){
      if(chatHistory.length>0||chatReadFailed)return;
      const text=window.RafiqParentAIDemo.greeting;
      addMessage('ai',text[(window.RafiqLanguage?.getLanguage?.()||document.documentElement.lang)==='ar'?'ar':'en'],{demoText:text,demoServiceKey:'explore'});
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

    function generateMockResponse(question){return window.RafiqParentAIDemo.build(question);}

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
      if(chatReadFailed){chatStorageError();return;}


      if(!containsEmergencySignal(cleanText)){
        try{if(!window.RafiqMembership.consumeAI()){window.RafiqMembership.prompt(window.RafiqMembership.state().active?'You have used your 30 questions for today. Your allowance resets tomorrow.':'You have used your 3 free questions today. Plus includes up to 30 questions per day.');return;}}
        catch{window.RafiqMembership.prompt('Your usage could not be saved. Please try again.');return;}
      }
      if(!addMessage("user",cleanText))return;


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


          const lang=(window.RafiqLanguage?.getLanguage?.()||document.documentElement.lang)==='ar'?'ar':'en';
          addMessage('ai',response.text[lang],{demoText:response.text,demoServiceKey:response.key});


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

    clearChatButton.addEventListener('click',()=>{
      if(!window.confirm((window.RafiqLanguage?.getLanguage?.()||document.documentElement.lang)==='ar'?'تمسحوا هالمحادثة؟':'Clear this conversation?'))return;
      try{localStorage.removeItem(chatStorageKey);}catch{chatStorageError();return;}
      chatHistory=[];chatReadFailed=false;messages.replaceChildren();document.getElementById('parentAIStorageError')?.remove();addInitialGreeting();
    });

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

    new MutationObserver(()=>renderMessages()).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    if(chatReadFailed)chatStorageError();
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
