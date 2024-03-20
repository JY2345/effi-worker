import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateColumnDto {
  /**
   * 보드 id
   * @example 1
   */
  @IsNumber({}, { message: '보드 지정이 잘못되었습니다.' })
  @IsNotEmpty({ message: '보드가 지정되지 않았습니다.' })
  boardId: number;

  /**
   * 컬럼명
   * @example "To-Do"
   */
  @IsString()
  @IsNotEmpty({ message: '컬럼명을 입력하세요.' })
  name: string;
}
