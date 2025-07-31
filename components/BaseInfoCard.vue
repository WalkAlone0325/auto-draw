<script setup>
defineProps({
  infos: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <view class="info-card">
    <view class="info-item" v-for="i in infos" :key="i.label">
      <view class="info-label">{{ i.label }}</view>
      <view class="info-value">{{ i.value }}</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.info-card {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;

  .info-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;

    .info-label {
      font-size: 32rpx;
      color: #333;
    }

    .info-value {
      font-size: 32rpx;
      color: #666;
    }
  }
}
</style>
