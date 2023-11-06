import React, { useState } from 'react';
import { fireAuth } from './firebase';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged } from "firebase/auth";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [firebase_uid, sestFirebaseUID] = useState<string | null>(null);
  const navigate = useNavigate();

  // Listen for authentication state changes to get the firebase_uid
  onAuthStateChanged(fireAuth, (user) => {
    if (user) {
      sestFirebaseUID(user.uid);
    } else {
      sestFirebaseUID(null);
    }
  });

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(fireAuth, email, password);

      // Ensure the firebase_uid is set before making the POST request
      if (!firebase_uid) {
        alert('ユーザーfirebase_uidが取得できませんでした');
        return;
      }

      const userData = {
        email,
        name,
        age,
        firebase_uid, // Include the firebase_uid in the user data
      };

      const response = await axios.post('http://localhost:8000/users/register', userData);
      if (response.status === 200 || response.status === 201) {
        console.log('ユーザー作成成功');
        navigate('/login')
      } else {
        alert(`ユーザー作成失敗: ${response.data.error}`);
      }
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
      <input
        type="text"
        placeholder="名前"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="年齢"
        value={age != null ? age : ''}
        onChange={(e) => setAge(Number(e.target.value))}
      />
      <button onClick={handleSignup}>新規作成</button>
    </div>
  );
};

export default SignupForm;
