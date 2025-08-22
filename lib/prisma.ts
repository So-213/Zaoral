// Prismaクライアントのインスタンスを作成するためのファイル

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Serverless環境でのコネクション管理のためのラッパー関数
export async function withPrismaConnection<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error('Prisma operation error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export { prisma };

// Edge Runtimeではprocess.onが利用できないため、条件付きで実行
if (typeof process !== 'undefined' && process.on) {
  // 接続をクリーンアップする関数
  const cleanup = async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  };

  // プロセス終了時に接続をクリーンアップ（Node.js環境のみ）
  if (process.env.NODE_ENV === 'production') {
    process.on('SIGTERM', cleanup);
    process.on('SIGINT', cleanup);
  }
} 