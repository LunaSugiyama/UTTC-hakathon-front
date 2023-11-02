import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from "./components/Home";
import ItemDetails from "./components/ItemDetails";

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate(); // Get the navigate function

  const login = () => {
    axios.post('http://localhost:8000/users/login', { username, password })
      .then((response) => {
        if (response.data && response.data.token) {
          setToken(response.data.token);
          setMessage('Login successful');
          navigate('/home'); // Use navigate to redirect to the Home page
        } else {
          setMessage('Login failed: Invalid response data');
        }
      })
      .catch((error) => {
        setMessage('Login failed: ' + (error.response?.data?.error || 'Unknown error'));
      });
  }

  const register = () => {
    axios.post('http://localhost:8000/users/register', { username, password })
      .then((response) => {
        setMessage('Registration successful');
      })
      .catch((error) => {
        setMessage('Registration failed: ' + (error.response?.data?.error || 'Unknown error'));
      });
  }

  return (
    <div>
      <h1>User Authentication</h1>
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
      <button onClick={login}>Login</button>
      <button onClick={register}>Register</button>
      {message && <p>{message}</p>}
      {token && <p>Token: {token}</p>}
    </div>
  );
}

export{ App};

// Ensure that the Router component wraps your entire application
function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/item/:category/:id" element={<ItemDetails />} />
        <Route path="/" element={<App />} />
      </ Routes>
    </ Router>
  );
}

export default Main;
