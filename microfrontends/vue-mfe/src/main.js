import { defineCustomElement } from 'vue'
import App from './App.ce.vue'

const VueMfeElement = defineCustomElement(App)

customElements.define('vue-mfe', VueMfeElement)
