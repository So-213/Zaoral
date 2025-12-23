import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers

// Edge Runtimeの設定を追加
export const runtime = 'nodejs'