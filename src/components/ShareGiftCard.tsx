
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Share2, Copy, Download, MessageCircle, Mail, Link } from "lucide-react";
import { GiftCard as GiftCardType } from "@/types/giftcard";
import { useToast } from "@/hooks/use-toast";

interface ShareGiftCardProps {
  giftCard: GiftCardType;
}

const ShareGiftCard = ({ giftCard }: ShareGiftCardProps) => {
  const [recipientMessage, setRecipientMessage] = useState('');
  const { toast } = useToast();

  const generateShareImage = async (): Promise<string> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Canvas context not available');
    
    canvas.width = 400;
    canvas.height = 300;
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 400, 300);
    gradient.addColorStop(0, '#8B5CF6');
    gradient.addColorStop(1, '#EC4899');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 300);
    
    // Card content
    ctx.fillStyle = 'white';
    ctx.fillRect(20, 20, 360, 260);
    
    // Text content
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(giftCard.name, 40, 70);
    
    ctx.font = '18px Arial';
    ctx.fillText(`사용처: ${giftCard.store}`, 40, 110);
    ctx.fillText(`금액: ${giftCard.amount.toLocaleString()}원`, 40, 140);
    ctx.fillText(`만료일: ${new Date(giftCard.expiryDate).toLocaleDateString('ko-KR')}`, 40, 170);
    
    if (recipientMessage) {
      ctx.font = '14px Arial';
      ctx.fillStyle = '#6B7280';
      ctx.fillText(`메시지: ${recipientMessage}`, 40, 210);
    }
    
    // Convert to blob URL
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        }
      });
    });
  };

  const handleDownloadImage = async () => {
    try {
      const imageUrl = await generateShareImage();
      const link = document.createElement('a');
      link.download = `기프티콘_${giftCard.name}_${Date.now()}.png`;
      link.href = imageUrl;
      link.click();
      URL.revokeObjectURL(imageUrl);
      
      toast({
        title: "다운로드 완료",
        description: "기프티콘 이미지가 다운로드되었습니다."
      });
    } catch (error) {
      toast({
        title: "다운로드 실패",
        description: "이미지 생성 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleCopyLink = () => {
    const shareText = `🎁 기프티콘 공유\n\n` +
                     `상품: ${giftCard.name}\n` +
                     `사용처: ${giftCard.store}\n` +
                     `금액: ${giftCard.amount.toLocaleString()}원\n` +
                     `만료일: ${new Date(giftCard.expiryDate).toLocaleDateString('ko-KR')}\n` +
                     `${recipientMessage ? `\n메시지: ${recipientMessage}` : ''}`;
    
    navigator.clipboard.writeText(shareText).then(() => {
      toast({
        title: "복사 완료",
        description: "기프티콘 정보가 클립보드에 복사되었습니다."
      });
    });
  };

  const handleShareToKakao = () => {
    const shareText = `🎁 ${giftCard.name} 기프티콘을 공유합니다!\n` +
                     `💳 사용처: ${giftCard.store}\n` +
                     `💰 금액: ${giftCard.amount.toLocaleString()}원\n` +
                     `📅 만료일: ${new Date(giftCard.expiryDate).toLocaleDateString('ko-KR')}\n` +
                     `${recipientMessage ? `\n💌 ${recipientMessage}` : ''}`;
    
    // This would integrate with KakaoTalk API in a real implementation
    navigator.clipboard.writeText(shareText).then(() => {
      toast({
        title: "카카오톡 공유 준비",
        description: "텍스트가 복사되었습니다. 카카오톡에 붙여넣기하세요."
      });
    });
  };

  const handleEmailShare = () => {
    const subject = `기프티콘 공유: ${giftCard.name}`;
    const body = `안녕하세요!\n\n${giftCard.name} 기프티콘을 공유합니다.\n\n` +
                `상품명: ${giftCard.name}\n` +
                `사용처: ${giftCard.store}\n` +
                `금액: ${giftCard.amount.toLocaleString()}원\n` +
                `만료일: ${new Date(giftCard.expiryDate).toLocaleDateString('ko-KR')}\n` +
                `${recipientMessage ? `\n메시지: ${recipientMessage}\n` : ''}\n` +
                `즐겁게 사용하세요! 😊`;
    
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Share2 className="h-4 w-4 mr-2" />
          공유하기
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>기프티콘 공유</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* 미리보기 카드 */}
          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <CardContent className="p-4">
              <h3 className="font-bold text-lg">{giftCard.name}</h3>
              <p className="text-sm opacity-90">{giftCard.store}</p>
              <p className="text-2xl font-bold">{giftCard.amount.toLocaleString()}원</p>
              <p className="text-xs opacity-75">
                만료일: {new Date(giftCard.expiryDate).toLocaleDateString('ko-KR')}
              </p>
            </CardContent>
          </Card>

          {/* 메시지 입력 */}
          <div className="space-y-2">
            <Label htmlFor="message">받는 분께 메시지 (선택사항)</Label>
            <Input
              id="message"
              placeholder="예: 생일 축하해! 맛있게 드세요 :)"
              value={recipientMessage}
              onChange={(e) => setRecipientMessage(e.target.value)}
            />
          </div>

          {/* 공유 옵션 */}
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleDownloadImage} className="flex flex-col h-16">
              <Download className="h-4 w-4 mb-1" />
              <span className="text-xs">이미지 저장</span>
            </Button>
            <Button onClick={handleCopyLink} variant="outline" className="flex flex-col h-16">
              <Copy className="h-4 w-4 mb-1" />
              <span className="text-xs">텍스트 복사</span>
            </Button>
            <Button onClick={handleShareToKakao} className="flex flex-col h-16 bg-yellow-400 text-black hover:bg-yellow-500">
              <MessageCircle className="h-4 w-4 mb-1" />
              <span className="text-xs">카카오톡</span>
            </Button>
            <Button onClick={handleEmailShare} variant="outline" className="flex flex-col h-16">
              <Mail className="h-4 w-4 mb-1" />
              <span className="text-xs">이메일</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareGiftCard;
