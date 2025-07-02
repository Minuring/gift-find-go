
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GiftCard from './GiftCard';
import GiftCardRegistration from './GiftCardRegistration';
import GiftCardDetail from './GiftCardDetail';
import GiftCardHeader from './GiftCardHeader';
import ExpiryNotifications from './ExpiryNotifications';
import GiftCardEmptyState from './GiftCardEmptyState';
import { useGiftCardManager } from '@/hooks/useGiftCardManager';

const GiftCardList = () => {
  const {
    showRegistration,
    setShowRegistration,
    selectedGiftCard,
    setSelectedGiftCard,
    notifications,
    activeGiftCards,
    usedGiftCards,
    handleAddGiftCard,
    handleMarkAsUsed
  } = useGiftCardManager();

  if (showRegistration) {
    return (
      <GiftCardRegistration 
        onAdd={handleAddGiftCard}
        onCancel={() => setShowRegistration(false)}
      />
    );
  }

  if (selectedGiftCard) {
    return (
      <GiftCardDetail 
        giftCard={selectedGiftCard}
        onBack={() => setSelectedGiftCard(null)}
        onMarkAsUsed={handleMarkAsUsed}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <GiftCardHeader onShowRegistration={() => setShowRegistration(true)} />
      
      <ExpiryNotifications notifications={notifications} />

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeGiftCards.map(giftCard => (
                <GiftCard 
                  key={giftCard.id} 
                  giftCard={giftCard} 
                  onViewDetail={setSelectedGiftCard}
                />
              ))}
            </div>
          ) : (
            <GiftCardEmptyState onShowRegistration={() => setShowRegistration(true)} />
          )}
        </TabsContent>
        
        <TabsContent value="used" className="mt-6">
          {usedGiftCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {usedGiftCards.map(giftCard => (
                <GiftCard 
                  key={giftCard.id} 
                  giftCard={giftCard} 
                  onViewDetail={setSelectedGiftCard}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">사용 완료된 기프티콘이 없습니다.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GiftCardList;
