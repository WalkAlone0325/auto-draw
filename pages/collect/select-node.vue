<script setup>
import { getNodeListApi } from '@/api/collect'
import { ref } from 'vue'
import {onLoad} from '@dcloudio/uni-app'

const list = ref([])
const nTotal = ref(0)
onLoad((options) => {
  getNodeList(options.id)
})

// 获取节点
const getNodeList = async (projectStationLineId) => {
  uni.showLoading({ title: '加载中', mask: true })
  const res = await getNodeListApi({
    projectStationLineId: projectStationLineId,
  })
  if (res.code === 200 && res.rows.length > 0) {
    const data = res.rows

    const nodeMarkers = data.map((i, idx) => ({
      ...i,
        infos: [
          { label: '节点编号', value: i.nodeCode },
          { label: '节点属性', value: i.nodeClassesName },
          { label: '杆路类型', value: i.nodeTypeName },
          { label: '节点类型', value: i.polePathTypeName },
          { label: '节点名称', value: i.nodeNameName },
          { label: '节点规格', value: i.nodeMaterialsCount }
        ]
    }))
    list.value = nodeMarkers
    nTotal.value = res.total
  }
  uni.hideLoading()
}

const select = (item) => {
  uni.navigateBack({
    delta: 1,
    success: () => {
      uni.$emit('selectNode', item)
    }
  })
}

</script>

<template>
  <view class="select-node-page">
    <view class="node-list">
      <BaseInfoCard v-for="i in list" :item="i" :tab="1" noBtn @select="select" />
    </view>
  </view>
</template>

<style lang="scss" scoped>

</style>
