import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/article-form";
import { getArticle } from "@/data/articles";

type EditArticlePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const article = await getArticle(id).catch(() => undefined);

  if (!article) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10">
      <header className="border-b border-slate-200 pb-6">
        <Link
          href={`/articles/${article.id}`}
          className="text-sm font-semibold text-indigo-700"
        >
          Back to article
        </Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Edit article
        </h1>
      </header>
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <ArticleForm article={article} />
      </section>
    </main>
  );
}
