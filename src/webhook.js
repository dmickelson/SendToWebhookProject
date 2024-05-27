// webhook.js

// Define the WebHook constructor function
function WebHook(name, documentUrlPatterns, targetUrlPatterns, action) {
  this.name = name;
  this.documentUrlPatterns = documentUrlPatterns;
  this.targetUrlPatterns = targetUrlPatterns;
  this.action = action;
}

// Define the WebHookAction constructor function
function WebHookAction(method, url, payload, headers) {
  this.method = method;
  this.url = url;
  this.payload = payload;
  this.headers = headers;
}

// Export the constructors
export { WebHook, WebHookAction };
