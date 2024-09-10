import ky from 'ky'

export const urlToBlob = async (filePath: string): Promise<Blob | Error> => {
  try {
    const blob = await ky(filePath).blob()

    return blob
  } catch {
    return new Error('Failed to fetch image in urlToBlob helper fn.')
  }
}

export const parseBase64String = (str: string) => str.split(',')[1]

export const blobToBase64 = (blob: Blob): Promise<string | Error> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64data = reader.result

      if (typeof base64data === 'string') {
        // if it's a string, remove the prefix
        const rawBase64 = parseBase64String(base64data)
        resolve(rawBase64)
      } else if (base64data instanceof ArrayBuffer) {
        // if it's an ArrayBuffer, convert it to Base64 string
        const uint8Array = new Uint8Array(base64data)
        const rawBase64 = btoa(
          String.fromCharCode.apply(null, Array.from(uint8Array)),
        )
        resolve(rawBase64)
      } else {
        console.error(
          'Unexpected result type from FileReader:',
          typeof base64data,
        )
        reject(
          new Error(
            'Failed to convert Blob to Base64 in blobToBase64 helper fn.',
          ),
        )
      }
    }
    reader.readAsDataURL(blob)
  })
}
