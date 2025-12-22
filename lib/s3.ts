import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// S3クライアントを取得する関数（環境変数の変更に対応）
function getS3Client() {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/fd387f13-f7cb-4376-8e9e-8890c8da3bd0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/s3.ts:4',message:'getS3Client called',data:{hasProcessEnv:!!process.env,envKeys:Object.keys(process.env).filter(k=>k.includes('AWS')).join(',')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  // 環境変数から明示的に認証情報を取得
  const rawAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const rawSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const rawRegion = process.env.AWS_REGION;

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/fd387f13-f7cb-4376-8e9e-8890c8da3bd0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/s3.ts:10',message:'Raw env values before trim',data:{rawAccessKeyId:rawAccessKeyId||'undefined',rawAccessKeyIdLength:rawAccessKeyId?.length||0,rawAccessKeyIdType:typeof rawAccessKeyId,hasRawSecret:!!rawSecretAccessKey,rawRegion:rawRegion||'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  const accessKeyId = rawAccessKeyId?.trim();
  const secretAccessKey = rawSecretAccessKey?.trim();
  const region = (rawRegion || 'ap-northeast-1').trim();

  if (!accessKeyId || !secretAccessKey) {
    throw new Error('AWS認証情報が設定されていません。AWS_ACCESS_KEY_IDとAWS_SECRET_ACCESS_KEYを確認してください。');
  }

  // 認証情報を明示的に指定（AWS SDKのデフォルト認証情報チェーンは使用されない）
  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

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
    const s3Client = getS3Client();
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: 'public-read', // 画像は公開読み取り可能
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
    const s3Client = getS3Client();
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

