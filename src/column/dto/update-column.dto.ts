import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateColumnDto {
  /**
   * 컬럼 이름
   * @example "To-Do"
   */
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
