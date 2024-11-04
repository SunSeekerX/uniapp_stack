import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'virtual:svg-icons-register'

import * as kiwi from '@/kiwi'
import App from './App.vue'
import router from './router'
import { i18n } from '@/kiwi'
import SvgIcon from '@/components/svg-icon/svg-icon.vue'
import BuildInfo from '@/components/build_info.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.component('SvgIcon', SvgIcon)
if (!kiwi.env.viteIsProd) {
  app.component('BuildInfo', BuildInfo)
}

app.mount('#app')
