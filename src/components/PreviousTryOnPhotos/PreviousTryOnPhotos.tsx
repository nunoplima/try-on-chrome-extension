import { AnimatePresence, motion } from 'framer-motion'
import { X as XIcon } from 'lucide-react'
import { FC, MouseEventHandler, PropsWithChildren } from 'react'
import PhotoCard, { Photo, PhotoActionButton } from '../PhotoCard'
import Collapsible from '../ui/Collapsible'
import SwipeableContainer from '../ui/SwipeableContainer'
import {
  IPreviousTryOnPhotoCard,
  IPreviousTryOnPhotos,
  IPreviousTryOnPhotosLabel,
} from './PreviousTryOnPhotos.types'

const PreviousTryOnPhotosLabel: FC<IPreviousTryOnPhotosLabel> = ({ count }) => (
  <div className="mx-6 flex items-center justify-between">
    <h3 className="text-lg font-semibold text-gray-700">
      Previous uploaded photos
    </h3>
    <p className="text-md">{count} </p>
  </div>
)

const PreviousUploadedPhotoCard: FC<IPreviousTryOnPhotoCard> = ({
  imageSrc,
  onDelete,
  onSelect,
}) => (
  <AnimatePresence>
    <motion.div
      onClick={onSelect}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PhotoCard classNames="cursor-pointer">
        <Photo imageSrc={imageSrc} imageAlt="previously uploaded photo">
          <PhotoActionButton
            classNames="absolute right-2 top-2 h-6 w-6"
            onClick={onDelete}
          >
            <XIcon className="text-gray-400" />
          </PhotoActionButton>
        </Photo>
      </PhotoCard>
    </motion.div>
  </AnimatePresence>
)

const PreviousTryOnPhotosList: FC<PropsWithChildren> = ({ children }) => (
  <SwipeableContainer>{children}</SwipeableContainer>
)

export const PreviousTryOnPhotos: FC<IPreviousTryOnPhotos> = ({
  previousTryOnPhotos,
  setPreviousTryOnPhotos,
  onPreviousUploadedPhotoClick,
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
    <div className="space-y-2">
      <PreviousTryOnPhotosLabel count={previousTryOnPhotos.length} />

      <Collapsible collapsed={previousTryOnPhotos.length === 0}>
        <PreviousTryOnPhotosList>
          {previousTryOnPhotos.map((imageSrc, index) => (
            <PreviousUploadedPhotoCard
              key={`${imageSrc}-${index}`}
              imageSrc={imageSrc}
              onDelete={handleDeletePhoto(index)}
              onSelect={handleSelectPhoto(imageSrc)}
            />
          ))}
        </PreviousTryOnPhotosList>
      </Collapsible>
    </div>
  )
}
