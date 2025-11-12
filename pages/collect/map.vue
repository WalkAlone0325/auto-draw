<script setup>
import { ref } from 'vue'
import { getParagraphListApi, getNodeListApi, deleteSectionApi, deleteNodeApi, publishBatchApi } from '@/api'
import { onLoad } from '@dcloudio/uni-app'

const scale = ref(20)
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

const clickLocal = () => {
  latitude.value = ''
  longitude.value = ''
  initMap()
}

const map = ref(null)

onLoad(() => {
  // initMap()
  uni.$on('refresh', async () => {
    show.value = false
    pTotal.value = 0
    polyline.value = []
    getParagraphList()
    nTotal.value = 0
    markers.value = []
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
onLoad(async (option) => {
  if (option) {
    uni.showLoading({ title: '加载中...' })
    param.value = option
    pTotal.value = 0
    nTotal.value = 0
    markers.value = []
    polyline.value = []
    await getParagraphList()
    await getNodeList()
    uni.hideLoading()
  }
})

const tab = ref(0)
// 点击打开弹窗
const clickOpenPopup = () => {
  list.value = []
  if (tab.value == 0) {
    list.value = polyline.value
    total.value = polyline.value.length
  } else {
    list.value = markers.value.filter(i => !i.isHidden)
    total.value = markers.value.filter(i => !i.isHidden).length
  }
  show.value = true
}

const close = () => {
  show.value = false
}

const handleTabChange = ({ index }) => {
  tab.value = index
  list.value = []
  query.value.pageNum = 1
  if (tab.value === 0) {
    list.value = polyline.value
  } else {
    list.value = markers.value.filter(i => !i.isHidden)
  }
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

// 批量创建段落
const clickAddMulti = () => {
  const queryStr = `projectStationLineId=${param.value.projectStationLineId}&projectStationId=${param.value.projectStationId}&projectId=${param.value.projectId}`
  uni.navigateTo({
    url: '/pages/collect/multi-stage-form?' + queryStr
  })
}

const clickCollect = () => {
  const queryStr = `projectStationLineId=${param.value.projectStationLineId}&projectStationId=${param.value.projectStationId}&projectId=${param.value.projectId}&projectName=${param.value.projectName}&show=${nTotal.value}`
  uni.navigateTo({
    url: '/pages/collect/form?' + queryStr
  })
}

const loading = ref(false)
const pTotal = ref(0)
const nTotal = ref(0)
const list = ref([])
const total = ref(0)
const query = ref({
  // pageNum: 1,
  // pageSize: 10,
  order: 'asc'
})

// 计算数量
const calcCount = (data, curItem, type) => {
  let len
  if (type) {
    const res = data.map(i => `${(Number(i.startNodePlaceLatitude) + Number(i.endNodePlaceLatitude)) / 2},${(Number(i.startNodePlaceLongitude) + Number(i.endNodePlaceLongitude)) / 2}`)
    const cur = `${(Number(curItem.startNodePlaceLatitude) + Number(curItem.endNodePlaceLatitude)) / 2},${(Number(curItem.startNodePlaceLongitude) + Number(curItem.endNodePlaceLongitude)) / 2}`
    len = res.filter(i => i === cur).length
  } else {
    const res = data.map(i => `${i.nodePlaceLatitude},${i.nodePlaceLongitude}`)
    const cur = `${curItem.nodePlaceLatitude},${curItem.nodePlaceLongitude}`
    len = res.filter(i => i == cur).length
  }
  return len
}

// 获取段落
const getParagraphList = async () => {
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
            { label: '段落名称', value: i.sectionNameName },
            { label: '段落距离', value: (i.sectionDistance || 0) + '米', row: 1 },
            { label: '段落类型', value: i.sectionTypeName, row: 2 },
            { label: '段落属性', value: i.sectionAttributeName, row: 1 },
            { label: '段落数量', value: i.sectionMaterialsCount, row: 2 }
          ]
        },
        id: idx + 9000001,
        count: calcCount(data, i, 'isHidden') || 1,
        // iconPath: '/static/polyline.png',
        iconPath: `/static/map/san${calcCount(data, i, 'isHidden') || 1}.png`,
        width: 31,
        height: 27,
        anchor: { x: 0.5, y: 0.5 },
        latitude: (Number(i.startNodePlaceLatitude) + Number(i.endNodePlaceLatitude)) / 2,
        longitude: (Number(i.startNodePlaceLongitude) + Number(i.endNodePlaceLongitude)) / 2
      })
      return {
        id: i.projectStationLineSectionId,
        pId: idx + 9000001,
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
      }
    })
    markers.value = [...arr, ...markers.value]
    pTotal.value = res.total
  }
}

// 获取节点
const getNodeList = async () => {
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
          { label: '节点属性', value: i.nodeAttributeName, row: 1 },
          { label: '杆路类型', value: i.nodeTypeName, row: 2 },
          { label: '节点类型', value: i.polePathTypeName, row: 1 },
          { label: '节点名称', value: i.nodeNameName, row: 2 },
          { label: '节点规格', value: i.nodeSpecificationName, row: 1 }
        ]
      },
      id: i.projectStationLineNodeId,
      latitude: Number(i.nodePlaceLatitude),
      longitude: Number(i.nodePlaceLongitude),
      count: calcCount(data, i) || 1,
      // iconPath: '/static/location.png',
      iconPath: `/static/map/loc${calcCount(data, i) || 1}.png`,
      width: 17,
      height: 26
    }))
    markers.value = [...nodeMarkers, ...markers.value]
    clickMarker({ detail: { markerId: nodeMarkers[0].id } })
    nTotal.value = res.total
  } else {
    initMap()
  }
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
          show.value = false
          polyline.value = []
          markers.value = []
          pTotal.value = 0
          nTotal.value = 0
          showBox.value = false
          query.value.pageNum = 1
          getNodeList()
          getParagraphList()
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
const allBox = ref([])
const currentSwiper = ref(0)

const changeSwiper = (e) => {
  currentSwiper.value = e.detail.current
}

const clickMarker = (e) => {
  currentSwiper.value = 0
  const { markerId } = e.detail
  console.log('🚀:>> markerId: ', markerId)
  const idx = markers.value.findIndex(i => i.id === markerId)
  showBox.value = true

  // 段落
  if(markerId > 9000000 && markers.value[idx].isHidden) {
    const all = markers.value.filter(i => i.isHidden && i.latitude === markers.value[idx].latitude && i.longitude === markers.value[idx].longitude)
    console.log('🚀:>> all: ', all)
    allBox.value = all
    tab.value = 0
    // 点
    markers.value.forEach((i, index) => {
      if (i.isHidden) {
        i.iconPath = `/static/map/san${i.count}.png`
        if (index === idx) {
          markers.value[index].iconPath = `/static/map/a-san${markers.value[index].count}.png`
        }
      } else {
        i.iconPath = `/static/map/loc${i.count}.png`
      }
    })

    // 线
    polyline.value.forEach((i, index) => {
      if (i.pId === markerId) {
        i.color = '#d81e06'
      } else {
        i.color = '#8268de'
      }
    })
  } else {
    tab.value = 1
    const all = markers.value.filter(i => !i.isHidden && i.latitude === markers.value[idx].latitude && i.longitude === markers.value[idx].longitude)
    allBox.value = all
    markers.value.forEach((i, index) => {
      if (!i.isHidden) {
        i.iconPath = `/static/map/loc${i.count}.png`
        if (index === idx) {
          markers.value[index].iconPath = `/static/map/a-loc${markers.value[index].count}.png`
        }
      } else {
        i.iconPath = `/static/map/san${i.count}.png`
      }
    })
    // 线
    polyline.value.forEach(i => {
      i.color = '#8268de'
    })
  }
}

const clickPolyline = (e) => {
}

const publishLoading = ref(false)
const handlePublish = async () => {
  const options = {
    title: '确认发布吗？',
    message: '确认发布吗？',
    editable: false,
    placeholderText: '请输入版本备注信息',
    success: async (res) => {
      if (res.confirm) {
        // if (!res.content) {
        //   uni.showToast({ title: '请输入版本备注', icon: 'none', complete: () => uni.showModal(options) })
        //   return
        // }
        publishLoading.value = true
        const resD = await publishBatchApi({
          projectStationLineId: param.value.projectStationLineId,
          publishStatusCode: 'published',
          // versionsRemark: res.content.trim()
        })
        if (resD.code === 200) {
          uni.showToast({
            title: '发布成功',
            icon: 'success'
          })
        }
        show.value = false
        publishLoading.value = false
        setTimeout(() => {
          uni.navigateBack()
        }, 1000)
      }
    }
  }
  uni.showModal(options)
}

const showCanvas = ref(false)
const update = () => {
  showCanvas.value = true
  uni.canvasToTempFilePath({
    canvasId: 'myCanvas',
    fileType: 'png',
    quality: 1, //图片质量
    width: '100vw',
    height: '100vh',
    success: (res) => {
      console.log('🚀:>> res: ', res.tempFilePath)
      uni.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success(res) {
          uni.showToast({
            title: '已保存到相册',
            duration: 2000
          })
        }
      })
    }
  })
}

</script>

<template>
  <view class="collect-map-page">
    <map ref="map" :latitude="latitude" :longitude="longitude" :markers="markers" :polyline="polyline" :scale="scale"
      :show-location="true" @tap="clickMap" @polylinetap="clickPolyline" @markertap="clickMarker">
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
        <view class="local" @click="clickLocal">
          <image class="local-img" src="/static/local.png"></image>
        </view>
      </view>

      <view class="box-con" v-show="showBox">
        <swiper @change="changeSwiper" :current="currentSwiper" :style="{ height: tab == 1 ? '300rpx' : '340rpx' }">
          <swiper-item class="box" v-for="i in allBox" :key="i.id">
            <BaseInfoCard class="box-item" :item="i.raw" :tab="tab" @del="delItem" />
          </swiper-item>
        </swiper>
      </view>

      <view class="btn-box">
        <view class="btn-con">
          <!-- <wd-button custom-class="custom-btn" type="primary" :loading="publishLoading" :round="false"
            @click="update">上传截图</wd-button>
          <view style="width: 30rpx;" /> -->
          <wd-button custom-class="custom-btn" type="primary" :loading="publishLoading" :round="false"
            @click="handlePublish">发布</wd-button>
        </view>
      </view>
    </map>

    <wd-popup v-model="show" position="left" safe-area-inset-bottom custom-style="width: 80%" @close="close">
      <view class="tab-con">
        <wd-tabs v-model="tab" @change="handleTabChange" auto-line-width>
          <wd-tab title="段落"></wd-tab>
          <wd-tab title="节点"></wd-tab>
        </wd-tabs>
      </view>
      <view class="main-content">
        <scroll-view scroll-y class="scroll-y">
          <view class="list-con">
            <BaseInfoCard v-for="i in list" :key="i.id" :item="i.raw" :tab="tab" @del="delItem" />
          </view>

          <wd-status-tip image="content" tip="暂无内容" v-if="total === 0" />
        </scroll-view>
      </view>

      <view class="footer">
        <view class="container" :style="tab == 0 ? { display: 'flex', justifyContent: 'center' } : {}">
          <wd-button custom-class="custom-btn" type="primary" :loading="loading" block :round="false"
            @click="clickAdd(tab)">新建{{ tab === 0 ? '段落' : '节点' }}</wd-button>

          <view style="width: 30rpx;" v-if="tab === 0" />
          <wd-button custom-class="custom-btn" v-if="tab === 0" type="primary" :loading="loading" block :round="false"
            @click="clickAddMulti">批量选择段落</wd-button>
        </view>
      </view>
    </wd-popup>

  </view>
</template>

<style lang="scss" scoped>
.map-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}


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
      width: 50rpx;
      height: 50rpx;
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
      bottom: 530rpx;
      right: 60rpx;
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

  .box-con {
    position: absolute;
    bottom: calc(140rpx + env(safe-area-inset-bottom));
    left: 0;
    right: 0;
    width: 100%;
  }

  .box {
    margin: 0 30rpx;
    border-radius: 8rpx;
    box-sizing: border-box;

    :deep(.info-card) {
      max-width: calc(100% - 60rpx);
    }
  }

  .btn-box {
    padding-bottom: calc(env(safe-area-inset-bottom) + 10rpx);
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .btn-con {
      display: flex;
      padding-top: 20rpx;
      margin-right: 30rpx;
    }
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
    height: calc(100vh - 80px - 42px);
    z-index: 99;

    .scroll-y {
      height: calc(100vh - 80px);
    }

    .list-con {
      padding-top: 42px;
      // padding-bottom: calc(env(safe-area-inset-bottom) + 80rpx);
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
    padding-bottom: env(safe-area-inset-bottom);

    .container {
      padding: 20rpx;
    }
  }
}
</style>
