import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import './styles/LoginRegister.css';

export const REGISTER_USER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      id
      username
    }
  }
`;

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerUser, { loading, error }] = useMutation(REGISTER_USER);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await registerUser({ variables: { username, email, password } });
      console.log('Registration successful:', data);
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err.message);
    }
  };

  return (
    <div className="login-container" id="register-page">
      <div className="login-card">
        <div className="login-image">
        </div>
        <div className="login-form">
          <h2>Create an account</h2>
          <p>Please enter your details to sign up</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="form-control"
                placeholder="Enter your username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
                placeholder="Enter your email"
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
                placeholder="Create a password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
            {error && <p className="error-message">Error: {error.message}</p>}
          </form>
          <p className="login-link">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;