<script setup>
import { ref, watchEffect } from 'vue'
import { getTypeApi, getDictApi, getSpecApi, getAttrApi, getCodeApi, addNodeApi, getNodeDetailApi, updateNodeApi, createNodeDefaultApi, copyNodeDefaultApi } from '@/api'
import { onLoad, onShow } from '@dcloudio/uni-app'

const model = ref({
  nodeCode: '',
  nodeTypeId: '',
  nodeNameId: '',
  nodeSpecificationId: '',
  nodeAttributeId: '',
  polePathTypeId: '',
  projectStationLineId: '',
  nodePlace: '',
  nodePlaceLongitude: '',
  nodePlaceLatitude: ''
})
const rules = ref({
  nodePlace: [
    { required: true, message: '请选择节点坐标', trigger: 'blur' }
  ],
  nodeCode: [
    { required: true, message: '请输入节点编号', trigger: 'blur' }
  ],
  nodeTypeId: [
    { required: true, message: '请选择节点类型', trigger: 'blur' }
  ],
  nodeNameId: [
    { required: true, message: '请选择节点名称', trigger: 'blur' }
  ],
  polePathTypeId: [
    { required: true, message: '请选择杆路类型', trigger: 'blur' }
  ],
})
const param = ref({
  projectStationLineId: '',
  projectStationId: '',
  projectId: '',
  projectName: '',
})

const dist = ref({
  poleColumns: [],
  nodeColumns: [],
  nameColumns: [],
  attrTypeColumns: []
})

const getDict = async (code, key) => {
  const res = await getDictApi(code)
  if (res.code === 200) {
    dist.value[key] = res.data
    console.log(dist.value[key])
  }
}

const specColumns = ref([])
const attrColumns = ref([])
const getType = async (type, key) => {
  const res = await getTypeApi(type)
  if (res.code === 200) {
    dist.value[key] = res.data
  }
}
const getSpec = async (code, key) => {
  const res = await getSpecApi(code)
  if (res.code === 200) {
    specColumns.value = res.data
  }
}
const getAttr = async (code, key) => {
  const res = await getAttrApi(code)
  if (res.code === 200) {
    attrColumns.value = res.data
  }
}
// 节点编号
const getCode = async (code) => {
  const res = await getCodeApi(code)
  if (res.code === 200) {
    model.value.nodeCode = code + 'node' + res.data
  }
}

const clickNode = (key) => {
  uni.navigateTo({
    url: '/pages/collect/select-map?key=' + key
  })
}

const loading = ref(false)
const form = ref()
const curId = ref('')

const handleSubmit = async () => {
  loading.value = true
  const { valid } = await form.value.validate()
  if (valid) {
    if (model.value.projectStationLineNodeId) {
      const res = await updateNodeApi({
        ...model.value,
        projectStationLineId: curId.value
      })
      if (res.code === 200) {
        uni.showToast({
          title: '更新成功'
        })
        loading.value = false
        uni.navigateBack({
          delta: 1,
          success: () => {
            uni.$emit('refresh')
          }
        })
      } else {
        loading.value = false
      }
    } else {
      const res = await addNodeApi({
        ...model.value,
        projectStationLineId: curId.value
      })
      if (res.code === 200) {
        uni.showToast({
          title: '新增成功'
        })
        loading.value = false
        uni.navigateBack({
          delta: 1,
          success: () => {
            uni.$emit('refresh')
          }
        })
      } else {
        loading.value = false
      }
    }
  }
}

// 获取详情
const getDetail = async (id) => {
  const res = await getNodeDetailApi(id)
  if (res.code === 200) {
    model.value = {
      ...res.data,
      nodePlace: res.data.nodePlaceLatitude + ',' + res.data.nodePlaceLongitude,
      projectStationLineNodeId: isCopy.value ? '' : res.data.projectStationLineNodeId
    }
    initDefaultData()
  }
}

onShow(() => {
  uni.$on('local', (data) => {
    if (data.key === 'nodePlace') {
      model.value.nodePlace = data.latitude + ',' + data.longitude
      model.value.nodePlaceLongitude = data.longitude
      model.value.nodePlaceLatitude = data.latitude
    } else if (data.key === 'nodeReferenceSubstance') {
      model.value.nodeReferenceSubstance = data.latitude + ',' + data.longitude
      model.value.nodeReferenceSubstanceLatitude = data.latitude
      model.value.nodeReferenceSubstanceLongitude = data.longitude
    }
  })
})

// 创建节点默认值
const getCreateDefault = async (id) => {
  const res = await createNodeDefaultApi(id)
  if (res.code === 200) {
    model.value = {
      ...res.data,
      nodePlace: res.data.nodePlaceLatitude ? res.data.nodePlaceLatitude + ',' + res.data.nodePlaceLongitude : ''
    }
  initDefaultData()
  }
}

// 复制节点默认值
const getCopyDefault = async (id) => {
  const res = await copyNodeDefaultApi(id)
  if (res.code === 200) {
    model.value = {
      ...res.data,
      nodePlace: res.data.nodePlaceLatitude ? res.data.nodePlaceLatitude + ',' + res.data.nodePlaceLongitude : '',
    }
  }
  initDefaultData()
}

// 杆路类型改变
const confirmPolePathType = ({ value }) => {
  model.value.nodeTypeId = ''
  model.value.nodeNameId = ''
  model.value.nodeSpecificationId = ''
  model.value.nodeAttributeId = ''
  dist.value.nodeColumns = []
  dist.value.nameColumns = []
  specColumns.value = []
  attrColumns.value = []
  getType(value, 'nodeColumns')
}
// 节点类型改变
const confirmNodeType = ({ value }) => {
  model.value.nodeNameId = ''
  model.value.nodeSpecificationId = ''
  model.value.nodeAttributeId = ''
  dist.value.nameColumns = []
  specColumns.value = []
  attrColumns.value = []
  getType(value, 'nameColumns')
}
// 节点名称改变
const confirmNodeName = ({ value }) => {
  model.value.nodeSpecificationId = ''
  model.value.nodeAttributeId = ''
  specColumns.value = []
  attrColumns.value = []
  getSpec(value, 'specColumns')
  getAttr(value, 'attrColumns')
}

const initDefaultData = async () => {
  await getType('1', 'poleColumns')
  if(model.value.polePathTypeId) {
    await getType(model.value.polePathTypeId, 'nodeColumns')
  }
  if(model.value.nodeTypeId) {
    await getType(model.value.nodeTypeId, 'nameColumns')
  }
  if(model.value.nodeNameId) {
    await getSpec(model.value.nodeNameId, 'specColumns')
    await getAttr(model.value.nodeNameId, 'attrColumns')
  }
}

const info = ref({})
const isCopy = ref(false)
onLoad((param) => {
  param.value = param
  isCopy.value = param.copy === 'copy'
  info.value = uni.getStorageSync('info')
  curId.value = param.projectStationLineId

  if (param.projectStationLineNodeId) {
    if (!isCopy.value) {
      getDetail(param.projectStationLineNodeId)
    } else {
      getCopyDefault(param.projectStationLineNodeId)
    }
    // getCode(param.projectStationLineId)
  } else {
    // getCode(param.projectStationLineId)
    getCreateDefault(param.projectStationLineId)
  }
})
</script>

<template>
  <view class="collect-form-page">
    <wd-toast />
    <view class="form-con">
      <view class="info-con">
        <view>项目名称：{{ info.projectName }}</view>
        <view>站点名称：{{ info.projectStationName }}</view>
      </view>

      <wd-form ref="form" :model="model" :rules="rules" errorType="toast">
        <wd-cell-group title="节点创建" border>
          <view @click="clickNode('nodePlace')">
            <wd-input prop="nodePlace" v-model="model.nodePlace" label="节点坐标" placeholder="请选择节点坐标" type="text"
              label-width="80px" readonly />
          </view>
          <wd-picker :columns="dist.poleColumns" label-key="text" label-width="80px" label="杆路类型" placeholder="请选择杆路类型"
            v-model="model.polePathTypeId" @confirm="confirmPolePathType" prop="polePathTypeId" />
          <wd-picker :columns="dist.nodeColumns" label-key="text" label-width="80px" label="节点类型" placeholder="请选择节点类型"
            v-model="model.nodeTypeId" prop="nodeTypeId" @confirm="confirmNodeType" />
          <wd-picker :columns="dist.nameColumns" label-key="text" label-width="80px" label="节点名称" placeholder="请选择节点名称"
            v-model="model.nodeNameId" prop="nodeNameId" @confirm="confirmNodeName" />
          <wd-input readonly label-width="80px" label="节点编号" placeholder="请选择节点编号" v-model="model.nodeCode"
            prop="nodeCode" />
          <wd-input prop="remark" v-model="model.remark" label="节点备注" placeholder="请输入节点备注" type="text"
            label-width="80px" />
          <wd-picker :columns="specColumns" label-key="text" label-width="80px" label="节点规格" placeholder="请选择节点规格"
            v-model="model.nodeSpecificationId" prop="nodeSpecificationId" />
          <wd-picker :columns="attrColumns" label-key="text" label-width="80px" label="节点属性" placeholder="请选择节点属性"
            v-model="model.nodeAttributeId" prop="nodeAttributeId" />
          <view @click="clickNode('nodeReferenceSubstance')">
            <wd-input prop="nodeReferenceSubstance" v-model="model.nodeReferenceSubstance" label="节点参照物坐标"
              placeholder="请选择参照物节点坐标" type="text" label-width="120px" readonly clearable />
          </view>
          <wd-picker :columns="dist.attrTypeColumns" label-key="dictLabel" value-key="dictValue" label-width="120px" label="节点参照物类型"
            placeholder="请选择节点参照物类型" v-model="model.nodeReferenceSubstanceTypeCode"
            prop="nodeReferenceSubstanceTypeCode" />
          <wd-input prop="nodeReferenceSubstanceName" v-model="model.nodeReferenceSubstanceName" label="节点参照物名称"
            placeholder="请输入节点参照物名称" type="text" label-width="120px" />
        </wd-cell-group>
      </wd-form>
    </view>
    <view class="footer">
      <wd-button custom-class="custom-btn" type="primary" :loading="loading" block :round="false"
        @click="handleSubmit">保存</wd-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.collect-form-page {
  width: 100%;
  height: 100vh;

  .form-con {
    padding: 30rpx;
    padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);

    .info-con {
      margin-bottom: 20rpx;
      background-color: #fff;
      padding: 20rpx;
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
