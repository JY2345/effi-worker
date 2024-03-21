import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { IsEmpty, IsString } from 'class-validator';

export class UpdateUserDto extends PickType(User, ['name', 'password']) {
  @IsString()
  newPassword: string;
}
