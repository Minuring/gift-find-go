import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, QrCode } from "lucide-react";
import { GiftCard as GiftCardType } from "@/types/giftcard";
import StoreLogo from './StoreLogo';
import { useState } from "react";
import type { Friend } from "../types/friend";

interface GiftCardProps {
  giftCard: GiftCardType;
  onViewDetail: (giftCard: GiftCardType) => void;
  onShare?: (friend: Friend) => void;
}

const dummyFriends: Friend[] = [
  { id: "1", name: "홍길동", type: "kakao" },
  { id: "2", name: "김철수", type: "contact" },
];

const GiftCard = ({ giftCard, onViewDetail, onShare }: GiftCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const getExpiryStatus = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(giftCard.expiryDate);
    expiryDate.setHours(23, 59, 59, 999);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { type: 'expired', message: '만료됨' };
    } else if (diffDays <= 1) {
      return { type: 'today', message: '오늘 만료 예정' };
    } else if (diffDays <= 7) {
      return { type: 'soon', message: `${diffDays}일 후 만료됨` };
    }
    return { type: 'normal', message: '' };
  };

  const expiryStatus = getExpiryStatus();

  const handleShareClick = () => {
    setShowModal(true);
  };

  const handleFriendSelect = (friend: Friend) => {
    setSelectedFriend(friend);
  };

  const handleShareConfirm = () => {
    if (selectedFriend && onShare) {
      onShare(selectedFriend);
    }
    setShowModal(false);
    setSelectedFriend(null);
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 ${
      giftCard.isUsed ? 'opacity-60 bg-gray-50' : ''
    }`}>
      <div className="relative">
        <div className="h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center">
          {giftCard.image ? (
            <img 
              src={giftCard.image} 
              alt={giftCard.name}
              className="h-16 w-16 object-contain bg-white rounded-lg p-2"
            />
          ) : (
            <StoreLogo store={giftCard.store} size="md" />
          )}
        </div>
        
        {expiryStatus.type === 'today' && !giftCard.isUsed && (
          <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
            {expiryStatus.message}
          </Badge>
        )}
        
        {expiryStatus.type === 'soon' && !giftCard.isUsed && (
          <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600">
            {expiryStatus.message}
          </Badge>
        )}
        
        {expiryStatus.type === 'expired' && !giftCard.isUsed && (
          <Badge className="absolute top-2 right-2 bg-gray-500">
            {expiryStatus.message}
          </Badge>
        )}
        
        {giftCard.isUsed && (
          <Badge className="absolute top-2 right-2 bg-gray-500">
            사용완료
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{giftCard.name}</h3>
        <p className="text-gray-600 mb-2">{giftCard.store}</p>
        <p className="text-xl font-bold text-primary mb-3">
          {giftCard.amount.toLocaleString()}원
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar className="h-4 w-4 mr-1" />
          {new Date(giftCard.expiryDate).toLocaleDateString('ko-KR')}
        </div>
        
        <Button 
          onClick={() => onViewDetail(giftCard)}
          className="w-full"
          variant={giftCard.isUsed ? "outline" : "default"}
        >
          <QrCode className="h-4 w-4 mr-2" />
          {giftCard.isUsed ? '내역 보기' : '사용하기'}
        </Button>

        {onShare && (
          <button 
            onClick={handleShareClick}
            style={{ marginTop: 8, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px' }}
          >
            공유
          </button>
        )}
      </CardContent>

      {showModal && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            background: 'rgba(0,0,0,0.3)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1000 
          }}
        >
          <div 
            style={{ 
              background: '#fff', 
              borderRadius: 8, 
              padding: 24, 
              minWidth: 300 
            }}
          >
            <h3>친구에게 공유하기</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {dummyFriends.map(friend => (
                <li key={friend.id} style={{ margin: '8px 0' }}>
                  <label style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="friend"
                      value={friend.id}
                      checked={selectedFriend?.id === friend.id}
                      onChange={() => handleFriendSelect(friend)}
                    />
                    {friend.name} ({friend.type === 'kakao' ? '카카오' : '연락처'})
                  </label>
                </li>
              ))}
            </ul>
            <button 
              onClick={handleShareConfirm}
              disabled={!selectedFriend}
              style={{ marginTop: 12, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px' }}
            >
              공유하기
            </button>
            <button 
              onClick={() => setShowModal(false)}
              style={{ marginLeft: 8, background: '#aaa', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px' }}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default GiftCard;
