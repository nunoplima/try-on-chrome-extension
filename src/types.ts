import { EWorkerMessages } from './enums'

interface IWorkerMessage {
  type: EWorkerMessages
  error?: string
  data?: string
}

export type { IWorkerMessage }
