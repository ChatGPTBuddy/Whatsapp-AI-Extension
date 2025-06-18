// Simple WhatsApp AI Extension
console.log('🚀 WhatsApp AI Extension loading...');

// Prevent multiple injections
if (window.whatsappAIExtensionLoaded) {
  console.log('AI Extension already loaded');
} else {
  window.whatsappAIExtensionLoaded = true;

  // Wait a bit for WhatsApp to load, then add the button
  setTimeout(addAIButton, 2000);

function addAIButton() {
  console.log('🔍 Looking for WhatsApp elements...');

  // Find any footer or bottom area where we can add the button
  const footer = document.querySelector('footer') ||
                 document.querySelector('[data-testid="compose-box"]')?.parentElement ||
                 document.body;

  if (!footer) {
    console.log('❌ Could not find footer, retrying in 2 seconds...');
    setTimeout(addAIButton, 2000);
    return;
  }

  // Create a floating button
  const aiButton = document.createElement('div');
  aiButton.id = 'whatsapp-ai-extension-button';
  aiButton.innerHTML = 'AI Complete';
  aiButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #007bff;
    color: white;
    padding: 12px 20px;
    border-radius: 25px;
    cursor: pointer;
    z-index: 9999;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
  `;

  // Add hover effect
  aiButton.onmouseover = () => aiButton.style.transform = 'scale(1.05)';
  aiButton.onmouseout = () => aiButton.style.transform = 'scale(1)';

  // Add click handler
  aiButton.onclick = () => getAIComplete(aiButton);

  document.body.appendChild(aiButton);
  console.log('✅ AI Complete button added as floating button');
}

function getAIComplete(button_el) {
  console.log('🚀 AI Complete clicked!');
  button_el.innerHTML = 'Loading...';

  // Simple test data for now
  const testHistory = [
    { user: "Friend", text: "Hey, how are you doing?" },
    { user: "Friend", text: "Are you free this weekend?" },
    { user: "You", text: "I'm good! What did you have in mind?" }
  ];

  console.log('📤 Sending test request to server...');
  fetch("http://localhost:5000/api/ai_complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      history: testHistory,
      output_user: "You",
    }),
  })
    .then((response) => {
      console.log('📡 Server response status:', response.status);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('✅ AI response received:', data);
      button_el.innerHTML = "AI Complete";

      // Show results in a simple popup
      const suggestions = data.predictions[0].content
        .split("\n")
        .filter(line => line.trim())
        .map(line => line.replace(/^\*\s*/, ''));

      showSuggestions(suggestions);
    })
    .catch((error) => {
      console.error('❌ AI request failed:', error);
      button_el.innerHTML = "AI Complete";
      alert('AI request failed. Make sure the server is running and your API key is set.');
    });
}

function showSuggestions(suggestions) {
  // Create a simple popup with suggestions
  const popup = document.createElement('div');
  popup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 2px solid #007bff;
    border-radius: 10px;
    padding: 20px;
    z-index: 10000;
    max-width: 400px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  `;

  // Create title
  const title = document.createElement('h3');
  title.style.cssText = 'margin: 0 0 15px 0; color: #007bff;';
  title.textContent = 'AI Suggestions';
  popup.appendChild(title);

  // Create suggestion items
  suggestions.forEach((suggestion, i) => {
    const suggestionDiv = document.createElement('div');
    suggestionDiv.style.cssText = 'margin: 10px 0; padding: 10px; background: #f0f8ff; border-radius: 5px; cursor: pointer;';
    suggestionDiv.textContent = `${i + 1}. ${suggestion}`;

    // Add click handler without inline events
    suggestionDiv.addEventListener('click', () => {
      navigator.clipboard.writeText(suggestion).then(() => {
        alert('Copied to clipboard!');
      });
    });

    popup.appendChild(suggestionDiv);
  });

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.style.cssText = 'margin-top: 15px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;';
  closeButton.textContent = 'Close';
  closeButton.addEventListener('click', () => {
    popup.remove();
  });
  popup.appendChild(closeButton);

  document.body.appendChild(popup);
}
}
