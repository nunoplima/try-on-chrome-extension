import { MouseEventHandler } from 'react'

interface IPreviousTryOnPhotos {
  previousTryOnPhotos: string[]
  setPreviousTryOnPhotos: (value: string[]) => void
  onPreviousUploadedPhotoClick: (value: string) => void
}

interface IPreviousTryOnPhotoCard {
  imageSrc: string
  onDelete: MouseEventHandler<HTMLButtonElement>
  onSelect: MouseEventHandler<HTMLDivElement>
}

interface IPreviousTryOnPhotosLabel {
  count: number
}

export type {
  IPreviousTryOnPhotoCard,
  IPreviousTryOnPhotos,
  IPreviousTryOnPhotosLabel,
}
