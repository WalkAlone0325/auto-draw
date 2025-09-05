<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getParagraphListApi } from '@/api/collect'

const vals = ref([])
// 段落列表
const list = ref([])

const getList = async (projectStationLineId) => {
  const res = await getParagraphListApi({
    projectStationLineId,
  })
  list.value = res.rows.map(i => ({
    id: i.projectStationLineSectionId,
    raw: {
      ...i,
      infos: [
        { label: '段落编码', value: i.sectionCode },
        { label: '段落类别', value: i.sectionClassesName },
        { label: '段落名称', value: i.sectionNameName },
        { label: '段落距离', value: (i.sectionDistance || 0) + ' 米', row: 1 },
        { label: '段落类型', value: i.sectionTypeName, row: 2 },
        { label: '段落属性', value: i.sectionAttributeName, row: 1 },
        { label: '段落数量', value: i.sectionMaterialsCount, row: 2 }
      ]
    },
    color: '#8268de',
    width: 3,
    points: [{ latitude: i.startNodePlaceLatitude, longitude: i.startNodePlaceLongitude }, { latitude: i.endNodePlaceLatitude, longitude: i.endNodePlaceLongitude }]
  }))
}

onLoad((param) => {
  if (param.vals) {
    vals.value = param.vals.split(',').map(i => Number(i))
  }
  getList(param.projectStationLineId)
})

const clickItem = (item) => {
  if (vals.value.includes(item.id)) {
    vals.value = vals.value.filter(i => i !== item.id)
  } else {
    vals.value.push(item.id)
  }
}

const handleSubmit = () => {
  if (vals.value.length === 0) {
    uni.showToast({
      title: '请选择段落',
      icon: 'none'
    })
    return
  }
  uni.navigateBack({
    delta: 1,
    success: (res) => {
      uni.$emit('sectionSelect', vals.value)
    }
  })
}

</script>

<template>
  <view class="section-select-page">
    <view class="list">
      <wd-checkbox-group v-model="vals">
        <view class="item-check" v-for="i in list" :key="i.id" @click="clickItem(i)">
          <wd-checkbox :modelValue="i.id" :true-value="i.id" false-value="" />
          <BaseInfoCard :item="i.raw" :tab="0" noBtn />
        </view>
      </wd-checkbox-group>
    </view>

    <view class="footer">
      <wd-button custom-class="custom-btn" type="primary" block :round="false"
        @click="handleSubmit">确认</wd-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.section-select-page {
  height: 100%;

  .list {
    margin: 30rpx;
    padding-bottom: calc(env(safe-area-inset-bottom) + 70rpx);

    :deep(.wd-checkbox-group) {
      background-color: transparent !important;
      padding-bottom: calc(env(safe-area-inset-bottom) + 70rpx);
    }

    .item-check {
      display: flex;
      align-items: center;
      padding-left: 20rpx;
      background: #fff;
      border-radius: 12rpx;
      margin-bottom: 30rpx;
    }
  }

  .footer {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30rpx 20rpx 0;
    padding-bottom: calc(env(safe-area-inset-bottom) + 30rpx);
    background: #fff;
  }

  :deep(.custom-btn) {
    width: 100%;
    margin: 0 10rpx;
    border-radius: 0 !important;
    opacity: 1;
  }
}

:deep(.wd-checkbox) {
  margin-bottom: 0 !important;
  margin-top: 32rpx;
}

:deep(.wd-checkbox__shape) {
  width: 44rpx !important;
  height: 44rpx !important;
}
</style>
