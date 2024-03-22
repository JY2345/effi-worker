import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MoveTaskDto {
  @IsNumber()
  @IsNotEmpty({ message: '새로운 컬럼 ID를 적어주세요.' })
  readonly newColumnId: number;

  @IsNumber()
  @IsNotEmpty({ message: '새로운 카드 순서를 적어주세요' })
  readonly newOrder: number;
}
