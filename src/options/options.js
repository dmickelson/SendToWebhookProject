const webhooksTextarea = document.getElementById('webhooks-textarea');
const saveButton = document.getElementById('save-button');
const saveStatus = document.getElementById('save-status');

// Load webhooks from storage
chrome.storage.sync.get(['webhooks', 'previousIndex'], (data) => {
  const storedWebhooks = JSON.parse(data.webhooks);
  const lastIndex = data.previousIndex;
  if (storedWebhooks) {
    webhooksTextarea.value = data.webhooks;
  } else {
    // Set default webhooks if none exist
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

  chrome.storage.sync.set({ webhooks: JSON.stringify(webhooks), previousIndex:5 }, () => {
    chrome.runtime.reload();
    saveStatus.textContent = 'Options saved.';
    saveStatus.classList.remove('error');
    setTimeout(() => {
      saveStatus.textContent = '';
      window.close();
    }, 750);
  });
});
