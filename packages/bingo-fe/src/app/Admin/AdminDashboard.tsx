import React, { useEffect } from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  Button,
  List,
  ListItem,
} from '@patternfly/react-core';
import { useGameStore } from '../store/gameState';
import { PlayIcon, PauseIcon, StopIcon } from '@patternfly/react-icons';

const AdminDashboard: React.FC = () => {
  const { games, loading, error, fetchGames, updateGameStatus } = useGameStore();

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const activeGames = games.filter(game => game.status === 'in_progress');
  const waitingGames = games.filter(game => game.status === 'waiting');

  return (
    <PageSection>
      <Title headingLevel="h1" size="lg">Admin Dashboard</Title>

      <Grid hasGutter>
        <GridItem span={6}>
          <Card>
            <CardTitle>Active Games</CardTitle>
            <CardBody>
              <List>
                {activeGames.map(game => (
                  <ListItem key={game.id}>
                    Game #{game.id} - Numbers drawn: {game.drawnNumbers.length}
                    <Button
                      variant="danger"
                      icon={<StopIcon />}
                      onClick={() => updateGameStatus(game.id, 'finished')}
                    >
                      End Game
                    </Button>
                  </ListItem>
                ))}
              </List>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={6}>
          <Card>
            <CardTitle>Waiting Games</CardTitle>
            <CardBody>
              <List>
                {waitingGames.map(game => (
                  <ListItem key={game.id}>
                    Game #{game.id}
                    <Button
                      variant="primary"
                      icon={<PlayIcon />}
                      onClick={() => updateGameStatus(game.id, 'in_progress')}
                    >
                      Start Game
                    </Button>
                  </ListItem>
                ))}
              </List>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </PageSection>
  );
};

export { AdminDashboard };
