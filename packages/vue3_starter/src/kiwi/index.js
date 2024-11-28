import { createI18n } from 'vue-i18n'
import { dayjs, lodash, axios } from './libs'

import zh_CN from './locales/zh-cn'
import en_US from './locales/en'
import zh_TW from './locales/zh-tw'

import * as utilBase from './util_base'

export * from './libs'

// Constant
export const constant = {
  storageAppLocale: 'APP_LOCALE',
}

// Env
export const env = {
  viteAppEnv: import.meta.env.VITE_APP_ENV,
  viteBaseUrl: import.meta.env.VITE_BASE_URL,
  viteSiteName: import.meta.env.VITE_SITE_NAME,
  viteBuildCompress: import.meta.env.VITE_BUILD_COMPRESS,
  // @ts-ignore
  viteIsProd: import.meta.env.PROD === 'production',
}

// I18n
const onGetEnvLocale = () => {
  let localeKey = null
  let localeName = null
  const query = location.href
  let vars = query.split('lang=')
  if (vars && vars.length > 0 && vars[1] == 'zh_CN') {
    localeKey = 'zh-CN'
    localeName = '简体中文'
  } else if (vars && vars.length > 0 && vars[1] == 'en') {
    localeKey = 'en'
    localeName = 'English'
  } else if (vars && vars.length > 0 && vars[1] == 'zh_TW') {
    localeKey = 'zh-TW'
    localeName = '繁体中文'
  }
  // if (!localeKey) {
  //   const appLocale = storage.getStorageSync(storageAppLocale, true)
  //   if (appLocale) {
  //     localeKey = appLocale.localeKey
  //     localeName = appLocale.localeName
  //   }
  // }

  if (!localeKey) {
    // @ts-ignore
    let lang = navigator.language || navigator.userLanguage
    lang = lang.substr(0, 2)
    if (lang === 'zh') {
      localeKey = 'zh-CN'
      localeName = '简体中文'
    } else if (lang === 'en') {
      localeKey = 'en'
      localeName = 'English'
    } else if (lang === 'zh-TW') {
      localeKey = 'zh-TW'
      localeName = '繁体中文'
    }
  }

  if (!localeKey) {
    localeKey = import.meta.env.VITE_DEFAULT_LOCALE_KEY
    localeName = import.meta.env.VITE_DEFAULT_LOCALE_NAME
  }

  return {
    localeKey,
    localeName,
  }
}

export const { localeKey, localeName } = onGetEnvLocale()

export const i18n = createI18n({
  locale: localeKey,
  globalInjection: true,
  fallbackLocale: 'en',
  silentTranslationWarn: env.viteIsProd,
  messages: {
    en: en_US,
    'zh-CN': zh_CN,
    'zh-TW': zh_TW,
  },
})
export const t = i18n.global.t

// Apis
export const createRequest = (axiosOptions, createOptions) => {
  createOptions = Object.assign(
    {
      packErr: true,
    },
    createOptions,
  )
  const { packErr = true } = createOptions

  const instance = axios.create(
    Object.assign(
      {
        withCredentials: false,
        // timeout: 90000,
      },
      axiosOptions,
    ),
  )

  instance.interceptors.request.use(
    config => {
      if (config.method.toUpperCase() === 'GET') {
        utilBase.cleanObject(config.params, {
          removeEmpty: true,
          mutate: true,
        })
      } else {
        utilBase.cleanObject(config.data, {
          removeEmpty: true,
          mutate: true,
        })
      }
      return config
    },
    error => Promise.reject(error),
  )

  instance.interceptors.response.use(
    response => response.data,
    error => {
      console.error(error)
      const ret = {
        success: false,
        code: -1,
        error: (error?.toJSON && error?.toJSON()) || error,
      }
      if (error.response) {
        const { data } = error.response
        ret['code'] = data.code || 500
        ret['msg'] = data.msg || data.message || 'Server response error'
        ret['response'] = error.response
      } else if (error.request) {
        ret['code'] = 400
        ret['msg'] = error.message || 'Network error'
      } else {
        ret['code'] = 400
        ret['msg'] = error.message || 'App error'
      }
      if (packErr) {
        return Promise.resolve(ret)
      } else {
        return Promise.reject(ret)
      }
    },
  )

  return instance
}
const req = createRequest({
  baseURL: env.viteBaseUrl,
})
export const api = {
  getApi: data => req({ url: '/get', method: 'GET', data }),
}

// Store
export const store = {
  useCounterStore: defineStore('counter', () => {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    function increment() {
      count.value++
    }
    return { count, doubleCount, increment }
  }),
}
