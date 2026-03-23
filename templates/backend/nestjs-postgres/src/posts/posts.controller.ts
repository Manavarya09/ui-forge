import { Controller, Get, Post, Put, Delete, Body, Param, Request } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  findAll(@Request() req) {
    return this.postsService.findAll(req.user.sub);
  }

  @Post()
  create(@Request() req, @Body() body: { title: string; content?: string; published?: boolean }) {
    return this.postsService.create(req.user.sub, body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Request() req, @Body() body: any) {
    return this.postsService.update(id, req.user.sub, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.postsService.delete(id, req.user.sub);
  }
}
