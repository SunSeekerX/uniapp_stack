<script setup>
import * as kiwi from '@/kiwi'

const mState = reactive({
  title: 'Hello',
  res: {},
})

const onTestRequest = async () => {
  const res = await kiwi.api.getApi()
  console.log('res>>>', res)
  if (res.success) {
    mState.res = res
  } else {
    alert(res.msg)
  }
}
</script>

<template>
  <main class="w-full min-h-[200px] flex flex-col items-center justify-center p-[15px] bg-slate-800 text-white">
    <h1>Index</h1>

    <div class="mt-[20px] py-[12px]">
      <span class="text-[36rpx] text-[#8f8f94]">{{ mState.title }}</span>
    </div>
    <button class="bg-blue-600 text-white p-[12px] rounded-[6px]" @click="onTestRequest">测试请求</button>
    <div class="mt-[20px]">
      <span class="text-[36rpx] text-[#8f8f94]">{{ mState.res }}</span>
    </div>

    <div class="bg-blue-600 text-white p-[12px] rounded-[6px]">
      <router-link :to="{ path: '/about' }"> to about </router-link>
    </div>
  </main>
</template>

<style lang="scss" scoped></style>
