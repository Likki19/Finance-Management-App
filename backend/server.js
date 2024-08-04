const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const typeDefs = require('./typeDefs'); // Adjust path to your schema
const resolvers = require('./resolvers'); // Adjust path to your resolvers

const app = express();

const ACCESS_SECRET_KEY = 'your-access-secret-key'; // Replace with your actual secret key
const REFRESH_SECRET_KEY = 'your-refresh-secret-key'; // Replace with your refresh secret key

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Create an instance of ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    let userId = null;

    if (token) {
      try {
        // Verify the access token and extract the user ID
        const decoded = jwt.verify(token.replace('Bearer ', ''), ACCESS_SECRET_KEY);
        userId = decoded.userId;
      } catch (err) {
        console.error('Token verification failed', err);
      }
    }

    return { userId };
  },
});

const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();
