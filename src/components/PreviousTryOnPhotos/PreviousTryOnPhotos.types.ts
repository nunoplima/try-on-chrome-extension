import { MouseEventHandler } from 'react'

interface IPreviousTryOnPhotos {
  previousTryOnPhotos: string[]
  setPreviousTryOnPhotos: (value: string[]) => void
  onPreviousUploadedPhotoClick: (value: string) => void
  onDownloadPhoto: (value: string) => MouseEventHandler<HTMLButtonElement>
}

interface IPreviousTryOnPhotoCard {
  imageSrc: string
  onDelete: MouseEventHandler<HTMLButtonElement>
  onSelect: MouseEventHandler<HTMLDivElement>
  onDownload: (value: string) => MouseEventHandler<HTMLButtonElement>
}

export type { IPreviousTryOnPhotoCard, IPreviousTryOnPhotos }
