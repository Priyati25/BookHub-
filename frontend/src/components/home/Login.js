import React, { useState } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookApi } from '../misc/BookApi';
import { handleLogError } from '../misc/Helpers';
import '../../styles/Login.css';
import { FaUser, FaLock } from 'react-icons/fa'; // Import icons

function Login() {
  const Auth = useAuth();
  const isLoggedIn = Auth.userIsAuthenticated();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(username && password)) {
      setIsError(true);
      return;
    }

    try {
      const response = await bookApi.authenticate(username, password);
      const { id, name, role } = response.data;
      const authdata = window.btoa(username + ':' + password);
      const authenticatedUser = { id, name, role, authdata };

      Auth.userLogin(authenticatedUser);

      setUsername('');
      setPassword('');
      setIsError(false);
    } catch (error) {
      handleLogError(error);
      setIsError(true);
    }
  };

  if (isLoggedIn) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        
        <div className="input-container">
          <FaUser className="input-icon" />
          <input
            className="login-input"
            autoFocus
            name="username"
            placeholder="Username"
            value={username}
            onChange={handleInputChange}
          />
        </div>

        <div className="input-container">
          <FaLock className="input-icon" />
          <input
            className="login-input"
            name="password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={handleInputChange}
          />
        </div>

        <button className="login-button" type="submit">Login</button>
      </form>

      <p className="signup-link">
        Don't have an account? <NavLink to="/signup">Sign Up</NavLink>
      </p>

      {isError && <p className="error-message">The username or password provided are incorrect!</p>}
    </div>
  );
}

export default Login;
