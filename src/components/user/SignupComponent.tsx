import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface SignupProps {}

const SignupComponent: React.FC<SignupProps> = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const register = () => {
    axios.post('http://localhost:8000/users/register', { username, password })
      .then((response) => {
        setMessage('Registration successful');
        navigate('/login'); // Redirect to the login page after successful registration
      })
      .catch((error) => {
        setMessage('Registration failed: ' + (error.response?.data?.error || 'Unknown error'));
      });
  }

  return (
    <div>
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={register}>Register</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SignupComponent;
