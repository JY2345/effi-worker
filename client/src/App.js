import React, { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // NestJS 서버 주소

function App() {
  useEffect(() => {
    socket.on('receiveNotification', (data) => {
      alert(`Received notification: ${data.message}`);
    });
  }, []);

  return (
    <div className="App">
      <h1>Notification Test</h1>
    </div>
  );
}

export default App;
