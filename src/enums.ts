export enum EHttpStatuses {
  idle = 'idle',
  loading = 'loading',
  success = 'success',
  error = 'error',
}

export enum ELocalStorageKeys {
  previousUploadedUserPhoto = 'previous-uploaded-user-photo',
  previousTryOnPhotos = 'previous-try-on-photos',
  mappedApparelPhotosByStoreUrl = 'mapped-apparel-photos-by-store-url',
}

export enum EWorkerMessages {
  captureHtml = 'capture-html',
  apparelPhotoSuccess = 'apparel-photo-success',
  apparelPhotoError = 'apparel-photo-error',
}
