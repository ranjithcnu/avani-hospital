// src/components/LoginPage.js

import React, { useState } from 'react';
import styles from '../styles/login.module.css'; // Ensure the path is correct
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import axios from 'axios'; // Ensure axios is installed (npm install axios)


const LoginPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [user, setUser] = useState(''); // State for user/email
  const [pass, setPass] = useState(''); // State for password
  const [error, setError] = useState(''); // State for handling error messages

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(''); // Reset error message

    try {
      const response = await axios.post('http://localhost:5000/login', { user, pass });

      if (response.data.success) {
        navigate('/home'); // Use navigate for redirection
      } else {
        setError(response.data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError(error.message || 'An error occurred. Please try again later.');
    }
  };

  return (
    <>
        <div className={styles.backgroundImage}></div> {/* Fullscreen background image */}

<div className={styles.loginContainer}>
  <div className={styles.loginForm}>
    <h2 className={styles.loginTitle}>AVANI HOSPITAL MANAGEMENT</h2>
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        className={styles.inputField}
        required/>
      <input
        type="password"
        placeholder="Password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        className={styles.inputField}
        required/>
       <button type="submit" style={{ backgroundColor: 'rgb(59, 45, 42)', color: 'white' }}>Sign In</button>
    </form>
    {error && <div className={styles.errorMessage}>{error}</div>}
  </div>
</div>
    
    </>

  );
}

export default LoginPage;