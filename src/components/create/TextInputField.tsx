import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CharacterCountDisplay } from "./CharacterCountDisplay";

// テキスト入力フィールドコンポーネント
interface TextInputFieldProps {
  title: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder: string;
  inputId: string;
}

export const TextInputField = ({
  title,
  description,
  value,
  onChange,
  maxLength,
  placeholder,
  inputId,
}: TextInputFieldProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Input
            id={inputId}
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
