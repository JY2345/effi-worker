import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userRepositoryMock: Partial<Record<keyof Repository<User>, jest.Mock>>;

  beforeEach(async () => {
    userRepositoryMock = {
      delete: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      findOne: jest.fn(),
    };

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

  // it('유저 생성 성공', async () => {
  //   const createUserDto = {
  //     email: 'newuser@example.com',
  //     password: '123456',
  //     name: 'newuser',
  //   };
  //   // 사용자가 없어야 회원가입이 되니까
  //   userRepositoryMock.findOneBy.mockResolvedValue(undefined);

  //   const createUser = await authj.createUser(createUserDto);
  //   const user = userRepositoryMock.save.mockResolvedValue(createUser);

  //   expect(userRepositoryMock.create).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       email: createUserDto.email,
  //       password: expect.any(String),
  //       name: createUserDto.name,
  //     }),
  //   );
  //   expect(userRepositoryMock.save).toBe(user);
  //   expect(userRepositoryMock.create).toHaveBeenCalledTimes(1);
  //   expect(userRepositoryMock.save).toHaveBeenCalledTimes(1);
  // });

  // it('유저 생성 실패 -> 이메일 중복', async () => {
  //   const createUserDto = {
  //     email: 'newuser@example.com',
  //     password: 'exdoafaoslgn.asdofhslkdsg.asodlsvb',
  //     name: 'newuser',
  //   };

  //   userRepositoryMock.findOneBy.mockResolvedValue(true);
  //   // createUser 메소드가 BadRequestException을 발생시켰는지 확인
  //   expect(userService.createUser(createUserDto)).rejects.toThrow(
  //     new BadRequestException('이미 존재하는 email입니다.'),
  //   );

  //   // findOneBy 메소드가 email을 찾았는지 => 중복이여햐하니까
  //   expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
  //     email: createUserDto.email,
  //   });
  //   // err가 났으니 호출이 되면 안 됨.
  //   expect(userRepositoryMock.create).toHaveBeenCalledTimes(0);
  //   expect(userRepositoryMock.save).toHaveBeenCalledTimes(0);
  // });
  it('이메일로 유저 찾기', async () => {
    const mockUser = {
      id: 2,
      email: 'user@test.com',
      password: '$2b$10$RnZR24e2SjOlTacfrTjTqO76RG333SGbtF.EI.dwykqBxD.Nyvb4C',
      name: '1234',
      createdAt: '2024-03-20T23:30:59.524Z',
      updatedAt: '2024-03-20T23:30:59.524Z',
    };
    // Mock의 findOneBy가 호출 => mockUser를 반환
    userRepositoryMock.findOne.mockReturnValue(mockUser);

    // 실제 함수를 호출합니다.
    const result = await userService.findByEmail(mockUser.email);

    // 실제 findByEmail 함수와 일치하는 지
    expect(result).toEqual(mockUser);

    expect(userRepositoryMock.findOne).toHaveBeenCalledTimes(1);

    // Mock의 findOneBy 함수가 정확한 인자와 함께 호출됐는지
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: {
        email: 'user@test.com',
      },
    });
  });

  it('유저 업데이트 성공', async () => {
    const id = 1;
    const updateUserDto = {
      name: 'user',
      password: 'testPassword',
      newPassword: 'newTestPassword',
    };
  });
});
