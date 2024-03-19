import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateColumnOrderDto {
  /**
   * 컬럼 이름
   * @example "To-Do"
   */
  @IsString()
  @IsNotEmpty({ message: '컬럼 순서를 받아오지 못했습니다.' })
  columnOrder: string;
}
