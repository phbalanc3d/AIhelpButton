//send message to chatbox and get response from openai

async function sendMessage(context) {
    const inputBox = document.getElementById('az-user-input');
    const userInput =inputBox.value;
    if (!userInput.trim()) return;
    appendMessage("user", userInput);
    inputBox.value = "";
    const { apiKey } = await chrome.storage.local.get('apiKey');

    if (!apiKey) { appendMessage('bot', 'Please set your API key in the extension popup.'); return; }

     const systemPrompt = `
You are a helpful coding mentor for AlgoZenith

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

 const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInput }
      ]
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || 'Error getting response.';
  
  appendMessage('bot', reply);
} catch (error) {
  console.error('Error:', error);
  appendMessage('bot', 'An error occurred while fetching the response.');       
}
}

function appendMessage(role, text) {
  const container = document.getElementById('az-chat-messages');
  const div = document.createElement('div');
  div.className = `az-message az-${role}`;
  div.innerHTML = marked.parse(text); // uses marked.min.js for markdown
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}