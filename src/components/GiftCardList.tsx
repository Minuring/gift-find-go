import { useState } from 'react';
import GiftCardRegistration from './GiftCardRegistration';
import GiftCardDetail from './GiftCardDetail';
import GiftCardHeader from './GiftCardHeader';
import ExpiryNotifications from './ExpiryNotifications';
import GiftCardTabs from './GiftCardTabs';
import Settings from './Settings';
import { useGiftCardManager } from '@/hooks/useGiftCardManager';
import { storeCategories, getStoreCategory } from '@/utils/storeCategories';

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

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filterByCategory = (cards: any[]) => {
    if (selectedCategory === 'all') return cards;
    const category = storeCategories.find(cat => cat.id === selectedCategory);
    if (!category) return cards;
    return cards.filter(card => category.stores.includes(card.store));
  };

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
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          className={`px-3 py-1 rounded-full border text-sm ${selectedCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
          onClick={() => setSelectedCategory('all')}
        >
          전체
        </button>
        {storeCategories.map(cat => (
          <button
            key={cat.id}
            className={`px-3 py-1 rounded-full border flex items-center gap-1 text-sm ${selectedCategory === cat.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span className="text-base">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
      <GiftCardTabs
        activeGiftCards={filterByCategory(activeGiftCards)}
        usedGiftCards={filterByCategory(usedGiftCards)}
        expiredGiftCards={filterByCategory(expiredGiftCards)}
        onShowRegistration={() => setShowRegistration(true)}
        onViewDetail={setSelectedGiftCard}
      />
    </div>
  );
};

export default GiftCardList;
