import { AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { FC } from 'react'
import AnimatedDOMElement from '../ui/AnimatedDOMElement'
import ErrorMessage from '../ui/ErrorMessage'
import { IGenerateTryOnPhoto } from './GenerateTryOnPhoto.types'

export const GenerateTryOnPhoto: FC<IGenerateTryOnPhoto> = ({
  onGenerateTryOnPhoto,
  isError,
  isLoading,
  isDisabled,
}) => (
  <button
    onClick={onGenerateTryOnPhoto}
    disabled={isDisabled}
    className="block flex w-full transform items-center justify-center rounded-md bg-gradient-to-r from-purple-500 to-pink-500 py-3 text-sm font-medium font-semibold text-white transition-all duration-300 hover:from-purple-600 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-75"
  >
    <AnimatePresence initial={false} mode="wait">
      {isLoading ? (
        <AnimatedDOMElement
          key="loader"
          classNames="flex items-center justify-center"
        >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Doing some work...
        </AnimatedDOMElement>
      ) : (
        <AnimatedDOMElement key="ready">
          Mirror, Mirror... do your magic!
        </AnimatedDOMElement>
      )}
    </AnimatePresence>

    <ErrorMessage
      visible={isError}
      message="The AI model is busy right now, try again later."
    />
  </button>
)
