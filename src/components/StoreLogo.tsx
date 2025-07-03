
import React from 'react';

interface StoreLogoProps {
  store: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StoreLogo = ({ store, size = 'md', className = '' }: StoreLogoProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-16 w-16 text-2xl',
    lg: 'h-32 w-32 text-4xl'
  };

  const getStoreColor = (storeName: string) => {
    const colors: { [key: string]: string } = {
      '스타벅스': 'bg-green-600',
      '맥도날드': 'bg-yellow-500',
      'GS25': 'bg-blue-600',
      'CU': 'bg-purple-600',
      '세븐일레븐': 'bg-orange-500',
      '롯데리아': 'bg-red-500',
      '버거킹': 'bg-orange-600',
      'KFC': 'bg-red-600',
      '파리바게뜨': 'bg-amber-600',
      '뚜레쥬르': 'bg-pink-500',
      '던킨도너츠': 'bg-pink-600',
      '배스킨라빈스': 'bg-pink-400'
    };
    return colors[storeName] || 'bg-gray-500';
  };

  const getStoreInitial = (storeName: string) => {
    const initials: { [key: string]: string } = {
      '스타벅스': 'S',
      '맥도날드': 'M',
      'GS25': 'G',
      'CU': 'C',
      '세븐일레븐': '7',
      '롯데리아': 'L',
      '버거킹': 'B',
      'KFC': 'K',
      '파리바게뜨': 'P',
      '뚜레쥬르': 'T',
      '던킨도너츠': 'D',
      '배스킨라빈스': 'B'
    };
    return initials[storeName] || storeName.charAt(0);
  };

  return (
    <div className={`${sizeClasses[size]} ${getStoreColor(store)} rounded-full flex items-center justify-center text-white font-bold ${className}`}>
      {getStoreInitial(store)}
    </div>
  );
};

export default StoreLogo;
