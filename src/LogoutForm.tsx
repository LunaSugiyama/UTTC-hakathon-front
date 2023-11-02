import React from 'react';
import { fireAuth } from './firebase';
import { signOut } from 'firebase/auth';

const LogoutForm: React.FC = () => {
  const handleLogout = async () => {
    try {
      await signOut(fireAuth);
      alert('ログアウトしました');
    } catch (error) {
      if (error instanceof Error) {
        alert(`ログアウトエラー: ${error.message}`);
      } else {
        console.log('Unexpected error', error);
      }
    }
  };

  return (
    <button onClick={handleLogout}>ログアウト</button>
  );
};

export default LogoutForm;
