import { Children, FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ISwipeableContainer } from './SwipeableContainer.types'

import 'swiper/css'

export const SwipeableContainer: FC<ISwipeableContainer> = ({
  slidesPerView = 3.5,
  spaceBetween = 5,
  slidesOffsetBefore = 24,
  slidesOffsetAfter = 24,
  children,
}) => {
  return (
    <Swiper
      watchSlidesProgress={true}
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      slidesOffsetBefore={slidesOffsetBefore}
      slidesOffsetAfter={slidesOffsetAfter}
    >
      {Children.map(children, (child) => (
        <SwiperSlide>{child}</SwiperSlide>
      ))}

      <div className="absolute -bottom-1 -right-1 -top-1 z-10 w-4 bg-gradient-to-r from-transparent to-white" />
    </Swiper>
  )
}
