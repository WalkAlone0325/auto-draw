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
      <view class="info-label">{{ i.label }}：</view>
      <view class="info-value">{{ i.value }}</view>
    </view>

    <view class="btn-con">
      <view class="btn">删除段落</view>
      <view class="btn">编辑段落</view>
      <view class="btn">复制段落</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.info-card {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 10rpx;
  box-sizing: border-box;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #e5e5e5;

  .info-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4rpx;

    .info-label {
      font-size: 28rpx;
      color: #666;
    }

    .info-value {
      font-size: 28rpx;
      color: #333;
    }
  }

  .btn-con {
    display: flex;
    justify-content: space-between;
    margin-top: 10rpx;
    padding: 0 30rpx;

    .btn {
      font-size: 24rpx;
      color: #666;
      padding: 10rpx 20rpx;
      border-radius: 4rpx;
      border: 1rpx solid #666;
    }
  }
}
</style>
