import axios from 'axios';

export class AxiosConfig {
  constructor() {
    this.config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  addConfig(key, value) {
    this.config[key] = value;
  }

  removeConfig(key) {
    if (this.config.hasOwnProperty(key)) {
      delete this.config[key];
    }
  }

  addConfigHeader(key, value) {
    this.config.headers[key] = value;
  }

  removeConfigHeader(key) {
    if (this.config.headers.hasOwnProperty(key)) {
      delete this.config.headers[key];
    }
  }

  removeContentType() {
    this.removeConfig('Content-Type');
  }

  addAuthorization(token) {
    this.addConfigHeader('Authorization', `Bearer ${token}`);
  }

  addFormHeaderContentType() {
    this.addConfigHeader('Content-Type', 'multipart/form-data');
  }

  getConfig() {
    return this.config;
  }
}

export class RequestMethodInstance {
  constructor() {
    // Store active requests to be able to cancel them
    this.activeRequests = new Map();
  }

  // Generate a unique key for each request
  _getRequestKey(url, method) {
    return `${method}:${url}`;
  }

  // Cancel specific request
  cancelRequest(url, method) {
    const key = this._getRequestKey(url, method);
    if (this.activeRequests.has(key)) {
      const controller = this.activeRequests.get(key);
      controller.abort();
      this.activeRequests.delete(key);
    }
  }

  // Cancel all active requests
  cancelAllRequests() {
    this.activeRequests.forEach((controller) => {
      controller.abort();
    });
    this.activeRequests.clear();
  }

  // Register a new request with its controller
  _registerRequest(url, method, controller) {
    const key = this._getRequestKey(url, method);
    this.activeRequests.set(key, controller);
    return () => {
      this.activeRequests.delete(key);
    };
  }

  async getMethod(url, headers) {
    const controller = new AbortController();
    const config = { ...headers, signal: controller.signal };
    const cleanup = this._registerRequest(url, 'GET', controller);
    const response = await axios.get(url, config);
    cleanup();
    return response;
  }
  async postMethod(url, body, headers) {
    const controller = new AbortController();
    const config = { ...headers, signal: controller.signal };
    const cleanup = this._registerRequest(url, 'POST', controller);
    const response = await axios.post(url, body, config);
    cleanup();
    return response;
  }
  async putMethod(url, body, headers) {
    const controller = new AbortController();
    const config = { ...headers, signal: controller.signal };
    const cleanup = this._registerRequest(url, 'PUT', controller);
    const response = await axios.put(url, body, config);
    cleanup();
    return response;
  }

  async patchMethod(url, body, headers) {
    const controller = new AbortController();
    const config = { ...headers, signal: controller.signal };
    const cleanup = this._registerRequest(url, 'PATCH', controller);
    const response = await axios.patch(url, body, config);
    cleanup();
    return response;
  }

  async deleteMethod(url, body, headers) {
    const controller = new AbortController();
    const config = { ...headers, signal: controller.signal };
    const cleanup = this._registerRequest(url, 'DELETE', controller);
    const response = await axios.delete(url, config);
    cleanup();
    return response;
  }
}
