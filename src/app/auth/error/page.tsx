'use client'

import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'OAuthAccountNotLinked':
        return 'このメールアドレスは既に別の方法で登録されています。元のログイン方法を使用してください。'
      case 'AccessDenied':
        return 'ログインが拒否されました。'
      case 'Verification':
        return 'メールアドレスの確認が必要です。'
      default:
        return 'ログイン中にエラーが発生しました。'
    }
  }

  const handleRetry = () => {
    signIn(undefined, { callbackUrl: '/dashboard' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-white to-purple-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">ログインエラー</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{getErrorMessage(error)}</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full px-4 py-3 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors"
            >
              再度ログインを試す
            </button>
            
            <Link
              href="/"
              className="block w-full px-4 py-3 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition-colors text-center"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function AuthErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-white to-purple-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">ログインエラー</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">ログイン中にエラーが発生しました。</p>
          </div>
          
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full px-4 py-3 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition-colors text-center"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthError() {
  return (
    <Suspense fallback={<AuthErrorFallback />}>
      <AuthErrorContent />
    </Suspense>
  )
}
