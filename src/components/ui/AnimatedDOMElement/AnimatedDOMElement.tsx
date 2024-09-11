import { motion } from 'framer-motion'
import { FC } from 'react'
import { EDomElement } from './AnimatedDOMElement.enums'
import { IAnimatedDOMElement } from './AnimatedDOMElement.types'

export const AnimatedDOMElement: FC<IAnimatedDOMElement> = ({
  element = EDomElement.div,
  classNames,
  onClick,
  children,
  ...otherProps
}) => {
  return (
    <>
      {(() => {
        switch (element) {
          case EDomElement.p:
            return (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={classNames}
                onClick={onClick}
                {...otherProps}
              >
                {children}
              </motion.p>
            )
          case EDomElement.div:
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={classNames}
                onClick={onClick}
                {...otherProps}
              >
                {children}
              </motion.div>
            )
          default:
            return null
        }
      })()}
    </>
  )
}
