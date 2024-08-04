import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import client from '../apolloClient';
import './styles/LoginRegister.css';

export const LOGIN_USER = gql`
  mutation Login($identifier: String!, $password: String!) {
    login(identifier: $identifier, password: $password) {
      accessToken
      refreshToken
      username
      userId
    }
  }
`;

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ variables: { identifier, password } });
      if (data && data.login) {
        localStorage.setItem('token', data.login.accessToken);
        localStorage.setItem('refreshToken', data.login.refreshToken);
        localStorage.setItem('username', data.login.username);
        localStorage.setItem('userId', data.login.userId);
        await client.resetStore();
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err.message);
    }
  };

  return (
    <div className="login-container" id="login-page">
      <div className="login-card">
        <div className="login-image"></div>
        <div className="login-form">
          <h2>Welcome back!</h2>
          <p>Please enter your details</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="identifier">Email or Username</label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="form-control"
                placeholder="example@gmail.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
            {error && <p className="error-message">Error: {error.message}</p>}
          </form>
          <p className="register-link">
            Don't have an account? <a href="/register">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;