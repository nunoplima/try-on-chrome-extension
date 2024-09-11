import { AnimatePresence } from 'framer-motion'
import { Download as DownloadIcon, X as XIcon } from 'lucide-react'
import { FC, MouseEventHandler, PropsWithChildren } from 'react'
import PhotoCard, { Photo, PhotoActionButton, PhotoActions } from '../PhotoCard'
import AnimatedDOMElement from '../ui/AnimatedDOMElement'
import SwipeableContainer from '../ui/SwipeableContainer'
import {
  IPreviousTryOnPhotoCard,
  IPreviousTryOnPhotos,
} from './PreviousTryOnPhotos.types'

const PreviousTryOnPhotosLabel: FC = () => (
  <label className="text-sm font-medium text-purple-700">
    Previous Mirrors
  </label>
)

const PreviousUploadedPhotoCard: FC<IPreviousTryOnPhotoCard> = ({
  imageSrc,
  onDelete,
  onSelect,
  onDownload,
}) => (
  <AnimatePresence initial={false}>
    <AnimatedDOMElement onClick={onSelect}>
      <PhotoCard classNames="cursor-pointer shadow-none">
        <Photo imageSrc={imageSrc} imageAlt="previously uploaded photo">
          <PhotoActions>
            <PhotoActionButton classNames="h-5 w-5" onClick={onDelete}>
              <XIcon className="text-purple-600" />
            </PhotoActionButton>
            <PhotoActionButton
              classNames="h-5 w-5"
              onClick={onDownload(imageSrc)}
            >
              <DownloadIcon className="text-purple-600" />
            </PhotoActionButton>
          </PhotoActions>
        </Photo>
      </PhotoCard>
    </AnimatedDOMElement>
  </AnimatePresence>
)

const PreviousTryOnSkeleton = () => (
  <PhotoCard classNames="border border-purple-100 shadow-none h-full w-full">
    <Photo imageAlt='"previously uploaded photo loader' />
  </PhotoCard>
)

const PreviousTryOnPhotosList: FC<PropsWithChildren> = ({ children }) => (
  <div className="h-[123px] overflow-hidden rounded-md border border-purple-200 bg-white py-2">
    {children}
  </div>
)

export const PreviousTryOnPhotos: FC<IPreviousTryOnPhotos> = ({
  previousTryOnPhotos,
  setPreviousTryOnPhotos,
  onPreviousUploadedPhotoClick,
  onDownloadPhoto,
}) => {
  const handleDeletePhoto: (
    index: number,
  ) => MouseEventHandler<HTMLButtonElement> = (index: number) => (event) => {
    event.stopPropagation()

    setPreviousTryOnPhotos(previousTryOnPhotos.filter((_, i) => i !== index))
  }

  const handleSelectPhoto: (
    imageSrc: string,
  ) => MouseEventHandler<HTMLDivElement> = (imageSrc: string) => (event) => {
    event.stopPropagation()

    onPreviousUploadedPhotoClick(imageSrc)
  }

  return (
    <div className="flex flex-col gap-2">
      <PreviousTryOnPhotosLabel />

      <PreviousTryOnPhotosList>
        <AnimatePresence mode="wait" initial={false}>
          {previousTryOnPhotos.length > 0 ? (
            <AnimatedDOMElement key="previous-try-outs">
              <SwipeableContainer slidesOffsetBefore={8} slidesOffsetAfter={8}>
                {previousTryOnPhotos.map((imageSrc, index) => (
                  <PreviousUploadedPhotoCard
                    key={`${imageSrc}-${index}`}
                    imageSrc={imageSrc}
                    onDelete={handleDeletePhoto(index)}
                    onSelect={handleSelectPhoto(imageSrc)}
                    onDownload={onDownloadPhoto}
                  />
                ))}
              </SwipeableContainer>
            </AnimatedDOMElement>
          ) : (
            <AnimatedDOMElement
              key="loader"
              classNames="flex h-full w-full items-center gap-2 px-2"
            >
              {new Array(4).fill(null).map((_, index) => (
                <PreviousTryOnSkeleton key={index} />
              ))}
            </AnimatedDOMElement>
          )}
        </AnimatePresence>
      </PreviousTryOnPhotosList>
    </div>
  )
}
