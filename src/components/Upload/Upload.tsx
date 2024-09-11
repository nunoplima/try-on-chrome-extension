import { Upload as UploadIcon } from 'lucide-react'
import { DragEventHandler, FC } from 'react'
import { EHttpStatuses } from '../../enums'
import ErrorMessage from '../ui/ErrorMessage'
import { IUpload } from './Upload.types'

export const Upload: FC<IUpload> = ({ onChange, onDrop, uploadStatus }) => {
  const handleDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
  }

  return (
    <div className="relative" onDrop={onDrop} onDragOver={handleDragOver}>
      <input
        id="user-image"
        type="file"
        onChange={onChange}
        accept="image/*"
        className="hidden"
      />
      <label
        htmlFor="user-image"
        className="flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-purple-300 p-2 transition-colors duration-300 hover:bg-purple-50"
      >
        <UploadIcon className="mr-2 h-4 w-4 text-purple-500" />
        <span className="text-sm text-purple-600">
          Choose a file or drag it here
        </span>
      </label>

      <ErrorMessage visible={uploadStatus === EHttpStatuses.error} />
    </div>
  )
}
