import { AnimatePresence, motion } from 'framer-motion'
import { Image as ImageIcon } from 'lucide-react'
import { FC, PropsWithChildren } from 'react'
import { IImage } from './Photo.types'

interface IPhotoActionButton extends PropsWithChildren {
  onClick: () => void
}
export const PhotoActionButton: FC<IPhotoActionButton> = ({
  onClick,
  children,
}) => (
  <button
    onClick={onClick}
    className="flex h-8 w-8 transform items-center justify-center rounded-full border bg-white shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
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

export const PhotoImage: FC<IImage> = ({ imageSrc, children }) => (
  <AnimatePresence mode="sync" initial={false}>
    <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg bg-gray-100">
      {imageSrc ? (
        <motion.img
          key="image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          src={imageSrc}
          alt="User uploaded"
          className="object-fit h-full w-full"
        />
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

      {children}
    </div>
  </AnimatePresence>
)
export const Photo: FC<PropsWithChildren> = ({ children }) => (
  <div className="space-y-2">{children}</div>
)
