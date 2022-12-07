<script setup>
import { getData } from './integration';
</script>
<script>
  export default {
    props: ['config'],
    watch: {
      config: function(newVal) {
        const { contextParams, params } = JSON.parse(newVal);
        this.contextParams = contextParams;
        this.params = params;
      }
    },
    data() {
      const { contextParams, params } = JSON.parse(this.config || '{}');

      return {
        internalTimestamp: null,
        externalTimestamp: null,
        contextParams,
        params,
      };
    },
    methods: {
      getTimestamps: async function() {
        const { res: internalApiResponse, error: internalApiError } = await getData(this.config, 'int-api', '/api/timestamp');

        if (!internalApiError) {
          this.internalTimestamp = (await internalApiResponse.json())?.timestamp;
        } else {
          this.internalTimestamp = internalApiError.message;
        }

        const { res: externalApiResponse, error: externalApiError } = await getData(this.config, 'ext-api', '/api/timestamp');

        if (!externalApiError) {
          this.externalTimestamp = (await externalApiResponse.json())?.timestamp;
        } else {
          this.externalTimestamp = externalApiError.message;
        }
      },
    }
  }
</script>

<template>
  <div class="App">
    <header class="App-header">
      <img src="./assets/vue.svg" class="App-logo" alt="logo" />
    </header>
    <button @click="getTimestamps()">Get timestamps</button>
    <div v-if="internalTimestamp">
      <div>Internal timestamp: {{internalTimestamp}}</div>
      <div>External timestamp: {{externalTimestamp}}</div>
    </div>
    <br />
    <div v-if="contextParams">Page Code: <strong>{{contextParams.page_code}}</strong></div>
    <br />
    <div v-if="params">
      <div>Username: <strong>{{params.username}}</strong></div>
      <div>Description <strong>{{params.description}}</strong></div>
    </div>
  </div>
</template>

<style scoped>
.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

.App-header {
  background-color: #282c34;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

button {
  margin: 16px 0;
}
</style>
