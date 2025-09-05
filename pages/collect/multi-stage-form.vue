<script setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { isArray } from '@/uni_modules/wot-design-uni/components/common/util'
import { getSectionDetailApi, getDistanceApi, addSectionApi, copySectionBatchApi, getNodeListApi, getSectionCodeApi, getAttrApi, getTypeApi, getSpecApi } from '@/api'

const loading = ref(false)
const form = ref(null)
const model = ref({
  desc: '',
  projectStationLineSectionIdList: [],
  projectStationLineId: '',
  sectionCode: '',
  sectionNameId: '',
  sectionTypeId: '',
  sectionClassesId: '',
  sectionDistance: '',
  sectionSpecificationId: '',
  sectionAttributeId: '',
  startStationLineNodeId: '',
  endStationLineNodeId: '',
})
const rules = ref({
  projectStationLineSectionIdList: [
    { required: true, message: '请选择段落', validator: (value) => {
        if (isArray(value) && value.length) {
          return Promise.resolve()
        } else {
          return Promise.reject()
        }
      }
    }
  ],
  sectionName: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ],
  sectionTypeId: [
    { required: true, message: '请选择段落类型', trigger: 'change' }
  ],
  sectionNameId: [
    { required: true, message: '请选择段落名称', trigger: 'change' }
  ],
  sectionClassesId: [
    { required: true, message: '请选择段落类别', trigger: 'change' }
  ],
  startStationLineNodeId: [
    { required: true, message: '请选择开始节点', trigger: 'change' }
  ],
  endStationLineNodeId: [
    { required: true, message: '请选择结束节点', trigger: 'change' }
  ],
  sectionDistance: [
    { required: true, message: '请输入距离', trigger: 'blur' }
  ],
  sectionMaterialsCount: [
    { required: true, message: '请输入段落数量', trigger: 'blur' }
  ],
})

// 提交
const handleSubmit = async () => {
  loading.value = true
  form.value.validate().then(async ({ valid, errors }) => {
    if (valid) {
        const res = await copySectionBatchApi(model.value)
        if (res.code === 200) {
          uni.showToast({
            title: '新增成功',
            icon: 'success'
          })
          setTimeout(() => {
            loading.value = false
            uni.navigateBack({
              delta: 1,
              success: () => {
                uni.$emit('refresh')
              }
            })
          }, 1000)
        }
      }
    loading.value = false
  })
}


// 详情
const getDetail = async (id) => {
  const res = await getSectionDetailApi(id)
  if (res.code === 200) {
    model.value = {
      ...res.data,
      projectStationLineSectionId: isCopy.value ? '' : res.data.projectStationLineSectionId
    }
  }
}

const list = ref([])
// 获取节点
const getNodeList = async (projectStationLineId) => {
  const res = await getNodeListApi({ projectStationLineId })
  if (res.code === 200) {
    list.value = res.rows
  }
}


const dist = ref({
  sectionCateColumns: [],
  sectionTypeColumns: [],
  sectionNameColumns: [],
})
const sectionSpecColumns = ref([])
const sectionAttrColumns = ref([])
const getType = async (type, key) => {
  const res = await getTypeApi(type)
  if (res.code === 200) {
    dist.value[key] = res.data
  }
}
const getSpec = async (code, key, type) => {
  const res = await getSpecApi(code)
  if (res.code === 200) {
    if (type === 'section') {
      sectionSpecColumns.value = res.data
    }
  }
}
const getAttr = async (code, key, type) => {
  const res = await getAttrApi(code)
  if (res.code === 200) {
    if (type === 'section') {
      sectionAttrColumns.value = res.data
    }
  }
}

// 选择段落
const clickSelect = () => {
  uni.navigateTo({
    url: '/pages/collect/section-select?projectStationLineId=' + model.value.projectStationLineId + '&vals=' + model.value.projectStationLineSectionIdList.join(',')
  })
}

const info = ref({})
const isCopy = ref(false)
onLoad(async (options) => {
  console.log('🚀:>> ', options)
  model.value.projectStationLineId = options.projectStationLineId
  // 复制
  isCopy.value = options.copy === 'copy'

  info.value = uni.getStorageSync('info')
  getNodeList(options.projectStationLineId)
  getType('2', 'sectionCateColumns')
  getType('129', 'sectionTypeColumns')
  getType('133', 'sectionNameColumns')
  getSpec('141', 'sectionSpecColumns', 'section')
  getAttr('141', 'sectionAttrColumns', 'section')
  if (options.id) {
    await getDetail(options.id)
  }
})

onShow(() => {
  uni.$on('sectionSelect', (res) => {
    console.log('🚀:>> ', res)
    model.value.projectStationLineSectionIdList = res
    model.value.desc = `批量数据段落( ${res.length} )条`
  })
})


</script>

<template>
  <view class="form-page">
    <wd-toast />
    <view class="form-con">
      <wd-form ref="form" :model="model" :rules="rules" errorType="toast">
        <wd-cell-group use-slot border>
          <template #title>
            <view>
              <view class="title">项目名称：{{ info.projectName }}</view>
              <view class="title">站点名称：{{ info.projectStationName }}</view>
            </view>
          </template>

          <view @click="clickSelect">
            <wd-input prop="projectStationLineSectionIdList" v-model="model.desc" label="选择段落" placeholder="请选择段落" type="text"
              label-width="80px" readonly />
          </view>
          <wd-picker :columns="dist.sectionCateColumns" label-key="text" label-width="80px" label="段落类别"
            placeholder="请选择段落类别" v-model="model.sectionClassesId" prop="sectionClassesId" />
          <wd-picker :columns="dist.sectionTypeColumns" label-key="text" label-width="80px" label="段落类型"
            placeholder="请选择段落类型" v-model="model.sectionTypeId" prop="sectionTypeId" />
          <wd-picker :columns="dist.sectionNameColumns" label-key="text" label-width="80px" label="段落名称"
            placeholder="请选择段落名称" v-model="model.sectionNameId" prop="sectionNameId" />
          <wd-picker :columns="sectionAttrColumns" label-key="text" label-width="80px" label="段落属性"
            placeholder="请选择段落属性" v-model="model.sectionAttributeId" prop="sectionAttributeId" />
          <wd-input prop="sectionMaterialsCount" v-model="model.sectionMaterialsCount" label="段落数量"
            placeholder="请输入段落数量" type="number" label-width="80px" />
        </wd-cell-group>
      </wd-form>
    </view>

    <view class="footer">
      <wd-button custom-class="custom-btn" type="primary" :loading="loading" block :round="false"
        @click="handleSubmit">保存</wd-button>
      <!-- <wd-button v-if="model.projectId" custom-class="custom-btn" type="success" :loading="loading" block :round="false"
        @click="handleSubmit('published')">发布</wd-button> -->
    </view>
  </view>
</template>

<style lang="scss" scoped>
.form-page {
  .form-con {
    padding: 30rpx;
    padding-bottom: 160rpx;

    .title {
      color: #333;
      font-weight: 500;
      font-size: 32rpx;
    }

    .site-item {
      margin: 20rpx 0 30rpx 0;
      background: #fff;

      .title-con {
        padding: 20rpx 30rpx;
        border-bottom: 1rpx solid #f5f5f5;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
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
    // z-index: 999;
  }

  :deep(.custom-btn) {
    width: 100%;
    margin: 0 10rpx;
    border-radius: 0 !important;
    opacity: 1;
  }

  :deep(.group) {
    margin-top: 30rpx;

    .wd-cell-group__title {
      display: flex;
      align-items: center;
    }
  }
}
</style>
