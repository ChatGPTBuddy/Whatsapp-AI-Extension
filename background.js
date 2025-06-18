chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Extension button clicked, message received:", message);

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length === 0) {
      console.error("No active tab found");
      return;
    }

    const activeTab = tabs[0];
    console.log("Active tab URL:", activeTab.url);

    // Check if we're on WhatsApp Web
    if (!activeTab.url.includes("web.whatsapp.com")) {
      console.warn("Not on WhatsApp Web. Current URL:", activeTab.url);
      alert("Please open WhatsApp Web (https://web.whatsapp.com) to use this extension.");
      return;
    }

    chrome.scripting
      .executeScript({
        target: { tabId: activeTab.id },
        files: ["scripts/complete.js"],
      })
      .then(() => {
        console.log("✅ Script executed successfully");
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error("❌ Script execution failed:", error);
        sendResponse({ success: false, error: error.message });
      });
  });

  // Return true to indicate we'll send a response asynchronously
  return true;
});
