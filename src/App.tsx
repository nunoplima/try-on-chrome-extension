import { X as XIcon } from 'lucide-react'
import { ChangeEvent, DragEventHandler, useState } from 'react'
import { convertToWebPFile } from './@lib/utils/webP'
import GenerateTryOnPhoto from './components/GenerateTryOnPhoto'
import PhotoCard, {
  Photo,
  PhotoActionButton,
  PhotoActions,
  PhotoLabel,
} from './components/PhotoCard'
import PreviousUploadedPhotos from './components/PreviousUploadedPhotos'
import Upload from './components/Upload'
import { EHttpStatuses, ELocalStorageKeys } from './enums'
import { usePersistedState } from './hooks/usePersistedState'
import { getGeneratedTryOnPhoto } from './services/external/getGeneratedTryOnPhoto'
import { getTryOnEventId } from './services/external/getTryOnEventId'

const apparelPhoto =
  'https://res.cloudinary.com/nungon/image/upload/v1725534568/pjyfrbpeldmnlbm1pnrr.webp'

function App() {
  const [previousUploadedPhotos, setPreviousUploadedPhotos] = usePersistedState<
    string[]
  >(ELocalStorageKeys.previousUploadedPhotos, [])
  const [userPhoto, setUserPhoto] = useState<string | undefined>()
  const [tryOnPhoto, setTryOnPhoto] = useState<string | undefined>()
  const [uploadStatus, setUploadStatus] = useState<EHttpStatuses>(
    EHttpStatuses.idle,
  )
  const [generateTryOnStatus, setGenerateTryOnStatus] = useState(
    EHttpStatuses.idle,
  )

  const handleUploadUserPhoto = async (file: File) => {
    const webPFile = await convertToWebPFile(file)

    const reader = new FileReader()

    reader.onloadend = () => {
      const base64DataUrl = reader.result as string

      setUserPhoto(base64DataUrl)
      setPreviousUploadedPhotos([...previousUploadedPhotos, base64DataUrl])
    }

    reader.readAsDataURL(webPFile)
  }

  const handleUserPhotoDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    const file = event.dataTransfer?.files[0]

    if (!file) return

    handleUploadUserPhoto(file)
  }

  const handleUserPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const file = event.target.files?.[0]

    if (!file) return

    handleUploadUserPhoto(file)
  }

  const handleGenerateTryOnPhoto = async () => {
    if (!userPhoto || !apparelPhoto) return

    setGenerateTryOnStatus(EHttpStatuses.loading)

    const getTryOnEventIdResponse = await getTryOnEventId({
      userPhotoUrl: userPhoto,
      apparelPhotoUrl: apparelPhoto,
    })

    if (getTryOnEventIdResponse.error) {
      setGenerateTryOnStatus(EHttpStatuses.error)
      return
    }

    const eventId = getTryOnEventIdResponse.data as string
    const getGeneratedTryOnPhotoResponse = await getGeneratedTryOnPhoto(eventId)

    if (getGeneratedTryOnPhotoResponse.error) {
      setGenerateTryOnStatus(EHttpStatuses.error)
      return
    }

    setTryOnPhoto(getGeneratedTryOnPhotoResponse.data)

    setGenerateTryOnStatus(EHttpStatuses.success)
  }

  const handleClickPreviousUploadedPhoto = (
    previousUploadedPhotoUrl: string,
  ) => {
    setUploadStatus(EHttpStatuses.idle)
    setUserPhoto(previousUploadedPhotoUrl)
  }

  const handleClearUserPhoto = () => setUserPhoto(undefined)

  const handleClearGeneratedTryOnPhoto = () => setTryOnPhoto(undefined)

  return (
    <div className="space-y-4 overflow-hidden rounded-lg border shadow-lg">
      <Upload
        onChange={handleUserPhotoChange}
        onDrop={handleUserPhotoDrop}
        uploadStatus={uploadStatus}
      />

      <div className="grid grid-cols-2 gap-4 px-6">
        <PhotoCard>
          <PhotoLabel>Your Photo</PhotoLabel>
          <Photo imageSrc={userPhoto} imageAlt="your photo">
            {userPhoto && (
              <PhotoActions>
                <PhotoActionButton onClick={handleClearUserPhoto}>
                  <XIcon className="text-gray-400" />
                </PhotoActionButton>
              </PhotoActions>
            )}
          </Photo>
        </PhotoCard>

        <PhotoCard>
          <PhotoLabel>Try-On Result</PhotoLabel>
          <Photo
            imageSrc={tryOnPhoto}
            imageAlt="try-on result"
            classNames={`${generateTryOnStatus === EHttpStatuses.loading ? 'animate-pulse' : ''}`}
          >
            {tryOnPhoto && (
              <PhotoActions>
                <PhotoActionButton onClick={handleClearGeneratedTryOnPhoto}>
                  <XIcon className="text-gray-400" />
                </PhotoActionButton>
              </PhotoActions>
            )}
          </Photo>
        </PhotoCard>
      </div>

      <PreviousUploadedPhotos
        previousUploadedPhotos={previousUploadedPhotos}
        setPreviousUploadedPhotos={setPreviousUploadedPhotos}
        onPreviousUploadedPhotoClick={handleClickPreviousUploadedPhoto}
      />

      <GenerateTryOnPhoto
        onGenerateTryOnPhoto={handleGenerateTryOnPhoto}
        isError={generateTryOnStatus === EHttpStatuses.error}
        isLoading={generateTryOnStatus === EHttpStatuses.loading}
        isDisabled={
          generateTryOnStatus === EHttpStatuses.loading ||
          !userPhoto ||
          !apparelPhoto
        }
      />
    </div>
  )
}

export default App
