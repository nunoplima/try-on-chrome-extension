import { useCallback, useEffect, useState } from 'react'
import { ELocalStorageKeys } from '../enums'
import {
  getFromLocalStorage,
  setToLocalStorage,
} from '../services/internal/localStorage'

export const usePersistedState = <T>(
  key: ELocalStorageKeys,
  initialValue: T,
): [T, (value: T | ((prevValue: T) => T)) => void] => {
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

  useEffect(() => {
    if (!chrome || !chrome.storage) return

    const handleChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string,
    ) => {
      // check if the change is for the specified key and in the 'local' storage area
      if (areaName === 'local' && changes[key]) {
        setValue(changes[key].newValue)
      }
    }

    chrome.storage.onChanged.addListener(handleChange)

    return () => {
      chrome.storage.onChanged.removeListener(handleChange)
    }
  }, [key])

  const handleSetValue = useCallback(
    (newValue: T | ((prevValue: T) => T)) => {
      setValue((prevState) => {
        const nextState =
          typeof newValue === 'function'
            ? (newValue as (prevValue: T) => T)(prevState)
            : newValue

        setToLocalStorage(key, nextState)

        return nextState
      })
    },
    [key],
  )

  return [value, handleSetValue]
}
