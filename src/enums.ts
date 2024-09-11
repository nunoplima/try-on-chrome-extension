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
  activeTabUrl = 'active-tab-url',
}

export enum EWorkerMessages {
  captureHtml = 'capture-html',
  apparelPhotoSuccess = 'apparel-photo-success',
  apparelPhotoError = 'apparel-photo-error',
  tabUrlChanged = 'tab-url-changed',
  storedApparelPhotoUrl = 'stored-apparel-photo-url',
  getInitialActiveTabUrl = 'get-initial-active-tab-url',
}
