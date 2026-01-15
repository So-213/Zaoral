import { ProjectNameInput } from "./ProjectNameInput";
import { TextInputField } from "./TextInputField";
import { ImageUploadField } from "./ImageUploadField";
import { PROJECT_TYPE_CONFIG, ProjectType } from "@/lib/create/project-type-config";

// プロジェクトタイプ別入力セクションコンポーネント
interface ProjectTypeInputSectionProps {
  projectType: ProjectType;
  projectName: string;
  onProjectNameChange: (value: string) => void;
  inputText: string;
  onInputTextChange: (value: string) => void;
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxProjectNameLength: number;
  maxCharacters: number;
}

export const ProjectTypeInputSection = ({
  projectType,
  projectName,
  onProjectNameChange,
  inputText,
  onInputTextChange,
  selectedFile,
  onFileChange,
  maxProjectNameLength,
  maxCharacters,
}: ProjectTypeInputSectionProps) => {
  const config = PROJECT_TYPE_CONFIG[projectType];
  
  if (!config) {
    return null;
  }

  return (
    <>
      <ProjectNameInput
        value={projectName}
        onChange={onProjectNameChange}
        maxLength={maxProjectNameLength}
        placeholder={config.projectNamePlaceholder}
      />
      
      {config.inputFields.map((field) => {
        if (field.type === 'text') {
          return (
            <TextInputField
              key={field.inputId}
              title={field.title}
              description={field.description}
              value={inputText}
              onChange={onInputTextChange}
              maxLength={maxCharacters}
              placeholder={field.placeholder || ''}
              inputId={field.inputId}
            />
          );
        }
        
        if (field.type === 'image') {
          return (
            <ImageUploadField
              key={field.inputId}
              selectedFile={selectedFile}
              onFileChange={onFileChange}
            />
          );
        }
        
        return null;
      })}
    </>
  );
};
