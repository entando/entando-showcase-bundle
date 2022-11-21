import { Component, Input, OnInit, OnDestroy, OnChanges, ChangeDetectorRef, isDevMode, SimpleChanges } from '@angular/core';

const getKeycloakInstance = () =>
  (window &&
    window.entando &&
    window.entando.keycloak &&
    { ...window.entando.keycloak, initialized: true }
  ) || { initialized: false };

type MfeConfig = {
  systemParams: {
    api: {
      'int-api': { url: string },
      'ext-api': { url: string }
    }
  };
  contextParams: {
    page_code: string
  },
  params: {
    username: string,
    description: string
  }
} | null;

const API_TIMESTAMP_PATH = '/api/timestamp';

@Component({
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges, OnDestroy {
  title = 'angular-mfe';
  internalTimestamp: string | null = null;
  externalTimestamp: string | null = null;
  keycloak = getKeycloakInstance();
  isDevMode = isDevMode();

  @Input()
  config: MfeConfig;

  constructor(private cdr: ChangeDetectorRef) {
    this.config = null;

    this.handleKeycloakUpdate = this.handleKeycloakUpdate.bind(this);
  }

  ngOnInit() {
    this.config = typeof this.config === 'string' ? JSON.parse(this.config) : this.config;

    window.addEventListener('keycloak', this.handleKeycloakUpdate);
  }

  ngOnChanges() {
    this.config = typeof this.config === 'string' ? JSON.parse(this.config) : this.config;
  }

  ngOnDestroy() {
    window.removeEventListener('keycloak', this.handleKeycloakUpdate);
  }

  handleKeycloakUpdate() {
    this.keycloak = { ...getKeycloakInstance(), initialized: true };
    this.cdr.detectChanges();
  }

  handleLogoutClick() {
    this.keycloak.logout();
  }

  async fetchTimestamps() {
    const { systemParams } = this.config || {};
    const { api } = systemParams || {};

    const internalApiUrl = api && api['int-api'].url;
    const externalApiUrl = api && api['ext-api'].url;
    const options = {
      headers: {
        Authorization: `Bearer ${this.keycloak.token}`
      }
    };

    try {
      const internalApiResponse = await fetch(internalApiUrl + API_TIMESTAMP_PATH, options);

      if (internalApiResponse.ok) {
        this.internalTimestamp = (await internalApiResponse.json())?.timestamp;
      } else {
        this.internalTimestamp = 'Server responded with an error';
      }
    } catch (error) {
      this.internalTimestamp = (error as Error).message;
    }


    try {
      const externalApiResponse = await fetch(externalApiUrl + API_TIMESTAMP_PATH, options);

      if (externalApiResponse.ok) {
        this.externalTimestamp = (await externalApiResponse.json())?.timestamp;
      } else {
        this.externalTimestamp = 'Server responded with an error';
      }
    } catch(error) {
      this.externalTimestamp = (error as Error).message;
    }
  }

  handleGetTimestampsClick() {
    if (this.keycloak.authenticated) {
      if (this.keycloak.isTokenExpired()) {
        this.keycloak.login();
      } else {
        this.fetchTimestamps();
      }
    }
  }
}
