import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let userService: UserService;
  let userRepositoryMock: Partial<Record<keyof Repository<User>, jest.Mock>>;

  beforeEach(async () => {
    userRepositoryMock = {
      delete: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      exists: jest.fn(),
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

  it('should create a new user', async () => {
    const createUserDto = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
    };

    userRepositoryMock.exists.mockResolvedValue(false);
    userRepositoryMock.save.mockResolvedValue(createUserDto);

    const newUser = await userService.createUser(createUserDto);

    expect(newUser).toEqual(createUserDto);
  });
});
