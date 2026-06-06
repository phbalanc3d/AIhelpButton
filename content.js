// cotext scraping logic 

function getProblemContext() {
  // Scrape problem title
  const titleEl = document.querySelector(
    "div.flex.flex-wrap.items-start.justify-between h4"
  );

  // Scrape description — the main problem text area
  const descEl = document.querySelector(
    "div.problem-statement, div[class*='description'], div[class*='problem-desc']"
  );

  // Scrape input/output format sections
  const allSections = document.querySelectorAll("h5, h6, p, li");
  
  let description = descEl?.innerText || document.body.innerText.slice(0, 2000);
  let inputFormat = '';
  let outputFormat = '';

  // Walk through sections looking for Input/Output headings
  allSections.forEach(el => {
    const text = el.innerText?.toLowerCase() || '';
    if (text.includes('input format')) {
      inputFormat = el.nextElementSibling?.innerText || '';
    }
    if (text.includes('output format')) {
      outputFormat = el.nextElementSibling?.innerText || '';
    }
  });

  return {
    title: titleEl?.innerText || 'Unknown Problem',
    description,
    inputFormat,
    outputFormat
  };
}

// Wait for an element to appear then run callback
function waitForElement(selector, callback) {
  // Check immediately first
  const el = document.querySelector(selector);
  if (el) { callback(el); return; }

  const observer = new MutationObserver(() => {
    const el = document.querySelector(selector);
    if (el) {
      observer.disconnect();
      callback(el);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Entry point — wait for title then inject everything
waitForElement(
  "div.flex.flex-wrap.items-start.justify-between h4",
  () => {
    const context = getProblemContext();
    // Store context so scripts.js can access it
    window.azProblemContext = context;
    // Now inject button and chatbox
    injectAIButton();
    createChatBox(context);
    observeLayoutChanges();
  }
);