import { useState, useEffect } from 'react';
import { GiftCard as GiftCardType } from "@/types/giftcard";

export const useGiftCardManager = () => {
  const [giftCards, setGiftCards] = useState<GiftCardType[]>([]);
  const [showRegistration, setShowRegistration] = useState(false);
  const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCardType | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Initialize with sample data
  useEffect(() => {
    const sampleData: GiftCardType[] = [
      {
        id: '1',
        name: '아메리카노',
        store: '스타벅스',
        amount: 4500,
        expiryDate: '2025-07-05',
        isUsed: false,
        createdAt: '2025-06-01',
        qrCode: 'STARBUCKS123456789',
        ownerId: 'me',
        storeNearbyNotification: true
      },
      {
        id: '2',
        name: '치킨버거 세트',
        store: '맥도날드',
        amount: 8900,
        expiryDate: '2025-07-03',
        isUsed: false,
        createdAt: '2025-06-15',
        barcode: '1234567890123',
        ownerId: 'me',
        storeNearbyNotification: true
      },
      {
        id: '3',
        name: '편의점 상품권',
        store: 'GS25',
        amount: 10000,
        expiryDate: '2025-08-15',
        isUsed: true,
        createdAt: '2025-05-20',
        qrCode: 'GS25GIFT987654321',
        ownerId: 'me',
        storeNearbyNotification: true
      }
    ];
    setGiftCards(sampleData);
    checkExpiringGiftCards(sampleData);
  }, []);

  const checkExpiringGiftCards = (cards: GiftCardType[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to beginning of day for accurate comparison
    const notifications: string[] = [];
    
    cards.forEach(card => {
      if (card.isUsed) return;
      
      const expiryDate = new Date(card.expiryDate);
      expiryDate.setHours(23, 59, 59, 999); // Set to end of expiry day
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let message = '';
      if (diffDays <= 1) {
        message = `${card.store}의 ${card.name}이(가) 오늘 만료 예정입니다!`;
      } else if (diffDays > 1 && diffDays <= 3) {
        message = `${card.store}의 ${card.name}이(가) ${diffDays}일 후 만료됩니다!`;
      } else if (diffDays > 3 && diffDays <= 7) {
        message = `${card.store}의 ${card.name}이(가) ${diffDays}일 후 만료됩니다!`;
      }
      
      if (message) {
        notifications.push(message);
      }
    });
    
    setNotifications(notifications);
  };

  const handleAddGiftCard = (newGiftCard: Omit<GiftCardType, 'id' | 'createdAt'>) => {
    const giftCard: GiftCardType = {
      ...newGiftCard,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      storeNearbyNotification: true
    };
    
    const updatedCards = [...giftCards, giftCard];
    setGiftCards(updatedCards);
    setShowRegistration(false);
    checkExpiringGiftCards(updatedCards);
  };

  const handleMarkAsUsed = (id: string) => {
    const updatedCards = giftCards.map(card => 
      card.id === id ? { ...card, isUsed: true } : card
    );
    setGiftCards(updatedCards);
    setSelectedGiftCard(null);
    checkExpiringGiftCards(updatedCards);
  };

  const handleStoreNearbyNotificationChange = (id: string, value: boolean) => {
    const updatedCards = giftCards.map(card =>
      card.id === id ? { ...card, storeNearbyNotification: value } : card
    );
    setGiftCards([...updatedCards]);
    // selectedGiftCard도 동기화
    if (selectedGiftCard && selectedGiftCard.id === id) {
      setSelectedGiftCard({ ...selectedGiftCard, storeNearbyNotification: value });
    }
    checkExpiringGiftCards(updatedCards);
  };

  const today = new Date();
  today.setHours(23, 59, 59, 999); // Set to end of today for comparison
  
  const activeGiftCards = giftCards.filter(card => {
    if (card.isUsed) return false;
    const expiryDate = new Date(card.expiryDate);
    expiryDate.setHours(23, 59, 59, 999); // Set to end of expiry day
    return expiryDate >= today; // Include cards that expire today
  });
  
  const usedGiftCards = giftCards.filter(card => card.isUsed);
  
  const expiredGiftCards = giftCards.filter(card => {
    if (card.isUsed) return false;
    const expiryDate = new Date(card.expiryDate);
    expiryDate.setHours(23, 59, 59, 999); // Set to end of expiry day
    return expiryDate < today; // Only cards that expired before today
  });

  return {
    giftCards,
    showRegistration,
    setShowRegistration,
    selectedGiftCard,
    setSelectedGiftCard,
    notifications,
    activeGiftCards,
    usedGiftCards,
    expiredGiftCards,
    handleAddGiftCard,
    handleMarkAsUsed,
    handleStoreNearbyNotificationChange
  };
};
