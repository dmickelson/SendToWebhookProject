// utils.js

// Function to escape a JSON value
export function escapeJsonValue(value) {
  const o = [value || '']; // Create an array with the value (or an empty string)
  const str = JSON.stringify(o); // Stringify the array
  return str.substring(2, str.length - 2); // Extract the escaped value from the string
}

// Function to set the browser icon based on status
export function setBrowserIcon(status, title = '') {

  switch (status) {
    case 'OK':
      chrome.action.setBadgeText({ text: '✓' });
      chrome.action.setBadgeBackgroundColor({ color: '#00C851' }); // Green
      chrome.action.setTitle({ title: title || 'Sent.' });
      break;
    case 'Error':
      chrome.action.setBadgeText({ text: '!' });
      chrome.action.setBadgeBackgroundColor({ color: '#ff4444' }); // Red
      chrome.action.setTitle({ title: title || 'Error' });
      break;
    case 'Sending':
      chrome.action.setBadgeText({ text: '…' });
      chrome.action.setBadgeBackgroundColor({ color: '#ffbb33' }); // Orange
      chrome.action.setTitle({ title: title || 'Sending...' });
      break;
    default: // Default or any other status
      chrome.action.setBadgeText({ text: '' }); // Clear badge text
      chrome.action.setTitle({ title: title || '' }); // Set title (optional)
      break;
  }
}
