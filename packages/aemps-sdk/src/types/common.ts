export interface RequestOptions {
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export type QueryParams = Record<string, string | number | boolean | undefined>;

export interface ClientConfig {
  baseUrl?: string;
  fetchFn?: typeof fetch;
  defaultHeaders?: Record<string, string>;
}
