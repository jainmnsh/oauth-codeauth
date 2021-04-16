/* eslint-disable no-console */
import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom'; // eslint-disable-line
import  ClientOAuth2  from "client-oauth2"; // eslint-disable-line
import { RequestAuthorizationCode, AuthorizationCodeCallback } from "react-oauth2-auth-code-flow"; // eslint-disable-line
import logo from './logo.svg'; // eslint-disable-line
import './App.css'; // eslint-disable-line

const oauthClient = new ClientOAuth2({
  authorizationUri: "https://login.usw2.pure.cloud/oauth/authorize",
  accessTokenUri: 'https://login.usw2.pure.cloud/oauth/token',
  clientId: "CLIENT_D",
  clientSecret: "client secret",
  redirectUri: 'http://localhost:3000/auth/callback',
  scopes: [],
  token: 'maxc-genesys-chat'
});

class App extends Component {
  handleSuccess = (accessToken, { response, state }) => {
    console.log('Success!');
    console.log('AccessToken: ', accessToken);
    console.log('Response: ', response);
    console.log('State: ', state);
  };

  handleError = async error => {
    console.error('Error: ', error.message);

    //const text = await error.response.text();
    //console.log(text);
  };

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>

          <Route
            exact
            path="/"
            render={() => (
              <div>
                <RequestAuthorizationCode
                  oauthClient={oauthClient}
                  state={{ to: '/auth/success' }}
                  render={({ url }) => <a href={url}>Connect to PureCloud</a>}
                />
              </div>
            )}
          />
          <Route
            exact
            path="/auth/callback"
            render={({ location }) => (
              <AuthorizationCodeCallback
                oauthClient={oauthClient}
                location={location}
                onAuthSuccess={this.handleSuccess}
                onAuthError={this.handleError}
                render={({ processing, state, error }) => {
                  if (processing) {
                    return <p>Processing!</p>;
                  }
                  if (error) {
                    return <p style={{ color: 'red' }}>{error.message}</p>;
                  }
                  return <Redirect to={state.to} />;
                }}
              />
            )}
          />

          <Route
            exact
            path="/auth/success"
            render={() => <div>Successfully authorized pure cloud!</div>}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
