import { AnimatePresence, motion } from 'framer-motion'
import { X as XIcon } from 'lucide-react'
import { FC, MouseEventHandler, PropsWithChildren } from 'react'
import PhotoCard, { Photo, PhotoActionButton } from '../PhotoCard'
import Collapsible from '../ui/Collapsible'
import SwipeableContainer from '../ui/SwipeableContainer'
import {
  IPreviousUploadedPhotoCard,
  IPreviousUploadedPhotos,
  IPreviousUploadedPhotosLabel,
} from './PreviousUploadedPhotos.types'

const PreviousUploadedPhotosLabel: FC<IPreviousUploadedPhotosLabel> = ({
  count,
}) => (
  <div className="mx-6 flex items-center justify-between">
    <h3 className="text-lg font-semibold text-gray-700">
      Previous uploaded photos
    </h3>
    <p className="text-md">{count} </p>
  </div>
)

const PreviousUploadedPhotoCard: FC<IPreviousUploadedPhotoCard> = ({
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

const PreviousUploadedPhotosList: FC<PropsWithChildren> = ({ children }) => (
  <SwipeableContainer>{children}</SwipeableContainer>
)

export const PreviousUploadedPhotos: FC<IPreviousUploadedPhotos> = ({
  previousUploadedPhotos,
  setPreviousUploadedPhotos,
  setUserPhoto,
}) => {
  const handleDeletePhoto: (
    index: number,
  ) => MouseEventHandler<HTMLButtonElement> = (index: number) => (event) => {
    event.stopPropagation()

    setPreviousUploadedPhotos(
      previousUploadedPhotos.filter((_, i) => i !== index),
    )
  }

  const handleSelectPhoto: (
    imageSrc: string,
  ) => MouseEventHandler<HTMLDivElement> = (imageSrc: string) => (event) => {
    event.stopPropagation()

    setUserPhoto(imageSrc)
  }

  return (
    <div className="-mx-6 space-y-2">
      <PreviousUploadedPhotosLabel count={previousUploadedPhotos.length} />

      <Collapsible collapsed={previousUploadedPhotos.length === 0}>
        <PreviousUploadedPhotosList>
          {previousUploadedPhotos.map((imageSrc, index) => (
            <PreviousUploadedPhotoCard
              key={`${imageSrc}-${index}`}
              imageSrc={imageSrc}
              onDelete={handleDeletePhoto(index)}
              onSelect={handleSelectPhoto(imageSrc)}
            />
          ))}
        </PreviousUploadedPhotosList>
      </Collapsible>
    </div>
  )
}
