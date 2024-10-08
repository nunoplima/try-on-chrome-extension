import { EWorkerMessages } from './enums'

interface IWorkerMessage {
  type: EWorkerMessages
  error?: string
  data?: string
  tabUrl?: string
}

interface IApparelPhoto {
  photoUrl: string
  tabUrl: string
}

export type { IApparelPhoto, IWorkerMessage }
