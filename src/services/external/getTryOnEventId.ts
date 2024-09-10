import ky from 'ky'
import { blobToBase64, parseBase64String, urlToBlob } from '../../utils/base64'

interface IGenerateTryOnEventId {
  userPhotoUrl: string
  apparelPhotoUrl: string
}

interface IGetTryOnEventIdRawResponse {
  event_id: string
}

interface IGetTryOnEventIdResponse {
  data?: string
  error?: string
}

export const getTryOnEventId = async ({
  userPhotoUrl,
  apparelPhotoUrl,
}: IGenerateTryOnEventId): Promise<IGetTryOnEventIdResponse> => {
  try {
    const [userPhotoBlob, apparelPhotoBlob] = await Promise.all([
      urlToBlob(userPhotoUrl),
      urlToBlob(apparelPhotoUrl),
    ])

    if (userPhotoBlob instanceof Error || apparelPhotoBlob instanceof Error) {
      throw new Error('Failed to fetch image in urlToBlob helper function.')
    }

    const [userPhotoRawBase64, apparelPhotoRawBase64] = await Promise.all([
      blobToBase64(userPhotoBlob),
      blobToBase64(apparelPhotoBlob),
    ])

    if (
      userPhotoRawBase64 instanceof Error ||
      apparelPhotoRawBase64 instanceof Error
    ) {
      throw new Error(
        'Failed to convert Blob to Base64 in blobToBase64 helper fn.',
      )
    }

    const payload = {
      data: [
        parseBase64String(userPhotoRawBase64),
        parseBase64String(apparelPhotoRawBase64),
      ],
    }

    const response: IGetTryOnEventIdRawResponse = await ky
      .post(import.meta.env.VITE_HF_API_URL, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_HF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      .json()

    return { data: response.event_id }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred'

    return { error: errorMessage }
  }
}
