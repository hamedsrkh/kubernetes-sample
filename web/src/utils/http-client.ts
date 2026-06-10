export class HttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

type HttpClientOptions = {
  baseUrl: string;
};

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export function createHttpClient({ baseUrl }: HttpClientOptions) {
  async function request<TResponse>(
    path: string,
    { body, headers, ...init }: RequestOptions = {},
  ): Promise<TResponse> {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      body: body === undefined ? undefined : JSON.stringify(body),
      headers: {
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
    });

    if (!response.ok) {
      throw new HttpError(await getErrorMessage(response), response.status);
    }

    if (response.status === 204) {
      return undefined as TResponse;
    }

    return response.json() as Promise<TResponse>;
  }

  return {
    delete: <TResponse>(path: string, options?: RequestOptions) =>
      request<TResponse>(path, { ...options, method: "DELETE" }),
    get: <TResponse>(path: string, options?: RequestOptions) =>
      request<TResponse>(path, { ...options, method: "GET" }),
    patch: <TResponse, TBody>(path: string, body: TBody, options?: RequestOptions) =>
      request<TResponse>(path, { ...options, body, method: "PATCH" }),
    post: <TResponse, TBody>(path: string, body: TBody, options?: RequestOptions) =>
      request<TResponse>(path, { ...options, body, method: "POST" }),
  };
}

async function getErrorMessage(response: Response) {
  const fallback = `Request failed with status ${response.status}`;
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: unknown }
      | null;

    if (typeof payload?.message === "string") {
      return payload.message;
    }

    if (Array.isArray(payload?.message)) {
      return payload.message.join(", ");
    }
  }

  return (await response.text().catch(() => "")) || fallback;
}
