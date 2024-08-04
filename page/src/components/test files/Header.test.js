import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock window.confirm
const mockConfirm = jest.fn();
window.confirm = mockConfirm;

describe('Header', () => {
  const renderHeader = (props = {}) => {
    return render(
      <BrowserRouter>
        <Header {...props} />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header with correct title', () => {
    renderHeader({ title: 'Test Title' });
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    renderHeader();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Income')).toBeInTheDocument();
    expect(screen.getByText('Expenses')).toBeInTheDocument();
    expect(screen.getByText('Add Transaction')).toBeInTheDocument();
  });

  it('renders logout button', () => {
    renderHeader();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('has the correct HTML id', () => {
    renderHeader();
    expect(document.getElementById('main-header')).toBeInTheDocument();
  });

  it('calls handleLogout when logout button is clicked and confirmed', () => {
    renderHeader();
    mockConfirm.mockReturnValue(true);
    
    fireEvent.click(screen.getByText('Logout'));
    
    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to logout?');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('does not logout when logout is not confirmed', () => {
    renderHeader();
    mockConfirm.mockReturnValue(false);
    
    fireEvent.click(screen.getByText('Logout'));
    
    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to logout?');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('removes token and userId from localStorage on logout', () => {
    renderHeader();
    mockConfirm.mockReturnValue(true);
    
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('userId', 'test-user-id');
    
    fireEvent.click(screen.getByText('Logout'));
    
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('userId')).toBeNull();
  });
});