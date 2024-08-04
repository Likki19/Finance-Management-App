import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import Login, { LOGIN_USER } from '../Login';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the Apollo Client
jest.mock('../apolloClient', () => ({
  resetStore: jest.fn(),
}));

const mocks = [
  {
    request: {
      query: LOGIN_USER,
      variables: { identifier: 'testuser', password: 'password123' },
    },
    result: {
      data: {
        login: {
          accessToken: 'fake-access-token',
          refreshToken: 'fake-refresh-token',
          username: 'testuser',
          userId: '123',
        },
      },
    },
  },
];

describe('Login Component', () => {
  const renderLogin = () => {
    return render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </MockedProvider>
    );
  };

  it('renders the login form', () => {
    renderLogin();
    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    expect(screen.getByLabelText('Email or Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
  });

  it('has the correct HTML id', () => {
    renderLogin();
    expect(document.getElementById('login-page')).toBeInTheDocument();
  });

  it('updates input fields correctly', () => {
    renderLogin();
    const identifierInput = screen.getByLabelText('Email or Username');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(identifierInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(identifierInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });

  it('submits the form and handles successful login', async () => {
    renderLogin();
    const identifierInput = screen.getByLabelText('Email or Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Log in' });

    fireEvent.change(identifierInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-access-token');
      expect(localStorage.getItem('refreshToken')).toBe('fake-refresh-token');
      expect(localStorage.getItem('username')).toBe('testuser');
      expect(localStorage.getItem('userId')).toBe('123');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error message on login failure', async () => {
    const errorMock = {
      request: {
        query: LOGIN_USER,
        variables: { identifier: 'wronguser', password: 'wrongpass' },
      },
      error: new Error('Invalid credentials'),
    };

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </MockedProvider>
    );

    const identifierInput = screen.getByLabelText('Email or Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Log in' });

    fireEvent.change(identifierInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error: Invalid credentials')).toBeInTheDocument();
    });
  });

  it('disables the submit button while loading', async () => {
    renderLogin();
    const submitButton = screen.getByRole('button', { name: 'Log in' });

    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Logging in...');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Log in');
    });
  });

  it('renders the register link', () => {
    renderLogin();
    const registerLink = screen.getByText('Sign Up');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.getAttribute('href')).toBe('/register');
  });
});