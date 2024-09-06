import { AnimatePresence, motion } from 'framer-motion'
import { Image as ImageIcon } from 'lucide-react'
import { FC, PropsWithChildren } from 'react'
import { cn } from '../../utils'
import { IPhoto, IPhotoActionButton, IPhotoCard } from './PhotoCard.types'

export const PhotoActionButton: FC<IPhotoActionButton> = ({
  onClick,
  classNames,
  children,
}) => (
  <button
    onClick={onClick}
    className={cn(
      'flex h-8 w-8 transform items-center justify-center rounded-full border bg-white p-1 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95',
      classNames,
    )}
  >
    {children}
  </button>
)

export const PhotoActions: FC<PropsWithChildren> = ({ children }) => (
  <div className="absolute right-2 top-2 z-10 space-x-2">{children}</div>
)
export const PhotoLabel: FC<PropsWithChildren> = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-700">{children}</h3>
)

export const Photo: FC<IPhoto> = ({
  imageSrc,
  imageAlt,
  classNames,
  children,
}) => (
  <AnimatePresence mode="popLayout" initial={false}>
    <div
      className={cn(
        'relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg bg-gray-100',
        classNames,
      )}
    >
      {imageSrc ? (
        <motion.div
          key={imageSrc}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.img
            src={imageSrc}
            alt={imageAlt}
            draggable={false}
            className="object-fit h-full w-full"
          />
          {children}
        </motion.div>
      ) : (
        <motion.div
          key="icon"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ImageIcon className="h-12 w-12 text-gray-400" />
        </motion.div>
      )}
    </div>
  </AnimatePresence>
)
export const PhotoCard: FC<IPhotoCard> = ({ classNames, children }) => (
  <div className={classNames}>{children}</div>
)
