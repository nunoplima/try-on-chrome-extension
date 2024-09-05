import { X as XIcon } from 'lucide-react'
import { ChangeEvent, DragEventHandler, useState } from 'react'
import GenerateTryOnPhoto from './components/GenerateTryOnPhoto'
import PhotoCard, {
  Photo,
  PhotoActionButton,
  PhotoActions,
  PhotoLabel,
} from './components/PhotoCard'
import PreviousUploadedPhotos from './components/PreviousUploadedPhotos'
import Upload from './components/Upload'
import { ELocalStorageKeys, EUploadStatuses } from './enums'
import { usePersistedState } from './hooks/usePersistedState'
import { uploadUserPhotoToCloudinary } from './services/external/uploadUserPhotoToCloudinary'
import { convertToWebPFile } from './services/internal/convertToWebPFile'

function App() {
  const [previousUploadedPhotos, setPreviousUploadedPhotos] = usePersistedState<
    string[]
  >(ELocalStorageKeys.previousUploadedPhotos, [])
  const [userPhoto, setUserPhoto] = useState<string | undefined>()
  const [uploadStatus, setUploadStatus] = useState<EUploadStatuses>(
    EUploadStatuses.idle,
  )

  const handleUploadUserPhoto = async (file: File) => {
    setUploadStatus(EUploadStatuses.uploading)

    // optimistically render the user's photo
    const imageUrl = URL.createObjectURL(file)
    setUserPhoto(imageUrl)

    // convert to webp
    const webPFile = await convertToWebPFile(file)
    // try and upload to cloudinary
    const response = await uploadUserPhotoToCloudinary(webPFile)
    if (response.data) {
      setUploadStatus(EUploadStatuses.success)
      setPreviousUploadedPhotos([...previousUploadedPhotos, response.data])
    } else {
      setUserPhoto(undefined)
      setUploadStatus(EUploadStatuses.error)
    }
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

  const handleClearUserPhoto = () => setUserPhoto(undefined)

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
            {userPhoto ? (
              <PhotoActions>
                <PhotoActionButton onClick={handleClearUserPhoto}>
                  <XIcon className="text-gray-400" />
                </PhotoActionButton>
              </PhotoActions>
            ) : null}
          </Photo>
        </PhotoCard>

        <PhotoCard>
          <PhotoLabel>Try-On Result</PhotoLabel>
          <Photo imageAlt="try-on result"></Photo>
        </PhotoCard>
      </div>

      <PreviousUploadedPhotos
        previousUploadedPhotos={previousUploadedPhotos}
        setPreviousUploadedPhotos={setPreviousUploadedPhotos}
        setUserPhoto={setUserPhoto}
      />

      <GenerateTryOnPhoto />
    </div>
  )
}

export default App
