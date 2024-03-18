import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty({ message: '칸반보드의 이름을 적어주세요' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '배경색을 정해주세요' })
  color: string;

  @IsString()
  @IsNotEmpty({ message: '설명을 적어주세요' })
  info: string;
}
