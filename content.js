function waitForElement(selector, callback) {
  const observer = new MutationObserver(() => {
    const el = document.querySelector(selector);
    if (el) { observer.disconnect(); callback(el); }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// content.js
// content.js

function injectAIButton() {
  // Don't inject twice
  if (document.getElementById('az-ai-help-btn')) return;

  // Find the same container the reference repo uses
  const titleContainer = document.querySelector(
    "div.flex.flex-wrap.items-start.justify-between"
  );
  if (!titleContainer) return;

  const h4 = titleContainer.querySelector("h4");
  if (!h4) return;

  // Create the button wrapper
  const btn = document.createElement('div');
  btn.id = 'az-ai-help-btn';
  btn.innerHTML = `
    <img src="${chrome.runtime.getURL('assets/icon.png')}" alt="AI" id="az-btn-icon"/>
    <span id="az-btn-text">AI Help</span>
  `;

  // Place it right after the h4 title — same as bookmark button
  h4.insertAdjacentElement('afterend', btn);

  btn.addEventListener('click', () => {
    const chatbox = document.getElementById('az-chatbox');
    if (chatbox) {
      chatbox.style.display = chatbox.style.display === 'flex' ? 'none' : 'flex';
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