'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { detectInAppBrowser } from '@/lib/browser-detection'
import ExternalBrowserModal from './ExternalBrowserModal'

interface BrowserDetectionContextType {
  isInAppBrowser: boolean
  appName?: string
  showModal: boolean
  setShowModal: (show: boolean) => void
}

const BrowserDetectionContext = createContext<BrowserDetectionContextType | undefined>(undefined)

export function useBrowserDetection() {
  const context = useContext(BrowserDetectionContext)
  if (context === undefined) {
    throw new Error('useBrowserDetection must be used within a BrowserDetectionProvider')
  }
  return context
}

interface BrowserDetectionProviderProps {
  children: ReactNode
}

export default function BrowserDetectionProvider({ children }: BrowserDetectionProviderProps) {
  const [browserInfo, setBrowserInfo] = useState<{ isInAppBrowser: boolean; appName?: string }>({
    isInAppBrowser: false
  })
  const [showModal, setShowModal] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window !== 'undefined' && !hasChecked) {
      const info = detectInAppBrowser()
      setBrowserInfo(info)
      setHasChecked(true)
      
      // アプリ内ブラウザを検出した場合、モーダルを表示
      if (info.isInAppBrowser) {
        // 少し遅延させてページ読み込み後に表示
        setTimeout(() => {
          setShowModal(true)
        }, 1000)
      }
    }
  }, [hasChecked])

  const handleModalClose = () => {
    setShowModal(false)
  }

  const handleContinue = () => {
    setShowModal(false)
  }

  const value: BrowserDetectionContextType = {
    isInAppBrowser: browserInfo.isInAppBrowser,
    appName: browserInfo.appName,
    showModal,
    setShowModal
  }

  return (
    <BrowserDetectionContext.Provider value={value}>
      {children}
      <ExternalBrowserModal
        isOpen={showModal}
        onClose={handleModalClose}
        onContinue={handleContinue}
      />
    </BrowserDetectionContext.Provider>
  )
}
