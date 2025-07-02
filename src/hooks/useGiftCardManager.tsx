
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
        qrCode: 'STARBUCKS123456789'
      },
      {
        id: '2',
        name: '치킨버거 세트',
        store: '맥도날드',
        amount: 8900,
        expiryDate: '2025-07-03',
        isUsed: false,
        createdAt: '2025-06-15',
        barcode: '1234567890123'
      },
      {
        id: '3',
        name: '편의점 상품권',
        store: 'GS25',
        amount: 10000,
        expiryDate: '2025-08-15',
        isUsed: true,
        createdAt: '2025-05-20',
        qrCode: 'GS25GIFT987654321'
      }
    ];
    setGiftCards(sampleData);
    checkExpiringGiftCards(sampleData);
  }, []);

  const checkExpiringGiftCards = (cards: GiftCardType[]) => {
    const today = new Date();
    const expiringSoon = cards.filter(card => {
      if (card.isUsed) return false;
      const expiryDate = new Date(card.expiryDate);
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0;
    });

    if (expiringSoon.length > 0) {
      const messages = expiringSoon.map(card => {
        const expiryDate = new Date(card.expiryDate);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let expiryMessage = '';
        if (diffDays === 0) {
          expiryMessage = '오늘 만료됩니다!';
        } else if (diffDays > 0 && diffDays <= 7) {
          expiryMessage = `${diffDays}일 후에 만료됩니다!`;
        } else {
          expiryMessage = `${expiryDate.getFullYear()}년 ${String(expiryDate.getMonth() + 1).padStart(2, '0')}월 ${String(expiryDate.getDate()).padStart(2, '0')}일에 만료됩니다!`;
        }
        
        return `${card.store}의 ${card.name}(이)가 ${expiryMessage}`;
      });
      setNotifications(messages);
    }
  };

  const handleAddGiftCard = (newGiftCard: Omit<GiftCardType, 'id' | 'createdAt'>) => {
    const giftCard: GiftCardType = {
      ...newGiftCard,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
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
  };

  const activeGiftCards = giftCards.filter(card => !card.isUsed);
  const usedGiftCards = giftCards.filter(card => card.isUsed);

  return {
    giftCards,
    showRegistration,
    setShowRegistration,
    selectedGiftCard,
    setSelectedGiftCard,
    notifications,
    activeGiftCards,
    usedGiftCards,
    handleAddGiftCard,
    handleMarkAsUsed
  };
};
