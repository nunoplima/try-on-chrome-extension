interface IUploadUserImageToCloudinaryResponse {
  error?: string
  data?: string
}

export const uploadUserImageToCloudinary = (file: File) => {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          error:
            'https://res.cloudinary.com/nungon/image/upload/v1725453741/em9uf64p05bwb2oc07hp.png',
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
  //   const response = await ky
  //     .post(
  //       `${import.meta.env.VITE_CLOUDINARY_BASE_URL}/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
  //       {
  //         body: formData,
  //       },
  //     )
  //     .json()

  //   return { data: response } as IUploadUserImageToCloudinaryResponse
  // } catch (error) {
  //   const errorMessage =
  //     error instanceof Error ? error.message : 'An unexpected error occurred'

  //   return { error: errorMessage } as IUploadUserImageToCloudinaryResponse
  // }
}
