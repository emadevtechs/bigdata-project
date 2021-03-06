import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import MainPage from './MainPage';
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
  uri: 'https://bigdataproj-analysis.hasura.app/v1/graphql',
  headers: {
    'x-hasura-admin-secret': "bS6JCYJ6GEcCB6bsLkIdpOoOtzPcR4Vh7GIAYvZ4hvlgo4a1c3GAVwiM6ZTzk3IO"
  }
});

const wssLink = new WebSocketLink({
  uri: "wss://bigdataproj-analysis.hasura.app/v1/graphql",
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        'x-hasura-admin-secret': "bS6JCYJ6GEcCB6bsLkIdpOoOtzPcR4Vh7GIAYvZ4hvlgo4a1c3GAVwiM6ZTzk3IO"
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
      <MainPage />
    </Router>
  </ApolloProvider>),
  document.getElementById('root')
);