import { Download as DownloadIcon, X as XIcon } from 'lucide-react'
import {
  ChangeEvent,
  DragEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from 'react'
import GenerateTryOnPhoto from './components/GenerateTryOnPhoto'
import Header from './components/Header'
import PhotoCard, {
  Photo,
  PhotoActionButton,
  PhotoActions,
} from './components/PhotoCard'
import PreviousTryOnPhotos from './components/PreviousTryOnPhotos'
import Upload from './components/Upload'
import { EHttpStatuses, ELocalStorageKeys, EWorkerMessages } from './enums'
import { useIsMounted } from './hooks/useIsMounted'
import { usePersistedState } from './hooks/usePersistedState'
import { getGeneratedTryOnPhoto } from './services/external/getGeneratedTryOnPhoto'
import { getTryOnEventId } from './services/external/getTryOnEventId'
import { IApparelPhoto, IWorkerMessage } from './types'
import { blobToBase64, urlToBlob } from './utils/base64'
import { convertToWebPFile } from './utils/webP'

function App() {
  const [tryOnPhoto, setTryOnPhoto] = useState<string | undefined>()
  const [uploadStatus, setUploadStatus] = useState<EHttpStatuses>(
    EHttpStatuses.idle,
  )
  const [getApparelPhotoStatus, setGetApparelPhotoStatus] =
    useState<EHttpStatuses>(EHttpStatuses.idle)
  const [generateTryOnStatus, setGenerateTryOnStatus] = useState(
    EHttpStatuses.idle,
  )
  const [previousTryOnPhotos, setPreviousTryOnPhotos] = usePersistedState<
    string[]
  >(ELocalStorageKeys.previousTryOnPhotos, [])
  const [userPhoto, setUserPhoto] = usePersistedState<string>(
    ELocalStorageKeys.previousUploadedUserPhoto,
    '',
  )
  const [apparelPhotos, setApparelPhotos] = usePersistedState<IApparelPhoto[]>(
    ELocalStorageKeys.mappedApparelPhotosByStoreUrl,
    [],
  )
  const [activeTabUrl] = usePersistedState<string | undefined>(
    ELocalStorageKeys.activeTabUrl,
    undefined,
  )
  const isMounted = useIsMounted()

  const apparelPhoto = apparelPhotos.find(
    (apparelPhoto) => apparelPhoto.tabUrl === activeTabUrl,
  )?.photoUrl

  console.log(activeTabUrl, 'from App component')

  useEffect(() => {
    if (import.meta.env.DEV || !isMounted || !activeTabUrl) return

    const workerMessageListener = (message: IWorkerMessage) => {
      if (message.type === EWorkerMessages.apparelPhotoError) {
        setGetApparelPhotoStatus(EHttpStatuses.error)
      } else if (message.type === EWorkerMessages.storedApparelPhotoUrl) {
        setGetApparelPhotoStatus(EHttpStatuses.success)
      } else if (message.type === EWorkerMessages.apparelPhotoSuccess) {
        setApparelPhotos((prevApparelPhotos: IApparelPhoto[]) => {
          return [
            ...prevApparelPhotos,
            {
              photoUrl: message.data as string,
              tabUrl: message.tabUrl as string,
            },
          ]
        })

        setGetApparelPhotoStatus(EHttpStatuses.success)
      }
    }

    chrome.runtime.onMessage.addListener(workerMessageListener)

    return () => {
      chrome.runtime.onMessage.removeListener(workerMessageListener)
    }
  }, [activeTabUrl, isMounted, setApparelPhotos])

  useEffect(() => {
    if (import.meta.env.DEV || !isMounted || !activeTabUrl) return

    setGetApparelPhotoStatus(EHttpStatuses.loading)
    chrome.runtime.sendMessage({ type: EWorkerMessages.captureHtml })
  }, [activeTabUrl, isMounted])

  useEffect(() => {
    if (import.meta.env.DEV || !isMounted || !!activeTabUrl) return

    chrome.runtime.sendMessage({
      type: EWorkerMessages.getInitialActiveTabUrl,
    })
  }, [activeTabUrl, isMounted])

  const handleUploadUserPhoto = async (file: File) => {
    const webPFile = await convertToWebPFile(file)

    const reader = new FileReader()

    reader.onloadend = () => {
      const base64DataUrl = reader.result as string

      setUserPhoto(base64DataUrl)
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

    setTryOnPhoto(undefined)

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

    if (getGeneratedTryOnPhotoResponse.data) {
      const tryOnPhotoBlob = await urlToBlob(
        getGeneratedTryOnPhotoResponse.data,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_HF_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (tryOnPhotoBlob instanceof Error) {
        setGenerateTryOnStatus(EHttpStatuses.error)
        return
      }

      const tryOnPhotoBase64 = await blobToBase64(tryOnPhotoBlob)

      if (tryOnPhotoBase64 instanceof Error) {
        setGenerateTryOnStatus(EHttpStatuses.error)
        return
      }

      setTryOnPhoto(tryOnPhotoBase64)
      setPreviousTryOnPhotos([...previousTryOnPhotos, tryOnPhotoBase64])
    }

    setGenerateTryOnStatus(EHttpStatuses.success)
  }

  const handleClickPreviousTryOnPhoto = (previousTryOnPhotoUrl: string) => {
    setUploadStatus(EHttpStatuses.idle)
    setUserPhoto(previousTryOnPhotoUrl)
  }

  // TODO: the browser doesn't trigger the 'change' event if one selects the same
  // file again. To work around this, add a ref to the input element and
  // reset its value when the user clicks the "Remove photo" button (`userPhotoRef.current.value = ''`).
  const handleClearUserPhoto = () => setUserPhoto('')

  const handleClearGeneratedTryOnPhoto = () => setTryOnPhoto(undefined)

  const handleDownloadPhoto =
    (photoUrlBase64: string): MouseEventHandler<HTMLButtonElement> =>
    (event) => {
      event.stopPropagation()

      const parts = photoUrlBase64.split(';')
      const mimeType = parts[0].split(':')[1]
      const fileExtension = mimeType.split('/')[1]

      const link = document.createElement('a')
      link.href = photoUrlBase64
      link.download = `my-mirror.${fileExtension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

  return (
    <div className="h-[598px] w-[400px] space-y-4 bg-gradient-to-b from-purple-100 to-pink-100 p-6">
      <Header />

      <Upload
        onChange={handleUserPhotoChange}
        onDrop={handleUserPhotoDrop}
        uploadStatus={uploadStatus}
      />

      <div className="grid grid-cols-2 gap-4">
        <PhotoCard>
          <Photo imageSrc={userPhoto} imageAlt="your photo">
            {!!userPhoto && (
              <PhotoActions>
                <PhotoActionButton onClick={handleClearUserPhoto}>
                  <XIcon className="text-purple-600" />
                </PhotoActionButton>
              </PhotoActions>
            )}
          </Photo>
        </PhotoCard>

        <PhotoCard>
          <Photo
            imageSrc={tryOnPhoto}
            imageAlt="try-on result"
            classNames={`${generateTryOnStatus === EHttpStatuses.loading || getApparelPhotoStatus === EHttpStatuses.loading ? 'animate-pulse' : ''}`}
          >
            {tryOnPhoto && (
              <PhotoActions>
                <PhotoActionButton onClick={handleClearGeneratedTryOnPhoto}>
                  <XIcon className="text-purple-600" />
                </PhotoActionButton>
                <PhotoActionButton onClick={handleDownloadPhoto(tryOnPhoto)}>
                  <DownloadIcon className="text-purple-600" />
                </PhotoActionButton>
              </PhotoActions>
            )}
          </Photo>
        </PhotoCard>
      </div>

      <PreviousTryOnPhotos
        previousTryOnPhotos={previousTryOnPhotos}
        setPreviousTryOnPhotos={setPreviousTryOnPhotos}
        onPreviousUploadedPhotoClick={handleClickPreviousTryOnPhoto}
        onDownloadPhoto={handleDownloadPhoto}
      />

      <GenerateTryOnPhoto
        onGenerateTryOnPhoto={handleGenerateTryOnPhoto}
        isError={
          generateTryOnStatus === EHttpStatuses.error ||
          getApparelPhotoStatus === EHttpStatuses.error
        }
        isLoading={
          generateTryOnStatus === EHttpStatuses.loading ||
          getApparelPhotoStatus === EHttpStatuses.loading
        }
        isDisabled={
          generateTryOnStatus === EHttpStatuses.loading ||
          getApparelPhotoStatus === EHttpStatuses.loading ||
          !userPhoto ||
          !apparelPhoto
        }
      />
    </div>
  )
}

export default App
