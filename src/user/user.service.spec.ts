import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userRepositoryMock: Partial<Record<keyof Repository<User>, jest.Mock>>;
  let bcryptMock: any;

  beforeEach(async () => {
    userRepositoryMock = {
      delete: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    };

    bcryptMock = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    // bcryptMock.compare.mockResolvedValue(true);
    // bcryptMock.hash.mockResolvedValue('hashedNewPassword');

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
  });

  it('이메일로 유저 찾기', async () => {
    const mockUser = {
      id: 2,
      email: 'user@test.com',
      password: 'hashPassword',
      name: 'name',
    };
    // Mock의 findOne가 호출 => mockUser를 반환
    userRepositoryMock.findOne.mockResolvedValue(mockUser);

    // 실제 함수를 호출
    const result = await userService.findByEmail('user@test.com');

    // 실제 findByEmail 함수와 일치하는 지
    expect(result).toEqual(mockUser);

    expect(userRepositoryMock.findOne).toHaveBeenCalledTimes(1);

    // Mock의 findOne 함수가 정확한 인자와 함께 호출됐는지
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { email: 'user@test.com' },
    });
  });

  it('유저 업데이트 성공', async () => {
    const id = 72;
    const updateUserDto = {
      name: 'user',
      password: 'password',
      newPassword: 'newPassword',
    };
    const mockUser = {
      id: 72,
      email: 'user@test.com',
      password: expect.any(String),
      name: 'name',
    };

    userRepositoryMock.findOneBy.mockResolvedValue(mockUser);

    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));

    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(() => Promise.resolve(expect.any(String)));

    await userService.updateUser(id, updateUserDto);

    expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({ id });

    expect(jest.spyOn(bcrypt, 'compare')).toHaveBeenCalledWith(
      updateUserDto.password,
      mockUser.password,
    );
    expect(jest.spyOn(bcrypt, 'hash')).toHaveBeenCalledWith(
      updateUserDto.newPassword,
      10,
    );
    expect(userRepositoryMock.update).toHaveBeenCalledWith(
      { id },
      { name: updateUserDto.name, password: 'hashedNewPassword' },
    );
    expect(userRepositoryMock.save).toHaveBeenCalled();
  });

  it('유저 업데이트 실패 -> 유저가 존재하지 않음', async () => {
    const id = 72;
    const updateUserDto = {
      name: 'user',
      password: 'password',
      newPassword: 'newPassword',
    };
    userRepositoryMock.findOneBy.mockResolvedValue(undefined);

    await expect(userService.updateUser(id, updateUserDto)).rejects.toThrow(
      new NotFoundException('사용자를 찾을 수 없습니다.'),
    );
  });
  it('유저 업데이트 실패 -> 비밀번호 일치하지 않음', async () => {
    const id = 72;
    const updateUserDto = {
      name: 'user',
      password: 'password',
      newPassword: 'newPassword',
    };
    userRepositoryMock.findOneBy.mockResolvedValue(true);
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(false));

    expect(userService.updateUser(id, updateUserDto)).rejects.toThrow(
      new UnauthorizedException('비밀번호가 일치하지 않습니다'),
    );
  });
  it('유저 삭제 성공 ', async () => {
    const id = 72;
    const deleteUserDto = { password: 'password' };
    const mockUser = {
      id: 72,
      email: 'user@test.com',
      password: expect.any(String),
      name: 'name',
    };
    userRepositoryMock.findOneBy.mockResolvedValue(mockUser);

    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));

    await userService.deleteUser(id, deleteUserDto);
    expect(userRepositoryMock.delete({ id }));
  });
});
