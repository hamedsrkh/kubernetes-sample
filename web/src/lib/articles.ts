export type Article = {
  id: string;
  title: string;
  text: string;
  author: string;
  createdAt: string;
  updatedAt: string;
};

export type ArticlePayload = {
  title: string;
  text: string;
  author: string;
};

function getApiBaseUrl() {
  if (typeof window === "undefined") {
    return (
      process.env.API_INTERNAL_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:3001/api"
    );
  }

  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getArticles() {
  return request<Article[]>("/articles");
}

export async function getArticle(id: string) {
  return request<Article>(`/articles/${id}`);
}

export async function createArticle(payload: ArticlePayload) {
  return request<Article>("/articles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateArticle(id: string, payload: ArticlePayload) {
  return request<Article>(`/articles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteArticle(id: string) {
  return request<{ id: string }>(`/articles/${id}`, {
    method: "DELETE",
  });
}
