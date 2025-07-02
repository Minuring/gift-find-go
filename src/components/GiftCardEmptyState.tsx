
import { Button } from "@/components/ui/button";

interface GiftCardEmptyStateProps {
  onShowRegistration: () => void;
}

const GiftCardEmptyState = ({ onShowRegistration }: GiftCardEmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 mb-4">사용 가능한 기프티콘이 없습니다.</p>
      <Button 
        onClick={onShowRegistration}
        variant="outline"
      >
        첫 번째 기프티콘 등록하기
      </Button>
    </div>
  );
};

export default GiftCardEmptyState;
