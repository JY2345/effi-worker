import { IsNotEmpty, IsString } from 'class-validator';

export class CommentDto {
  @IsString()
  @IsNotEmpty({ message: '댓글을 작성해 주세요' })
  content: string;
}
