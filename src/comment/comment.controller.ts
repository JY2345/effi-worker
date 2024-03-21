import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/:taskId')
  async getComments(@Param('taskId') taskId: number) {
    return await this.commentService.findAll(taskId);
  }

  @Post('/:taskId')
  async createComment(
    @Param('taskId') taskId: number,
    @Body() commentDto: CommentDto,
  ) {
    const comment = await this.commentService.create(taskId, commentDto);

    if (comment) {
      return { message: '댓글 생성 완료', comment };
    }
  }

  @Patch('/:commentId')
  async updateComment(
    @Param('commentId') commentId: number,
    @Body() commentDto: CommentDto,
  ) {
    const comment = await this.commentService.update(commentId, commentDto);

    return { message: '댓글 수정 완료', comment };
  }

  @Delete('/:commentId')
  async deleteComment(@Param('commentId') commentId: number) {
    await this.commentService.delete(commentId);

    return { message: '댓글 삭제 완료' };
  }
}
