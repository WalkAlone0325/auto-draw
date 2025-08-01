<script setup>
import { ref } from 'vue'
import { getParagraphListApi, getNodeListApi } from '@/api'
import { onLoad } from '@dcloudio/uni-app'

const latitude = ref(39.904989)
const longitude = ref(116.405285)
const markers = ref([
  {
    latitude: 39.904989,
    longitude: 116.405285,
    title: '北京'
  }
])

const show = ref(false)

const clickOpenPopup = () => {
  show.value = true
  list.value = []
  total.value = 0
  getList()
}

const close = () => {
  show.value = false
}

const tab = ref(0)

const handleTabChange = ({index}) => {
  console.log('🚀:>> ', index)
  tab.value = index
  getList()
}

const loading = ref(false)
const list = ref([])
const total = ref(0)
const getList = async () => {
  loading.value = true
  if (tab.value === 0) {
    // 段落
    const res = await getParagraphListApi({
      pageNum: 1,
      pageSize: 10,
      projectStationLineId: query.value.projectStationLineId,
      order: 'asc'
    })
    if (res.code === 200) {
      list.value = res.rows.map(item => {
        return {
          ...item,
          infos: [
            {label: '段落编码', value: item.sectionCode},
            {label: '段落类别', value: item.sectionClassesName},
            {label: '段落距离', value: item.sectionDistance},
            {label: '段落名称', value: item.sectionNameName},
            {label: '段落类型', value: item.sectionTypeName},
            {label: '段落属性', value: item.sectionAttributeName},
            {label: '段落数量', value: item.sectionMaterialsCount}
          ]
        }
      })
      total.value = res.total
      loading.value = false
    }
  } else {
    // 节点
    const res = await getNodeListApi({
      pageNum: 1,
      pageSize: 10,
      projectStationLineId: query.value.projectStationLineId,
      order: 'asc'
    })
    if (res.code === 200) {
      list.value = res.rows.map(item => {
        return {
          ...item,
          infos: [
            {label: '节点编号', value: item.nodeCode},
            {label: '节点属性', value: item.nodeClassesName},
            {label: '杆路类型', value: item.nodeTypeName},
            {label: '节点类型', value: item.polePathTypeName},
            {label: '节点名称', value: item.nodeNameName},
            {label: '节点规格', value: item.nodeMaterialsCount}
          ]
        }
      })
      total.value = res.total
      loading.value = false
    }
  }
}

const query = ref({
  projectStationLineId: '',
  projectStationId: '',
  projectId: ''
})
onLoad((param) => {
  if(param) {
    query.value = param
  }
})
</script>

<template>
  <view class="collect-map-page">
    <map :latitude="latitude" :longitude="longitude" :markers="markers">
      <view class="header-con">
        <view class="con" @click="clickOpenPopup">
          <image class="icon-img" src="/static/list.png"></image>
          <view class="icon-title">列表</view>
        </view>
        <view class="con">
          <image class="icon-img" src="/static/collect.png"></image>
          <view class="icon-title">采集</view>
        </view>
      </view>

      <view class="control-con">
        <view class="local">
          <image class="local-img" src="/static/local.png"></image>
        </view>
      </view>
    </map>

    <wd-popup v-model="show" position="left" custom-style="width: 80%" @close="close">
      <wd-tabs v-model="tab" @change="handleTabChange" auto-line-width>
        <wd-tab title="段落"></wd-tab>
        <wd-tab title="节点"></wd-tab>
      </wd-tabs>

      <BaseLoading :loading="loading" v-if="loading && !list.length"/>
      <view class="main-content" v-else>
        <view class="list">
          <BaseInfoCard v-for="i in list" :key="i.id" :infos="i.infos" />
        </view>
      </view>
    </wd-popup>

  </view>
</template>

<style lang="scss" scoped>
.collect-map-page {
  width: 100%;
  height: 100vh;

  map {
    width: 100%;
    height: 100%;
  }

  .header-con {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;

    .con {
      display: flex;
      align-items: center;
      flex-direction: column;
      color: #fff;
      background-color: #4D80F0;
      padding: 4rpx 18rpx;
      border-radius: 8rpx;
      box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.3);
      box-sizing: border-box;

      // &:active {
      //   transform: scale(0.9);
      //   box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
      //   transition: all 0.3s;
      //   background-color: #f5f5f5;
      //   padding: 14rpx;
      // }
    }

    .icon-img {
      width: 40rpx;
      height: 40rpx;
    }
    .icon-title {
      font-size: 22rpx;
    }
  }

  .control-con {
    .local-img {
      width: 80rpx;
      height: 80rpx;
      background-color: #fff;
      padding: 12rpx;
      border-radius: 8rpx;
      box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.3);
      position: absolute;
      bottom: 520rpx;
      left: 60rpx;
      box-sizing: border-box;

      &:active {
        transform: scale(0.9);
        box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
        transition: all 0.3s;
        background-color: #f5f5f5;
        padding: 14rpx;
      }
    }
  }
}
</style>
