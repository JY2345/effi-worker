import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { BoardUser } from './entities/boardUser.entity';
import { ColumnEntity } from '../../src/column/entities/column.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let boardService: BoardService;
  let boardRepositoryMock: Partial<Record<keyof Repository<Board>, jest.Mock>>;
  let boardUserRepositoryMock: Partial<
    Record<keyof Repository<BoardUser>, jest.Mock>
  >;
  let columnRepositoryMock: Partial<
    Record<keyof Repository<ColumnEntity>, jest.Mock>
  >;

  beforeEach(async () => {
    boardRepositoryMock = {
      save: jest.fn(),
    };

    boardUserRepositoryMock = {
      // Define mock methods for BoardUser repository if needed
    };

    columnRepositoryMock = {
      // Define mock methods for ColumnEntity repository if needed
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: getRepositoryToken(Board),
          useValue: boardRepositoryMock,
        },
        {
          provide: getRepositoryToken(BoardUser),
          useValue: boardUserRepositoryMock,
        },
        {
          provide: getRepositoryToken(ColumnEntity),
          useValue: columnRepositoryMock,
        },
      ],
    }).compile();

    boardService = moduleRef.get<BoardService>(BoardService);
  });

  it('유저 생성 테스트', async () => {
    // Test logic goes here
  });
});
