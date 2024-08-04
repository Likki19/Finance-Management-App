const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
  }

  type Transaction {
    id: ID!
    description: String!
    amount: Float!
    type: String!
    userId: ID!
    date: String
  }

  type Query {
    user(id: ID!): User
    hello: String
    totalBalance(userId: ID!): Float
    totalIncome(userId: ID!): Float
    totalExpenses(userId: ID!): Float
    incomes(userId: ID!): [Transaction]
    expenses(userId: ID!): [Transaction]
    transaction(id: ID!): Transaction
    transactionsByDate(userId: ID!, startDate: String!, endDate: String!): [Transaction]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): User
    login(identifier: String!, password: String!): AuthPayload
    refreshToken(refreshToken: String!): AuthPayload
    addTransaction(userId: ID!, description: String!, amount: Float!, type: String!, date: String): Transaction
    editTransaction(userId: ID!, id: ID!, description: String!, amount: Float!, type: String!, date: String): Transaction
    deleteTransaction(userId: ID!, id: ID!): Boolean
  }

  type AuthPayload {
    accessToken: String!
    refreshToken: String!
    username: String!
    userId: ID!
  }
`;

module.exports = typeDefs;
