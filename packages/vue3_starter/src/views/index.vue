<script setup>
import * as kiwi from '@/kiwi'
import Toast from '@/components/toast.vue'

const mState = reactive({
  title: 'Hello',
  res: undefined,
})

const toast = reactive({
  show: false,
  message: '',
  type: 'success',
})

const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  toast.show = true
}

const onTestRequest = async () => {
  try {
    mState.res = undefined
    const res = await kiwi.api.getApi()
    console.log(`++++++[${new Date().toISOString()}] 请求结果: `, res)
    mState.res = res
    // @ts-ignore
    if (res?.success) {
      showToast('请求成功')
    } else {
      showToast(`${kiwi.dayjs().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')}: ${res.msg}` || '请求失败', 'error')
    }
  } catch (error) {
    console.error(`++++++[${new Date().toISOString()}] 'Request failed:`, error)
    showToast(`${kiwi.dayjs().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')}: 网络请求错误`, 'error')
  }
}
</script>

<template>
  <main class="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white px-4 py-8">
    <Toast v-model:show="toast.show" :message="toast.message" :type="toast.type" />

    <div class="max-w-4xl mx-auto">
      <!-- Header Section -->
      <div class="text-center space-y-4 mb-12">
        <h1
          class="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
        >
          Welcome to Demo
        </h1>
      </div>

      <!-- Icons Section -->
      <div class="flex gap-4 justify-center mb-8">
        <!-- 彩色图标 -->
        <SvgIcon name="icon_close" :size="32" />
        <!-- 单色图标 -->
        <SvgIcon name="icon_close" :size="32" color="green" />
        <!-- 旋转图标 -->
        <SvgIcon name="icon_close" :size="32" :spin="true" color="blue" />
      </div>

      <!-- Main Content -->
      <div class="space-y-8">
        <!-- API Test Section -->
        <div class="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <button
              @click="onTestRequest"
              class="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <span>Test Request</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>

            <div class="w-full md:w-2/3 overflow-x-auto">
              <pre class="text-sm text-slate-300 p-4 bg-slate-900/50 rounded-lg whitespace-pre-wrap break-words">{{
                typeof mState.res === 'object' ? JSON.stringify(mState.res, null, 2) : mState.res
              }}</pre>
            </div>
          </div>
        </div>

        <!-- Navigation Section -->
        <div class="flex justify-center">
          <router-link
            to="/about"
            class="group px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 active:from-purple-800 active:to-blue-800 transition-all duration-300 transform hover:-translate-y-1"
          >
            <span class="flex items-center gap-2">
              <span>Go to About</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped></style>

<style lang="scss" scoped>
pre {
  &:empty::before {
    content: '暂无数据';
    color: #666;
    font-style: italic;
  }
}
</style>
