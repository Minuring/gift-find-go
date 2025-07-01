
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Plus } from "lucide-react";
import GiftCard from './GiftCard';
import GiftCardRegistration from './GiftCardRegistration';
import GiftCardDetail from './GiftCardDetail';
import { GiftCard as GiftCardType } from "@/types/giftcard";

const GiftCardList = () => {
  const [giftCards, setGiftCards] = useState<GiftCardType[]>([]);
  const [showRegistration, setShowRegistration] = useState(false);
  const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCardType | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);

  // 샘플 데이터
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
    
    // 만료 임박 알림 체크
    checkExpiringGiftCards(sampleData);
  }, []);

  const checkExpiringGiftCards = (cards: GiftCardType[]) => {
    const today = new Date();
    const expiringSoon = cards.filter(card => {
      if (card.isUsed) return false;
      const expiryDate = new Date(card.expiryDate);
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays >= 0;
    });

    if (expiringSoon.length > 0) {
      const messages = expiringSoon.map(card => 
        `${card.store}의 ${card.name}이 ${new Date(card.expiryDate).toLocaleDateString('ko-KR')}에 만료됩니다!`
      );
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
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            기프티콘 관리
          </h1>
          <p className="text-gray-600 mt-1">김민수님의 기프티콘을 관리하세요</p>
        </div>
        <Button 
          onClick={() => setShowRegistration(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          등록하기
        </Button>
      </div>

      {/* 알림 */}
      {notifications.length > 0 && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center mb-2">
            <Bell className="h-5 w-5 text-orange-500 mr-2" />
            <h3 className="font-semibold text-orange-800">만료 임박 알림</h3>
          </div>
          {notifications.map((notification, index) => (
            <p key={index} className="text-orange-700 text-sm">{notification}</p>
          ))}
        </div>
      )}

      {/* 탭 */}
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
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">사용 가능한 기프티콘이 없습니다.</p>
              <Button 
                onClick={() => setShowRegistration(true)}
                variant="outline"
              >
                첫 번째 기프티콘 등록하기
              </Button>
            </div>
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
