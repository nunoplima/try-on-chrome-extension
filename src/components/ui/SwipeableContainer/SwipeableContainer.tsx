import { Children, FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ISwipeableContainer } from './SwipeableContainer.types'

import 'swiper/css'

export const SwipeableContainer: FC<ISwipeableContainer> = ({
  classNames,
  children,
}) => {
  return (
    <div className={classNames}>
      <Swiper
        watchSlidesProgress={true}
        slidesPerView={3.5}
        spaceBetween={5}
        className="mySwiper"
      >
        {Children.map(children, (child) => (
          <SwiperSlide>{child}</SwiperSlide>
        ))}

        <div className="absolute bottom-0 right-0 top-0 z-10 w-4 bg-gradient-to-r from-transparent to-white" />
      </Swiper>
    </div>
  )
}
