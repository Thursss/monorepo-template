import { type App, createApp } from 'vue'
import AppPage from './App.vue'
import router from './router'
import 'virtual:windi.css'
import './style.css'

let app: App | null = null

window.mount = () => {
  app = createApp(AppPage)
  app.use(router).mount('#app')
}

window.unmount = () => {
  app?.unmount()
  app = null
}

if (!window.__MICRO_APP_ENVIRONMENT__) {
  window.mount()
}
