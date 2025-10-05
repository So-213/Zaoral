'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink, Smartphone, Monitor, Copy, Check } from 'lucide-react'
import { detectInAppBrowser, getExternalBrowserMessage } from '@/lib/browser-detection'

interface ExternalBrowserModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
}

export default function ExternalBrowserModal({ isOpen, onClose, onContinue }: ExternalBrowserModalProps) {
  const [browserInfo, setBrowserInfo] = useState<{ isInAppBrowser: boolean; appName?: string }>({
    isInAppBrowser: false
  })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const info = detectInAppBrowser()
    setBrowserInfo(info)
  }, [])

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('URLのコピーに失敗しました:', err)
    }
  }

  const handleOpenExternal = () => {
    const externalUrl = window.location.href
    
    if (browserInfo.isInAppBrowser) {
      // アプリ内ブラウザから外部ブラウザを開く複数の方法を試す
      
      // 方法1: Android Intent URL（Android端末の場合）
      if (navigator.userAgent.includes('Android')) {
        const intentUrl = `intent://${window.location.host}${window.location.pathname}${window.location.search}#Intent;scheme=https;package=com.android.chrome;end`
        try {
          window.location.href = intentUrl
          onContinue()
          return
        } catch (e) {
          console.log('Intent URL failed, trying alternative methods')
        }
      }
      
      // 方法2: カスタムスキームを使用してChromeを開く
      try {
        const chromeUrl = `googlechrome://navigate?url=${encodeURIComponent(externalUrl)}`
        window.location.href = chromeUrl
        
        // フォールバック: 1秒後に通常のwindow.openを試す
        setTimeout(() => {
          try {
            window.open(externalUrl, '_blank')
          } catch (e) {
            console.log('window.open failed, user may need to manually open external browser')
          }
        }, 1000)
      } catch (e) {
        // 方法3: 最後の手段として通常のwindow.open
        try {
          window.open(externalUrl, '_blank')
        } catch (e) {
          console.log('All methods failed, user needs to manually copy URL')
        }
      }
    } else {
      // 通常のブラウザの場合は通常通り
      window.open(externalUrl, '_blank')
    }
    
    onContinue()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <ExternalLink className="w-6 h-6 text-amber-600" />
            </div>
            <DialogTitle className="text-xl">外部ブラウザで開くことをお勧めします</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {getExternalBrowserMessage(browserInfo.appName)}
            <br />
            <span className="text-sm text-gray-600 mt-2 block">
              外部ブラウザの方が動作が安定し、すべての機能をご利用いただけます。
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 推奨ブラウザ */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-blue-600" />
                推奨ブラウザ
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Chrome</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Firefox</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Safari</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span>Edge</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* URLコピー */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-green-600" />
                手順
              </h3>
              <div className="space-y-2 text-sm">
                <p>1. 下のボタンでURLをコピー</p>
                <p>2. 外部ブラウザを開く</p>
                <p>3. アドレスバーに貼り付け</p>
              </div>
              <Button
                onClick={handleCopyUrl}
                variant="outline"
                size="sm"
                className="w-full mt-3"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    コピー完了
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    URLをコピー
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex gap-3">
            <Button
              onClick={handleOpenExternal}
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              外部ブラウザで開く
            </Button>
            <Button
              onClick={onContinue}
              variant="outline"
              className="flex-1"
            >
              このまま続行
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
