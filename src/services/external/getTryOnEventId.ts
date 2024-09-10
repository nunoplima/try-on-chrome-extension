import ky from 'ky'
import { blobToBase64, urlToBlob } from '../../@lib/utils/base64'

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

    const [userPhotoBase64, apparelPhotoBase64] = await Promise.all([
      blobToBase64(userPhotoBlob),
      blobToBase64(apparelPhotoBlob),
    ])

    if (
      userPhotoBase64 instanceof Error ||
      apparelPhotoBase64 instanceof Error
    ) {
      throw new Error(
        'Failed to convert Blob to Base64 in blobToBase64 helper fn.',
      )
    }

    const payload = {
      data: [userPhotoBase64, apparelPhotoBase64],
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
