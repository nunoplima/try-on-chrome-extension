import { MouseEventHandler } from 'react'

interface IPreviousUploadedPhotos {
  previousUploadedPhotos: string[]
  setPreviousUploadedPhotos: (value: string[]) => void
  onPreviousUploadedPhotoClick: (value: string) => void
}

interface IPreviousUploadedPhotoCard {
  imageSrc: string
  onDelete: MouseEventHandler<HTMLButtonElement>
  onSelect: MouseEventHandler<HTMLDivElement>
}

interface IPreviousUploadedPhotosLabel {
  count: number
}

export type {
  IPreviousUploadedPhotoCard,
  IPreviousUploadedPhotos,
  IPreviousUploadedPhotosLabel,
}
