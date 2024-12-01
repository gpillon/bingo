import React, { memo } from 'react';
import {
  Card,
  CardBody,
  Grid,
  GridItem,
  Button,
  Split,
  SplitItem,
  Label,
} from '@patternfly/react-core';
import { BingoCard as IBingoCard } from '../../store/cardState';
import { Game } from '../../store/gameState';

interface BingoCardProps {
  card: IBingoCard;
  game: Game;
}

const areEqual = (prevProps: BingoCardProps, nextProps: BingoCardProps) => {
  return (
    prevProps.card.id === nextProps.card.id &&
    prevProps.game.extractedNumbers.length === nextProps.game.extractedNumbers.length &&
    prevProps.game.cinquinaCard?.id === nextProps.game.cinquinaCard?.id &&
    prevProps.game.bingoCard?.id === nextProps.game.bingoCard?.id &&
    prevProps.game.miniBingoCard?.id === nextProps.game.miniBingoCard?.id
  );
};

export const BingoCard = memo<BingoCardProps>(({ card, game }) => {
  return (
    <Card isCompact>
      <CardBody>
        <Split hasGutter style={{ marginBottom: '8px' }}>
          {game.cinquinaCard?.id === card.id && (
            <SplitItem>
              <Label color="grey" isCompact>Cinquina</Label>
            </SplitItem>
          )}
          {game.bingoCard?.id === card.id && (
            <SplitItem>
              <Label color="yellow" isCompact>Bingo</Label>
            </SplitItem>
          )}
          {game.miniBingoCard?.id === card.id && (
            <SplitItem>
              <Label color="green" isCompact>Mini Bingo</Label>
            </SplitItem>
          )}
        </Split>

        <Grid style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(9, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: '4px',
          width: '100%',
          height: '150px',
          padding: '8px'
        }}>
          {card.numbers.map((row, rowIndex) => (
            row.map((num, colIndex) => (
              <GridItem
                key={`${rowIndex}-${colIndex}`}
                style={{
                  gridColumn: colIndex + 1,
                  gridRow: rowIndex + 1,
                  height: '100%'
                }}
              >
                {num !== null && (
                  <Button
                    variant={game.extractedNumbers.includes(num) ? "primary" : "control"}
                    isBlock
                    style={{
                      width: '100%',
                      height: '100%',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {num === -1 ? ' ' : num}
                  </Button>
                )}
              </GridItem>
            ))
          ))}
        </Grid>
      </CardBody>
    </Card>
  );
}, areEqual);
