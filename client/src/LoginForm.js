import React, { useState } from 'react';
import { handleLogin } from './api';

function LoginForm({ onLoginSuccess, onLoginFailure }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password, onLoginSuccess, onLoginFailure);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email :</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password :</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">로그인</button>
    </form>
  );
}

export default LoginForm;
