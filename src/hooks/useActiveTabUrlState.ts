import { useEffect, useState } from 'react'

export const useActiveTabUrlState = () => {
  const [activeTabUrl, setActiveTabUrl] = useState<string>()

  useEffect(() => {
    if (!chrome || !chrome.tabs) return

    const getActiveTabUrl = async () => {
      try {
        const tabs = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        })
        if (tabs && tabs.length > 0) {
          setActiveTabUrl(tabs[0].url)
        } else {
          console.error('Could not get the active tab URL.')
        }
      } catch (error) {
        console.error('Error getting active tab URL:', error)
      }
    }

    getActiveTabUrl()
  }, [])

  return [activeTabUrl]
}
