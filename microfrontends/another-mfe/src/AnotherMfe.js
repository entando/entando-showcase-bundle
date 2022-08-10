import { useContext, useState } from 'react';
import logo from './react-logo.svg';
import './AnotherMfe.css';
import KeycloakContext from './KeycloakContext';

const API_TIMESTAMP_PATH = '/api/timestamp'

function AnotherMfe({ config }) {
  const { systemParams, contextParams, params } = config || {};
  const { api } = systemParams || {};

  const { username, description } = params || {};

  const internalApiUrl = api && api['int-api'].url;
  const externalApiUrl = api && api['ext-api'].url;

  const [internalTimestamp, setInternalTimestamp] = useState(null);
  const [externalTimestamp, setExternalTimestamp] = useState(null);

  const keycloak = useContext(KeycloakContext);

  const fetchTimestamps = async () => {
    const options = {
      headers: {
        Authorization: `Bearer ${keycloak.token}`
      }
    };

    try {
      const internalApiResponse = await fetch(internalApiUrl + API_TIMESTAMP_PATH, options);

      if (internalApiResponse.ok) {
        setInternalTimestamp((await internalApiResponse.json())?.timestamp);
      } else {
        setInternalTimestamp('Server responded with an error');
      }
    } catch (error) {
      setInternalTimestamp(error.message);
    }


    try {
      const externalApiResponse = await fetch(externalApiUrl + API_TIMESTAMP_PATH, options);

      if (externalApiResponse.ok) {
        setExternalTimestamp((await externalApiResponse.json())?.timestamp);
      } else {
        setExternalTimestamp('Server responded with an error');
      }
    } catch(error) {
      setExternalTimestamp(error.message);
    }
    
  };

  const handleGetTimestampsClick = () => {
    if (keycloak.authenticated) {
      if (keycloak.isTokenExpired()) {
        keycloak.login();
      } else {
        fetchTimestamps();
      }
    }
  };

  const handleLogoutClick = () => {
    keycloak.logout();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <button onClick={handleGetTimestampsClick}>Get timestamps</button>
      {internalTimestamp && (
        <>
          <div>Internal timestamp: {internalTimestamp}</div>
          <div>External timestamp: {externalTimestamp}</div>
        </>
      )}
      <br />
      {
        contextParams && (
          <>
            <div>Page Code: <strong>{contextParams.page_code}</strong></div>
          </>
        )
      }
      <br />
      {
        params && (
          <>
            <div>Username: <strong>{username}</strong></div>
            <div>Description <strong>{description}</strong></div>
          </>
        )
      }
      <br />
      {
        process.env.NODE_ENV === 'development' && keycloak.authenticated && (
          <button onClick={handleLogoutClick}>Log out</button>
        )
      }
    </div>
  );
}

export default AnotherMfe;
