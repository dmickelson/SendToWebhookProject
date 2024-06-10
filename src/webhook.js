export class WebHook {
  constructor(name, documentUrlPatterns, targetUrlPatterns, action) {
    this.name = name;
    this.documentUrlPatterns = documentUrlPatterns;
    this.targetUrlPatterns = targetUrlPatterns;
    this.action = action;
  }
}

export class WebHookAction {
  constructor(method, url, payload, headers) {
    this.method = method;
    this.url = url;
    this.payload = payload;
    this.headers = headers;
  }
}
