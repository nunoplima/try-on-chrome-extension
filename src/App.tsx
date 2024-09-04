import { X as XIcon } from 'lucide-react'
import { ChangeEvent, DragEventHandler, useState } from 'react'
import Photo, {
  PhotoActionButton,
  PhotoActions,
  PhotoImage,
  PhotoLabel,
} from './components/Photo'
import Upload from './components/Upload'
import { EUploadStatuses } from './enums'
import { uploadUserImageToCloudinary } from './services/external/uploadUserImageToCloudinary'

function App() {
  const [userImage, setUserImage] = useState<string | undefined>()
  const [uploadStatus, setUploadStatus] = useState<EUploadStatuses>(
    EUploadStatuses.idle,
  )

  const handleUploadUserImage = async (file: File) => {
    setUploadStatus(EUploadStatuses.idle)

    const reader = new FileReader()
    reader.onload = (e) => setUserImage(e.target?.result as string)
    reader.readAsDataURL(file)

    setUploadStatus(EUploadStatuses.uploading)

    const response = await uploadUserImageToCloudinary(file)
    if (response.error) {
      setUserImage(undefined)
      setUploadStatus(EUploadStatuses.error)
    } else {
      setUploadStatus(EUploadStatuses.success)
    }
  }

  const handleUserImageDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    const file = event.dataTransfer?.files[0]

    if (!file) return

    handleUploadUserImage(file)
  }

  const handleUserImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const file = event.target.files?.[0]

    if (!file) return

    handleUploadUserImage(file)
  }

  const handleClearUserImage = () => setUserImage(undefined)

  return (
    <div className="space-y-4 rounded-lg border p-6 shadow-lg">
      <Upload
        onChange={handleUserImageChange}
        onDrop={handleUserImageDrop}
        uploadStatus={uploadStatus}
      />

      <div className="grid grid-cols-2 gap-4">
        <Photo>
          <PhotoLabel>Your Photo</PhotoLabel>
          <PhotoImage imageSrc={userImage}>
            {userImage ? (
              <PhotoActions>
                <PhotoActionButton onClick={handleClearUserImage}>
                  <XIcon className="text-gray-400" />
                </PhotoActionButton>
              </PhotoActions>
            ) : null}
          </PhotoImage>
        </Photo>

        <Photo>
          <PhotoLabel>Try-On Result</PhotoLabel>
          <PhotoImage></PhotoImage>
        </Photo>
      </div>
    </div>
  )
}

export default App
