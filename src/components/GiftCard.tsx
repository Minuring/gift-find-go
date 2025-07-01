
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, QrCode } from "lucide-react";
import { GiftCard as GiftCardType } from "@/types/giftcard";

interface GiftCardProps {
  giftCard: GiftCardType;
  onViewDetail: (giftCard: GiftCardType) => void;
}

const GiftCard = ({ giftCard, onViewDetail }: GiftCardProps) => {
  const isExpiringSoon = () => {
    const today = new Date();
    const expiryDate = new Date(giftCard.expiryDate);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const isExpired = () => {
    const today = new Date();
    const expiryDate = new Date(giftCard.expiryDate);
    return expiryDate < today;
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 ${
      giftCard.isUsed ? 'opacity-60 bg-gray-50' : ''
    }`}>
      <div className="relative">
        {giftCard.image && (
          <div className="h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center">
            <img 
              src={giftCard.image} 
              alt={giftCard.name}
              className="h-16 w-16 object-contain bg-white rounded-lg p-2"
            />
          </div>
        )}
        {!giftCard.image && (
          <div className="h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <div className="text-white text-2xl font-bold">
              {giftCard.store.charAt(0)}
            </div>
          </div>
        )}
        
        {isExpiringSoon() && !giftCard.isUsed && (
          <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600">
            곧 만료
          </Badge>
        )}
        
        {isExpired() && !giftCard.isUsed && (
          <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
            만료됨
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
      </CardContent>
    </Card>
  );
};

export default GiftCard;
