import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CommentDto } from './dto/comment.dto';
import AWS from 'aws-sdk';

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

  async create(taskId: number, commentDto: CommentDto, userId: number) {
    const comment = await this.commentRepository.save({
      taskId: taskId,
      content: commentDto.content,
      userId: userId,
    });
    return comment;
  }
  async createWithFile(
    taskId: number,
    commentDto: CommentDto,
    userId: number,
    fileKey: string,
  ) {
    const comment = await this.commentRepository.save({
      taskId: taskId,
      content: commentDto.content,
      userId: userId,
      fileKey: fileKey,
    });
    return comment;
  }

  async update(commentId: number, commentDto: CommentDto, userId: number) {
    const findcomment = await this.commentRepository.find({
      where: {
        id: commentId,
      },
    });

    if (!findcomment) {
      throw new NotFoundException('해당 댓글을 찾을 수 없습니다.');
    }

    if (findcomment[0].id !== userId) {
      throw new Error('본인 댓글만 수정할 수 있습니다.');
    }

    return await this.commentRepository.update(
      { id: commentId },
      { content: commentDto.content },
    );
  }

  async delete(commentId: number, userId: number) {
    const findcomment = await this.commentRepository.find({
      where: {
        id: commentId,
      },
    });

    if (!findcomment) {
      throw new NotFoundException('해당 댓글을 찾을 수 없습니다.');
    }

    if (findcomment[0].userId !== userId) {
      throw new Error('본인 댓글만 삭제할 수 있습니다.');
    }

    if (findcomment[0].fileKey) {
      const s3 = new AWS.S3({
        accessKeyId: process.env.S3_ACCESSKEY,
        secretAccessKey: process.env.S3_SECRETKEY,
      });

      const deleteParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: findcomment[0].fileKey,
      };

      await s3.deleteObject(deleteParams).promise();
    }

    await this.commentRepository.delete({ id: commentId });
  }
}
