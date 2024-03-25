import React, { useState, useEffect } from 'react';
import { fetchBoards, createBoard, fetchNonColumnMembers,inviteUserToBoard } from './api';
import Columns from './Columns';
import Chat from './Chat';

function Board({ socket }) {
  const [boards, setBoards] = useState([]);
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [isInviting, setIsInviting] = useState(false);
  const [newBoard, setNewBoard] = useState({
    name: '',
    color: '',
    info: '',
  });
  const [usersNotInBoard, setUsersNotInBoard] = useState([]);

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

  // 보드 초대를 위한 사용자 조회
  const fetchUsersForInvite = async () => {
    if (!selectedBoardId) return;
    try {
      const users = await fetchNonColumnMembers(selectedBoardId);
      setUsersNotInBoard(users.users);
    } catch (error) {
      console.error('사용자 조회에 실패했습니다: ', error);
    }
  };
  // 초대 모달을 표시
  const handleInviteClick = () => {
    setIsInviting(true);
    fetchUsersForInvite();
  };

  useEffect(() => {
    if (selectedBoardId) {
      socket.emit('joinRoom', selectedBoardId);

      return () => {
        socket.emit('leaveRoom', selectedBoardId);
      };
    }
  }, [selectedBoardId, socket]);

  const handleAddBoardClick = () => {
    setIsAddingBoard(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBoard({ ...newBoard, [name]: value });
  };

  const handleBoardClick = (boardId) => {
    setSelectedBoardId(boardId);
  };

  const addBoard = () => {
    const newBoard = {
      board_id: boards.length + 1,
      board_name: `새 보드 ${boards.length + 1}`,
      board_color: '',
      board_info: '새로 추가된 보드입니다.',
      board_createdAt: new Date().toISOString(),
    };

    setBoards([...boards, newBoard]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBoard(newBoard);
      setIsAddingBoard(false);
      const boardsData = await fetchBoards();
      setBoards(boardsData);
      setNewBoard({
        name: '',
        color: '',
        info: '',
      });
    } catch (error) {
      console.error('보드 추가에 실패했습니다: ', error);
    }
  };

  const handleUserInviteClick = async (userId) => {
    const confirmInvite = window.confirm('해당 보드에 초대하시겠습니까?');
    if (confirmInvite) {
      try {
        await inviteUserToBoard(selectedBoardId, userId);
        alert('사용자가 성공적으로 초대되었습니다.');
      } catch (error) {
        alert('초대에 실패했습니다.');
      }
    }
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
          <button onClick={handleAddBoardClick} className="add-board-btn">
            보드 추가
          </button>
          <button onClick={handleInviteClick} className="invite-board-btn">
            보드 초대
          </button>
          {isInviting && (
          <div className="invite-modal">
            {usersNotInBoard.map((user) => (
              <div key={user.id} onClick={() => handleUserInviteClick(user.id)}>
                {user.name}
              </div>
            ))}
            <button onClick={() => setIsInviting(false)}>닫기</button>
          </div>
          )}
        </div>
        {isAddingBoard && (
          <form className="add-board-form" onSubmit={handleSubmit}>
            <input
              name="name"
              value={newBoard.name}
              onChange={handleChange}
              placeholder="보드 이름"
            />
            <input
              name="color"
              value={newBoard.color}
              onChange={handleChange}
              placeholder="보드 색상"
            />
            <input
              name="info"
              value={newBoard.info}
              onChange={handleChange}
              placeholder="보드 정보"
            />
            <button type="submit">보드 생성</button>
          </form>
        )}
      </div>

      <div className="column_wrapper">
        {selectedBoardId && (
          <Columns socket={socket} boardId={selectedBoardId} />
        )}

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
