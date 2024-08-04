import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GET_DASHBOARD_DATA } from '../../graphql';
import Dashboard from '../Dashboard';

// Mock the Header and Savings components
jest.mock('./Header', () => ({ title }) => <div data-testid="header">{title}</div>);
jest.mock('./Savings', () => ({ userId }) => <div data-testid="savings">Savings for {userId}</div>);

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const mocks = [
  {
    request: {
      query: GET_DASHBOARD_DATA,
      variables: { userId: '123' },
    },
    result: {
      data: {
        user: {
          username: 'TestUser',
        },
      },
    },
  },
];

describe('Dashboard', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue('123');
  });

  it('renders loading state', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Dashboard />
      </MockedProvider>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    const errorMock = [
      {
        request: {
          query: GET_DASHBOARD_DATA,
          variables: { userId: '123' },
        },
        error: new Error('An error occurred'),
      },
    ];

    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <Dashboard />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Error: An error occurred')).toBeInTheDocument();
    });
  });

  it('renders dashboard content', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Dashboard />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('header')).toHaveTextContent('Dashboard');
      expect(screen.getByText('Welcome, TestUser')).toBeInTheDocument();
      expect(screen.getByTestId('savings')).toHaveTextContent('Savings for 123');
      expect(document.getElementById('main-dashboard')).toBeInTheDocument();
    });
  });

  it('renders default username when user data is not available', async () => {
    const noUserMock = [
      {
        request: {
          query: GET_DASHBOARD_DATA,
          variables: { userId: '123' },
        },
        result: {
          data: {},
        },
      },
    ];

    render(
      <MockedProvider mocks={noUserMock} addTypename={false}>
        <Dashboard />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Welcome, User')).toBeInTheDocument();
    });
  });
});