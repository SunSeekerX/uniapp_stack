import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import appSystemInfo from './modules/app-system-info'
import appAuth from './modules/app-auth'

export default new Vuex.Store({
  modules: {
    appSystemInfo,
    appAuth,
  },
})
