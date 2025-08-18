<script setup>
import { ref } from 'vue'
import { getParagraphListApi, getNodeListApi, deleteSectionApi, deleteNodeApi } from '@/api'
import { onLoad, onShow } from '@dcloudio/uni-app'

const scale = ref(18)
const latitude = ref('')
const longitude = ref('')
const markers = ref([])
const polyline = ref([])

const initMap = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      latitude.value = res.latitude
      longitude.value = res.longitude
    },
    fail: (res) => {
      console.log('🚀:>> ', res)
    }
  })
}

onLoad(() => {
  // initMap()
  uni.$on('refresh', () => {
    console.log('🚀:>> ', 111)
    pTotal.value = 0
    nTotal.value = 0
    markers.value = []
    polyline.value = []
    getParagraphList()
    getNodeList()
    showBox.value = false
  })
})

const show = ref(false)

const param = ref({
  projectStationLineId: '',
  projectStationId: '',
  projectId: '',
  projectName: ''
})
onLoad((option) => {
  if (option) {
    param.value = option
    console.log('🚀:>> ', param.value)
    getParagraphList()
    getNodeList()
  }
})

const clickOpenPopup = () => {
  show.value = true
}
const clickAdd = (tab) => {
  const queryStr = `projectStationLineId=${param.value.projectStationLineId}&projectStationId=${param.value.projectStationId}&projectId=${param.value.projectId}`
  if (tab === 0) {
    // 段落
    uni.navigateTo({
      url: '/pages/collect/stage-form?' + queryStr
    })
  } else {
    // 节点
    uni.navigateTo({
      url: '/pages/collect/node-form?' + queryStr
    })
  }
}

const clickCollect = () => {
  const queryStr = `projectStationLineId=${param.value.projectStationLineId}&projectStationId=${param.value.projectStationId}&projectId=${param.value.projectId}&projectName=${param.value.projectName}&show=${nTotal.value}`
  uni.navigateTo({
    url: '/pages/collect/form?' + queryStr
  })
}

const close = () => {
  show.value = false
}

const tab = ref(0)

const handleTabChange = ({ index }) => {
  tab.value = index
  pTotal.value = 0
  nTotal.value = 0
  markers.value = []
  polyline.value = []
  query.value.pageNum = 1
  if (tab.value === 0) {
    getParagraphList()
  } else {
    getNodeList()
  }
}

const state = ref('loading')
const loading = ref(false)
const pTotal = ref(0)
const nTotal = ref(0)
const query = ref({
  // pageNum: 1,
  // pageSize: 10,
  order: 'asc'
})
// 获取段落
const getParagraphList = async () => {
  uni.showLoading({ title: '加载中', mask: true })
  const res = await getParagraphListApi({
    ...query.value,
    projectStationLineId: param.value.projectStationLineId,
  })
  if (res.code === 200 && res.rows.length > 0) {
    const data = res.rows
    // 段落中间点
    const arr = []
    polyline.value = data.map((i, idx) => {
      // 段落中间点
      arr.push({
        isHidden: true,
        raw: {
          ...i,
          infos: [
            { label: '段落编码', value: i.sectionCode },
            { label: '段落类别', value: i.sectionClassesName },
            { label: '段落距离', value: i.sectionDistance },
            { label: '段落名称', value: i.sectionNameName },
            { label: '段落类型', value: i.sectionTypeName },
            { label: '段落属性', value: i.sectionAttributeName },
            { label: '段落数量', value: i.sectionMaterialsCount }
          ]
        },
        id: idx + 9000001,
        iconPath: '/static/polyline.png',
        width: 24,
        height: 24,
        anchor: { x: 0.5, y: 0.5 },
        latitude: (Number(i.startNodePlaceLatitude) + Number(i.endNodePlaceLatitude)) / 2,
        longitude: (Number(i.startNodePlaceLongitude) + Number(i.endNodePlaceLongitude)) / 2,
      })
      return {
        id: i.projectStationLineSectionId,
        pId: idx + 9000001,
        raw: {
          ...i,
          infos: [
            { label: '段落编码', value: i.sectionCode },
            { label: '段落类别', value: i.sectionClassesName },
            { label: '段落距离', value: i.sectionDistance },
            { label: '段落名称', value: i.sectionNameName },
            { label: '段落类型', value: i.sectionTypeName },
            { label: '段落属性', value: i.sectionAttributeName },
            { label: '段落数量', value: i.sectionMaterialsCount }
          ]
        },
        color: '#8268de',
        width: 3,
        points: [{ latitude: i.startNodePlaceLatitude, longitude: i.startNodePlaceLongitude }, { latitude: i.endNodePlaceLatitude, longitude: i.endNodePlaceLongitude }]
      }
    })
    markers.value = [...arr, ...markers.value]
    pTotal.value = res.total
  }
  uni.hideLoading()
}

// 获取节点
const getNodeList = async () => {
  uni.showLoading({ title: '加载中', mask: true })
  const res = await getNodeListApi({
    ...query.value,
    projectStationLineId: param.value.projectStationLineId,
  })
  if (res.code === 200 && res.rows.length > 0) {
    const data = res.rows
    latitude.value = data[0].nodePlaceLatitude
    longitude.value = data[0].nodePlaceLongitude

    const nodeMarkers = data.map((i, idx) => ({
      raw: {
        ...i,
        infos: [
          { label: '节点编号', value: i.nodeCode },
          { label: '节点属性', value: i.nodeClassesName },
          { label: '杆路类型', value: i.nodeTypeName },
          { label: '节点类型', value: i.polePathTypeName },
          { label: '节点名称', value: i.nodeNameName },
          { label: '节点规格', value: i.nodeMaterialsCount }
        ]
      },
      id: i.projectStationLineNodeId,
      latitude: i.nodePlaceLatitude,
      longitude: i.nodePlaceLongitude,
      // title: `${idx + 1}`,
      iconPath: '/static/location.png',
      width: 24,
      height: 24,
      label: {
        content: `${idx + 1}`,
        color: '#000',
        fontSize: 16,
        position: 'bottom'
      }
    }))
    markers.value = [...nodeMarkers, ...markers.value]
    nTotal.value = res.total
  } else {
    initMap()
  }
  uni.hideLoading()
}

// 删除段落，节点
const delItem = async (item) => {
  uni.showModal({
    title: '提示',
    content: '确定删除吗？',
    success: async (res) => {
      if (res.confirm) {
        let res
        if (tab.value === 0) {
          res = await deleteSectionApi(item.projectStationLineSectionId)
        } else {
          res = await deleteNodeApi(item.projectStationLineNodeId)
        }
        if (res.code === 200) {
          uni.showToast({
            title: '删除成功'
          })
          polyline.value = []
          markers.value = []
          pTotal.value = 0
          nTotal.value = 0
          showBox.value = false
          state.value = 'loading'
          query.value.pageNum = 1
          if (tab.value === 0) {
            getParagraphList()
          } else {
            getNodeList()
          }
        }
      }
    }
  })
}

// 点击地图
const clickMap = (e) => {
  const { latitude, longitude } = e.detail
  // uni.showModal({
  //   title: '提示',
  //   content: '确定采集此处节点坐标吗？',
  //   success: (res) => {
  //     if (res.confirm) {
  //       uni.navigateBack({
  //         delta: 1,
  //         success: () => {
  //           uni.$emit('local', { latitude, longitude })
  //         }
  //       })
  //     }
  //   }
  // })
}

const showBox = ref(false)
const boxItem = ref({})
const lastNodeIdx = ref(-1)
const lastPolyIdx = ref(-1)

const clickMarker = (e) => {
  const { markerId } = e.detail
  const idx = markers.value.findIndex(i => i.id === markerId)

  // 段落
  if (markerId > 9000000 && markers.value[idx].isHidden) {
    tab.value = 0
    if (lastPolyIdx.value !== -1 && lastNodeIdx.value !== -1) {
      markers.value[lastPolyIdx.value].iconPath = '/static/polyline.png'
      markers.value[lastNodeIdx.value].iconPath = '/static/location.png'
    }
    markers.value[idx].iconPath = '/static/polyline-a.png'
    polyline.value.forEach(element => {
      element.color = '#8268de'
    })
    polyline.value.find(i => i.pId === markers.value[idx].id).color = '#d81e06'
    boxItem.value = markers.value[idx].raw
    lastPolyIdx.value = idx
  } else {
    // 节点
    const idxn = markers.value.findIndex(i => i.id === markerId)
    tab.value = 1
    if (lastNodeIdx.value !== -1 && lastPolyIdx.value !== -1) {
      markers.value[lastPolyIdx.value].iconPath = '/static/polyline.png'
      markers.value[lastNodeIdx.value].iconPath = '/static/location.png'
    }
    polyline.value.forEach(element => {
      element.color = '#8268de'
    })
    markers.value[idxn].iconPath = '/static/location-a.png'
    boxItem.value = markers.value[idxn].raw
    lastNodeIdx.value = idxn
  }
  showBox.value = true
}

const clickPolyline = (e) => {
  console.log('🚀:>> ', e)
}

const regionchange = (e) => {
  console.log('🚀:>> ', e)
}

</script>

<template>
  <view class="collect-map-page">
    <map :latitude="latitude" :longitude="longitude" :markers="markers" :polyline="polyline" :scale="scale"
      :show-location="true" @tap="clickMap" @polylinetap="clickPolyline" @markertap="clickMarker"
      @regionchange="regionchange">
      <view class="header-con">
        <view class="con" @click="clickOpenPopup">
          <image class="icon-img" src="/static/list.png"></image>
          <view class="icon-title">列表</view>
        </view>
        <view class="con" @click="clickCollect">
          <image class="icon-img" src="/static/collect.png"></image>
          <view class="icon-title">采集</view>
        </view>
      </view>

      <view class="control-con">
        <view class="local">
          <image class="local-img" src="/static/local.png"></image>
        </view>
      </view>

      <view class="box" v-show="showBox">
        <BaseInfoCard :item="boxItem" :tab="tab" @del="delItem" />
      </view>
    </map>

    <wd-popup v-model="show" position="left" safe-area-inset-bottom custom-style="width: 80%" @close="close">
      <view class="tab-con">
        <wd-tabs v-model="tab" @change="handleTabChange" auto-line-width>
          <wd-tab title="段落">
            <view class="main-content">
              <scroll-view scroll-y class="scroll-y">
                <view class="list-con">
                  <BaseInfoCard v-for="i in polyline" :key="i.id" :item="i.raw" :tab="tab" @del="delItem" />
                </view>
              </scroll-view>
            </view>
          </wd-tab>
          <wd-tab title="节点">
            <view class="main-content">
              <scroll-view scroll-y class="scroll-y">
                <view class="list-con">
                  <BaseInfoCard v-for="i in markers" :key="i.id" :item="i.raw" :tab="tab" @del="delItem" />
                </view>
              </scroll-view>
            </view>
          </wd-tab>
        </wd-tabs>
      </view>

      <view class="footer">
        <view class="container">
          <wd-button custom-class="custom-btn" type="primary" :loading="loading" block :round="false"
            @click="clickAdd(tab)">新建{{ tab === 0 ? '段落' : '节点' }}</wd-button>
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

  .box {
    position: absolute;
    bottom: 100rpx;
    left: 30rpx;
    right: 30rpx;
    background-color: #fff;
    border-radius: 8rpx;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
  }

  // popup
  .tab-con {
    width: 80%;
    position: fixed;
    left: 0;
    right: 0;
    top: env(safe-area-inset-top);
    z-index: 999;
  }

  .main-content {
    height: calc(100vh - 30rpx - env(safe-area-inset-top));
    z-index: 99;


    .scroll-y {
      height: calc(100vh - 30rpx - env(safe-area-inset-bottom));
    }

    .list-con {
      padding-bottom: calc(env(safe-area-inset-bottom) + 80rpx);
    }
  }

  .footer {
    background: #fff;
    width: 80%;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;

    .container {
      padding: 20rpx;
      padding-bottom: env(safe-area-inset-bottom);
    }
  }
}
</style>
