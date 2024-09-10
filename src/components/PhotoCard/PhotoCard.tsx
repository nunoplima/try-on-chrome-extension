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
      'flex h-6 w-6 transform items-center justify-center rounded-md border bg-white p-1 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95',
      classNames,
    )}
  >
    {children}
  </button>
)

export const PhotoActions: FC<PropsWithChildren> = ({ children }) => (
  <div className="absolute right-1 top-1 z-10 flex flex-col gap-1">
    {children}
  </div>
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
    {imageSrc ? (
      <motion.div
        key={imageSrc}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          'relative flex aspect-[3/4] h-full items-center justify-center',
          classNames,
        )}
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
        className={cn(
          'relative flex aspect-[3/4] h-full items-center justify-center',
          classNames,
        )}
      >
        <ImageIcon className="h-8 w-8 text-purple-300" />
      </motion.div>
    )}
  </AnimatePresence>
)
export const PhotoCard: FC<IPhotoCard> = ({ classNames, children }) => (
  <div
    className={cn('overflow-hidden rounded-md bg-white shadow-md', classNames)}
  >
    {children}
  </div>
)
