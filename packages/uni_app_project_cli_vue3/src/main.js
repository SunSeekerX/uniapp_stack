import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import 'virtual:svg-icons-register'

import App from './App.vue'
import uView from '@/uni_modules/vk-uview-ui'
import { i18n } from './god'
import SvgIcon from '@/components/svg_icon/svg_icon.vue'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(i18n)
  app.use(uView)
  app.component('SvgIcon', SvgIcon)

  return {
    app,
  }
}
