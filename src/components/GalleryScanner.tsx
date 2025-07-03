import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Images, X, Upload, Check, Wand2 } from "lucide-react";
import { extractGiftCardInfo, validateGiftCardImage, GiftCardInfo } from '@/utils/imageRecognition';

interface GalleryScannerProps {
  onScanComplete: (info: GiftCardInfo, imageFile: File) => void;
  onCancel: () => void;
  mode: 'select' | 'scan';
}

const GalleryScanner = ({ onScanComplete, onCancel, mode }: GalleryScannerProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [processedResults, setProcessedResults] = useState<Array<{file: File, info: GiftCardInfo, preview: string}>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [excludedIndexes, setExcludedIndexes] = useState<number[]>([]);

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
        const isValid = await validateGiftCardImage(file);
        if (isValid) {
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

  // 자동 스캔에서 제외할 이미지 토글
  const toggleExclude = (idx: number) => {
    setExcludedIndexes(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  // 자동 스캔에서 최종 등록
  const handleRegisterAll = () => {
    processedResults.forEach((result, idx) => {
      if (!excludedIndexes.includes(idx)) {
        onScanComplete(result.info, result.file);
      }
    });
  };

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
          <CardTitle>사진첩에서 기프티콘 {mode === 'scan' ? '자동 스캔' : '선택'}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 직접 선택 모드 */}
          {mode === 'select' && selectedFiles.length === 0 && (
            <div className="text-center py-12">
              <Images className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-6">사진첩에서 기프티콘 이미지를 직접 선택하세요</p>
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
          {mode === 'select' && selectedFiles.length > 0 && processedResults.length === 0 && (
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
          {mode === 'select' && processedResults.length > 0 && (
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
          {/* 자동 스캔 모드 */}
          {mode === 'scan' && selectedFiles.length === 0 && (
            <div className="text-center py-12">
              <Images className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-6">사진첩 전체를 스캔하여 기프티콘 이미지를 자동으로 찾습니다</p>
              <Button 
                onClick={() => document.getElementById('gallery-input')?.click()}
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                사진첩 스캔 시작
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
          {mode === 'scan' && selectedFiles.length > 0 && processedResults.length === 0 && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  {selectedFiles.length}개의 이미지를 스캔합니다.
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
                    {isProcessing ? '스캔 중...' : '기프티콘 자동 스캔'}
                  </Button>
                </div>
              </div>
            </div>
          )}
          {mode === 'scan' && processedResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                자동으로 발견된 기프티콘 ({processedResults.length}개)
              </h3>
              <p className="text-gray-700 mb-2">제외할 이미지가 있나요? 제외할 이미지를 체크하세요.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {processedResults.map((result, index) => (
                  <Card key={index} className={"transition-shadow " + (excludedIndexes.includes(index) ? 'opacity-50' : 'hover:shadow-lg cursor-pointer')}>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={excludedIndexes.includes(index)}
                          onChange={() => toggleExclude(index)}
                          className="mr-2"
                          id={`exclude-${index}`}
                        />
                        <label htmlFor={`exclude-${index}`} className="text-sm text-gray-600">제외</label>
                      </div>
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
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button 
                onClick={handleRegisterAll}
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500"
                disabled={processedResults.length === excludedIndexes.length}
              >
                {processedResults.length === excludedIndexes.length ? '선택된 기프티콘이 없습니다' : '선택한 기프티콘 등록하기'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GalleryScanner;
