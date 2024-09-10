import { AnimatePresence, motion } from 'framer-motion'
import { FC } from 'react'
import { IErrorMessage } from './ErrorMessage.types'

export const ErrorMessage: FC<IErrorMessage> = ({
  visible,
  message = 'Oops, something went wrong... 😥',
}) => (
  <AnimatePresence initial={false}>
    {visible ? (
      <motion.p
        className="absolute -bottom-4 left-0 text-xs font-semibold text-red-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {message}
      </motion.p>
    ) : null}
  </AnimatePresence>
)
