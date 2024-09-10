import { AnimatePresence, motion } from 'framer-motion'
import { Download as DownloadIcon, X as XIcon } from 'lucide-react'
import { FC, MouseEventHandler, PropsWithChildren } from 'react'
import PhotoCard, { Photo, PhotoActionButton, PhotoActions } from '../PhotoCard'
import Collapsible from '../ui/Collapsible'
import SwipeableContainer from '../ui/SwipeableContainer'
import {
  IPreviousTryOnPhotoCard,
  IPreviousTryOnPhotos,
  IPreviousTryOnPhotosLabel,
} from './PreviousTryOnPhotos.types'

const PreviousTryOnPhotosLabel: FC<IPreviousTryOnPhotosLabel> = ({ count }) => (
  <div className="mb-2 flex items-center justify-between">
    <h3 className="text-sm font-medium text-purple-700">Previous Mirrors</h3>
    <p className="text-md text-purple-700">{count} </p>
  </div>
)

const PreviousUploadedPhotoCard: FC<IPreviousTryOnPhotoCard> = ({
  imageSrc,
  onDelete,
  onSelect,
}) => {
  const handleDownloadPhoto =
    (photoUrl: string): MouseEventHandler<HTMLButtonElement> =>
    (event) => {
      event.stopPropagation()

      const link = document.createElement('a')
      link.href = photoUrl
      link.download = 'my-mirror.webp'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

  return (
    <AnimatePresence initial={false}>
      <motion.div
        onClick={onSelect}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <PhotoCard classNames="cursor-pointer shadow-none">
          <Photo imageSrc={imageSrc} imageAlt="previously uploaded photo">
            <PhotoActions>
              <PhotoActionButton classNames="h-5 w-5" onClick={onDelete}>
                <XIcon className="text-purple-600" />
              </PhotoActionButton>
              <PhotoActionButton
                classNames="h-5 w-5"
                onClick={handleDownloadPhoto(imageSrc)}
              >
                <DownloadIcon className="text-purple-600" />
              </PhotoActionButton>
            </PhotoActions>
          </Photo>
        </PhotoCard>
      </motion.div>
    </AnimatePresence>
  )
}

const PreviousTryOnPhotosList: FC<PropsWithChildren> = ({ children }) => (
  <div className="overflow-hidden rounded-md border border-purple-200 bg-white py-2">
    <SwipeableContainer slidesOffsetBefore={8} slidesOffsetAfter={8}>
      {children}
    </SwipeableContainer>
  </div>
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
    <Collapsible collapsed={previousTryOnPhotos.length === 0}>
      <PreviousTryOnPhotosLabel count={previousTryOnPhotos.length} />

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
  )
}
