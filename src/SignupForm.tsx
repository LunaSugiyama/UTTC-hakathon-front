import React, { useState } from 'react';
import { fireAuth } from './firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      // const auth = getAuth();
      await createUserWithEmailAndPassword(fireAuth, email, password);
      alert('新しいユーザーアカウントが作成されました');
    } catch (error) {
      if (error instanceof Error) {
        alert(`ユーザー作成エラー: ${error.message}`);
      } else {
        console.log('Unexpected error', error);
      }
    }
  };

  return (
    <div>
      <h2>新規ユーザー作成</h2>
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
      <button onClick={handleSignup}>新規作成</button>
    </div>
  );
};

export default SignupForm;
