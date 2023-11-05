// LoginForm.tsx
import React, { useState } from 'react';
import { fireAuth } from './firebase';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // const auth = getAuth();
      await signInWithEmailAndPassword(fireAuth, email, password);
      alert('ログインに成功しました');
    } catch (error) {
      if (error instanceof Error) {
        alert(`ログインエラー: ${error.message}`);
      } else {
        console.log('Unexpected error', error);
      }
    }
  };

  return (
    <div>
      <h2>ログイン</h2>
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>ログイン</button>
    </div>
  );
};

export default LoginForm;
