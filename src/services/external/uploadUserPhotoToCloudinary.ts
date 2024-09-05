interface IUploadUserImageToCloudinaryResponse {
  error?: string
  data?: string
}

interface IUploadUserImageToCloudinaryRawResponse {
  secure_url: string
}

export const uploadUserPhotoToCloudinary = async (file: File) => {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          data: 'https://res.cloudinary.com/nungon/image/upload/v1725531590/jyy0djqsibicvbgrwmlr.webp',
        }),
      1000,
    )
  }) as Promise<IUploadUserImageToCloudinaryResponse>

  // const formData = new FormData()
  // formData.append('file', file)
  // formData.append(
  //   'upload_preset',
  //   import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  // )

  // try {
  //   const response: IUploadUserImageToCloudinaryRawResponse = await ky
  //     .post(
  //       `${import.meta.env.VITE_CLOUDINARY_BASE_URL}/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
  //       {
  //         body: formData,
  //       },
  //     )
  //     .json()

  //   return { data: response.secure_url } as IUploadUserImageToCloudinaryResponse
  // } catch (error) {
  //   const errorMessage =
  //     error instanceof Error ? error.message : 'An unexpected error occurred'

  //   return { error: errorMessage } as IUploadUserImageToCloudinaryResponse
  // }
}
