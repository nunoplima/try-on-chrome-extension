import { ChangeEvent, DragEventHandler } from 'react'
import { EUploadStatuses } from '../../enums'

interface IUpload {
  onDrop: DragEventHandler<HTMLDivElement>
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  uploadStatus: EUploadStatuses
}

export type { IUpload }
