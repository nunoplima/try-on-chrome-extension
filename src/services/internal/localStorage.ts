export const setToLocalStorage = (key: string, value: unknown) => {
  if (import.meta.env.DEV) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error setting data in localStorage:', error)
    }
  } else {
    chrome.storage.local.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        console.error(
          'Error setting data in chrome.storage.local:',
          chrome.runtime.lastError,
        )
      } else {
        console.log('Data saved successfully!')
      }
    })
  }
}

export const getFromLocalStorage = <T>(key: string): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    if (import.meta.env.DEV) {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : undefined
    } else {
      chrome.storage.local.get([key], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(result[key] as T | undefined)
        }
      })
    }
  })
}
