import React, { useState } from 'react';
import { Button, ButtonVariant, Flex, FlexItem } from '@patternfly/react-core';
import { GiftIcon } from '@patternfly/react-icons';
import { PriceModal } from './PriceModal';
import { Game } from '../store/gameState';

interface PricesListProps {
  game: Game;
}

export const PricesList: React.FC<PricesListProps> = ({ game }) => {
  const [selectedPrice, setSelectedPrice] = useState<{
    id: number;
    name: string;
    description?: string;
    hasImage?: boolean;
  } | null>(null);

  const prices = [];
  if (game.cinquinaPrice) {
    prices.push({ type: 'Cinquina', ...game.cinquinaPrice });
  }
  if (game.bingoPrice) {
    prices.push({ type: 'Bingo', ...game.bingoPrice });
  }
  if (game.miniBingoPrice) {
    prices.push({ type: 'Mini Bingo', ...game.miniBingoPrice });
  }

  if (prices.length === 0) {
    return null;
  }

  return (
    <>
      <Flex>
        {prices.map((price) => (
          <FlexItem key={`${price.type}-${price.id}`}>
            <Button
              variant={ButtonVariant.link}
              icon={<GiftIcon />}
              onClick={() => setSelectedPrice(price)}
            >
              {price.type}: {price.name}
            </Button>
          </FlexItem>
        ))}
      </Flex>

      {selectedPrice && (
        <PriceModal
          isOpen={!!selectedPrice}
          onClose={() => setSelectedPrice(null)}
          price={selectedPrice}
        />
      )}
    </>
  );
};
