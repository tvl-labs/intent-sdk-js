export interface FetchConfig {
  baseURL?: string;
  headers?: HeadersInit;
}

type RequestInterceptor = (
  input: RequestInfo,
  init: RequestInit,
) => Promise<[RequestInfo, RequestInit]> | [RequestInfo, RequestInit];
type ResponseInterceptor = (response: Response) => Promise<Response> | Response;

export interface FetchJSONResult<T = unknown> {
  status: number;
  data: T;
  ok: boolean;
  raw?: Response;
}

export abstract class Fetch {
  protected readonly baseURL?: string;
  protected readonly headers: HeadersInit;

  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(config?: FetchConfig) {
    this.baseURL = config?.baseURL;
    this.headers = config?.headers || {};
  }

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  async get<T = unknown>(url: string, init?: RequestInit): Promise<FetchJSONResult<T>> {
    return this._request<T>(url, { ...init, method: "GET" });
  }

  async post<T = unknown>(url: string, body?: unknown, init?: RequestInit): Promise<FetchJSONResult<T>> {
    return this._request<T>(url, {
      ...init,
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    });
  }

  async put<T = unknown>(url: string, body?: unknown, init?: RequestInit): Promise<FetchJSONResult<T>> {
    return this._request<T>(url, {
      ...init,
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    });
  }

  async delete<T = unknown>(url: string, init?: RequestInit): Promise<FetchJSONResult<T>> {
    return this._request<T>(url, { ...init, method: "DELETE" });
  }

  protected async _request<T = unknown>(url: string, init: RequestInit): Promise<FetchJSONResult<T>> {
    let fullUrl: RequestInfo = this.baseURL ? this.baseURL + url : url;
    let finalInit: RequestInit = {
      ...init,
      headers: {
        ...(this.headers || {}),
        ...(init.headers || {}),
      },
    };

    for (const interceptor of this.requestInterceptors) {
      [fullUrl, finalInit] = await interceptor(fullUrl, finalInit);
    }

    let response = await fetch(fullUrl, finalInit);

    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response);
    }

    const status = response.status;
    const ok = response.ok;
    const data: T = await response.json().catch(() => undefined);
    const raw = response;

    return { status, data, raw, ok };
  }
}
