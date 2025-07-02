
import GiftCard from './GiftCard';
import { GiftCard as GiftCardType } from "@/types/giftcard";

interface GiftCardGridProps {
  giftCards: GiftCardType[];
  onViewDetail: (giftCard: GiftCardType) => void;
}

const GiftCardGrid = ({ giftCards, onViewDetail }: GiftCardGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {giftCards.map(giftCard => (
        <GiftCard 
          key={giftCard.id} 
          giftCard={giftCard} 
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  );
};

export default GiftCardGrid;
