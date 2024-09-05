import { PropsWithChildren } from 'react'

interface ISwipeableContainer extends PropsWithChildren {
  slidesPerView?: number
  spaceBetween?: number
  slidesOffsetBefore?: number
  slidesOffsetAfter?: number
}

export type { ISwipeableContainer }
