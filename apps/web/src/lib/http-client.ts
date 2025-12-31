import {z} from 'zod/v4';

interface HttpClientConfig {
  baseURL: string;
  headers?: Record<string, string>;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: {path: string; message: string}[];
}

export class HttpClientError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: {path: string; message: string}[],
  ) {
    super(message);
    this.name = 'HttpClientError';
  }
}

export class HttpClient {
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig) {
    this.config = config;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await this.parseError(response);
      throw new HttpClientError(response.status, error.message, error.errors);
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json() as Promise<T>;
    }

    return response.text() as Promise<T>;
  }

  private async parseError(response: Response): Promise<ApiError> {
    try {
      const data: unknown = await response.json();
      const errorData = data as {message?: string; errors?: {path: string; message: string}[]};
      return {
        message: errorData.message ?? 'An error occurred',
        statusCode: response.status,
        errors: errorData.errors,
      };
    } catch {
      return {
        message: 'An unexpected error occurred',
        statusCode: response.status,
      };
    }
  }

  private buildUrl(path: string): string {
    const baseURL = this.config.baseURL.replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseURL}${normalizedPath}`;
  }

  private getHeaders(customHeaders?: Record<string, string>): HeadersInit {
    return {
      'Content-Type': 'application/json',
      ...this.config.headers,
      ...customHeaders,
    };
  }

  async get<TResponse>(path: string, options?: {headers?: Record<string, string>}): Promise<TResponse> {
    const response = await fetch(this.buildUrl(path), {
      method: 'GET',
      headers: this.getHeaders(options?.headers),
      credentials: 'include',
    });

    return this.handleResponse<TResponse>(response);
  }

  async post<TRequest, TResponse>(
    path: string,
    data?: TRequest,
    options?: {headers?: Record<string, string>},
  ): Promise<TResponse> {
    const response = await fetch(this.buildUrl(path), {
      method: 'POST',
      headers: this.getHeaders(options?.headers),
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<TResponse>(response);
  }

  async put<TRequest, TResponse>(
    path: string,
    data: TRequest,
    options?: {headers?: Record<string, string>},
  ): Promise<TResponse> {
    const response = await fetch(this.buildUrl(path), {
      method: 'PUT',
      headers: this.getHeaders(options?.headers),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return this.handleResponse<TResponse>(response);
  }

  async patch<TRequest, TResponse>(
    path: string,
    data: TRequest,
    options?: {headers?: Record<string, string>},
  ): Promise<TResponse> {
    const response = await fetch(this.buildUrl(path), {
      method: 'PATCH',
      headers: this.getHeaders(options?.headers),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return this.handleResponse<TResponse>(response);
  }

  async delete<TResponse>(path: string, options?: {headers?: Record<string, string>}): Promise<TResponse> {
    const response = await fetch(this.buildUrl(path), {
      method: 'DELETE',
      headers: this.getHeaders(options?.headers),
      credentials: 'include',
    });

    return this.handleResponse<TResponse>(response);
  }

  /**
   * Type-safe request method that validates request and response using Zod schemas
   */
  async request<TRequest, TResponse>(
    path: string,
    options: {
      method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      data?: TRequest;
      requestSchema?: z.Schema<TRequest>;
      responseSchema?: z.Schema<TResponse>;
      headers?: Record<string, string>;
    },
  ): Promise<TResponse> {
    // Validate request data if schema provided
    if (options.requestSchema && options.data !== undefined) {
      options.requestSchema.parse(options.data);
    }

    let response: unknown;

    switch (options.method) {
      case 'GET':
        response = await this.get<TResponse>(path, {headers: options.headers});
        break;
      case 'POST':
        response = await this.post<TRequest, TResponse>(path, options.data, {headers: options.headers});
        break;
      case 'PUT':
        if (options.data === undefined) {
          throw new Error('PUT requests require data');
        }
        response = await this.put<TRequest, TResponse>(path, options.data, {headers: options.headers});
        break;
      case 'PATCH':
        if (options.data === undefined) {
          throw new Error('PATCH requests require data');
        }
        response = await this.patch<TRequest, TResponse>(path, options.data, {headers: options.headers});
        break;
      case 'DELETE':
        response = await this.delete<TResponse>(path, {headers: options.headers});
        break;
    }

    // Validate response if schema provided
    if (options.responseSchema) {
      return options.responseSchema.parse(response);
    }

    return response as TResponse;
  }
}

// Create and export the default HTTP client instance
const baseURL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000/api';

export const httpClient = new HttpClient({
  baseURL,
});
