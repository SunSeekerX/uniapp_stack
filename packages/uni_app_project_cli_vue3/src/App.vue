<script setup>
onLaunch(async () => {
  console.log('onLaunch')
})

onHide(() => {
  console.log('onHide')
})

onShow(() => {
  console.log('onShow')
})
</script>

<style lang="scss">
/* #ifndef APP-NVUE */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
/* #endif */

@import '@/uni_modules/limm-windi-css-uniapp/index.scss';
@import '@/uni_modules/vk-uview-ui/index.scss';
</style>
