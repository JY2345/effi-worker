import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserInfo } from './utils/userInfo.decorator';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete(':id')
  async deleteUser(
    @Param('id') id: number,
    @Body() deleteUserDto: DeleteUserDto,
  ) {
    await this.userService.deleteUser(id, deleteUserDto);
    return;
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserdto: UpdateUserDto,
  ) {
    await this.userService.updateUser(id, updateUserdto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async getEmail(@UserInfo() user: User) {
    return await this.userService.findByEmail(user.email);
  }
}
