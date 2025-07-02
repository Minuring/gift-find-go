
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface GiftCardHeaderProps {
  onShowRegistration: () => void;
}

const GiftCardHeader = ({ onShowRegistration }: GiftCardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          기프티콘 관리
        </h1>
        <p className="text-gray-600 mt-1">김민수님의 기프티콘을 관리하세요</p>
      </div>
      <Button 
        onClick={onShowRegistration}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      >
        <Plus className="h-4 w-4 mr-2" />
        등록하기
      </Button>
    </div>
  );
};

export default GiftCardHeader;
