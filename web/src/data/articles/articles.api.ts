import { Article, ArticlePayload } from "@/types/article";
import { createHttpClient } from "@/utils/http-client";

function getApiClient() {
  return createHttpClient({
    baseUrl:
      typeof window === "undefined"
        ? process.env.API_INTERNAL_URL!
        : process.env.NEXT_PUBLIC_API_URL!,
  });
}

function getBrowserApiClient() {
  return createHttpClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  });
}

export function getArticles() {
  return getApiClient().get<Article[]>("/articles", {
    cache: "no-store",
  });
}

export function getArticle(id: string) {
  return getApiClient().get<Article>(`/articles/${id}`, {
    cache: "no-store",
  });
}

export function createArticle(payload: ArticlePayload) {
  return getBrowserApiClient().post<Article, ArticlePayload>("/articles", payload);
}

export function updateArticle(id: string, payload: ArticlePayload) {
  return getBrowserApiClient().patch<Article, ArticlePayload>(
    `/articles/${id}`,
    payload,
  );
}

export function deleteArticle(id: string) {
  return getBrowserApiClient().delete<{ id: string }>(`/articles/${id}`);
}
