// lib/prisma-with-rls.ts
// Prisma Clientをラップする関数

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// RLS対応のPrismaクライアント
export function createPrismaClientWithRLS(userId?: string) {
  if (!userId) {
    return prisma;
  }

  // ユーザーIDを設定してRLSを有効にする
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query, operation, model }) {
          // 各クエリの前にユーザーIDを設定
          await prisma.$executeRaw`SELECT set_config('app.current_user_id', ${userId}, false)`;
          return query(args);
        },
      },
    },
  });
}

// 管理者用のPrismaクライアント
export function createPrismaClientForAdmin() {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query, operation, model }) {
          // 管理者権限を設定
          await prisma.$executeRaw`SELECT set_config('app.current_user_id', 'admin', false)`;
          return query(args);
        },
      },
    },
  });
}

export { prisma };

// 接続をクリーンアップする関数
const cleanup = async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
};

// プロセス終了時に接続をクリーンアップ
if (process.env.NODE_ENV === 'production') {
  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);
} 