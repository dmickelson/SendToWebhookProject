// utils.js

// Function to escape a JSON value
function escapeJsonValue(value) {
  const o = [value || '']; // Create an array with the value (or an empty string)
  const str = JSON.stringify(o); // Stringify the array
  return str.substring(2, str.length - 2); // Extract the escaped value from the string
}

// Function to set the browser icon based on status
function setBrowserIcon(status, title = '') {
  switch (status) {
    case 'OK':
      chrome.browserAction.setBadgeText({ text: '✓' });
      chrome.browserAction.setBadgeBackgroundColor({ color: '#00C851' }); // Green
      chrome.browserAction.setTitle({ title: title || 'Sent.' });
      break;
    case 'Error':
      chrome.browserAction.setBadgeText({ text: '!' });
      chrome.browserAction.setBadgeBackgroundColor({ color: '#ff4444' }); // Red
      chrome.browserAction.setTitle({ title: title || 'Error' });
      break;
    case 'Sending':
      chrome.browserAction.setBadgeText({ text: '…' });
      chrome.browserAction.setBadgeBackgroundColor({ color: '#ffbb33' }); // Orange
      chrome.browserAction.setTitle({ title: title || 'Sending...' });
      break;
    default: // Default or any other status
      chrome.browserAction.setBadgeText({ text: '' }); // Clear badge text
      chrome.browserAction.setTitle({ title: title || '' }); // Set title (optional)
      break;
  }
}

// Export the functions
export { escapeJsonValue, setBrowserIcon };
