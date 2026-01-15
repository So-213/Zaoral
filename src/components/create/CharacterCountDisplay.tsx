// 文字数カウント表示コンポーネント
interface CharacterCountDisplayProps {
  currentLength: number;
  maxLength: number;
  warningThreshold?: number;
}

export const CharacterCountDisplay = ({ 
  currentLength, 
  maxLength, 
  warningThreshold = 0.9 
}: CharacterCountDisplayProps) => {
  const isNearLimit = currentLength > maxLength * warningThreshold;
  
  return (
    <div className="flex justify-between items-center text-sm">
      <span className={isNearLimit ? 'text-orange-500' : 'text-gray-500'}>
        {currentLength} / {maxLength} 文字
      </span>
      {isNearLimit && (
        <span className="text-orange-500 text-xs">
          文字数制限に近づいています
        </span>
      )}
    </div>
  );
};
