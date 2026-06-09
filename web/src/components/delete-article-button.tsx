"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteArticle } from "@/lib/articles";

type DeleteArticleButtonProps = {
  articleId: string;
};

export function DeleteArticleButton({ articleId }: DeleteArticleButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this article permanently?");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteArticle(articleId);
      router.push("/");
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex h-10 items-center justify-center rounded-md border border-red-200 px-4 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
