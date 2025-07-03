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

const KAKAO_APP_KEY = "카카오_자바스크립트_키_여기에_입력";

declare global {
  interface Window {
    Kakao: any;
  }
}

function loadKakaoScript() {
  if (document.getElementById("kakao-sdk")) return;
  const script = document.createElement("script");
  script.id = "kakao-sdk";
  script.src = "https://developers.kakao.com/sdk/js/kakao.js";
  script.async = true;
  document.body.appendChild(script);
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

  useEffect(() => {
    loadKakaoScript();
    const timer = setTimeout(() => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_APP_KEY);
      }
    }, 500);
    return () => clearTimeout(timer);
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

  const handleKakaoLogin = () => {
    if (!window.Kakao) {
      alert("카카오 SDK 로딩 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    window.Kakao.Auth.login({
      scope: "profile_nickname,account_email,friends",
      success: function (authObj) {
        // 로그인 성공 시 처리
        console.log("카카오 로그인 성공:", authObj);
        // 사용자 정보 가져오기
        window.Kakao.API.request({
          url: "/v2/user/me",
          success: function (userRes: any) {
            console.log("카카오 사용자 정보:", userRes);
            // 친구 목록 가져오기
            window.Kakao.API.request({
              url: "/v1/api/talk/friends",
              success: function (friendsRes: any) {
                console.log("카카오 친구 목록:", friendsRes);
                // TODO: 서비스 가입자와 매칭 및 자동 친구 등록 구현
              },
              fail: function (err: any) {
                alert("카카오 친구 목록 불러오기 실패: " + JSON.stringify(err));
              },
            });
          },
          fail: function (err: any) {
            alert("카카오 사용자 정보 불러오기 실패: " + JSON.stringify(err));
          },
        });
      },
      fail: function (err) {
        alert(JSON.stringify(err));
      },
    });
  };

  const handleContactSync = async () => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        // 연락처에서 이름, 전화번호, 이메일만 요청
        const contacts = await (navigator as any).contacts.select(['name', 'tel', 'email'], { multiple: true });
        console.log('가져온 연락처:', contacts);
        // TODO: 서비스 가입자와 매칭 및 자동 친구 등록 구현
      } catch (err) {
        alert('연락처 접근이 거부되었거나 오류가 발생했습니다.');
      }
    } else {
      alert('이 브라우저에서는 주소록 연동 기능이 지원되지 않습니다.');
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

          <button
            onClick={handleKakaoLogin}
            style={{
              background: "#FEE500",
              color: "#191600",
              border: "none",
              borderRadius: 6,
              padding: "10px 20px",
              fontWeight: "bold",
              marginTop: 16,
            }}
          >
            카카오로 로그인
          </button>
          <button
            onClick={handleContactSync}
            style={{
              background: "#4F8A10",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "10px 20px",
              fontWeight: "bold",
              marginTop: 16,
              marginLeft: 8,
            }}
          >
            주소록 연동
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
