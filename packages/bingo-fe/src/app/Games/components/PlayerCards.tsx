import React from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  EmptyState,
  EmptyStateBody,
  Grid,
  GridItem,
  PageSection,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import { PlusCircleIcon, TrophyIcon, UserIcon } from '@patternfly/react-icons';
import { BingoCard } from './BingoCard';
import { Game } from '../../store/gameState';
import { BingoCard as IBingoCard } from '../../store/cardState';

interface PlayerCardsProps {
  game: Game;
  cards: IBingoCard[];
  title?: string;
  playerName?: string;
  onBuyCard?: () => void;
}

export const PlayerCards: React.FC<PlayerCardsProps> = ({
  game,
  cards,
  title = "My Cards",
  playerName,
  onBuyCard
}) => (
  <PageSection>
    <Card>
      <CardTitle>
        <Split>
          <SplitItem>
            <TrophyIcon /> {title} {playerName && <><UserIcon /> {playerName}</>}
          </SplitItem>
          <SplitItem isFilled>
            <Badge>{cards?.length || 0} / {game.maxCards}</Badge>
          </SplitItem>
          {onBuyCard && cards?.length < game.maxCards && game.gameStatus === 'Created' && (
            <SplitItem>
              <Button
                variant="link"
                icon={<PlusCircleIcon />}
                onClick={onBuyCard}
              >
                Buy Card
              </Button>
            </SplitItem>
          )}
        </Split>
      </CardTitle>
      <CardBody>
        {!cards?.length ? (
          <EmptyState>
            <EmptyStateBody>
              No cards available.
              {onBuyCard && game.gameStatus === 'Created' && " Click 'Buy Card' to get started!"}
            </EmptyStateBody>
          </EmptyState>
        ) : (
          <Grid hasGutter>
            {cards.map(card => (
              <GridItem key={card.id} span={12} md={12} lg={12} xl={6} xl2={6}>
                <BingoCard card={card} game={game} />
              </GridItem>
            ))}
          </Grid>
        )}
      </CardBody>
    </Card>
  </PageSection>
);
