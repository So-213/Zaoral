import { NextRequest, NextResponse } from 'next/server';
import {
  requireAuth,
  handleApiError,
  validateRequired,
} from '@/lib/api-helpers';
import {
  createProject,
  deleteProject,
} from '@/lib/services/project-service';



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, type, name } = body;

    // 認証チェック
    const { userId, userName } = await requireAuth();

    // バリデーション
    const slugValidation = validateRequired(slug, 'スラッグ');
    if (slugValidation) return slugValidation;

    const typeRequiredValidation = validateRequired(type, 'プロジェクトタイプ');
    if (typeRequiredValidation) return typeRequiredValidation;

    const nameValidation = validateRequired(name, 'プロジェクト名');
    if (nameValidation) return nameValidation;

    const result = await createProject({ userId, userName, projectType: type, slug, name, body });
    if (result instanceof NextResponse) {
      return result;
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    // 認証エラーの場合は401を返す
    if (error instanceof Error && error.message === '認証が必要です') {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }
    return handleApiError(error, 'プロジェクト作成エラー', 'プロジェクトの作成に失敗しました');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 認証チェック
    const { userId } = await requireAuth();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');

    // バリデーション
    const projectIdValidation = validateRequired(projectId, 'プロジェクトID');
    if (projectIdValidation) return projectIdValidation;

    const result = await deleteProject(projectId!, userId);
    if (result instanceof NextResponse) {
      return result;
    }

    return NextResponse.json({ message: 'プロジェクトが正常に削除されました' });
  } catch (error) {
    // 認証エラーの場合は401を返す
    if (error instanceof Error && error.message === '認証が必要です') {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }
    return handleApiError(error, 'プロジェクト削除エラー', 'プロジェクトの削除に失敗しました');
  }
}
