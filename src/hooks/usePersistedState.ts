import { useState } from 'react'
import { ELocalStorageKeys } from '../enums'
import {
  getFromLocalStorage,
  setToLocalStorage,
} from '../services/internal/localStorage'

export function usePersistedState<T>(
  key: ELocalStorageKeys,
  initialValue: T,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(
    () => getFromLocalStorage<T>(key) || initialValue,
  )

  const handleSetValue = (value: T) => {
    setValue(value)
    setToLocalStorage(key, value)
  }

  return [value, handleSetValue]
}
