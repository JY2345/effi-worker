import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateTaskOrderDto {
  /**
   * 카드(Task) 이름
   * @example "To-Do"
   */
  @IsString()
  @IsNotEmpty({ message: '카드 순서를 받아오지 못했습니다.' })
  taskOrder: string;
}
