// プロジェクトタイプの型定義
export type ProjectType = "message" | "picture";

// プロジェクトタイプ別のリクエストボディ構築ハンドラー
export interface RequestBodyBuilder {
  buildRequestBody: (
    baseBody: { slug: string; type: string; name: string },
    context: {
      inputText: string;
      selectedFile: File | null;
      [key: string]: any;
    }
  ) => Promise<Record<string, any>>;
}

// プロジェクトタイプ別の設定
export const PROJECT_TYPE_CONFIG: Record<ProjectType, {
  projectNamePlaceholder: string;
  inputFields: Array<{
    type: 'text' | 'image';
    title: string;
    description: string;
    placeholder?: string;
    inputId: string;
  }>;
  requestBodyBuilder: RequestBodyBuilder;
}> = {
  message: {
    projectNamePlaceholder: "例：おたおめプロジェクト",
    inputFields: [
      {
        type: 'text',
        title: '文字列入力',
        description: 'Webページに表示させたい文字列を入力してください',
        placeholder: '例：おたおめ！！',
        inputId: 'input-text',
      },
    ],
    requestBodyBuilder: {
      buildRequestBody: async (baseBody, { inputText }) => {
        return {
          ...baseBody,
          message: inputText,
        };
      },
    },
  },
  picture: {
    projectNamePlaceholder: "例：〇〇の写真",
    inputFields: [
      {
        type: 'image',
        title: '画像アップロード',
        description: 'Webページに表示させたい画像をアップロードしてください（JPEG、PNG、GIF、WebP、最大10MB）',
        inputId: 'file-input',
      },
    ],
    requestBodyBuilder: {
      buildRequestBody: async (baseBody, { selectedFile }) => {
        if (!selectedFile) {
          throw new Error('画像ファイルが必要です');
        }

        // 画像をS3にアップロード
        const formData = new FormData();
        formData.append('image', selectedFile);
        
        const uploadResponse = await fetch('/api/projects/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}));
          const errorMessage = errorData.error || '画像のアップロードに失敗しました';
          throw new Error(errorMessage);
        }

        const uploadData = await uploadResponse.json();
        return {
          ...baseBody,
          s3Key: uploadData.s3Key,
        };
      },
    },
  },
};
