import ky from 'ky'

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
    const response: IGetTryOnEventIdRawResponse = await ky
      .post('https://kwai-kolors-kolors-virtual-try-on.hf.space/call/tryon', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [{ path: userPhotoUrl }, { path: apparelPhotoUrl }, 0, true],
        }),
      })
      .json()

    return { data: response.event_id }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred'

    return { error: errorMessage }
  }
}
