import { findProductPhotoUrl, trimHtmlContent } from './background.functions'
import { ELocalStorageKeys, EWorkerMessages } from './src/enums'
import {
  getFromLocalStorage,
  setToLocalStorage,
} from './src/services/internal/localStorage'
import { blobToBase64, urlToBlob } from './src/utils/base64'

chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.url && tab.active) {
    setToLocalStorage(ELocalStorageKeys.activeTabUrl, changeInfo.url)
  }
})

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === EWorkerMessages.getInitialActiveTabUrl) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab && activeTab.url) {
        setToLocalStorage(ELocalStorageKeys.activeTabUrl, activeTab.url)
      }
    })
  }
})

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === EWorkerMessages.captureHtml) {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const activeTab = tabs[0]

      if (!activeTab) return

      const apparelPhotos = await getFromLocalStorage(
        ELocalStorageKeys.mappedApparelPhotosByStoreUrl,
      )
      const apparelPhoto = apparelPhotos?.find(
        (apparelPhoto) => apparelPhoto.tabUrl === activeTab.url,
      )?.photoUrl

      if (!!apparelPhoto) {
        chrome.runtime.sendMessage({
          type: EWorkerMessages.storedApparelPhotoUrl,
          data: apparelPhoto,
          tabUrl: activeTab.url,
        })
      } else {
        // inject content script to capture HTML
        chrome.scripting.executeScript(
          {
            target: { tabId: activeTab.id },
            func: () => document.documentElement.outerHTML,
          },
          async (injectionResults) => {
            const htmlContent = injectionResults[0]?.result
            if (htmlContent) {
              try {
                const trimmedHtmlContent = trimHtmlContent(htmlContent)
                const result = await findProductPhotoUrl(trimmedHtmlContent)
                const resultWebPBlob = await urlToBlob(result.data)
                const resultBase64 = await blobToBase64(resultWebPBlob)

                chrome.runtime.sendMessage({
                  type: EWorkerMessages.apparelPhotoSuccess,
                  data: resultBase64,
                  tabUrl: activeTab.url,
                })
              } catch (error) {
                chrome.runtime.sendMessage({
                  type: EWorkerMessages.apparelPhotoError,
                  error: error.message,
                })
              }
            }
          },
        )
      }
    })
  }
})

export {}
