import { MouseEventHandler, PropsWithChildren } from 'react'

interface IPhoto extends PropsWithChildren {
  imageSrc?: string
  imageAlt: string
}

interface IPhotoActionButton extends PropsWithChildren {
  onClick: MouseEventHandler<HTMLButtonElement>
  classNames?: string
}

interface IPhotoCard extends PropsWithChildren {
  classNames?: string
}

export type { IPhoto, IPhotoActionButton, IPhotoCard }
