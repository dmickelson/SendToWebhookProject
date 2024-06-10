const webhooksTextarea = document.getElementById('webhooks-textarea');
const saveButton = document.getElementById('save-button');
const saveStatus = document.getElementById('save-status');

// Load webhooks from storage
chrome.storage.sync.get(['webhooks'], (data) => {
  try {
    const storedWebhooks = data.webhooks ? JSON.parse(data.webhooks) : [];
    webhooksTextarea.value = JSON.stringify(storedWebhooks, null, 2);
  } catch (error) {
    console.error('Error parsing webhooks from storage:', error);
    webhooksTextarea.value = '[]'; // Or your default webhook configuration
  }
});

// Save button click handler
saveButton.addEventListener('click', () => {
  let webhooks;
  try {
    webhooks = JSON.parse(webhooksTextarea.value);
    if (!(webhooks instanceof Array)) {
      throw new Error('Invalid JSON!');
    }
  } catch (error) {
    saveStatus.textContent = 'Invalid JSON!';
    saveStatus.classList.add('error');
    return;
  }

  chrome.storage.sync.set({ webhooks: JSON.stringify(webhooks) }, () => {
    chrome.runtime.reload();
    saveStatus.textContent = 'Options saved.';
    saveStatus.classList.remove('error');
    setTimeout(() => {
      saveStatus.textContent = '';
      window.close();
    }, 750);
  });
});
