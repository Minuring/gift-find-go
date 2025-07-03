import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getExpiryStatus(expiryDateStr: string, isUsed: boolean) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiryDate = new Date(expiryDateStr);
  expiryDate.setHours(0, 0, 0, 0);
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (isUsed) {
    return { type: 'used', message: '사용완료', diffDays };
  }
  if (diffDays < 0) {
    return { type: 'expired', message: '만료됨', diffDays };
  }
  if (diffDays === 0) {
    return { type: 'today', message: '오늘 만료', diffDays };
  }
  if (diffDays <= 7) {
    return { type: 'soon', message: `${diffDays}일 후 만료`, diffDays };
  }
  return { type: 'normal', message: '', diffDays };
}
