import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 画像アップロードフィールドコンポーネント
interface ImageUploadFieldProps {
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploadField = ({ selectedFile, onFileChange }: ImageUploadFieldProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>画像アップロード</CardTitle>
        <CardDescription>
          Webページに表示させたい画像をアップロードしてください（JPEG、PNG、GIF、WebP、最大10MB）
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="file-input">画像ファイル</Label>
          <Input
            id="file-input"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={onFileChange}
            className="w-full"
          />
          {selectedFile && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>選択されたファイル:</strong> {selectedFile.name}
              </p>
              <p className="text-sm text-gray-500">
                サイズ: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
