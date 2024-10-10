export type EventDateType = string | Date | undefined

export interface IEvent {
  title: string
  start?: EventDateType
  description?: string
  end?: EventDateType
  date?: EventDateType
  backgroundColor?: string
  borderColor?: string
  extendedProps?: {
    id: string
  }
}

export interface ICreateEventPayload {
  id: string
  title: string
  dateRange: Date[]
  description?: string
  backgroundColor?: string
  borderColor?: string
}

export interface IUpdateEventPayload {
  id: string
  title?: string
  dateRange?: Date[]
  description?: string
  backgroundColor?: string
  borderColor?: string
}
