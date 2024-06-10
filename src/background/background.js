import { WebHook, WebHookAction } from '../webhook.js';
import { escapeJsonValue, setBrowserIcon } from '../utils.js';

// Get the webhooks from your storage or configuration (replace with your actual logic)
const webhooks = [
  new WebHook(
    'My Webhook',
    ['https://example.com/*'],
    ['https://api.example.com/webhook'],
    new WebHookAction(
      'POST',
      'https://api.example.com/webhook',
      JSON.stringify({ message: 'Hello from extension' }),
      { 'Content-Type': 'application/json' }
    )
  ),
  // ... more webhook definitions
];

// Create the context menus
function createContextMenus() {
  chrome.contextMenus.removeAll(() => {
    for (const [index, webhook] of webhooks.entries()) {
      const isLink = webhook.targetUrlPatterns !== undefined && webhook.targetUrlPatterns.length > 0;

      if (isLink) {
        chrome.contextMenus.create({
          id: `sendLinkTo${webhook.name.replace(/\s+/g, '')}${index}`,
          documentUrlPatterns: webhook.documentUrlPatterns,
          title: `Send Link to ${webhook.name}`,
          contexts: ['link'],
          targetUrlPatterns: webhook.targetUrlPatterns,
        });

        chrome.contextMenus.create({
          id: `sendImageTo${webhook.name.replace(/\s+/g, '')}${index}`,
          documentUrlPatterns: webhook.documentUrlPatterns,
          title: `Send Image to ${webhook.name}`,
          contexts: ['image'],
          targetUrlPatterns: webhook.targetUrlPatterns,
        });

      } else {
        chrome.contextMenus.create({
          id: `sendSelectionTo${webhook.name.replace(/\s+/g, '')}${index}`,
          documentUrlPatterns: webhook.documentUrlPatterns,
          title: `Send "%s" to ${webhook.name}`,
          contexts: ['selection'],
        });
      }
    }
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const id = info.menuItemId;

  // Find the matching webhook
  const webhook = webhooks.find(webhook => id.startsWith(`send${webhook.name.replace(/\s+/g, '')}`));

  if (webhook) {
    if (id.startsWith('sendLinkTo')) {
      send(info.linkUrl, webhook.action);
    } else if (id.startsWith('sendImageTo')) {
      send(info.srcUrl, webhook.action);
    } else if (id.startsWith('sendSelectionTo')) {
      send(escapeJsonValue(info.selectionText), webhook.action);
    }
  }
});

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

createContextMenus();
