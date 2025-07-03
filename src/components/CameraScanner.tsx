
import { useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, X, Check, RotateCcw } from "lucide-react";
import { extractGiftCardInfo, GiftCardInfo } from '@/utils/imageRecognition';

interface CameraScannerProps {
  onScanComplete: (info: GiftCardInfo, imageFile: File) => void;
  onCancel: () => void;
}

const CameraScanner = ({ onScanComplete, onCancel }: CameraScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera if available
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('카메라에 접근할 수 없습니다. 권한을 확인해주세요.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  }, [stream]);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const processCapturedImage = useCallback(async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    try {
      // Convert base64 to File
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], 'captured-giftcard.jpg', { type: 'image/jpeg' });
      
      // Extract gift card information
      const info = await extractGiftCardInfo(file);
      onScanComplete(info, file);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('이미지 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  }, [capturedImage, onScanComplete]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onCancel} className="mr-4">
          <X className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">기프티콘 스캔</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>카메라로 기프티콘 촬영</CardTitle>
        </CardHeader>
        <CardContent>
          {!isScanning && !capturedImage && (
            <div className="text-center py-12">
              <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-6">카메라를 사용해 기프티콘을 촬영하세요</p>
              <Button onClick={startCamera} className="bg-gradient-to-r from-purple-500 to-pink-500">
                <Camera className="h-4 w-4 mr-2" />
                카메라 시작
              </Button>
            </div>
          )}

          {isScanning && (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
                <div className="absolute inset-0 border-2 border-dashed border-white opacity-50 rounded-lg pointer-events-none" />
              </div>
              <div className="flex gap-4">
                <Button onClick={stopCamera} variant="outline" className="flex-1">
                  취소
                </Button>
                <Button onClick={captureImage} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500">
                  <Camera className="h-4 w-4 mr-2" />
                  촬영
                </Button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={capturedImage} 
                  alt="촬영된 기프티콘" 
                  className="w-full rounded-lg"
                />
              </div>
              <div className="flex gap-4">
                <Button onClick={retakePhoto} variant="outline" className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  다시 촬영
                </Button>
                <Button 
                  onClick={processCapturedImage} 
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {isProcessing ? '처리 중...' : '확인'}
                </Button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraScanner;
