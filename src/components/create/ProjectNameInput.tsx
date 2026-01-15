import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CharacterCountDisplay } from "./CharacterCountDisplay";

// プロジェクト名入力コンポーネント
interface ProjectNameInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder?: string;
}

export const ProjectNameInput = ({ 
  value, 
  onChange, 
  maxLength, 
  placeholder = "例：プロジェクト名" 
}: ProjectNameInputProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>プロジェクト名</CardTitle>
        <CardDescription>プロジェクトを識別するための名前を入力してください</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Input
            id="project-name"
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={maxLength}
            className="w-full"
          />
          <CharacterCountDisplay 
            currentLength={value.length} 
            maxLength={maxLength} 
          />
        </div>
      </CardContent>
    </Card>
  );
};
