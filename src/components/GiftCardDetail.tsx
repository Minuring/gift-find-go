import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Check, QrCode } from "lucide-react";
import { GiftCard as GiftCardType } from "@/types/giftcard";
import QRCodeDisplay from './QRCodeDisplay';
import ShareGiftCard from './ShareGiftCard';

interface GiftCardDetailProps {
  giftCard: GiftCardType;
  onBack: () => void;
  onMarkAsUsed: (id: string) => void;
}

const GiftCardDetail = ({ giftCard, onBack, onMarkAsUsed }: GiftCardDetailProps) => {
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

  const getDaysUntilExpiry = () => {
    const today = new Date();
    const expiryDate = new Date(giftCard.expiryDate);
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">기프티콘 상세</h1>
      </div>

      <div className="space-y-6">
        {/* 기프티콘 정보 카드 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{giftCard.name}</CardTitle>
                <p className="text-gray-600 mt-1">{giftCard.store}</p>
              </div>
              <div className="text-right">
                {isExpiringSoon() && !giftCard.isUsed && (
                  <Badge className="bg-orange-500 hover:bg-orange-600 mb-2">
                    {getDaysUntilExpiry()}일 후 만료
                  </Badge>
                )}
                {isExpired() && !giftCard.isUsed && (
                  <Badge className="bg-red-500 hover:bg-red-600 mb-2">
                    만료됨
                  </Badge>
                )}
                {giftCard.isUsed && (
                  <Badge className="bg-gray-500 mb-2">
                    사용완료
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">금액</p>
                <p className="text-2xl font-bold text-primary">
                  {giftCard.amount.toLocaleString()}원
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">만료일</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  <p className="font-medium">
                    {new Date(giftCard.expiryDate).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
            </div>

            {/* 이미지 표시 영역 */}
            <div className="h-48 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-lg flex items-center justify-center mb-6">
              {giftCard.image ? (
                <img 
                  src={giftCard.image} 
                  alt={giftCard.name}
                  className="h-32 w-32 object-contain bg-white rounded-lg p-4"
                />
              ) : (
                <div className="text-white text-4xl font-bold">
                  {giftCard.store.charAt(0)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* QR코드/바코드 표시 */}
        {(giftCard.qrCode || giftCard.barcode) && !giftCard.isUsed && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                사용 코드
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QRCodeDisplay 
                qrCode={giftCard.qrCode}
                barcode={giftCard.barcode}
              />
            </CardContent>
          </Card>
        )}

        {/* 공유 및 사용 완료 버튼 */}
        <div className="space-y-3">
          {/* 공유 기능 */}
          <ShareGiftCard giftCard={giftCard} />
          
          {/* 사용 완료 버튼 */}
          {!giftCard.isUsed && (
            <Button 
              onClick={() => onMarkAsUsed(giftCard.id)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              disabled={isExpired()}
            >
              <Check className="h-4 w-4 mr-2" />
              사용 완료
            </Button>
          )}
        </div>

        {/* 사용 완료된 기프티콘 정보 */}
        {giftCard.isUsed && (
          <Card className="bg-gray-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <Check className="h-12 w-12 mx-auto text-green-500 mb-2" />
                <p className="text-gray-600">이 기프티콘은 사용 완료되었습니다.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GiftCardDetail;
