
import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Images, X, Upload, Check } from "lucide-react";
import { extractGiftCardInfo, validateGiftCardImage, GiftCardInfo } from '@/utils/imageRecognition';

interface GalleryScannerProps {
  onScanComplete: (info: GiftCardInfo, imageFile: File) => void;
  onCancel: () => void;
}

const GalleryScanner = ({ onScanComplete, onCancel }: GalleryScannerProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [processedResults, setProcessedResults] = useState<Array<{file: File, info: GiftCardInfo, preview: string}>>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('이미지 파일을 선택해주세요.');
      return;
    }

    setSelectedFiles(imageFiles);
  }, []);

  const processImages = useCallback(async () => {
    if (selectedFiles.length === 0) return;
    
    setIsProcessing(true);
    const results: Array<{file: File, info: GiftCardInfo, preview: string}> = [];
    
    try {
      for (const file of selectedFiles) {
        // Validate if image looks like a gift card
        const isValid = await validateGiftCardImage(file);
        
        if (isValid) {
          // Extract gift card information
          const info = await extractGiftCardInfo(file);
          const preview = URL.createObjectURL(file);
          
          results.push({ file, info, preview });
        }
      }
      
      setProcessedResults(results);
    } catch (error) {
      console.error('Error processing images:', error);
      alert('이미지 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFiles]);

  const selectGiftCard = useCallback((result: {file: File, info: GiftCardInfo, preview: string}) => {
    onScanComplete(result.info, result.file);
  }, [onScanComplete]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onCancel} className="mr-4">
          <X className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">갤러리에서 기프티콘 찾기</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>사진첩에서 기프티콘 선택</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedFiles.length === 0 && (
            <div className="text-center py-12">
              <Images className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-6">사진첩에서 기프티콘 이미지들을 선택하세요</p>
              <Button 
                onClick={() => document.getElementById('gallery-input')?.click()}
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                <Upload className="h-4 w-4 mr-2" />
                사진 선택
              </Button>
              <input
                id="gallery-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {selectedFiles.length > 0 && processedResults.length === 0 && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  {selectedFiles.length}개의 이미지가 선택되었습니다.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={() => {
                      setSelectedFiles([]);
                      setProcessedResults([]);
                    }}
                    variant="outline"
                  >
                    다시 선택
                  </Button>
                  <Button 
                    onClick={processImages}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {isProcessing ? '분석 중...' : '기프티콘 찾기'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {processedResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                발견된 기프티콘 ({processedResults.length}개)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {processedResults.map((result, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <img 
                        src={result.preview} 
                        alt="기프티콘" 
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                      <div className="space-y-2">
                        {result.info.store && (
                          <p><strong>사용처:</strong> {result.info.store}</p>
                        )}
                        {result.info.name && (
                          <p><strong>상품명:</strong> {result.info.name}</p>
                        )}
                        {result.info.amount && (
                          <p><strong>금액:</strong> {result.info.amount.toLocaleString()}원</p>
                        )}
                        {result.info.expiryDate && (
                          <p><strong>만료일:</strong> {new Date(result.info.expiryDate).toLocaleDateString('ko-KR')}</p>
                        )}
                      </div>
                      <Button 
                        onClick={() => selectGiftCard(result)}
                        className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-500"
                      >
                        이 기프티콘 등록하기
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GalleryScanner;
