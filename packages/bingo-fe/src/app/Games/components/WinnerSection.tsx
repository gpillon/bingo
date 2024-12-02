import React from 'react';
import {
  Bullseye,
  Card,
  CardBody,
  Label,
  PageSection,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import { TrophyIcon } from '@patternfly/react-icons';
import { Game } from '../../store/gameState';

interface WinnerSectionProps {
  game: Game;
}

export const WinnerSection: React.FC<WinnerSectionProps> = ({ game }) => (
  <PageSection>
    <Card isPlain>
      <CardBody>
        <Bullseye>
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h2" size="xl">
                <TrophyIcon /> Winner!
              </Title>
            </StackItem>
            <StackItem>
              {game.cinquinaCard && (
                <Label color="green" isCompact>Cinquina: {game.cinquinaCard?.owner?.name || "Unknown"}</Label>
              )}
            </StackItem>
            <StackItem>
              {game.bingoCard && (
                <Label color="yellow" isCompact>Bingo: {game.bingoCard?.owner?.name || "Unknown"}</Label>
              )}
            </StackItem>
            <StackItem>
              {game.miniBingoCard && (
                <Label isCompact>Mini Bingo: {game.miniBingoCard?.owner?.name || "Unknown"}</Label>
              )}
            </StackItem>
          </Stack>
        </Bullseye>
      </CardBody>
    </Card>
  </PageSection>
);
