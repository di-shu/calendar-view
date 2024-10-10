<template>
  <div id="full-calendar-wrapper" class="full-calendar-wrapper">
    <full-calendar :options="calendarOptions">
      <template v-slot:eventContent="arg">
        <dropdown :distance="10">
          <tooltip :distance="10" :popperClass="{ empty: !arg.event.extendedProps?.description }">
            <template #popper>
              {{ arg.event.extendedProps.description }}
            </template>
            <div class="event-text" @click="setEditData(arg)">{{ arg.event.title }}</div>
          </tooltip>
          <template #popper>
            <div class="edit-event-wrap">
              <input
                :value="editEventTitle"
                class="tooltip-content"
                placeholder="Title"
                @input="handleTitleInput"
              />
              <vue-date-picker v-model="editDateRange" :timezone="{ timezone: 'UTC' }" range />
              <input v-model="editDescription" type="text" placeholder="Description" />
              <color-picker :default-bg-color="editColor" @change="editColor = $event" />
              <div class="edit-buttons">
                <button class="delete-button" @click="deleteEvent">Delete</button>
                <button class="discard-button" @click="setEditData(arg)">Discard</button>
                <button class="edit-button" @click="handleEditEvent">Edit</button>
              </div>
            </div>
          </template>
        </dropdown>
      </template>
    </full-calendar>
    <create-event-modal
      v-if="isModalVisible && modalInitialDateRange"
      :initial-date-range="modalInitialDateRange"
      @close="isModalVisible = false"
      @provide-payload="handleEventCreate"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import VueDatePicker from '@vuepic/vue-datepicker'
import CreateEventModal from './ CreateEventModal.vue'
import { useEventsStore } from '@/stores/eventsStore'
import { Dropdown, Tooltip } from 'floating-vue'
import type { ICreateEventPayload, IEvent } from '@/types/event'
import ColorPicker from './shared/ColorPicker.vue'
import type { CalendarOptions } from '@fullcalendar/core/index.js'

const maxChars = 30

const eventsStore = useEventsStore()

const editEventId = ref<string>('')
const editEventTitle = ref<string>('')
const editDescription = ref<string>('')
const editDateRange = ref<Date[]>()
const editColor = ref<string>('#3b86ff')
const modalInitialDateRange = ref<Date[]>()
const isModalVisible = ref(false)

const formatDateRange = (dates: Date[]) => {
  if (dates) {
    const endDate = dates[1]
    return {
      start: dates[0],
      ...(endDate ? { end: endDate } : {})
    }
  }
  return {}
}

const handleTitleInput = (event: Event) => {
  const inputElement = event.target as HTMLInputElement
  const value = inputElement.value

  if (value.length <= maxChars) {
    editEventTitle.value = value
  } else {
    editEventTitle.value = value.substring(0, maxChars)
  }
}

const setEditData = (data: any) => {
  const endDate = data.event._instance.range.end
  const startDate = data.event._instance.range.start
  editEventTitle.value = data.event.title
  editDescription.value = data.event.extendedProps.description
  editDateRange.value = [startDate, endDate ? endDate : startDate]
  editEventId.value = data.event.extendedProps.id
  if (data.event.backgroundColor) {
    editColor.value = data.event.backgroundColor
  }
}

const deleteEvent = () => {
  eventsStore.deleteEvent(editEventId.value)
}

const handleDateClick = (arg: any) => {
  isModalVisible.value = true
  // set initial start and end range
  modalInitialDateRange.value = [arg.date, new Date(new Date(arg.date).getTime() + 60 * 60 * 1000)]
}

const handleEditEvent = () => {
  const eventData: IEvent = {
    title: editEventTitle.value,
    description: editDescription.value,
    backgroundColor: editColor.value,
    borderColor: editColor.value,
    extendedProps: {
      id: editEventId.value
    },
    ...(editDateRange.value ? { ...formatDateRange(editDateRange.value) } : {})
  }
  eventsStore.updateEvent(eventData)
}

const handleEventCreate = (payload: ICreateEventPayload) => {
  const eventData = {
    title: payload.title,
    description: payload.description,
    backgroundColor: payload.backgroundColor,
    borderColor: payload.borderColor,
    ...formatDateRange(payload.dateRange)
  }
  eventsStore.addEvent(eventData)
  isModalVisible.value = false
}

const calendarOptions: CalendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  timeZone: 'UTC',
  initialView: 'dayGridMonth',
  selectMirror: false,
  slotDuration: '02:00:00',
  headerToolbar: {
    left: 'today,prev,next',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  slotLabelFormat: {
    hour: 'numeric',
    minute: '2-digit'
  },
  expandRows: true,
  nowIndicator: true,
  buttonText: {
    prev: 'Back',
    next: 'Next',
    today: 'Today',
    dayGridMonth: 'Month',
    timeGridWeek: 'Week',
    timeGridDay: 'Day'
  },
  editable: true,
  selectable: true,
  dateClick: handleDateClick,
  events: eventsStore.events,
  eventDidMount(event: any) {
    // This needed since an event does't apply color when creating on the MonthView
    if (event.backgroundColor) {
      const el = event.el as HTMLElement
      el.style.setProperty('background-color', event.backgroundColor)
      el.style.setProperty('border-color', event.backgroundColor)
    }
  }
}

onMounted(() => {
  // There is no another way to add custom slots to the calendar header
  const headerToolbar = document.querySelector('.fc-header-toolbar')
  if (headerToolbar) {
    const divEl = document.createElement('div')
    divEl.innerText = 'Calendar View'
    divEl.className = 'fc-toolbar-chunk'
    headerToolbar.appendChild(divEl)
  }
})
</script>
<style scoped>
:deep(.v-popper),
.edit-event-wrap {
  display: flex;
  flex-direction: column;
  row-gap: 30px;
}
.edit-event-wrap input {
  font-size: 9px;
}
:deep(.dp__input) {
  border: none;
  border-bottom: 1px solid #43425d80;
  border-radius: unset;
  font-size: 9px;
}
:deep(.v-popper),
.event-text {
  width: 100%;
  height: 100%;
}
.edit-buttons {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
