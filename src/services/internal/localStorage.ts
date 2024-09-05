export const setToLocalStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(error)
  }
}

export const getFromLocalStorage = <T>(key: string): T | undefined => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : undefined
  } catch (error) {
    console.error(error)
    return undefined
  }
}
