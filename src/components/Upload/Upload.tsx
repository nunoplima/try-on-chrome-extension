import { motion } from 'framer-motion'
import { Upload as UploadIcon } from 'lucide-react'
import { DragEventHandler, FC } from 'react'
import { EUploadStatuses } from '../../enums'
import { IUpload } from './Upload.types'

export const Upload: FC<IUpload> = ({ onChange, onDrop, uploadStatus }) => {
  const handleDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
  }

  return (
    <div
      className="relative space-y-2"
      onDrop={onDrop}
      onDragOver={handleDragOver}
    >
      <label
        htmlFor="user-image"
        className="text-lg font-semibold text-gray-700"
      >
        Upload Your Photo
      </label>
      <input
        id="user-image"
        type="file"
        onChange={onChange}
        className="hidden"
      />
      <label
        htmlFor="user-image"
        className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors duration-300 hover:border-purple-500 active:border-purple-500"
      >
        <UploadIcon className="mr-2 h-8 w-8 text-gray-400" />
        <span className="text-gray-600">Choose a file or drag it here</span>
      </label>

      {uploadStatus === EUploadStatuses.error && (
        <motion.p
          className="absolute -bottom-4 left-0 text-xs font-semibold text-red-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Oops, something went wrong... 😥
        </motion.p>
      )}
    </div>
  )
}
