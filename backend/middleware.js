const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const typeDefs = require('./typeDefs'); // Adjust path to your schema
const resolvers = require('./resolvers'); // Adjust path to your resolvers

const app = express();

app.use(bodyParser.json());

// Middleware to check for a valid token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token) {
    try {
      const user = jwt.verify(token, 'your-secret-key'); // Replace with your actual secret key
      req.user = user;
    } catch (err) {
      return res.status(401).json({ error: 'Your session expired. Sign in again.' });
    }
  }
  
  next();
};

app.use(authMiddleware);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const user = req.user;
    return { user };
  },
});

server.applyMiddleware({ app });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
});
