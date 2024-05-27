// content_script.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sendMessage') {
    // Get selected text
    const selectedText = window.getSelection()?.toString();

    // Send selected text to background script
    chrome.runtime.sendMessage({ text: selectedText }, (response) => {
      console.log('Sent selected text to background:', response);
    });
  }
});

// Send selected text when user clicks the context menu
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'contextMenuClick') {
    // Get selected text
    const selectedText = window.getSelection()?.toString();

    // Send selected text to background script
    chrome.runtime.sendMessage({ text: selectedText }, (response) => {
      console.log('Sent selected text to background:', response);
    });
  }
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sendTextToWebhook') {
    // Send selected text to the background script
    chrome.runtime.sendMessage({ text: selectedText, webhook: request.webhook }, (response) => {
      console.log('Sent selected text to webhook:', response);
    });
  }
});
