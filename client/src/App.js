import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';
import Board from './Board';
import LoginForm from './LoginForm';

function App() {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null); // 소켓 상태를 저장하는 state 추가

  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }

    const socket = io('http://localhost:3000');
    setSocket(socket);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('receiveNotification', (data) => {
        alert(`전송을 받았어요~ : ${data.message}`);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      const handleCardMovedNotification = (data) => {
        console.log("Card moved:", data.message);
        alert(data.message);
      };
    
      socket.on('cardMovedNotification', handleCardMovedNotification);
    
      return () => {
        socket.off('cardMovedNotification', handleCardMovedNotification);
      };
    }
  }, [socket]);

  const handleLogout = () => {
    localStorage.removeItem('authorized');
    localStorage.removeItem('user');
    setUser(null);
    console.log('로그아웃 되었습니다.');
  };

  const handleLoginSuccess = (userData) => {
    const authorizedData = userData.data;
    if (authorizedData) {
      const accessToken = authorizedData.accessToken;
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(authorizedData));
        setUser(authorizedData);
        console.log('로그인 성공');
      } else {
        console.error('토큰 값을 찾을 수 없습니다.');
      }
    } else {
      console.error('authorized 데이터가 없습니다.');
    }
  };

  const handleLoginFailure = (message) => {
    alert(message);
  };

  return (
    <div className="App">
      {user ? (
        <>
          {/* Board 컴포넌트에 소켓 전달 */}
          <Board socket={socket} />
          <button onClick={handleLogout} className="logout-button">
            로그아웃
          </button>
        </>
      ) : (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onLoginFailure={handleLoginFailure}
        />
      )}
    </div>
  );
}

export default App;
