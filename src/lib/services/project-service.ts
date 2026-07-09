import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { VALID_PROJECT_TYPES, DEFAULT_LEFT_PROJECTS } from '@/lib/config';
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

export interface CreateProjectParams {
  userId: string;
  userName: string;
  projectType: unknown;
  slug: string;
  name: string;
  body: any;
}

/**
 * プロジェクトを作成する
 * タイプバリデーション・残機チェック・有効期限計算・作成と残機減算のトランザクションを内包する
 * @returns 作成されたプロジェクト、またはエラー用のNextResponse
 */
export async function createProject(
  params: CreateProjectParams
): Promise<NextResponse | any> {
  const { userId, userName, projectType: rawType, slug, name, body } = params;

  // 有効なプロジェクトタイプかチェック
  const typeValidation = validateProjectType(rawType);
  if (typeValidation) return typeValidation;

  const projectType = rawType as string;

  // タイプに応じたバリデーションとデータ抽出
  const typeDataResult = validateAndExtractProjectTypeData(projectType, body);
  if (typeDataResult.error) {
    return typeDataResult.error;
  }

  // ユーザーのleft_projects（残機）を取得
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json(
      { error: 'ユーザーが見つかりません' },
      { status: 404 }
    );
  }

  const userPlan = (user as any).plan;
  const isPremium = userPlan === 'PREMIUM';
  const leftProjects = (user as any).left_projects ?? DEFAULT_LEFT_PROJECTS;

  // 残機チェック（プレミアムプラン以外で、残機が0以下なら作成不可）
  if (!isPremium && leftProjects <= 0) {
    return NextResponse.json(
      { error: 'プロジェクトの作成残機がありません。' },
      { status: 403 }
    );
  }

  // 有効期限を31日後に設定
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 31);

  // トランザクションでプロジェクト作成と残機減算を同時に実行
  const savedProject = await prisma.$transaction(async (tx) => {  // txとは、複数の処理を同じトランザクションとして扱うためのprisma clientのこと
    // プロジェクトを作成
    const projectData: any = {
      user_id: userId,
      user_name: userName,
      type: projectType,
      slug,
      name,
      expires_at: expiresAt,
    };

    // タイプに応じて関連データを作成
    const typeSpecificData = buildProjectTypeData(projectType, typeDataResult.data);
    Object.assign(projectData, typeSpecificData);

    const project = await tx.project.create({
      data: projectData,
      include: {
        projectMessage: true,
        projectPicture: true,
      },
    });

    // 残機を1減らす（プレミアムプランの場合は減らさない）
    if (!isPremium) {
      const currentLeftProjects = (user as any).left_projects ?? DEFAULT_LEFT_PROJECTS;
      await tx.user.update({
        where: { id: userId },
        data: {
          left_projects: Math.max(0, currentLeftProjects - 1),
        } as any,
      });
    }

    return project;
  });

  return savedProject;
}

/**
 * プロジェクトを削除する
 * 所有者権限チェック・タイプ固有の削除処理・プロジェクト削除を内包する
 * @returns 成功時は削除結果、失敗時はエラー用のNextResponse
 */
export async function deleteProject(
  projectId: string,
  userId: string
): Promise<NextResponse | { success: true }> {
  // プロジェクトの所有者権限をチェック
  const ownershipResult = await checkProjectOwnership(projectId, userId);
  if (ownershipResult instanceof NextResponse) {
    return ownershipResult;
  }

  // pictureタイプは削除時にprojects_pictureのS3キーが必要
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      projectPicture: true, // プロジェクトに紐づけられているprojectPictureレコードがあればそれを取得
    },
  });

  if (!project) {
    return NextResponse.json(
      { error: 'プロジェクトが見つかりません' },
      { status: 404 }
    );
  }

  // タイプ固有の削除処理を実行（例: pictureタイプのS3削除など）
  await handleProjectTypeDelete(project.type as string, project);

  // プロジェクトを削除（Cascadeにより関連するProjectMessage/ProjectPictureも削除される）
  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  return { success: true };
}
