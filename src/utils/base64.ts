import ky from 'ky'

export const urlToBlob = async (
  filePath: string,
  options?: Record<string, unknown>,
): Promise<Blob | Error> => {
  try {
    return await ky(filePath, options).blob()
  } catch {
    return new Error('Failed to fetch image in urlToBlob helper fn.')
  }
}

export const parseBase64String = (str: string) => str.split(',')[1]

export const blobToBase64 = (blob: Blob): Promise<string | Error> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('FileReader result is not a string'))
      }
    }
    reader.onerror = () => {
      reject(new Error('FileReader error'))
    }
    reader.readAsDataURL(blob)
  })
}
