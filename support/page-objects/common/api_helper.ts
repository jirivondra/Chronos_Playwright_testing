export class ApiHelper {
  protected path: string;
  protected baseApiUrl: string;
  private authHeader: string;

  constructor(path: string) {
    this.path = path;
    this.baseApiUrl = process.env.API_BASE_URL!;
    this.authHeader = 'Basic ' + Buffer.from(`${process.env.API_USERNAME}:${process.env.API_PASSWORD}`).toString('base64');
  }

  protected headers() {
    return {
      'Authorization': this.authHeader,
      'Content-Type': 'application/json'
    };
  }

  protected async get(endpoint: string) {
    return fetch(`${this.baseApiUrl}${endpoint}`, {
      headers: this.headers()
    });
  }

  protected async post(endpoint: string, body?: object) {
    return fetch(`${this.baseApiUrl}${endpoint}`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body)
    });
  }

  protected async put(endpoint: string, body?: object) {
    return fetch(`${this.baseApiUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(body)
    });
  }

  protected async delete(endpoint: string) {
    return fetch(`${this.baseApiUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.headers()
    });
  }

  async apiRequest(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, body?: object) {
    switch (method) {
      case 'GET':
        return this.get(endpoint);
      case 'POST':
        return this.post(endpoint, body);
      case 'PUT':
        return this.put(endpoint, body);
      case 'DELETE':
        return this.delete(endpoint);
      default:
        throw new Error(`Nepodporovaná metoda: ${method}`);
    }
  }
}