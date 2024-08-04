import { gql } from '@apollo/client';

// Query to get dashboard data
export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($userId: ID!) {
    totalBalance(userId: $userId)
    totalIncome(userId: $userId)
    totalExpenses(userId: $userId)
    incomes(userId: $userId) {
      id
      description
      amount
      date
    }
    expenses(userId: $userId) {
      id
      description
      amount
      date
    }
      user(id: $userId) {  # Add this part
      username
    }
  }
`;
export const REGISTER_USER = gql`
mutation Register($username: String!, $email: String!, $password: String!) {
  register(username: $username, email: $email, password: $password) {
    id
    username
    email
  }
}
`;
export const GET_TRANSACTION_BY_ID = gql`
query GetTransactionById($id: ID!) {
  transaction(id: $id) {
    id
    description
    amount
    type
    date
  }
}
`; 

// Query to get all transactions (general)
export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
      id
      amount
      date
      description
      category
    }
  }
`;
// Query to get transactions by date range
export const GET_TRANSACTIONS_BY_DATE = gql`
  query GetTransactionsByDate($userId: ID!, $startDate: String!, $endDate: String!) {
    transactionsByDate(userId: $userId, startDate: $startDate, endDate: $endDate) {
      id
      description
      amount
      type
      date
    }
  }
`;

// Mutation to add a new transaction
export const ADD_TRANSACTION = gql`
  mutation AddTransaction($userId: ID!, $description: String!, $amount: Float!, $type: String!, $date: String) {
    addTransaction(userId: $userId, description: $description, amount: $amount, type: $type, date: $date) {
      id
      description
      amount
      type
      date
    }
  }
`;

// Mutation to edit an existing transaction
export const EDIT_TRANSACTION = gql`
  mutation EditTransaction($userId: ID!, $id: ID!, $description: String!, $amount: Float!, $type: String!, $date: String) {
    editTransaction(userId: $userId, id: $id, description: $description, amount: $amount, type: $type, date: $date) {
      id
      description
      amount
      type
      date
    }
  }
`;

// Mutation to delete a transaction
export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($userId: ID!, $id: ID!) {
    deleteTransaction(userId: $userId, id: $id)
  }
`;

// Mutation to refresh the access token
export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
      username
      userId
    }
  }
`;
