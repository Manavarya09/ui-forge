import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async findAll(userId: string) {
    return this.postsRepository.find({ where: { author: { id: userId } } });
  }

  async create(userId: string, data: { title: string; content?: string; published?: boolean }) {
    const post = this.postsRepository.create({ ...data, author: { id: userId } as any });
    return this.postsRepository.save(post);
  }

  async update(id: string, userId: string, data: Partial<Post>) {
    const post = await this.postsRepository.findOne({ where: { id, author: { id: userId } } });
    if (!post) throw new NotFoundException('Post not found');
    Object.assign(post, data);
    return this.postsRepository.save(post);
  }

  async delete(id: string, userId: string) {
    const post = await this.postsRepository.findOne({ where: { id, author: { id: userId } } });
    if (!post) throw new NotFoundException('Post not found');
    await this.postsRepository.remove(post);
    return { message: 'Post deleted' };
  }
}
