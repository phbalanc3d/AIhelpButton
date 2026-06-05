//that checks the change in the screen
function waitForElement(selector, callback) {
  const observer = new MutationObserver(() => {
    const el = document.querySelector(selector);
    if (el) { 
        observer.disconnect();
        callback(el); 
    }
  });

  observer.observe(document.body, {
     childList: true,
      subtree: true 
    });

//temporary send button
    document
    .getElementById("az-send-btn")
    .addEventListener("click", () => {
      const input = document.getElementById("az-user-input");

      if (input.value.trim() === "") return;

      const messages =
        document.getElementById("az-chat-messages");

      messages.innerHTML += `
        <div style="margin-top:10px;">
          <b>You:</b> ${input.value}
        </div>
      `;

      input.value = "";
    });

}

function createChatBox(){
    if(document.getElementById('az-chatbox')) return;

    const chatBox = document.createElement('div');
    chatBox.id = 'az-chatbox';

    chatBox.style.display = 'none';
    chatBox.innerHTML = `
    <div id= "az-chat-header">
    <span id="az-close" style="cursor: pointer;"> AZ AI Assistance </span>
    </div>

    <div id ="az-chat-messages"> 
    <p>Ask anything about this problem</p>
    </div>

    <div id="az-chat-input-area">
    <input
    id="az-chat-input"
    type="text"
    placeholder="Type your question here..."
    />
    <button id="az-chat-send-btn">Send</button>
    </div>
    `;

    document.body.appendChild(chatBox);
    // Close button
  document
    .getElementById("az-close")
    .addEventListener("click", () => {
      chatBox.style.display = "none";
    });
     document.getElementById('az-chat-send-btn').addEventListener('click', () => sendMessage(context));
}


// inject the ai button on the screen

function injectAIButton() {
  // Don't inject twice
  if (document.getElementById('az-ai-help-btn')) return;

  // Find the container where the heading is placed
  const titleContainer = document.querySelector(
    "div.flex.flex-wrap.items-start.justify-between"
  );
  if (!titleContainer) return;
  //heading selector
  const h4 = titleContainer.querySelector("h4");
  if (!h4) return;

  // Create the button wrapper
  const btn = document.createElement('div');

  btn.id = 'az-ai-help-btn';

  btn.innerHTML = `
    <img src="${chrome.runtime.getURL('assets/icon.png')}"
    alt="AI"
    id="az-btn-icon"/>
    <span id="az-btn-text">
    AI Help
    </span>
  `;

  // Place it right after the h4 title
  h4.insertAdjacentElement('afterend', btn);
  //creates chatbox once
  createChatBox();

  //onclicking what happens
  btn.addEventListener('click', () => {
    const chatBox = document.getElementById('az-chatbox');
    if(!chatBox) return;

    if (chatBox.style.display === "none") {
      chatBox.style.display = "flex";
    } else {
      chatBox.style.display = "none";
    }
  });
}

// Keep watching in case React re-renders the page and removes the button
function observeLayoutChanges() {
  const observer = new MutationObserver(() => {
    if (!document.getElementById('az-ai-help-btn')) {
      injectAIButton();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Wait for the title to exist before injecting
function waitAndInject() {
  const titleContainer = document.querySelector(
    "div.flex.flex-wrap.items-start.justify-between"
  );
  const h4 = titleContainer?.querySelector("h4");

  if (h4) {
    injectAIButton();
    observeLayoutChanges();
  } else {
    // Page not ready yet, keep checking every 500ms
    setTimeout(waitAndInject, 500);
  }
}

waitAndInject();