'use client'
import { signIn } from "next-auth/react"

export default function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-80">
        <h1 className="text-2xl font-bold mb-4">ログイン</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          Googleでログイン
        </button>
        <button
          className="mt-4 block text-sm text-gray-500 underline"
          onClick={onClose}
        >
          閉じる
        </button>
      </div>
    </div>
  )
}
