
import { Card } from "@/components/ui/card";
import { QrCode } from "lucide-react";

interface QRCodeDisplayProps {
  qrCode?: string;
  barcode?: string;
}

const QRCodeDisplay = ({ qrCode, barcode }: QRCodeDisplayProps) => {
  return (
    <div className="space-y-4">
      {qrCode && (
        <Card className="p-6 text-center bg-white">
          <div className="mb-4">
            <h3 className="font-semibold mb-2">QR 코드</h3>
            <div className="flex justify-center mb-4">
              {/* QR 코드 시뮬레이션 - 실제로는 QR 코드 생성 라이브러리 사용 */}
              <div className="w-48 h-48 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                <QrCode className="h-24 w-24 text-gray-400" />
              </div>
            </div>
            <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
              {qrCode}
            </p>
          </div>
        </Card>
      )}

      {barcode && (
        <Card className="p-6 text-center bg-white">
          <div>
            <h3 className="font-semibold mb-2">바코드</h3>
            <div className="flex justify-center mb-4">
              {/* 바코드 시뮬레이션 */}
              <div className="bg-white p-4 border rounded">
                <div className="flex items-end space-x-1 mb-2">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-black"
                      style={{
                        width: '2px',
                        height: `${20 + Math.random() * 20}px`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
              {barcode}
            </p>
          </div>
        </Card>
      )}

      <div className="text-center text-sm text-gray-500 mt-4">
        <p>매장에서 위 코드를 스캔하여 사용하세요</p>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
