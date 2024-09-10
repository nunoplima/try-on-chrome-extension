import { useEffect, useState } from 'react'
import { ELocalStorageKeys } from '../enums'
import {
  getFromLocalStorage,
  setToLocalStorage,
} from '../services/internal/localStorage'

export const usePersistedState = <T>(
  key: ELocalStorageKeys,
  initialValue: T,
): [T, (value: T) => void] => {
  const [value, setValue] = useState<T>(initialValue)

  useEffect(() => {
    getFromLocalStorage<T>(key)
      .then((storedValue) => {
        if (storedValue !== undefined) {
          setValue(storedValue)
        }
      })
      .catch((error) => {
        console.error('Error getting data from storage:', error)
      })
  }, [key])

  const handleSetValue = (newValue: T) => {
    setValue(newValue)
    setToLocalStorage(key, newValue)
  }

  return [value, handleSetValue]
}
