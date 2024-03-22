import React, { useState, useEffect } from 'react';
import { fetchBoards } from './api';
import Columns from './Columns';
import Chat from './Chat';

function Board({ socket }) {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  useEffect(() => {
    const initFetchBoards = async () => {
      try {
        const boardsData = await fetchBoards();
        setBoards(boardsData);
      } catch (error) {
        console.error('보드를 불러오는 데 실패했습니다: ', error);
      }
    };

    initFetchBoards();
  }, []);

  useEffect(() => {
    if (selectedBoardId) {
      socket.emit('joinRoom', selectedBoardId);

      return () => {
        socket.emit('leaveRoom', selectedBoardId);
      };
    }
  }, [selectedBoardId, socket]);

  const handleBoardClick = (boardId) => {
    setSelectedBoardId(boardId);
  };

  const addBoard = () => {
    const newBoard = {
      id: boards.length + 1,
      name: `새 보드 ${boards.length + 1}`,
      color: '#cccccc',
      info: '새로 추가된 보드입니다.',
      createdAt: new Date().toISOString(),
    };

    setBoards([...boards, newBoard]);
  };

  return (
    <div className="data_wrapper">
      <div className="board_wrapper">
        <div className="board">
          <h1>보드 리스트</h1>
          {boards.map((board) => (
            <div
              key={board.id}
              className="list"
              onClick={() => handleBoardClick(board.id)}
            >
              <div className="list-title">{board.name}</div>
            </div>
          ))}

          <button onClick={addBoard} className="add-board-btn">
            보드 추가
          </button>
          <button onClick={addBoard} className="add-board-btn">
            보드 초대
          </button>
        </div>
      </div>

      <div className="column_wrapper">
        {selectedBoardId && <Columns boardId={selectedBoardId} />}
        <div className="chat_wrapper">
          {selectedBoardId && (
            <Chat boardId={selectedBoardId} socket={socket} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Board;
