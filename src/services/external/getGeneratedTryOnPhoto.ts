import ky from 'ky'

interface IGetGeneratedTryOnPhotoResponse {
  data?: string
  error?: string
}

export const getGeneratedTryOnPhoto = async (
  eventId: string,
): Promise<IGetGeneratedTryOnPhotoResponse> => {
  try {
    const response = await ky(`${import.meta.env.VITE_HF_API_URL}/${eventId}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      timeout: false,
    })

    const reader = response!.body!.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    const processText = async ({
      value,
    }: ReadableStreamReadResult<Uint8Array>): Promise<IGetGeneratedTryOnPhotoResponse> => {
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')

      for (let i = 0; i < lines.length - 1; i++) {
        const eventLine = lines[i].trim()
        if (eventLine.startsWith('event:')) {
          const event = eventLine.split('event: ')[1]
          const dataLine = lines[i + 1] ? lines[i + 1].split('data: ')[1] : null

          if (dataLine) {
            const data = JSON.parse(dataLine)
            if (event === 'complete') {
              return { data: data[0]?.url }
            } else if (event === 'error') {
              return {
                error: 'Oops something went wrong. Please try again later.',
              }
            }
          }
        }
      }

      buffer = lines[lines.length - 1]
      const readableStreamReadResult = await reader.read()
      return processText(readableStreamReadResult)
    }

    const readableStreamReadResult = await reader.read()
    return processText(readableStreamReadResult)
  } catch {
    return {
      error: 'The AI model is busy right now, try again later.',
    }
  }
}
