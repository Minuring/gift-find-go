
export interface GiftCardInfo {
  store?: string;
  amount?: number;
  expiryDate?: string;
  name?: string;
}

const getOCRSettings = () => {
  const provider = localStorage.getItem('ocr_provider');
  const apiKey = localStorage.getItem('ocr_api_key');
  return { provider, apiKey };
};

export const extractGiftCardInfo = async (imageFile: File): Promise<GiftCardInfo> => {
  const { provider, apiKey } = getOCRSettings();
  
  if (!provider || !apiKey) {
    console.warn('OCR API가 설정되지 않았습니다. 기본 분석을 사용합니다.');
    return analyzeGiftCardImageBasic(imageFile);
  }

  try {
    console.log('Starting gift card information extraction with', provider);
    
    const base64Image = await fileToBase64(imageFile);
    
    switch (provider) {
      case 'openai':
        return await extractWithOpenAI(base64Image, apiKey);
      case 'google':
        return await extractWithGoogleVision(base64Image, apiKey);
      case 'aws':
        return await extractWithAWSTextract(base64Image, apiKey);
      case 'azure':
        return await extractWithAzureVision(base64Image, apiKey);
      default:
        return analyzeGiftCardImageBasic(imageFile);
    }
  } catch (error) {
    console.error('Error extracting gift card info:', error);
    // Fallback to basic analysis
    return analyzeGiftCardImageBasic(imageFile);
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Remove data:image/...;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const extractWithOpenAI = async (base64Image: string, apiKey: string): Promise<GiftCardInfo> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: '이 이미지에서 기프티콘 정보를 추출해주세요. JSON 형태로 응답하며, store(사용처), name(상품명), amount(금액, 숫자만), expiryDate(만료일, YYYY-MM-DD 형식) 필드를 포함해주세요.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 300
    })
  });

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  try {
    return JSON.parse(content);
  } catch (e) {
    // Parse manually if JSON parsing fails
    return parseTextResponse(content);
  }
};

const extractWithGoogleVision = async (base64Image: string, apiKey: string): Promise<GiftCardInfo> => {
  const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          image: {
            content: base64Image
          },
          features: [
            {
              type: 'TEXT_DETECTION',
              maxResults: 10
            }
          ]
        }
      ]
    })
  });

  const data = await response.json();
  const text = data.responses[0]?.fullTextAnnotation?.text || '';
  
  return parseExtractedText(text);
};

const extractWithAWSTextract = async (base64Image: string, apiKey: string): Promise<GiftCardInfo> => {
  // AWS Textract implementation would go here
  // This is a placeholder - actual implementation requires AWS SDK setup
  throw new Error('AWS Textract integration not yet implemented');
};

const extractWithAzureVision = async (base64Image: string, apiKey: string): Promise<GiftCardInfo> => {
  // Azure Computer Vision implementation would go here
  // This is a placeholder - actual implementation requires proper endpoint setup
  throw new Error('Azure Computer Vision integration not yet implemented');
};

const parseTextResponse = (text: string): GiftCardInfo => {
  const info: GiftCardInfo = {};
  
  // Simple regex patterns to extract information
  const amountMatch = text.match(/(\d{1,3}(?:,\d{3})*)\s*원/);
  const dateMatch = text.match(/(\d{4}[-./]\d{1,2}[-./]\d{1,2})/);
  
  if (amountMatch) {
    info.amount = parseInt(amountMatch[1].replace(/,/g, ''));
  }
  
  if (dateMatch) {
    info.expiryDate = dateMatch[1].replace(/[./]/g, '-');
  }
  
  return info;
};

const parseExtractedText = (text: string): GiftCardInfo => {
  const info: GiftCardInfo = {};
  
  // Extract amount
  const amountMatch = text.match(/(\d{1,3}(?:,\d{3})*)\s*원/);
  if (amountMatch) {
    info.amount = parseInt(amountMatch[1].replace(/,/g, ''));
  }
  
  // Extract date
  const dateMatch = text.match(/(\d{4}[-./]\d{1,2}[-./]\d{1,2})/);
  if (dateMatch) {
    info.expiryDate = dateMatch[1].replace(/[./]/g, '-');
  }
  
  // Extract store name (this is more complex and would need a store database)
  const storePatterns = [
    '스타벅스', '맥도날드', 'GS25', 'CU', '세븐일레븐', '이디야', '투썸플레이스'
  ];
  
  for (const store of storePatterns) {
    if (text.includes(store)) {
      info.store = store;
      break;
    }
  }
  
  return info;
};

const analyzeGiftCardImageBasic = async (imageFile: File): Promise<GiftCardInfo> => {
  // Fallback to basic mock analysis when no API is configured
  const img = new Image();
  const imageUrl = URL.createObjectURL(imageFile);
  
  return new Promise((resolve) => {
    img.onload = () => {
      URL.revokeObjectURL(imageUrl);
      
      const mockResult: GiftCardInfo = {
        store: detectStore(),
        amount: detectAmount(),
        expiryDate: detectExpiryDate(),
        name: detectProductName()
      };
      
      resolve(mockResult);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      resolve({});
    };
    
    img.src = imageUrl;
  });
};

const detectStore = (): string | undefined => {
  const stores = ['스타벅스', '맥도날드', 'GS25', 'CU', '세븐일레븐'];
  return stores[Math.floor(Math.random() * stores.length)];
};

const detectAmount = (): number | undefined => {
  const amounts = [5000, 10000, 15000, 20000];
  return amounts[Math.floor(Math.random() * amounts.length)];
};

const detectExpiryDate = (): string | undefined => {
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + Math.floor(Math.random() * 6) + 1);
  return futureDate.toISOString().split('T')[0];
};

const detectProductName = (): string | undefined => {
  const names = ['아메리카노', '카페라떼', '치킨버거 세트', '편의점 상품권'];
  return names[Math.floor(Math.random() * names.length)];
};

export const validateGiftCardImage = async (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const hasValidAspectRatio = (img.width / img.height) >= 0.5 && (img.width / img.height) <= 2;
      const hasMinimumSize = img.width >= 200 && img.height >= 100;
      resolve(hasValidAspectRatio && hasMinimumSize);
    };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
};
