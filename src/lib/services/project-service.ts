import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { VALID_PROJECT_TYPES } from '@/lib/config';
import { validateRequired } from '@/lib/api-helpers';

/**
 * プロジェクトの所有者権限をチェックする
 * @param projectId プロジェクトID
 * @param userId ユーザーID
 * @returns プロジェクト情報または404エラーレスポンス
 */
export async function checkProjectOwnership(
  projectId: string,
  userId: string
) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      user_id: userId,
    },
  });

  if (!project) {
    return NextResponse.json(
      { error: 'プロジェクトが見つからないか、削除権限がありません' },
      { status: 404 }
    );
  }

  return project;
}

/**
 * プロジェクトタイプのバリデーション用のヘルパー関数
 * @param type 検証するプロジェクトタイプ
 * @returns バリデーションエラーレスポンスまたはnull
 */
export function validateProjectType(
  type: unknown
): NextResponse | null {
  if (typeof type !== 'string' || !VALID_PROJECT_TYPES.includes(type as any)) {
    return NextResponse.json(
      { error: `無効なプロジェクトタイプです。有効なタイプ: ${VALID_PROJECT_TYPES.join(', ')}` },
      { status: 400 }
    );
  }
  return null;
}

/**
 * プロジェクトタイプごとのバリデーションとデータ抽出の結果
 */
export interface ProjectTypeValidationResult {
  data: Record<string, any>;
  error: NextResponse | null;
}

/**
 * プロジェクトタイプごとのハンドラーインターフェース
 */
export interface ProjectTypeHandler {
  /**
   * リクエストボディからタイプ固有のデータを検証・抽出
   */
  validateAndExtract(body: any): ProjectTypeValidationResult;

  /**
   * PrismaのprojectDataにタイプ固有の関連データを追加
   */
  buildProjectData(extractedData: Record<string, any>): any;

  /**
   * プロジェクト削除時のタイプ固有の処理（オプション）
   */
  onDelete?(project: any): Promise<void>;
}

/**
 * プロジェクトタイプごとのハンドラーマップ
 * 新しいタイプを追加する場合は、ここにハンドラーを追加するだけ
 */
export const projectTypeHandlers: Record<string, ProjectTypeHandler> = {
  message: {
    validateAndExtract(body: any): ProjectTypeValidationResult {
      const message = body.message;
      const messageValidation = validateRequired(message, 'メッセージ');
      if (messageValidation) {
        return { data: {}, error: messageValidation };
      }
      return { data: { message }, error: null };
    },

    buildProjectData(extractedData: Record<string, any>): any {
      return {
        projectMessage: {
          create: {
            message: extractedData.message,
          },
        },
      };
    },
  },

  // picture型は一時停止中のため無効化
  // picture: {
  //   validateAndExtract(body: any): ProjectTypeValidationResult {
  //     const s3Key = body.s3Key;
  //     const s3KeyValidation = validateRequired(s3Key, 'S3キー');
  //     if (s3KeyValidation) {
  //       return { data: {}, error: s3KeyValidation };
  //     }
  //     return { data: { s3Key }, error: null };
  //   },
  //
  //   buildProjectData(extractedData: Record<string, any>): any {
  //     return {
  //       projectPicture: {
  //         create: {
  //           s3_key: extractedData.s3Key,
  //         },
  //       },
  //     };
  //   },
  //
  //   async onDelete(project: any): Promise<void> {
  //     if (project.projectPicture?.s3_key) {
  //       const { deleteImageFromS3 } = await import('@/lib/s3');
  //       await deleteImageFromS3(project.projectPicture.s3_key);
  //     }
  //   },
  // },
};

/**
 * プロジェクトタイプに応じたバリデーションとデータ抽出
 * @param type プロジェクトタイプ
 * @param body リクエストボディ
 * @returns バリデーション結果と抽出されたデータ
 */
export function validateAndExtractProjectTypeData(
  type: string,
  body: any
): ProjectTypeValidationResult {
  const handler = projectTypeHandlers[type];

  if (!handler) {
    return {
      data: {},
      error: NextResponse.json(
        { error: `未サポートのプロジェクトタイプです: ${type}` },
        { status: 400 }
      ),
    };
  }

  return handler.validateAndExtract(body);
}

/**
 * プロジェクトタイプに応じたPrismaデータを構築
 * @param type プロジェクトタイプ
 * @param extractedData 抽出されたデータ
 * @returns PrismaのprojectDataに追加するオブジェクト
 */
export function buildProjectTypeData(
  type: string,
  extractedData: Record<string, any>
): any {
  const handler = projectTypeHandlers[type];

  if (!handler) {
    throw new Error(`未サポートのプロジェクトタイプです: ${type}`);
  }

  return handler.buildProjectData(extractedData);
}

/**
 * プロジェクト削除時のタイプ固有の処理を実行
 * @param type プロジェクトタイプ
 * @param project プロジェクトデータ
 */
export async function handleProjectTypeDelete(
  type: string,
  project: any
): Promise<void> {
  const handler = projectTypeHandlers[type];

  if (handler?.onDelete) {
    await handler.onDelete(project);
  }
}
