<script setup>
import { ref } from 'vue'

defineProps({
  title: {
    type: String,
    default: '提示'
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const close = () => {
  emit('close', false)
}

const val = ref('')
const submit = () => {
  emit('submit', val.value)
}
</script>

<template>
  <view class="model-comp">
    <wd-popup custom-class="" :model-value="show" @close="close">
    <view class="modal-container">
      <view class="modal-header">
        <text class="modal-title">{{ title }}</text>
      </view>
      <view class="modal-content">
        <wd-input v-model="val" placeholder="请输入版本备注" />
      </view>
      <view class="modal-footer">
        <wd-button type="primary" @click="submit">确定</wd-button>
        <wd-button type="default" @click="close">取消</wd-button>
      </view>
    </view>
  </wd-popup>
  </view>
</template>

<style lang="scss" scoped>

.model-comp {
  .modal-container{
    width: 80vw;
    height: 30vh;
    background-color: #fff;
    border-radius: 10rpx;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #e5e5e5;
}

.modal-content {
  padding: 20rpx;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 20rpx;
}
</style>
