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
    <div className="px-6">
      <div
        className="relative space-y-2"
        onDrop={onDrop}
        onDragOver={handleDragOver}
      >
        <label htmlFor="user-image">
          <h3 className="text-lg font-semibold text-gray-700">
            Upload Your Photo
          </h3>
        </label>
        <input
          id="user-image"
          type="file"
          onChange={onChange}
          accept="image/*"
          className="hidden"
        />
        <label
          htmlFor="user-image"
          className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors duration-300 hover:border-purple-500 active:border-purple-500"
        >
          <UploadIcon className="mr-2 h-8 w-8 text-gray-400" />
          <span className="text-gray-600">Choose a file or drag it here</span>
        </label>

        <ErrorMessage visible={uploadStatus === EHttpStatuses.error} />
      </div>
    </div>
  )
}
