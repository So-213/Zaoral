import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-helpers';
import { uploadImageToS3 } from '@/lib/s3';

/**
 * 画像をS3にアップロードするエンドポイント
 * このエンドポイントは画像をアップロードし、S3キーを返します
 * 実際のプロジェクト作成は /api/projects で行います
 */
export async function POST(request: NextRequest) {
  // picture型プロジェクトは一時停止中のため、このエンドポイントは無効化
  return NextResponse.json(
    { error: '画像型プロジェクトは現在利用できません' },
    { status: 400 }
  );

  // 以下はpicture型一時停止中のためコメントアウト
  // try {
  //   // 認証チェック
  //   const authResult = await requireAuth();
  //   if (authResult instanceof NextResponse) {
  //     return authResult;
  //   }

  //   // FormDataから画像を取得
  //   const formData = await request.formData();
  //   const file = formData.get('image') as File;

  //   if (!file) {
  //     return NextResponse.json(
  //       { error: '画像ファイルが提供されていません' },
  //       { status: 400 }
  //     );
  //   }

  //   // ファイルタイプの検証
  //   const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  //   if (!allowedTypes.includes(file.type)) {
  //     return NextResponse.json(
  //       { error: 'サポートされていない画像形式です。JPEG、PNG、GIF、WebPのみ対応しています。' },
  //       { status: 400 }
  //     );
  //   }

  //   // ファイルサイズの検証（10MBまで）
  //   const maxSize = 10 * 1024 * 1024; // 10MB
  //   if (file.size > maxSize) {
  //     return NextResponse.json(
  //       { error: '画像サイズが大きすぎます。10MB以下にしてください。' },
  //       { status: 400 }
  //     );
  //   }

  //   // ファイルをバッファに変換
  //   const arrayBuffer = await file.arrayBuffer();
  //   const buffer = Buffer.from(arrayBuffer);

  //   // S3にアップロード
  //   const s3Key = await uploadImageToS3(buffer, file.name, file.type);

  //   return NextResponse.json(
  //     { s3Key, fileName: file.name, fileSize: file.size, contentType: file.type },
  //     { status: 200 }
  //   );
  // } catch (error) {
  //   console.error('Image upload error:', error);
  //   return NextResponse.json(
  //     { error: '画像のアップロードに失敗しました' },
  //     { status: 500 }
  //   );
  // }
}

