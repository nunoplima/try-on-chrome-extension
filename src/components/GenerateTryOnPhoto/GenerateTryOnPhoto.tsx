import { Loader2 } from 'lucide-react'
import { FC } from 'react'
import { IGenerateTryOnPhoto } from './GenerateTryOnPhoto.types'

export const GenerateTryOnPhoto: FC<IGenerateTryOnPhoto> = ({
  onGenerateTryOnPhoto,
  isLoading,
  isDisabled,
}) => {
  return (
    <div className="bg-gray-50 p-6">
      <button
        onClick={onGenerateTryOnPhoto}
        disabled={isDisabled}
        className="flex h-12 w-full transform items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 py-3 font-semibold text-white transition-all duration-300 hover:from-purple-600 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-75"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate Try-On Image'
        )}
      </button>
    </div>
  )
}
