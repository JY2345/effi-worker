import {
  ArrayNotEmpty,
  IsNumber,
} from 'class-validator';

export class AddWorkerTaskDto {
  @ArrayNotEmpty({ message: '작업 인원이 있어야 합니다.' })
  @IsNumber({}, { each: true, message: '담당자 ID를 숫자 형식으로 입력하세요.' })
  workerId: number[];
}
