import Link from "next/link";
import { getArticles } from "@/data/articles";
import { Article } from "@/types/article";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function Home() {
  let articles: Article[] = [];
  let loadError = false;

  try {
    articles = await getArticles();
  } catch {
    loadError = true;
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-700">
            Kubernetes sample app
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Articles
          </h1>
        </div>
        <Link
          href="/articles/new"
          className="inline-flex h-11 items-center justify-center rounded-md bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          New article
        </Link>
      </header>

      {loadError ? (
        <section className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          The API is not reachable yet. Start the NestJS server on port 3001 and
          refresh this page.
        </section>
      ) : null}

      {articles.length === 0 && !loadError ? (
        <section className="rounded-md border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">No articles yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            Create the first article to exercise the full CRUD flow.
          </p>
        </section>
      ) : (
        <section className="grid gap-4">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="rounded-md border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">
                    {article.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                    {article.text}
                  </p>
                </div>
                <p className="shrink-0 text-sm text-slate-500">
                  {formatDate(article.createdAt)}
                </p>
              </div>
              <p className="mt-4 text-sm font-medium text-slate-700">
                By {article.author}
              </p>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
