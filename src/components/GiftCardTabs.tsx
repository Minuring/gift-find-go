
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GiftCardGrid from './GiftCardGrid';
import GiftCardEmptyState from './GiftCardEmptyState';
import { GiftCard as GiftCardType } from "@/types/giftcard";

interface GiftCardTabsProps {
  activeGiftCards: GiftCardType[];
  usedGiftCards: GiftCardType[];
  onShowRegistration: () => void;
  onViewDetail: (giftCard: GiftCardType) => void;
}

const GiftCardTabs = ({ activeGiftCards, usedGiftCards, onShowRegistration, onViewDetail }: GiftCardTabsProps) => {
  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="active">
          사용 가능 ({activeGiftCards.length})
        </TabsTrigger>
        <TabsTrigger value="used">
          사용 완료 ({usedGiftCards.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="active" className="mt-6">
        {activeGiftCards.length > 0 ? (
          <GiftCardGrid giftCards={activeGiftCards} onViewDetail={onViewDetail} />
        ) : (
          <GiftCardEmptyState onShowRegistration={onShowRegistration} />
        )}
      </TabsContent>
      
      <TabsContent value="used" className="mt-6">
        {usedGiftCards.length > 0 ? (
          <GiftCardGrid giftCards={usedGiftCards} onViewDetail={onViewDetail} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">사용 완료된 기프티콘이 없습니다.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default GiftCardTabs;
