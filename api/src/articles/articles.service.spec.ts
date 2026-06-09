import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';

type MockRepository<T extends object = object> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

function createArticle(overrides: Partial<Article> = {}): Article {
  return {
    id: 'article-1',
    title: 'Learning Kubernetes',
    text: 'Kubernetes becomes much easier to learn with a small real application.',
    author: 'Ada Lovelace',
    createdAt: new Date('2026-01-01T10:00:00.000Z'),
    updatedAt: new Date('2026-01-01T10:00:00.000Z'),
    ...overrides,
  };
}

describe('ArticlesService', () => {
  let service: ArticlesService;
  let repository: MockRepository<Article>;

  beforeEach(() => {
    repository = {
      create: jest.fn((article: Partial<Article>) => article),
      find: jest.fn(),
      findOneBy: jest.fn(),
      merge: jest.fn((article: Article, update: Partial<Article>) => ({
        ...article,
        ...update,
      })),
      remove: jest.fn(),
      save: jest.fn(),
    };

    service = new ArticlesService(repository as Repository<Article>);
  });

  it('creates an article', async () => {
    const payload = {
      title: 'Learning Kubernetes',
      text: 'Kubernetes becomes much easier to learn with a small real application.',
      author: 'Ada Lovelace',
    };
    const article = createArticle(payload);

    repository.save?.mockResolvedValue(article);

    await expect(service.create(payload)).resolves.toEqual(article);
    expect(repository.create).toHaveBeenCalledWith(payload);
    expect(repository.save).toHaveBeenCalledWith(payload);
  });

  it('returns articles from newest to oldest', async () => {
    const articles = [createArticle()];

    repository.find?.mockResolvedValue(articles);

    await expect(service.findAll()).resolves.toEqual(articles);
    expect(repository.find).toHaveBeenCalledWith({
      order: {
        createdAt: 'DESC',
      },
    });
  });

  it('throws when an article does not exist', async () => {
    repository.findOneBy?.mockResolvedValue(null);

    await expect(service.findOne('missing-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates an existing article', async () => {
    const article = createArticle();
    const update = { title: 'Kubernetes basics' };
    const updatedArticle = createArticle(update);

    repository.findOneBy?.mockResolvedValue(article);
    repository.save?.mockResolvedValue(updatedArticle);

    await expect(service.update(article.id, update)).resolves.toEqual(
      updatedArticle,
    );
    expect(repository.merge).toHaveBeenCalledWith(article, update);
    expect(repository.save).toHaveBeenCalledWith({ ...article, ...update });
  });

  it('removes an existing article', async () => {
    const article = createArticle();

    repository.findOneBy?.mockResolvedValue(article);
    repository.remove?.mockResolvedValue(article);

    await expect(service.remove(article.id)).resolves.toEqual({
      id: article.id,
    });
    expect(repository.remove).toHaveBeenCalledWith(article);
  });
});
