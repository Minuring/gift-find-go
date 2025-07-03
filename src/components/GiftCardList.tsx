
import { useState } from 'react';
import GiftCardRegistration from './GiftCardRegistration';
import GiftCardDetail from './GiftCardDetail';
import GiftCardHeader from './GiftCardHeader';
import ExpiryNotifications from './ExpiryNotifications';
import GiftCardTabs from './GiftCardTabs';
import Settings from './Settings';
import { useGiftCardManager } from '@/hooks/useGiftCardManager';

const GiftCardList = () => {
  const [showSettings, setShowSettings] = useState(false);
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

  if (showSettings) {
    return <Settings onClose={() => setShowSettings(false)} />;
  }

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
      <GiftCardHeader 
        onShowRegistration={() => setShowRegistration(true)}
        onShowSettings={() => setShowSettings(true)}
      />
      
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
