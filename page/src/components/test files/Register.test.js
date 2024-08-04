import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import Register, { REGISTER_USER } from '../Register';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mocks = [
  {
    request: {
      query: REGISTER_USER,
      variables: { username: 'testuser', email: 'test@example.com', password: 'password123' },
    },
    result: {
      data: {
        register: {
          id: '1',
          username: 'testuser',
        },
      },
    },
  },
];

describe('Register Component', () => {
  const renderRegister = () => {
    return render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </MockedProvider>
    );
  };

  it('renders the register form', () => {
    renderRegister();
    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument();
  });

  it('has the correct HTML id', () => {
    renderRegister();
    expect(document.getElementById('register-page')).toBeInTheDocument();
  });

  it('updates input fields correctly', () => {
    renderRegister();
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput).toHaveValue('testuser');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('submits the form and handles successful registration', async () => {
    renderRegister();
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign up' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('displays error message on registration failure', async () => {
    const errorMock = {
      request: {
        query: REGISTER_USER,
        variables: { username: 'testuser', email: 'test@example.com', password: 'password123' },
      },
      error: new Error('Registration failed'),
    };

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </MockedProvider>
    );

    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign up' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error: Registration failed')).toBeInTheDocument();
    });
  });

  it('disables the submit button while loading', async () => {
    renderRegister();
    const submitButton = screen.getByRole('button', { name: 'Sign up' });
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Signing up...');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Sign up');
    });
  });

  it('renders the login link', () => {
    renderRegister();
    const loginLink = screen.getByText('Log in');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});