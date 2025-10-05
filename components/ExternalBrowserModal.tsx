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
    // 外部ブラウザで開くためのURLを生成
    const externalUrl = window.location.href
    window.open(externalUrl, '_blank')
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
