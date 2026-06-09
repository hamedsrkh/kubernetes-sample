import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteArticleButton } from "@/components/delete-article-button";
import { getArticle } from "@/lib/articles";

type ArticlePageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = await getArticle(id).catch(() => undefined);

  if (!article) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-6">
        <Link href="/" className="text-sm font-semibold text-indigo-700">
          Back to articles
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              {article.title}
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              By {article.author} · Updated {formatDate(article.updatedAt)}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/articles/${article.id}/edit`}
              className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Edit
            </Link>
            <DeleteArticleButton articleId={article.id} />
          </div>
        </div>
      </header>

      <article className="rounded-md border border-slate-200 bg-white p-5 text-base leading-8 text-slate-700 shadow-sm sm:p-6">
        {article.text.split("\n").map((paragraph, index) => (
          <p key={`${article.id}-${index}`} className="mb-5 last:mb-0">
            {paragraph}
          </p>
        ))}
      </article>
    </main>
  );
}
