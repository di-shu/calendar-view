<template>
  <div class="color-picker-wrap">
    <div
      :style="{ backgroundColor: eventColor }"
      class="color-picker-show-button"
      @click="isColorPickerVisible = !isColorPickerVisible"
    ></div>
    <Vue3ColorPicker
      v-show="isColorPickerVisible"
      v-model="eventColor"
      mode="solid"
      :showColorList="false"
      :showEyeDrop="false"
      type="RGBA"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import { Vue3ColorPicker } from '@cyhnkckali/vue3-color-picker'

const props = defineProps({
  defaultBgColor: {
    type: String,
    default: '#3b86ff'
  }
})

const emit = defineEmits(['change'])

const eventColor = ref<string>(props.defaultBgColor)
const isColorPickerVisible = ref<boolean>(false)

watch(
  eventColor,
  (newColor) => {
    emit('change', newColor)
  },
  { immediate: true }
)
</script>
<style scoped>
.color-picker-wrap {
  position: relative;
}
.color-picker-show-button {
  width: 21px;
  height: 21px;
  border-radius: 4px;
  cursor: pointer;
}
:deep(.ck-cp-container) {
  position: absolute;
  top: 10px;
  left: 21px;
}
</style>
