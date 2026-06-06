//for the capturing text fromt he input area and sending it to chat gpt and manage api calls

async function sendMessage(context) {
   context = context || {
    title: "",
    description: "",
    inputFormat: "",
    outputFormat: ""
};
    const inputBox = document.getElementById('az-user-input');

    if (!inputBox) {
    console.log("Input box not found");
    return;
  }

const userInput = inputBox.value.trim();

if (!userInput) return;

    appendMessage("user", userInput);
    inputBox.value = "";
   const { apiKey } = await chrome.storage.local.get("apiKey");

if (!apiKey) {
    appendMessage("bot", "Please set your API key in the extension popup.");
    return;
}
    //const { apiKey } = await chrome.storage.local.get('apiKey');

    if (!apiKey) { appendMessage('bot', 'Please set your API key in the extension popup.'); return; }

     const systemPrompt = `
You are a helpful coding mentor for AlgoZenith.

Problem Title:
${context.title}

Description:
${context.description}

Input Format:
${context.inputFormat}

Output Format:
${context.outputFormat}

Help the student understand the problem.
Do NOT reveal the full solution immediately.
Give hints first.
`;

try{

 const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
{
    method: "POST",
    headers: {
        "Content-Type":
        "application/json"
    },
    body: JSON.stringify({
        contents: [{
            parts: [{
                text:
                systemPrompt +
                "\n\nUser: " +
                userInput
            }]
        }]
    })
});

  const data = await response.json();
console.log(data);

if (data.error) {
    appendMessage(
        "bot",
        JSON.stringify(data.error)
    );
    return;
}

const reply =
    data.candidates?.[0]
    ?.content
    ?.parts?.[0]
    ?.text
    || "No response";

appendMessage("bot", reply);
} catch (error) {
  console.error('Error:', error);
  appendMessage('bot', 'An error occurred while fetching the response.');       
}
}

//who sent the msg and the actual text content
function appendMessage(role, text) {
  const container = document.getElementById("az-chat-messages");
  const div = document.createElement('div');
  div.className = `az-message az-${role}`;
  div.textContent = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}