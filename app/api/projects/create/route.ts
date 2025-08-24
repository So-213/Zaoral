// // app/api/projects/create/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { auth } from '@/lib/auth';
// import { prisma } from '@/lib/prisma';



// // バックエンドサーバーのURL（環境変数から取得、デフォルトはlocalhost）
// const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// export async function POST(request: NextRequest) {
//   try {
//     const session = await auth();
    
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
//     }

//     const { projectId } = await request.json();

//     if (!projectId) {
//       return NextResponse.json({ error: 'プロジェクトIDが必要です' }, { status: 400 });
//     }

//     // プロジェクトが存在し、ユーザーが所有者であることを確認
//     const project = await prisma.project.findFirst({
//       where: {
//         id: projectId,
//         user_id: session.user.id,
//       },
//     });

//     if (!project) {
//       return NextResponse.json({ error: 'プロジェクトが見つかりません' }, { status: 404 });
//     }

//     const updatedProject = await prisma.project.update({
//       where: {
//         id: projectId,
//       }
//     });

//     // バックエンドサーバーにプロジェクト公開作成を依頼
//     try {
//       const backendResponse = await fetch(`${BACKEND_URL}/api/projects/create`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           projectId: projectId,
//           projectData: {
//             id: updatedProject.id,
//             user_id: updatedProject.user_id,
//             user_name: updatedProject.user_name,
//             slug: updatedProject.slug,
//             message: updatedProject.message,
//             created_at: updatedProject.created_at,
//             expires_at: updatedProject.expires_at,
//             published: updatedProject.published
//           }
//         }),
//       });

//       if (!backendResponse.ok) {
//         console.error('バックエンドサーバーへの通知に失敗:', backendResponse.statusText);
//       } else {
//         console.log('バックエンドサーバーにプロジェクト公開通知を送信しました');
//       }
//     } catch (error) {
//       console.error('バックエンドサーバーへの通知エラー:', error);
//       // バックエンドへの通知が失敗しても、フロントエンドの処理は続行
//     }

//     return NextResponse.json({ 
//       success: true, 
//       project: updatedProject 
//     });

//   } catch (error) {
//     console.error('プロジェクト公開エラー:', error);
//     return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
//   }
// }
