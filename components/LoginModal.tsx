'use client'
import { useState } from 'react'
import { signIn } from "next-auth/react"

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)

  const handleLogin = (provider: string) => {
    setSelectedProvider(provider)
    setShowPrivacyPolicy(true)
  }

  const handleAgreeAndLogin = () => {
    if (selectedProvider) {
      signIn(selectedProvider, { callbackUrl: "/dashboard" })
    }
    setShowPrivacyPolicy(false)
    setSelectedProvider(null)
  }

  const handleCancel = () => {
    setShowPrivacyPolicy(false)
    setSelectedProvider(null)
  }

  if (showPrivacyPolicy) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-sm text-gray-800 leading-relaxed mb-6">
            <p className="mb-4">
              このWebサービスは、ログイン時の認証画面で許可をいただいた場合にのみ、お客様のアカウントに登録されているメールアドレスを取得いたします。取得したメールアドレスは、以下の目的以外には使用いたしません。また、法令で定められている場合を除き、第三者に提供することはありません。
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>ユーザーIDとしてのアカウント管理に使用</li>
              <li>パスワード再発行時の本人確認に使用</li>
            </ul>
          </div>
          <div className="flex gap-3">
            <button
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              onClick={handleCancel}
            >
              キャンセル
            </button>
            <button
              className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors"
              onClick={handleAgreeAndLogin}
            >
              同意してログイン
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-80">
        <h1 className="text-xl font-bold mb-6 text-gray-800">ログイン方法を選択</h1>
        <div className="space-y-3">
          <button
            className="w-full px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            onClick={() => handleLogin("line")}
          >
            LINEでログイン
          </button>
          <button
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            onClick={() => handleLogin("google")}
          >
            Googleでログイン
          </button>
          <button
            className="w-full px-4 py-3 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition-colors"
            onClick={onClose}
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  )
}
