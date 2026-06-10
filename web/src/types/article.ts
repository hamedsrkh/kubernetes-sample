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
