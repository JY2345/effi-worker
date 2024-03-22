import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { BoardUser } from './entities/boardUser.entity';
import { ColumnEntity } from '../../src/column/entities/column.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { User } from 'src/user/entities/user.entity';

describe('BoardService', () => {
  let boardService: BoardService;
  let boardRepositoryMock: Partial<Record<keyof Repository<Board>, jest.Mock>>;
  let boardUserRepositoryMock: Partial<
    Record<keyof Repository<BoardUser>, jest.Mock>
  >;

  beforeEach(async () => {
    boardRepositoryMock = {
      save: jest.fn(),
    };

    boardUserRepositoryMock = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: 'BoardRepository',
          useValue: boardRepositoryMock,
        },
        {
          provide: 'BoardUserRepository',
          useValue: boardUserRepositoryMock,
        },
      ],
    }).compile();

    boardService = moduleRef.get<BoardService>(BoardService);
  });

  it('should create a new board', async () => {
    // Arrange
    const createBoardDto: CreateBoardDto = {
      name: 'Test Board',
      color: 'blue',
      info: 'This is a test board.',
    };

    const user: User = {
      id: 1,
      email: '',
      password: '',
      name: '',
      createdAt: undefined,
      updatedAt: undefined,
      boardUser: [],
      taskUser: [],
      comment: [],
      task: [],
      board: [],
    };

    const bigintNum = BigInt(1);
    const savedBoard: Board = {
      id: bigintNum,
      userId: user.id,
      ...createBoardDto,
      createdAt: undefined,
      columns: [],
      boardUser: [],
      user: new User(),
    };

    boardRepositoryMock.save.mockResolvedValue(savedBoard);

    // Act
    const createdBoard = await boardService.create(createBoardDto, user);

    // Assert
    expect(createdBoard).toEqual(savedBoard);
    expect(boardRepositoryMock.save).toHaveBeenCalledWith({
      userId: user.id,
      ...createBoardDto,
    });
    expect(boardUserRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    expect(boardUserRepositoryMock.insert).toHaveBeenCalledWith();
  });
});
