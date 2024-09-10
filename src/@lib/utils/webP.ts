export const convertToWebPFile = (
  file: File,
  maxWidth: number = 1080,
  maxHeight: number = 1350,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string

      img.onload = () => {
        let { width, height } = img

        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height
          if (width > height) {
            width = maxWidth
            height = Math.min(maxHeight, Math.round(maxWidth / aspectRatio))
          } else {
            height = maxHeight
            width = Math.min(maxWidth, Math.round(maxHeight * aspectRatio))
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          canvas.toBlob((blob) => {
            if (blob) {
              const webpFile = new File(
                [blob],
                file.name.replace(/\.\w+$/, '.webp'),
                {
                  type: 'image/webp',
                  lastModified: Date.now(),
                },
              )
              resolve(webpFile)
            } else {
              reject(new Error('Conversion to WebP failed'))
            }
          }, 'image/webp')
        } else {
          reject(new Error('Canvas context not supported'))
        }
      }

      img.onerror = () => reject(new Error('Image loading failed'))
    }

    reader.onerror = () => reject(new Error('File reading failed'))
    reader.readAsDataURL(file)
  })
}
