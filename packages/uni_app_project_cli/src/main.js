import Vue from 'vue'
import { mapState } from 'vuex'
import uView from '@/uni_modules/uview-ui'

import App from './App'
// import './uni.promisify.adaptor'
import store from './store'

Vue.config.productionTip = false

Vue.use(uView)
Vue.mixin({
  computed: {
    ...mapState(['token', 'userInfo', 'systemInfo']),
  },
})

Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
  ...App,
  store,
})
app.$mount()
