<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  tab: {
    type: Number,
    default: 0
  },
  noBtn: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['del', 'edit', 'copy'])

const del = (item) => {
  emit('del', item)
}

const edit = (item) => {
  const { tab } = props
  const MAP = {
    0: '/pages/collect/stage-form', // 段落
    1: '/pages/collect/node-form' // 节点
  }
  const url = MAP[tab] + '?id=' + item.projectStationLineSectionId + '&projectStationLineId=' + item.projectStationLineId + '&projectStationLineNodeId=' + item.projectStationLineNodeId
  uni.navigateTo({
    url
  })
  emit('edit', item)
}

const copy = (item) => {
  emit('copy', item)
}

const select = (item) => {
  emit('select', item)
}
</script>

<template>
  <view class="info-card" v-if="!item.isHidden" @click="select(item)">
    <view class="info-item" v-for="i in item.infos" :key="i.label">
      <view class="info-label">{{ i.label }}：</view>
      <view class="info-value">{{ i.value }}</view>
    </view>

    <view class="btn-con" v-if="!noBtn">
      <view class="btn" @click="del(item)">删除{{ tab === 0 ? '段落' : '节点' }}</view>
      <view class="btn" @click="edit(item)">编辑{{ tab === 0 ? '段落' : '节点' }}</view>
      <view class="btn" @click="copy(item)">复制{{ tab === 0 ? '段落' : '坐标' }}</view>
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
