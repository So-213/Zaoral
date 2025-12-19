import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// S3クライアントの初期化
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;

/**
 * 画像をS3にアップロードする
 * @param fileBuffer アップロードするファイルのバッファ
 * @param fileName ファイル名（拡張子を含む）
 * @param contentType コンテンツタイプ（例: 'image/jpeg', 'image/png'）
 * @returns S3のオブジェクトキー（パス）
 */
export async function uploadImageToS3(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  if (!BUCKET_NAME) {
    throw new Error('S3_BUCKET_NAME environment variable is not set');
  }

  // オブジェクトキーを生成（例: pictures/2025/01/15/uuid-filename.jpg）
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '/');
  const uuid = crypto.randomUUID();
  const extension = fileName.split('.').pop() || 'jpg';
  const objectKey = `pictures/${timestamp}/${uuid}.${extension}`;

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: contentType,
      // 画像は公開読み取り可能にする（必要に応じて変更）
      // ACL: 'public-read', // パブリックアクセスブロックが有効な場合は使用不可
    });

    await s3Client.send(command);
    return objectKey;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('画像のアップロードに失敗しました');
  }
}

/**
 * S3から画像を削除する
 * @param objectKey S3のオブジェクトキー
 */
export async function deleteImageFromS3(objectKey: string): Promise<void> {
  if (!BUCKET_NAME) {
    throw new Error('S3_BUCKET_NAME environment variable is not set');
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('S3 delete error:', error);
    // 削除エラーはログに記録するが、例外は投げない（既に削除されている可能性があるため）
  }
}

/**
 * S3オブジェクトの公開URLを生成する
 * @param objectKey S3のオブジェクトキー
 * @returns 公開URL
 */
export function getS3PublicUrl(objectKey: string): string {
  if (!BUCKET_NAME) {
    throw new Error('S3_BUCKET_NAME environment variable is not set');
  }

  const region = process.env.AWS_REGION || 'ap-northeast-1';
  return `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${objectKey}`;
}

