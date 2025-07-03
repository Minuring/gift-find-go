
import GiftCardRegistration from './GiftCardRegistration';
import GiftCardDetail from './GiftCardDetail';
import GiftCardHeader from './GiftCardHeader';
import ExpiryNotifications from './ExpiryNotifications';
import GiftCardTabs from './GiftCardTabs';
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
    expiredGiftCards,
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

      <GiftCardTabs
        activeGiftCards={activeGiftCards}
        usedGiftCards={usedGiftCards}
        expiredGiftCards={expiredGiftCards}
        onShowRegistration={() => setShowRegistration(true)}
        onViewDetail={setSelectedGiftCard}
      />
    </div>
  );
};

export default GiftCardList;
