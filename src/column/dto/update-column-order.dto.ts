import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateColumnOrderDto {
  /**
   * 컬럼 이름
   * @example "To-Do"
   */
  @IsString()
  @IsNotEmpty()
  columnOrder: string;
}
