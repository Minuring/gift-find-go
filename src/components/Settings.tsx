
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Save, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsProps {
  onClose: () => void;
}

const Settings = ({ onClose }: SettingsProps) => {
  const [ocrProvider, setOcrProvider] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved settings
    const savedProvider = localStorage.getItem('ocr_provider') || '';
    const savedApiKey = localStorage.getItem('ocr_api_key') || '';
    setOcrProvider(savedProvider);
    setApiKey(savedApiKey);
  }, []);

  const handleSave = () => {
    if (ocrProvider && apiKey) {
      localStorage.setItem('ocr_provider', ocrProvider);
      localStorage.setItem('ocr_api_key', apiKey);
      toast({
        title: "설정 저장 완료",
        description: "OCR API 설정이 저장되었습니다."
      });
    } else {
      toast({
        title: "설정 오류",
        description: "OCR 제공업체와 API 키를 모두 입력해주세요.",
        variant: "destructive"
      });
    }
  };

  const ocrProviders = [
    { value: 'openai', label: 'OpenAI GPT-4 Vision' },
    { value: 'google', label: 'Google Cloud Vision' },
    { value: 'aws', label: 'AWS Textract' },
    { value: 'azure', label: 'Azure Computer Vision' }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onClose} className="mr-4">
          <SettingsIcon className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">설정</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>OCR API 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>OCR 제공업체</Label>
            <Select value={ocrProvider} onValueChange={setOcrProvider}>
              <SelectTrigger>
                <SelectValue placeholder="OCR 제공업체를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {ocrProviders.map(provider => (
                  <SelectItem key={provider.value} value={provider.value}>
                    {provider.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>API 키</Label>
            <div className="relative">
              <Input
                type={showApiKey ? "text" : "password"}
                placeholder="API 키를 입력하세요"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">API 키 안전 보관 안내</h3>
            <p className="text-sm text-blue-700">
              API 키는 브라우저의 로컬 스토리지에 저장됩니다. 
              보안을 위해 개인 기기에서만 사용하시고, 공용 컴퓨터에서는 사용을 피해주세요.
            </p>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              저장
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              취소
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
