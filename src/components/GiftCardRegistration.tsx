import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Calendar, AlertCircle, Camera, Images, Wand2 } from "lucide-react";
import { GiftCard as GiftCardType } from "@/types/giftcard";
import { useToast } from "@/hooks/use-toast";
import { storeCategories } from '@/utils/storeCategories';
import { extractGiftCardInfo, validateGiftCardImage, GiftCardInfo } from '@/utils/imageRecognition';
import GalleryScanner from './GalleryScanner';

interface GiftCardRegistrationProps {
  onAdd: (giftCard: Omit<GiftCardType, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

type RegistrationMode = 'gallery' | 'manual';

const GiftCardRegistration = ({ onAdd, onCancel }: GiftCardRegistrationProps) => {
  const [registrationMode, setRegistrationMode] = useState<RegistrationMode | null>(null);
  const [galleryMode, setGalleryMode] = useState<'select' | 'scan' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    store: '',
    amount: '',
    expiryDate: '',
    image: '',
    from: ''
  });
  
  const [validationErrors, setValidationErrors] = useState({
    image: '',
    amount: ''
  });

  const { toast } = useToast();

  const allStores = storeCategories.flatMap(category => category.stores);

  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Basic validation: check if it's a reasonable size for a gift card
        const isValidSize = img.width >= 100 && img.height >= 100;
        const hasValidAspectRatio = (img.width / img.height) >= 0.5 && (img.width / img.height) <= 2;
        
        if (!isValidSize || !hasValidAspectRatio) {
          setValidationErrors(prev => ({
            ...prev,
            image: '기프티콘 이미지로 적절하지 않은 크기입니다. 다른 이미지를 선택해주세요.'
          }));
          resolve(false);
        } else {
          setValidationErrors(prev => ({ ...prev, image: '' }));
          resolve(true);
        }
      };
      img.onerror = () => {
        setValidationErrors(prev => ({
          ...prev,
          image: '유효하지 않은 이미지 파일입니다.'
        }));
        resolve(false);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const validateAmount = (value: string): boolean => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue <= 0 || numValue > 1000000) {
      setValidationErrors(prev => ({
        ...prev,
        amount: '1원 이상 1,000,000원 이하의 유효한 금액을 입력해주세요.'
      }));
      return false;
    }
    setValidationErrors(prev => ({ ...prev, amount: '' }));
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.store || !formData.amount || !formData.expiryDate) {
      toast({
        title: "입력 오류",
        description: "필수 항목을 모두 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    if (!validateAmount(formData.amount)) {
      return;
    }

    const giftCard: Omit<GiftCardType, 'id' | 'createdAt'> = {
      name: formData.name,
      store: formData.store,
      amount: parseInt(formData.amount),
      expiryDate: formData.expiryDate,
      image: formData.image || undefined,
      isUsed: false,
      from: formData.from,
      ownerId: 'me'
    };

    onAdd(giftCard);
    toast({
      title: "등록 완료",
      description: "기프티콘이 성공적으로 등록되었습니다."
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'amount' && value) {
      validateAmount(value);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isValid = await validateImage(file);
      if (isValid) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          handleInputChange('image', result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAIRegistration = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const isValid = await validateGiftCardImage(file);
      if (!isValid) {
        setValidationErrors(prev => ({
          ...prev,
          image: '기프티콘 이미지로 적절하지 않은 크기입니다. 다른 이미지를 선택해주세요.'
        }));
        return;
      }

      const info = await extractGiftCardInfo(file);
      
      // Fill form with extracted information
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData({
          name: info.name || '',
          store: info.store || '',
          amount: info.amount?.toString() || '',
          expiryDate: info.expiryDate || '',
          image: result,
          from: ''
        });
      };
      reader.readAsDataURL(file);

      toast({
        title: "자동 인식 완료",
        description: "기프티콘 정보가 자동으로 입력되었습니다. 확인 후 수정해주세요."
      });

    } catch (error) {
      console.error('AI registration error:', error);
      toast({
        title: "인식 실패",
        description: "기프티콘 정보를 자동으로 인식하지 못했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleScanComplete = (info: GiftCardInfo, imageFile: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormData({
        name: info.name || '',
        store: info.store || '',
        amount: info.amount?.toString() || '',
        expiryDate: info.expiryDate || '',
        image: result,
        from: ''
      });
    };
    reader.readAsDataURL(imageFile);

    setRegistrationMode('manual');
    
    toast({
      title: "스캔 완료",
      description: "기프티콘 정보가 자동으로 입력되었습니다. 확인 후 수정해주세요."
    });
  };

  if (!registrationMode) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Button
            onClick={() => setRegistrationMode('gallery')}
            className="flex flex-col p-8 h-auto text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            <Images className="h-8 w-8 mb-2" />
            갤러리에서 찾기
          </Button>
          <Button
            onClick={() => setRegistrationMode('manual')}
            className="flex flex-col p-8 h-auto text-lg"
          >
            <Upload className="h-8 w-8 mb-2" />
            직접 입력하기
          </Button>
        </div>
      </div>
    );
  }

  if (registrationMode === 'gallery' && !galleryMode) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => setRegistrationMode(null)} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">갤러리에서 찾기</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Button
            onClick={() => setGalleryMode('select')}
            className="flex flex-col p-8 h-auto text-lg"
          >
            <Upload className="h-8 w-8 mb-2" />
            직접 선택
          </Button>
          <Button
            onClick={() => setGalleryMode('scan')}
            className="flex flex-col p-8 h-auto text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            <Wand2 className="h-8 w-8 mb-2" />
            자동 스캔
          </Button>
        </div>
      </div>
    );
  }

  if (registrationMode === 'gallery' && galleryMode === 'select') {
    return (
      <GalleryScanner 
        onScanComplete={handleScanComplete}
        onCancel={() => setGalleryMode(null)}
        mode="select"
      />
    );
  }

  if (registrationMode === 'gallery' && galleryMode === 'scan') {
    return (
      <GalleryScanner 
        onScanComplete={handleScanComplete}
        onCancel={() => setGalleryMode(null)}
        mode="scan"
      />
    );
  }

  if (registrationMode === 'manual') {
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
            <CardTitle>
              새 기프티콘 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 기프티콘 이미지 업로드 */}
              <div className="space-y-2">
                <Label>기프티콘 이미지</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  {formData.image ? (
                    <div className="space-y-4">
                      <img 
                        src={formData.image} 
                        alt="기프티콘 미리보기" 
                        className="max-h-32 mx-auto rounded"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => handleInputChange('image', '')}
                      >
                        이미지 변경
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">기프티콘 이미지를 업로드해주세요</p>
                      <Button type="button" variant="outline" className="mt-2" onClick={() => document.getElementById('file-input')?.click()}>
                        파일 선택
                      </Button>
                    </>
                  )}
                </div>
                {validationErrors.image && (
                  <div className="flex items-center text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {validationErrors.image}
                  </div>
                )}
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Common Form Fields - Show for both manual and AI modes */}
              <>
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
                  <Select onValueChange={(value) => handleInputChange('store', value)} value={formData.store}>
                    <SelectTrigger>
                      <SelectValue placeholder="사용처를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {storeCategories.map(category => (
                        <div key={category.id}>
                          <div className="px-2 py-1 text-sm font-medium text-gray-500 bg-gray-50">
                            {category.icon} {category.name}
                          </div>
                          {category.stores.map(store => (
                            <SelectItem key={store} value={store} className="pl-6">
                              {store}
                            </SelectItem>
                          ))}
                        </div>
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
                    min="1"
                    max="1000000"
                    step="100"
                    placeholder="10000"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                  />
                  {validationErrors.amount && (
                    <div className="flex items-center text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {validationErrors.amount}
                    </div>
                  )}
                </div>

                {/* 만료일 */}
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">만료일 *</Label>
                  <div className="relative">
                    <Input 
                      id="expiryDate"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    />
                    <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* 누구에게 받았나요? */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">누구에게 받았나요? <span className="text-xs text-gray-400">(선택 사항)</span></label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="ex) 엄마, 친구, 홍길동 등"
                    value={formData.from}
                    onChange={e => handleInputChange('from', e.target.value)}
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
              </>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default GiftCardRegistration;
