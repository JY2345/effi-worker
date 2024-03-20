import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardDto } from './create-board.dto';
import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
} from 'class-validator';

export class InviteBoardDto {
  @ArrayNotEmpty({ message: '초대 인원을 적어주세요' })
  @IsNumber({}, { each: true, message: '초대할 회원을 적어주세요' }) // { each: true } : 배열의 각 요소에 대해 개별적으로 유효성 검사를 수행하도록 지시
  inviteId: number[];
}
