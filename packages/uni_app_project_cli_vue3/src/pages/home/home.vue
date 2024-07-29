<script setup>
import * as god from '@/god'

const mState = reactive({
  title: 'Hello',
  res: {},
})

const onTestRequest = async () => {
  const res = await god.api.getApi()
  console.log('res>>>', res)
  if (res.success) {
    mState.res = res
  } else {
    god.uniapp.toast(res.msg)
  }
}
</script>

<template>
  <view class="flex flex-col justify-center items-center p-[20px]">
    <image class="w-[200rpx] h-[200rpx] mt-24" src="/static/images/logo.png" />
    <view class="mt-[20px]">
      <text class="text-[36rpx] text-[#8f8f94]">{{ mState.title }}</text>
    </view>
    <u-button type="primary" @click="onTestRequest">测试请求</u-button>
    <view class="mt-[20px]">
      <text class="text-[36rpx] text-[#8f8f94]">{{ mState.res }}</text>
    </view>
  </view>
</template>
