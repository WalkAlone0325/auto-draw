<script setup>
import { ref } from 'vue'
const props = defineProps({
  placeholder: {
    type: String,
    default: '请输入项目名称'
  },
  value: {
    type: String,
    default: ''
  }
})

const value = ref(props.value)

const emit = defineEmits(['search'])

const search = () => {
  if (value.value) {
    emit('search', value.value)
  }
}

const cancel = () => {
  if (value.value) {
    value.value = ''
    emit('search', value.value)
  }
}
</script>

<template>
  <wd-sticky>
    <view style="width: 100vw;">
      <wd-search placeholder-left v-model="value" @search="search" @clear="cancel" @cancel="cancel"
        :placeholder="placeholder" />
    </view>
  </wd-sticky>
</template>

<style lang="scss" scoped></style>
