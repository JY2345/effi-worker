import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from 'bcrypt';
import { DeleteUserDto } from './dto/delete-user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { name, password, newPassword } = updateUserDto;
    // 1)유저 찾기
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    // 2)비밀번호 비교
    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck)
      throw new BadRequestException('비밀번호가 일치하지 않습니다');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.name = name;
    user.password = hashedPassword;

    // 3)데이터수정
    await this.userRepository.update(
      { id },
      { name, password: hashedPassword },
    );
    await this.userRepository.save(user);
  }

  async deleteUser(id: number, deleteUserDto: DeleteUserDto) {
    const { password } = deleteUserDto;
    // 1) user 찾기
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    // 2)비밀번호 비교
    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');

    await this.userRepository.delete({ id });
  }
  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }
}
