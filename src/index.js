import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
// import { createUploadLink } from 'apollo-upload-client'


 const httpsLink = new HttpLink({
  uri: 'https://fileupload-cloud.hasura.app/v1/graphql',
  headers: {
    'x-hasura-admin-secret': "iuvT4KdYjFELpe7x0teyWjK7wDsxLu9VjTQ46OGzm1v9tvpRZNpbNo4FEPjaS26i"
  }
});

const wssLink = new WebSocketLink({
  uri: "wss://fileupload-cloud.hasura.app/v1/graphql",
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        'x-hasura-admin-secret': "iuvT4KdYjFELpe7x0teyWjK7wDsxLu9VjTQ46OGzm1v9tvpRZNpbNo4FEPjaS26i"
      }
    }
  }
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wssLink,
  httpsLink
);

const createApolloClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link
  });
};

const client = createApolloClient();

ReactDOM.render(
  (<ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>),
  document.getElementById('root')
);