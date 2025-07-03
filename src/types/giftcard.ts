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
  ownerId: string;
  sharedTo?: string;
  sharedAt?: string;
  from?: string;
  storeNearbyNotification?: boolean;
}

export interface Store {
  id: string;
  name: string;
  category: string;
}
