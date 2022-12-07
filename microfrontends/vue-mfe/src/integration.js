const getKeycloak = () =>
  (window &&
    window.entando &&
    window.entando.keycloak
  ) || {};

const getKeycloakToken = () => {
  if (getKeycloak().authenticated) {
    return getKeycloak().token;
  }

  return '';
};

const getDefaultOptions = () => {
    const token = getKeycloakToken()
    if (!token) return {}
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
}

const getAPIUrl = (config, serviceName) => {
  const { systemParams } = JSON.parse(config);
  return systemParams.api[serviceName].url;
};

export const getData = (config, serviceName, endpoint) => {
  const responseObj = {};

  try {
    const response = fetch(`${getAPIUrl(config, serviceName)}${endpoint}`, getDefaultOptions());
    if (response.ok) {
      responseObj['res'] = response;
    } else {
      throw new Error('Server responded with an error');
    }
  } catch (error) {
    responseObj['error'] = error;
  }

  return responseObj;
};
