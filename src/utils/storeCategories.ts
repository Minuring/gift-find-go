export interface StoreCategory {
  id: string;
  name: string;
  stores: string[];
  icon: string;
}

export const storeCategories: StoreCategory[] = [
  {
    id: 'cafe',
    name: '카페',
    stores: ['스타벅스', '이디야', '커피빈', '할리스', '메가커피', '투썸플레이스'],
    icon: '☕'
  },
  {
    id: 'convenience',
    name: '편의점',
    stores: ['GS25', 'CU', '세븐일레븐', '이마트24', '미니스톱'],
    icon: '🏪'
  },
  {
    id: 'fastfood',
    name: '패스트푸드',
    stores: ['맥도날드', '버거킹', 'KFC', '롯데리아', '맘스터치', '서브웨이'],
    icon: '🍔'
  },
  {
    id: 'bakery',
    name: '베이커리',
    stores: ['파리바게뜨', '뚜레쥬르', '던킨도너츠', '크라운베이커리', '성심당'],
    icon: '🥖'
  },
  {
    id: 'icecream',
    name: '아이스크림',
    stores: ['배스킨라빈스', '하겐다즈', '콜드스톤'],
    icon: '🍦'
  },
  {
    id: 'online',
    name: '온라인',
    stores: ['네이버페이', '카카오페이', '쿠팡', '11번가', 'G마켓'],
    icon: '💻'
  },
  {
    id: 'activity',
    name: '문화/여가',
    stores: ['CGV', '롯데시네마', '메가박스', '노래방', 'PC방'],
    icon: '🎬'
  }
];

export const getStoreCategory = (store: string): StoreCategory | undefined => {
  return storeCategories.find(category => 
    category.stores.includes(store)
  );
};

export const getCategoryIcon = (store: string): string => {
  const category = getStoreCategory(store);
  return category?.icon || '🎁';
};
