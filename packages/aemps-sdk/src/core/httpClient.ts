import { ClientConfig, QueryParams, RequestOptions } from "../types/common";

const CIMA_BASE_URL = "https://cima.aemps.es/cima/rest";

export class HttpClient {
  private readonly baseUrl: string;
  private readonly fetchFn: typeof fetch;
  private readonly defaultHeaders: Record<string, string>;

  constructor(config: ClientConfig = {}) {
    this.baseUrl = (config.baseUrl ?? CIMA_BASE_URL).replace(/\/$/, "");
    this.fetchFn = config.fetchFn ?? fetch;
    this.defaultHeaders = config.defaultHeaders ?? {};
  }

  async get<T>(
    path: string,
    query?: QueryParams,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = this.buildUrl(path, query);
    const response = await this.fetchFn(url, {
      method: "GET",
      signal: options.signal,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(
    path: string,
    body?: unknown,
    query?: QueryParams,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = this.buildUrl(path, query);
    const response = await this.fetchFn(url, {
      method: "POST",
      signal: options.signal,
      headers: {
        "Content-Type": "application/json",
        ...this.defaultHeaders,
        ...options.headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const body = await safeJson(response);
      const error = new Error(
        `CIMA request failed with status ${response.status}`
      );
      (error as Error & { response?: Response; body?: unknown }).response =
        response;
      (error as Error & { response?: Response; body?: unknown }).body = body;
      throw error;
    }

    return (await safeJson(response)) as T;
  }

  private buildUrl(path: string, query?: QueryParams): string {
    const url = new URL(path.replace(/^\//, ""), `${this.baseUrl}/`);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value === undefined) return;
        url.searchParams.append(key, String(value));
      });
    }
    return url.toString();
  }
}

async function safeJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}
