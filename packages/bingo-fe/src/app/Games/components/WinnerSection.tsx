import React from 'react';
import {
  PageSection,
  Card,
  CardBody,
  Stack,
  StackItem,
  Title,
  Label,
  Bullseye,
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
              <Label color="yellow" isCompact>{game.winner?.username || "Peppe"}</Label>
            </StackItem>
          </Stack>
        </Bullseye>
      </CardBody>
    </Card>
  </PageSection>
);
