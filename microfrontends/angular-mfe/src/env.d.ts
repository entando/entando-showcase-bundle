declare var process: NodeJS.Process;

declare global {
  interface Window {
    entando: {
      keycloak: {
        token: string,
        authenticated: boolean,
        isTokenExpired: Function,
        login: Function,
        logout: Function
      }
    };
  }
}

export {};
