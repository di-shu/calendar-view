<template>
  <div class="modal-background">
    <div class="event-modal">
      <div class="event-modal-body">
        <input
          :value="title"
          class="tooltip-content"
          placeholder="Title"
          @input="handleTitleInput"
          required
        />
        <vue-date-picker v-model="dateRange" range />
        <input v-model="description" type="text" placeholder="Description" />
        <color-picker @change="eventColor = $event" />
      </div>
      <div class="event-modal-buttons">
        <button class="discard-button" @click="$emit('close')">Cancel</button>
        <button class="edit-button" :disabled="isCreateButtonDisabled" @click="handleCreate">
          Create
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import ColorPicker from './shared/ColorPicker.vue'
import { ref, defineEmits, defineProps, computed, onBeforeMount } from 'vue'
import type { ICreateEventPayload } from '@/types/event'

const maxChars = 30

const emit = defineEmits(['close', 'provide-payload'])
const props = defineProps({
  initialDateRange: {
    type: Array<Date>,
    required: true
  }
})
const title = ref<string>('')
const description = ref<string>('')
const dateRange = ref<Date[]>([new Date(), new Date(new Date().getTime() + 60 * 60 * 1000)])
const eventColor = ref<string>()

const isCreateButtonDisabled = computed(() => {
  return title.value.trim() === '' || !dateRange.value
})

const handleTitleInput = (event: Event) => {
  const inputElement = event.target as HTMLInputElement
  const value = inputElement.value

  if (value.length <= maxChars) {
    title.value = value
  } else {
    title.value = value.substring(0, maxChars)
  }
}
const handleCreate = () => {
  const payload: ICreateEventPayload = {
    id: crypto.randomUUID(),
    title: title.value,
    description: description.value,
    dateRange: dateRange.value,
    backgroundColor: eventColor.value,
    borderColor: eventColor.value
  }
  emit('provide-payload', payload)
  emit('close')
}
onBeforeMount(() => {
  dateRange.value = props.initialDateRange
})
</script>
<style scoped>
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: calc(infinity);
}
.event-modal {
  padding: 20px;
  border: 1px solid #eaf0f4;
  box-shadow: 0px 3px 18px #00000029;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 10px;
}
.event-modal-body {
  display: flex;
  flex-direction: column;
  row-gap: 30px;
  margin-bottom: 37px;
}
</style>
