import { createApp } from 'vue'

import App from './App.vue'
import { pinia } from './plugins/pinia'
import { vuetify } from './plugins/vuetify'
import './styles/tokens.css'
import './styles/main.css'

const app = createApp(App)

app.use(pinia)
app.use(vuetify)
app.mount('#app')
