
export interface GiftCard {
  id: string;
  name: string;
  store: string;
  amount: number;
  expiryDate: string;
  image?: string;
  barcode?: string;
  qrCode?: string;
  isUsed: boolean;
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  category: string;
}
