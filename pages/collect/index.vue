<script setup>
import { ref } from 'vue'
import { getCollectListApi } from '@/api'
import { onReachBottom, onShow } from '@dcloudio/uni-app'

const list = ref([])
const total = ref(0)
const state = ref('loading')
const loading = ref(false)
const query = ref({
  pageNum: 1,
  pageSize: 10,
  projectName: '',
  order: 'asc',
  publishStatusCode: 'unpublished'
})

const getList = async () => {
  loading.value = true
  const res = await getCollectListApi(query.value)
  if (res.code === 200) {
    list.value = [...list.value, ...res.rows]
    total.value = res.total
    loading.value = false
  }
  if (!list.value.length) {
    state.value = 'error'
  } else if (list.value.length === total.value) {
    state.value = 'finished'
  }
}

const loadMore = async () => {
  if (state.value === 'finished') {
    return
  }
  query.value.pageNum++
  getList()
  state.value = 'loading'
}

const search = (val) => {
  state.value = 'loading'
  query.value.projectName = val
  query.value.pageNum = 1
  list.value = []
  total.value = 0
  getList()
}

onReachBottom(() => {
  if (!list.value.length) {
    state.value = 'error'
  } else if (list.value.length < total.value) {
    loadMore()
  } else if (list.value.length === total.value) {
    state.value = 'finished'
  }
})

onShow(() => {
  query.value.projectName = ''
  search()
})

const clickDetail = (i) => {
  uni.setStorage({
    key: 'info',
    data: {
      projectName: i.projectName,
      projectStationName: i.projectStationName
    },
    success: () => {
      const str = i ? `projectId=${i.projectId}&projectStationLineId=${i.projectStationLineId}&projectStationId=${i.projectStationId}` : ''
      uni.navigateTo({
        url: `/pages/collect/map?${str}`
      })
    }
  })

}

const tab = ref(0)
const handleTabChange = ({ index }) => {
  tab.value = index
  query.value.publishStatusCode = index === 0 ? 'unpublished' : 'published'
  search()
}

</script>

<template>
  <view class="index-page">
    <BaseSearch v-model.trim="query.projectName" @search="search">
      <wd-tabs v-model="tab" @change="handleTabChange" auto-line-width>
        <wd-tab title="待采集"></wd-tab>
        <wd-tab title="已发布"></wd-tab>
      </wd-tabs>
    </BaseSearch>

    <BaseLoading :loading="loading" v-if="loading && !list.length" />

    <view class="list-con" v-else>
      <view class="list-item" v-for="i in list" :key="i.projectId">
        <wd-card>
          <template #title>
            <view class="title-con">
              <view>{{ i.projectName }}</view>
            </view>
          </template>
          <view class="content">
            <view class="item-info">
              <view class="label">项目经理：</view>
              <view class="value">{{ i.projectManagerName }}</view>
            </view>
            <view class="item-info">
              <view class="label">建设单位：</view>
              <view class="value">{{ i.buildCompany }}</view>
            </view>
            <view class="item-info">
              <view class="label">站点名称：</view>
              <view class="value">{{ i.projectStationName }}</view>
            </view>
            <view class="item-info">
              <view class="label">项目所属公司：</view>
              <view class="value">{{ i.projectOwnershipCompanyName }}</view>
            </view>
          </view>
          <template #footer>
            <view class="footer">
              <view class="item-info" style="display: flex; align-items: center;">
                <view class="label">更新时间：</view>
                <view class="value">{{ i.lineVersionsCreateTime }}</view>
              </view>
              <view style="display: flex; align-items: center;">
                <wd-button custom-class="btn" size="small" :round="false" type="primary" @click="clickDetail(i)">
                  {{ tab === 0 ? '待采集' : '已发布' }}
                </wd-button>
              </view>
            </view>
          </template>
        </wd-card>
      </view>
      <wd-loadmore :state="state" @reload="loadMore" :loading-props="{ size: 20 }" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.index-page {
  .list-con {
    margin-top: 20rpx;

    .list-item {
      margin-bottom: 20rpx;

      .title-con {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .status-tip {
          padding: 6rpx 8rpx;
          border-radius: 4rpx;
          font-size: 24rpx;
          color: #fff;
        }
      }

      .content {
        .item-info {
          display: flex;
          align-items: center;
          margin-bottom: 10rpx;
          width: 100%;

          .label {
            color: #666;
          }

          .value {
            font-weight: 400;
            color: #333;
          }
        }
      }

      .footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 10rpx;
      }
    }

    :deep(.wd-card__footer) {
      padding: 0;
    }

    :deep(.btn) {
      display: flex;
      align-items: center;
    }

    :deep(.fab-con .wd-fab__trigger) {
      width: 70rpx !important;
      height: 70rpx !important;
    }
  }
}
</style>
