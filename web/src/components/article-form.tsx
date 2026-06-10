"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createArticle, updateArticle } from "@/data/articles";
import { Article, ArticlePayload } from "@/types/article";

type ArticleFormProps = {
  article?: Article;
};

const emptyArticle: ArticlePayload = {
  title: "",
  text: "",
  author: "",
};

export function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ArticlePayload>({
    title: article?.title ?? emptyArticle.title,
    text: article?.text ?? emptyArticle.text,
    author: article?.author ?? emptyArticle.author,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const savedArticle = article
        ? await updateArticle(article.id, form)
        : await createArticle(form);

      router.push(`/articles/${savedArticle.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save article.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <label htmlFor="title" className="text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={form.title}
          minLength={3}
          maxLength={160}
          required
          onChange={(event) =>
            setForm((current) => ({ ...current, title: event.target.value }))
          }
          className="h-11 rounded-md border border-slate-300 bg-white px-3 text-slate-950 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="author" className="text-sm font-medium text-slate-700">
          Author
        </label>
        <input
          id="author"
          name="author"
          value={form.author}
          minLength={2}
          maxLength={120}
          required
          onChange={(event) =>
            setForm((current) => ({ ...current, author: event.target.value }))
          }
          className="h-11 rounded-md border border-slate-300 bg-white px-3 text-slate-950 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="text" className="text-sm font-medium text-slate-700">
          Text
        </label>
        <textarea
          id="text"
          name="text"
          value={form.text}
          minLength={20}
          required
          rows={10}
          onChange={(event) =>
            setForm((current) => ({ ...current, text: event.target.value }))
          }
          className="resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-slate-950 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        />
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href={article ? `/articles/${article.id}` : "/"}
          className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex h-11 items-center justify-center rounded-md bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {isSaving ? "Saving..." : article ? "Update article" : "Create article"}
        </button>
      </div>
    </form>
  );
}
