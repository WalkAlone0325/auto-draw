<script setup>
import { ref } from 'vue'
import { getProjectListApi, deleteProjectApi } from '@/api'
import { onReachBottom, onShow } from '@dcloudio/uni-app'

const list = ref([])
const total = ref(0)
const state = ref('loading')
const loading = ref(false)
const query = ref({
  pageNum: 1,
  pageSize: 10,
  projectName: '',
  order: 'asc'
})

const getList = async () => {
  loading.value = true
  const res = await getProjectListApi(query.value)
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
  uni.navigateTo({
    url: `/pages/index/form?${i ? `id=${i.projectId}` : ''}`
  })
}

const clickDelete = async (i) => {
  uni.showModal({
    title: '提示',
    content: '确定删除吗？',
    success: async (res) => {
      if (res.confirm) {
        const res = await deleteProjectApi(i.projectId)
        if (res.code === 200) {
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          })
          search()
        }
      }
    }
  })
}

</script>

<template>
  <view class="index-page">
    <BaseSearch v-model.trim="query.projectName" @search="search" />

    <BaseLoading :loading="loading" v-if="loading && !list.length" />

    <view class="list-con" v-else>
      <view class="list-item" v-for="i in list" :key="i.projectId">
        <wd-card>
          <template #title>
            <view class="title-con">
              <view style="width: 90%;">{{ i.projectName }}</view>
              <view class="status-tip" :style="{ background: i.publishStatusCode === 'published' ? '#4D80F0' : '#fa4350' }">{{ i.publishStatusName }}</view>
            </view>
          </template>
          <view class="content">
            <view style="display: flex; justify-content: space-between;">
              <view class="item-info">
                <view class="label">项目经理：</view>
                <view class="value">{{ i.projectManagerName }}</view>
              </view>
              <view class="item-info">
                <view class="label">施工队长：</view>
                <view class="value">{{ i.spreadSuperintendentName }}</view>
              </view>
            </view>
            <view class="item-info">
              <view class="label">建设单位：</view>
              <view class="value">{{ i.buildCompany }}</view>
            </view>
            <view class="item-info">
              <view class="label">项目版本：</view>
              <view class="value">{{ i.projectVersions }}</view>
            </view>
          </view>
          <template #footer>
            <view class="footer">
              <view style="display: flex;">
                <view class="value" v-if="i.projectVersionsCreateTime" style="margin-right: 30rpx;">{{ i.projectVersionsCreateTime }}</view>
                <view class="value">{{ i.projectOwnershipCompanyName }}</view>
              </view>
              <view style="display: flex; align-items: center;">
                <wd-button type="text" custom-class="delete-btn" @click="clickDelete(i)">删除</wd-button>
                <wd-button type="text" @click="clickDetail(i)">查看</wd-button>
              </view>
            </view>
          </template>
        </wd-card>
      </view>
      <wd-loadmore :state="state" @reload="loadMore" :loading-props="{ size: 20 }" />
    </view>

    <wd-fab :expandable="false" @click="clickDetail"></wd-fab>
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

    :deep(.delete-btn) {
      color: #fa4350;
      margin-right: 30rpx;
    }

    :deep(.fab-con .wd-fab__trigger) {
      width: 70rpx !important;
      height: 70rpx !important;
    }
  }
}
</style>
