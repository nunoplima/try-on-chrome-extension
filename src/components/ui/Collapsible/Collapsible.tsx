import { AnimatePresence, motion } from 'framer-motion'
import { FC } from 'react'
import { ICollapsible } from './Collapsible.types'

export const Collapsible: FC<ICollapsible> = ({ collapsed, children }) => (
  <AnimatePresence>
    {!collapsed && (
      <motion.div
        initial={{ opacity: 0, maxHeight: 0 }}
        animate={{ opacity: 1, maxHeight: '1000px' }}
        exit={{ opacity: 0, maxHeight: 0 }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
)
