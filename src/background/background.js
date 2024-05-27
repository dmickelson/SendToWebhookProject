// background.js

try {
  importScripts('src/webhook.js');
} catch (e) {
  console.log(e);
}

try {
  importScripts('src/utils.js');
} catch (e) {
  console.log(e);
}


// Get the webhooks from your storage or configuration (replace with your actual logic)
const webhooks = [
  // Example:
  new WebHook(
    'My Webhook',
    ['https://example.com/*'], // Match URLs starting with https://example.com/
    ['https://api.example.com/webhook'], // Target URL pattern
    new WebHookAction(
      'POST', // HTTP method
      'https://api.example.com/webhook', // Target URL
      JSON.stringify({ message: 'Hello from extension' }), // Payload
      { 'Content-Type': 'application/json' } // Headers
    )
  ),
  // ... more webhook definitions
];

// Create the context menus
function createContextMenus() {
  chrome.contextMenus.removeAll(() => {
    for (const webhook of webhooks) {
      const isLink = webhook.targetUrlPatterns !== undefined && webhook.targetUrlPatterns.length > 0;

      if (isLink) {
        chrome.contextMenus.create({
          documentUrlPatterns: webhook.documentUrlPatterns,
          title: `Send Link to ${webhook.name}`,
          contexts: ['link'],
          targetUrlPatterns: webhook.targetUrlPatterns,
          onclick: (info) => {
            send(info.linkUrl, webhook.action);
          }
        });

        chrome.contextMenus.create({
          documentUrlPatterns: webhook.documentUrlPatterns,
          title: `Send Image to ${webhook.name}`,
          contexts: ['image'],
          targetUrlPatterns: webhook.targetUrlPatterns,
          onclick: (info) => {
            send(info.srcUrl, webhook.action);
          }
        });

      } else {
        chrome.contextMenus.create({
          documentUrlPatterns: webhook.documentUrlPatterns,
          title: `Send "%s" to ${webhook.name}`,
          contexts: ['selection'],
          onclick: (info) => {
            send(escapeJsonValue(info.selectionText), webhook.action);
          }
        });
      }
    }
  });
}

// Function to handle sending data to the webhook
function send(param, action) {
  if (param !== undefined && action !== undefined) {
    const { method, url, payload, headers } = action;
    let body;
    if (payload !== undefined) {
      body = JSON.stringify(payload)
        .replace('%d', new Date().toISOString())
        .replace('%l', new Date().toLocaleString())
        .replace('%s', param);
    }
    setBrowserIcon('Sending');
    fetch(url, {
      method: method || 'POST',
      body,
      headers,
      mode: 'no-cors' // Use 'cors' if your API supports it
    })
    .then((resp) => {
      if (resp.status >= 400) {
        setBrowserIcon('Error', `Error: ${resp.status}`);
      } else {
        setBrowserIcon('OK');
        setTimeout(() => {
          setBrowserIcon('Default');
        }, 750);
      }
    })
    .catch((err) => {
      setBrowserIcon('Error', `Error: ${err.message}`);
    });

  } else {
    alert('Error: Webhook action is not defined.');
  }
}

// Call the function to create the context menus
createContextMenus();

// ... other background script logic (if needed)
