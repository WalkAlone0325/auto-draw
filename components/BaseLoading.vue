<template>
  <view class="loading-con">
    <wd-loading v-if="loading" :size="30"/>
    <text style="margin-top: 20rpx;">加载中...</text>
  </view>
</template>

<script setup>
defineProps({
  loading: Boolean
})
</script>

<style lang="scss" scoped>
.loading-con {
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  margin-top: -30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
