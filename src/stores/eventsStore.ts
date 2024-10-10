import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IEvent } from '@/types/event'

export const useEventsStore = defineStore('eventsStore', () => {
  const events = ref<IEvent[]>([
    {
      title: 'Interview',
      start: '2024-10-10T16:30:00',
      end: '2024-10-10T17:30:00',
      extendedProps: { id: crypto.randomUUID() }
    },
    {
      title: 'Meeting with Alex',
      start: '2024-10-13T12:30:00',
      end: '2024-10-14T13:30:00',
      description: 'Meeting with Alex',
      extendedProps: { id: crypto.randomUUID() }
    },
    {
      title: 'JS Course',
      start: '2024-10-08T12:30:00',
      end: '2024-10-09T13:30:00',
      description: 'Learn Inheritance',
      extendedProps: { id: crypto.randomUUID() }
    }
  ])

  function addEvent(payload: IEvent) {
    events.value.push({
      ...payload
    })
  }

  function updateEvent(payload: IEvent) {
    const index = events.value.findIndex(
      (event) => event.extendedProps?.id === payload.extendedProps?.id
    )
    if (index > -1) {
      events.value[index] = { ...events.value[index], ...payload }
    }
  }

  function deleteEvent(id: string) {
    const index = events.value.findIndex((event) => event.extendedProps?.id === id)
    if (index > -1) {
      events.value.splice(index, 1)
    }
  }

  return { events, addEvent, updateEvent, deleteEvent }
})
