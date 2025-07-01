
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Calendar } from "lucide-react";
import { GiftCard as GiftCardType } from "@/types/giftcard";

interface GiftCardRegistrationProps {
  onAdd: (giftCard: Omit<GiftCardType, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const GiftCardRegistration = ({ onAdd, onCancel }: GiftCardRegistrationProps) => {
  const [formData, setFormData] = useState({
    name: '',
    store: '',
    amount: '',
    expiryDate: '',
    qrCode: '',
    barcode: ''
  });

  const stores = [
    '스타벅스', '맥도날드', 'GS25', 'CU', '세븐일레븐', '롯데리아', 
    '버거킹', 'KFC', '파리바게뜨', '뚜레쥬르', '던킨도너츠', '배스킨라빈스'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.store || !formData.amount || !formData.expiryDate) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    const giftCard: Omit<GiftCardType, 'id' | 'createdAt'> = {
      name: formData.name,
      store: formData.store,
      amount: parseInt(formData.amount),
      expiryDate: formData.expiryDate,
      qrCode: formData.qrCode || undefined,
      barcode: formData.barcode || undefined,
      isUsed: false
    };

    onAdd(giftCard);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={onCancel}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">기프티콘 등록</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>새 기프티콘 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기프티콘 이미지 업로드 */}
            <div className="space-y-2">
              <Label>기프티콘 이미지</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">이미지를 드래그하거나 클릭하여 업로드</p>
                <Button type="button" variant="outline" className="mt-2">
                  파일 선택
                </Button>
              </div>
            </div>

            {/* 기프티콘 이름 */}
            <div className="space-y-2">
              <Label htmlFor="name">기프티콘 이름 *</Label>
              <Input 
                id="name"
                placeholder="예: 아메리카노, 치킨버거 세트"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            {/* 사용처 */}
            <div className="space-y-2">
              <Label>사용처 *</Label>
              <Select onValueChange={(value) => handleInputChange('store', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="사용처를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map(store => (
                    <SelectItem key={store} value={store}>
                      {store}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 금액 */}
            <div className="space-y-2">
              <Label htmlFor="amount">금액 *</Label>
              <Input 
                id="amount"
                type="number"
                placeholder="10000"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
              />
            </div>

            {/* 만료일 */}
            <div className="space-y-2">
              <Label htmlFor="expiryDate">만료일 *</Label>
              <div className="relative">
                <Input 
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                />
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* QR코드 */}
            <div className="space-y-2">
              <Label htmlFor="qrCode">QR코드 (선택)</Label>
              <Input 
                id="qrCode"
                placeholder="QR코드 정보를 입력하세요"
                value={formData.qrCode}
                onChange={(e) => handleInputChange('qrCode', e.target.value)}
              />
            </div>

            {/* 바코드 */}
            <div className="space-y-2">
              <Label htmlFor="barcode">바코드 (선택)</Label>
              <Input 
                id="barcode"
                placeholder="바코드 번호를 입력하세요"
                value={formData.barcode}
                onChange={(e) => handleInputChange('barcode', e.target.value)}
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-4 pt-6">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                취소
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                등록하기
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GiftCardRegistration;
