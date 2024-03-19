import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findAll(taskId: number) {
    return await this.commentRepository.find({
      where: {
        taskId: taskId,
      },
    });
  }

  async create(taskId: number, content: string) {
    const comment = await this.commentRepository.save({
      taskId: taskId,
      content: content,
      userId: 1,
    });
    return comment;
  }

  async update(commentId: number, content: string) {
    const findcomment = await this.commentRepository.find({
      where: {
        id: commentId,
      },
    });

    if (!findcomment) {
      throw new NotFoundException('해당 댓글을 찾을 수 없습니다.');
    }

    if (findcomment[0].id !== commentId) {
      throw new Error('본인 댓글만 수정할 수 있습니다.');
    }

    return await this.commentRepository.update(
      { id: commentId },
      { content: content },
    );
  }

  async delete(commentId: number) {
    const findcomment = await this.commentRepository.find({
      where: {
        id: commentId,
      },
    });

    if (!findcomment) {
      throw new NotFoundException('해당 댓글을 찾을 수 없습니다.');
    }

    if (findcomment[0].id !== commentId) {
      throw new Error('본인 댓글만 삭제할 수 있습니다.');
    }

    await this.commentRepository.delete({ id: commentId });
  }
}
