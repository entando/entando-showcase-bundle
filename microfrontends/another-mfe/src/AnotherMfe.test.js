import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnotherMfe from './AnotherMfe';
import KeycloakContext from './KeycloakContext';

const keycloak = {
  token: 'faketoken',
  authenticated: true,
  isTokenExpired: jest.fn(() => false),
  login: jest.fn()
};

test('displays fetched timestamps when "Get timestamps" button is clicked', async () => {
  const config = {
    systemParams: {
      api: {
        'int-api': { url: 'http://localhost:8082' },
        'ext-api': { url: 'http://test-fire.apps.mainline.eng-entando.com/cecchisandrone/simple-ms' }
      }
    },
  };
  const internalTimestamp = 'Jul 07, 2022 19:00';
  const externalTimestamp = 'Jul 07, 2022 11:00';

  jest
    .spyOn(global, 'fetch')
    .mockImplementation(
      jest.fn((url) => {
        console.log(url)
        if (url === config.systemParams.api['int-api'].url + '/api/timestamp')
          return Promise.resolve({ json: () => Promise.resolve({ timestamp: internalTimestamp }), ok: true })
        if (url === config.systemParams.api['ext-api'].url + '/api/timestamp')
          return Promise.resolve({ json: () => Promise.resolve({ timestamp: externalTimestamp }), ok: true })
      })
    )

  render(
    <KeycloakContext.Provider value={keycloak}>
      <AnotherMfe config={config} />
    </KeycloakContext.Provider>
  );

  const getTimestampsBtnEl = screen.getByText(/Get timestamps/i);
  userEvent.click(getTimestampsBtnEl);

  expect(await screen.findByText(new RegExp(internalTimestamp))).toBeInTheDocument();
  expect(await screen.findByText(new RegExp(externalTimestamp))).toBeInTheDocument();
});

test('displays page code', async () => {
  const config = {
    contextParams: {
      page_code: 'my_mfe_page'
    }
  };

  render(
    <KeycloakContext.Provider value={keycloak}>
      <AnotherMfe config={config} />
    </KeycloakContext.Provider>
  );

  expect(screen.getByText(new RegExp(config.contextParams.page_code))).toBeInTheDocument();
});

test('displays username and description', async () => {
  const config = {
    params: {
      username: 'adionisi',
      description: 'Tech Lead Entando'
    }
  };

  render(
    <KeycloakContext.Provider value={keycloak}>
      <AnotherMfe config={config} />
    </KeycloakContext.Provider>
  );

  expect(screen.getByText(new RegExp(config.params.username))).toBeInTheDocument();
  expect(screen.getByText(new RegExp(config.params.description))).toBeInTheDocument();
});

test('invokes keycloak login when button is clicked and token is expired', async () => {
  keycloak.isTokenExpired.mockImplementationOnce(() => true)

  render(
    <KeycloakContext.Provider value={keycloak}>
      <AnotherMfe config={{}} />
    </KeycloakContext.Provider>
  );

  const getTimestampsBtnEl = screen.getByText(/Get timestamps/i);
  userEvent.click(getTimestampsBtnEl);

  expect(keycloak.login).toHaveBeenCalled()
});
