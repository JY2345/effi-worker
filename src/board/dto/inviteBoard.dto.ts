import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardDto } from './create-board.dto';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class InviteBoardDto {
  @IsNumberString()
  @IsNotEmpty({ message: '초대 인원을 적어주세요' })
  inviteId: number[];
}
