import React, { useState, useEffect } from 'react';

function Chat({ boardId, socket }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('message', (receivedMessage) => {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    });

    return () => {
      socket.off('message');
    };
  }, [socket, boardId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit('sendChatMessage', { boardId, message });
      setMessage('');
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지 입력..."
        />
        <button type="submit">보내기</button>
      </form>
    </div>
  );
}

export default Chat;
