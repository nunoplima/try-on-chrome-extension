import { AnimatePresence } from 'framer-motion'
import { FC } from 'react'
import AnimatedDOMElement from '../AnimatedDOMElement'
import { EDomElement } from '../AnimatedDOMElement/AnimatedDOMElement.enums'
import { IErrorMessage } from './ErrorMessage.types'

export const ErrorMessage: FC<IErrorMessage> = ({
  visible,
  message = 'Oops, something went wrong... 😥',
}) => (
  <AnimatePresence initial={false}>
    {visible ? (
      <AnimatedDOMElement
        element={EDomElement.p}
        classNames="absolute -bottom-4 left-0 text-xs font-semibold text-red-600"
      >
        {message}
      </AnimatedDOMElement>
    ) : null}
  </AnimatePresence>
)
