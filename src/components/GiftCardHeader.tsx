
import { Button } from "@/components/ui/button";
import { Plus, Settings as SettingsIcon } from "lucide-react";

interface GiftCardHeaderProps {
  onShowRegistration: () => void;
  onShowSettings: () => void;
}

const GiftCardHeader = ({ onShowRegistration, onShowSettings }: GiftCardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          내 기프티콘
        </h1>
        <p className="text-gray-600 mt-1">소중한 기프티콘을 관리하세요</p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline"
          onClick={onShowSettings}
          className="flex items-center"
        >
          <SettingsIcon className="h-4 w-4 mr-2" />
          설정
        </Button>
        <Button 
          onClick={onShowRegistration}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          기프티콘 등록
        </Button>
      </div>
    </div>
  );
};

export default GiftCardHeader;
