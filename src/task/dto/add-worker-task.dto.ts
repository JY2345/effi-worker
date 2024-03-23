import {
  IsNumber,
} from 'class-validator';

export class AddWorkerTaskDto {

  @IsNumber({}, { each: true, message: '담당자 ID를 숫자 형식으로 입력하세요.' })
  workerId: number;
  @IsNumber({}, { each: true, message: '카드 ID를 숫자 형식으로 입력하세요.' })
  taskId: number;
}
