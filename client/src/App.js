import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';
import Board from './Board';
import { getMyId } from './api';
import LoginForm from './LoginForm';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
function App() {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState({
    message: '',
    show: false,
  });

  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    const fetchUserData = async () => {
      const storedUserData = localStorage.getItem('user');
      if (storedUserData) {
        setUser(JSON.parse(storedUserData));
        try {
          const userId = await getMyId();
          // 웹소켓 연결 URL에 사용자 ID 쿼리 파라미터 추가
          const socketUrl = userId
            ? `${API_BASE_URL}?userId=${userId}`
            : `${API_BASE_URL}`;
          const socket = io(socketUrl);
          setSocket(socket);
        } catch (error) {
          console.error('사용자 ID를 가져오는 데 실패했습니다:', error);
        }
      }
    };
    fetchUserData();

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
        console.log('Card moved:', data.message);
        //alert(data.message);
        setNotification({ message: data.message, show: true });
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

  const Notification = ({ message, onClose }) => {
    return (
      <div className="notification">
        {message}
        <button onClick={onClose}>닫기</button>
      </div>
    );
  };

  return (
    <div className="App">
      {notification.show && (
        <Notification
          message={notification.message}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}
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
