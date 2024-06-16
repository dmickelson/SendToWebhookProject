import { WebHook } from '../webhook.js';
import { StoredData } from '../storeddata.js';

document.addEventListener('DOMContentLoaded', () => {
  const webhooksTextarea = document.getElementById('webhooks-textarea');
  const saveButton = document.getElementById('save-button');
  const saveStatus = document.getElementById('save-status');

  if (!webhooksTextarea || !saveButton || !saveStatus) {
    console.error('One or more elements are missing:', { webhooksTextarea, saveButton, saveStatus });
    return;
  }

  console.log("Elements loaded:", { webhooksTextarea, saveButton, saveStatus });

  // Load webhooks and previousIndex from storage
  chrome.storage.sync.get(['webhooks', 'previousIndex'], (data) => {
    try {
      const storedWebhooks = data.webhooks ? JSON.parse(data.webhooks) : [];
      webhooksTextarea.value = JSON.stringify(storedWebhooks, null, 2);
      console.log('Loaded webhooks:', storedWebhooks);
    } catch (error) {
      console.error('Error parsing webhooks from storage:', error);
      webhooksTextarea.value = '[]'; // Or your default webhook configuration
    }

    // Handle previousIndex
    const previousIndex = data.previousIndex !== undefined ? data.previousIndex : 0;
    console.log('Loaded previousIndex:', previousIndex);
  });

  // Save button click handler
  saveButton.addEventListener('click', () => {
    console.log('Save button clicked');
    let webhooks;
    try {
      webhooks = JSON.parse(webhooksTextarea.value);
      if (!(webhooks instanceof Array)) {
        throw new Error('Invalid JSON! Webhooks must be an array.');
      }
      console.log('Parsed webhooks:', webhooks);
    } catch (error) {
      saveStatus.textContent = 'Invalid JSON!';
      saveStatus.classList.add('error');
      console.error('Error parsing webhooks textarea:', error);
      return;
    }

    const previousIndex = 5; // Set your desired value for previousIndex here
    const data = new StoredData(JSON.stringify(webhooks), previousIndex);
    console.log('Data to save:', data);

    chrome.storage.sync.set({ webhooks: data.webhooks, previousIndex: data.previousIndex }, () => {
      saveStatus.textContent = 'Options saved.';
      saveStatus.classList.remove('error');
      console.log('Data saved to storage:', { webhooks: data.webhooks, previousIndex: data.previousIndex });

      setTimeout(() => {
        saveStatus.textContent = '';
        window.close();
      }, 750);
    });
  }, { passive: true });
});
