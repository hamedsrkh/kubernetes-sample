import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articlesRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const article = this.articlesRepository.create(createArticleDto);
    return this.articlesRepository.save(article);
  }

  findAll() {
    return this.articlesRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const article = await this.articlesRepository.findOneBy({ id });

    if (!article) {
      throw new NotFoundException(`Article with id "${id}" was not found.`);
    }

    return article;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    const article = await this.findOne(id);
    const updatedArticle = this.articlesRepository.merge(
      article,
      updateArticleDto,
    );

    return this.articlesRepository.save(updatedArticle);
  }

  async remove(id: string) {
    const article = await this.findOne(id);

    await this.articlesRepository.remove(article);

    return { id };
  }
}
