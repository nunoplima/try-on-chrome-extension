import { ChangeEvent, DragEventHandler } from 'react'
import { EHttpStatuses } from '../../enums'

interface IUpload {
  onDrop: DragEventHandler<HTMLDivElement>
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  uploadStatus: EHttpStatuses
}

export type { IUpload }
