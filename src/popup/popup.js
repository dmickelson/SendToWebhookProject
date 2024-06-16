console.log("This is a popup!");

import { escapeJsonValue, setBrowserIcon } from '../utils.js';
import { WebHook } from '../webhook.js';
import { StoredData } from '../storeddata.js';
import { DEVELOPERS_URL, DONATE_URL, ISSUES_URL } from '../constants.js';

document.addEventListener('DOMContentLoaded', () => {
  const contentTextarea = document.getElementById('content');
  const webhookSelect = document.getElementById('webhook-select');
  const sendStatusLabel = document.getElementById('send-status');
  const sendButton = document.getElementById('send-button');
  const optionsLink = document.getElementById('options-link');
  const developersLink = document.getElementById('developers-link');
  const issuesLink = document.getElementById('issues-link');
  const donateLink = document.getElementById('donate-link');

  let webhooks = [];
  let previousIndex = -1;

  // Load webhooks and previousIndex from storage
  chrome.storage.sync.get(['webhooks', 'previousIndex'], (data) => {
    try {
      webhooks = data.webhooks ? JSON.parse(data.webhooks) : [];
      previousIndex = data.previousIndex !== undefined ? data.previousIndex : -1;
      populateWebhookSelect();
    } catch (error) {
      console.error('Error parsing webhooks from storage:', error);
      webhooks = [];
    }
  });

  // Populate the select element with webhook options
  function populateWebhookSelect() {
    webhookSelect.innerHTML = '';
    webhooks.forEach((wh, i) => {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = wh.name;
      if (i === previousIndex) {
        option.selected = true;
      }
      webhookSelect.appendChild(option);
    });
  }

  // Event listeners
  optionsLink.addEventListener('click', () => chrome.runtime.openOptionsPage());
  developersLink.addEventListener('click', () => chrome.tabs.create({ url: DEVELOPERS_URL }));
  issuesLink.addEventListener('click', () => chrome.tabs.create({ url: ISSUES_URL }));
  donateLink.addEventListener('click', () => chrome.tabs.create({ url: DONATE_URL }));

  sendButton.addEventListener('click', () => {
    const content = escapeJsonValue(contentTextarea.value);
    const selectedIndex = webhookSelect.selectedIndex;
    if (selectedIndex === -1) {
      return;
    }
    const webhook = webhooks[selectedIndex];
    const webaction = webhook.action;

    if (webaction) {
      const { method, url, payload, headers } = webaction;

      // Get the current tab URL and title
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        const currentTabUrl = currentTab.url;
        const currentTabTitle = currentTab.title;

        let body;
        if (payload !== undefined) {
          body = JSON.stringify({
            ...payload
          })
            .replace('%d', new Date().toISOString())
            .replace('%l', new Date().toLocaleString())
            .replace('%t', currentTabTitle)
            .replace('%u', currentTabUrl)
            .replace('%s', content);
        }

        const formattedHeaders = headers || {};
        console.log(formattedHeaders);

        setBrowserIcon('Sending');
        sendStatusLabel.textContent = 'Sending...';
        sendStatusLabel.classList.remove('error');

        fetch(url, {
          method: method || 'POST',
          body,
          headers: formattedHeaders,
          mode: 'no-cors'
        }).then((resp) => {
          if (resp.status >= 400) {
            setBrowserIcon('Error', `Error: ${resp.status}`);
            sendStatusLabel.textContent = `Error: ${resp.status}`;
            sendStatusLabel.classList.add('error');
          } else {
            setBrowserIcon('OK');
            sendStatusLabel.textContent = 'Sent.';
            setTimeout(() => {
              setBrowserIcon('Default');
              sendStatusLabel.textContent = '';
            }, 750);
          }
        }).catch((err) => {
          setBrowserIcon('Error', `Error: ${err.message}`);
          sendStatusLabel.textContent = `Error: ${err.message}`;
          sendStatusLabel.classList.add('error');
        });

        // Save last hook
        const data = { previousIndex: selectedIndex };
        chrome.storage.sync.set(data);
      });
    }
  });
});
