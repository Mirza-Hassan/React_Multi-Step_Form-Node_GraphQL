const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');

const app = express();

// In-memory data
let formData = [];

// GraphQL schema
const typeDefs = gql`
  type Form {
    id: String
    name: String
    color: String
    aboutYourself: String
  }

  input FormInput {
    name: String
    color: String
    aboutYourself: String
  }

  type Query {
    getFormData: [Form]
  }

  type Mutation {
    submitForm(input: FormInput): Form
  }
`;

// Resolvers
const resolvers = {
  Query: {
    getFormData: () => formData,
  },
  Mutation: {
    submitForm: (_, { input }) => {
      const newForm = { id: String(formData.length + 1), ...input };
      formData.push(newForm);
      return newForm;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({
    app,
    cors: true,
  });
}

startApolloServer().then(() => {
  app.use(cors());

  app.listen({ port: 4000 }, () => {
    console.log('Server is running on port 4000');
  });
});
