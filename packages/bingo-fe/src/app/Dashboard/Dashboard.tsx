import React, { useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Label,
  List,
  ListItem,
  PageSection,
  Title,
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ClockIcon,
  CubesIcon,
  PlayIcon,
  TrendUpIcon,
} from '@patternfly/react-icons';
import { ChartDonut, ChartThemeColor } from '@patternfly/react-charts/victory';
import { Link, LinkProps } from 'react-router-dom';
import { useGameStore } from '../store/gameState';
import { useCardStore } from '../store/cardState';
import { useHasRole } from '../store/authState';

const Dashboard: React.FC = () => {
  const { games, fetchGames } = useGameStore();
  const { userCards, fetchUserCards } = useCardStore();
  const isAdmin = useHasRole('admin');

  useEffect(() => {
    fetchGames();
    fetchUserCards();
  }, [fetchGames, fetchUserCards]);
  // Calculate statistics
  const activeGames = games?.filter(g => g.gameStatus === 'Running').length || 0;
  const totalGames = games?.length || 0;
  const completedGames = games?.filter(g => g.gameStatus === 'Closed').length || 0;
  const pendingGames = games?.filter(g => g.gameStatus === 'Created').length || 0;

  const recentGames = games?.slice(0, 10) || [];

  return (
    <PageSection>
      <Grid hasGutter>
        {/* Header Stats */}
        <GridItem span={12}>
          <Title headingLevel="h1" size="2xl">Dashboard</Title>
        </GridItem>

        {/* Quick Stats Cards */}
        <GridItem span={3}>
          <Card>
            <CardTitle>Active Games</CardTitle>
            <CardBody>
              <Flex direction={{ default: 'column' }}>
                <FlexItem>
                  <Title headingLevel="h2" size="4xl">{activeGames}</Title>
                </FlexItem>
                <FlexItem>
                  <Label color="blue" icon={<PlayIcon />}>Running</Label>
                </FlexItem>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={3}>
          <Card>
            <CardTitle>Total Games</CardTitle>
            <CardBody>
              <Flex direction={{ default: 'column' }}>
                <FlexItem>
                  <Title headingLevel="h2" size="4xl">{totalGames}</Title>
                </FlexItem>
                <FlexItem>
                  <Label color="blue" icon={<CubesIcon />}>Games</Label>
                </FlexItem>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={3}>
          <Card>
            <CardTitle>Cards</CardTitle>
            <CardBody>
              <Flex direction={{ default: 'column' }}>
                <FlexItem>
                  <Title headingLevel="h2" size="4xl">{userCards?.length || 0}</Title>
                </FlexItem>
                <FlexItem>
                  <Label color="green" icon={<CheckCircleIcon />}>Active</Label>
                </FlexItem>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={3}>
          <Card>
            <CardTitle>Win Rate</CardTitle>
            <CardBody>
              <Flex direction={{ default: 'column' }}>
                <FlexItem>
                  <Title headingLevel="h2" size="4xl">
                    {totalGames ? Math.round((completedGames / totalGames) * 100) : 0}%
                  </Title>
                </FlexItem>
                <FlexItem>
                  <Label color="purple" icon={<TrendUpIcon />}>Rate</Label>
                </FlexItem>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>

        {/* Charts Section */}
        <GridItem span={3}>
          <Card>
            <CardTitle>Games Distribution</CardTitle>
            <CardBody>
              <ChartDonut
                ariaDesc="Games distribution"
                ariaTitle="Games status distribution chart"
                constrainToVisibleArea={true}
                data={[
                  { x: 'Running', y: activeGames },
                  { x: 'Completed', y: completedGames },
                  { x: 'Pending', y: pendingGames }
                ]}
                labels={({ datum }) => `${datum.x}: ${datum.y}`}
                legendData={[
                  { name: 'Running' },
                  { name: 'Completed' },
                  { name: 'Pending' }
                ]}
                legendPosition="bottom"
                legendAllowWrap={true}
                padding={{
                  bottom: 0,
                  left: 20,
                  right: 20,
                  top: -60
                }}
                title={`${activeGames} Running`}
                subTitle={`${pendingGames || 0} Pending, ${completedGames || 0} Completed`}
                themeColor={ChartThemeColor.multiOrdered}
                height={280}
              />
            </CardBody>
          </Card>
        </GridItem>

        {/* Recent Games */}
        <GridItem span={9}>
          <Card>
            <CardTitle>Recent Games</CardTitle>
            <CardBody>
              <List>
                {recentGames.map(game => (
                  <ListItem key={game.id}>
                    <Flex>
                      <FlexItem>
                        <ClockIcon /> {new Date(game.createTs).toLocaleDateString()}
                      </FlexItem>
                      <FlexItem>
                        {game.name || `Game #${game.id}`}
                      </FlexItem>
                      <FlexItem>
                        <Label
                          color={
                            game.gameStatus === 'Running' ? 'blue' :
                            game.gameStatus === 'Closed' ? 'green' : 'orange'
                          }
                        >
                          {game.gameStatus}
                        </Label>
                      </FlexItem>
                      <FlexItem align={{ default: 'alignRight' }}>
                        <Button
                          variant="link"
                          component={(props: LinkProps) => <Link {...props} to={`/games/${game.id}`} />}
                        >
                          View
                        </Button>
                      </FlexItem>
                    </Flex>
                  </ListItem>
                ))}
              </List>
            </CardBody>
          </Card>
        </GridItem>

        {/* Admin Section */}
        {isAdmin && (
          <GridItem span={12}>
            <Card>
              <CardTitle>Admin Quick Actions</CardTitle>
              <CardBody>
                <Flex>
                  <FlexItem>
                    <Button
                      variant="primary"
                      component={(props: LinkProps) => <Link {...props} to="/games/new" />}
                    >
                      Create New Game
                    </Button>
                  </FlexItem>
                  <FlexItem>
                    <Button
                      variant="primary"
                      component={(props: LinkProps) => <Link {...props} to="/admin/users/new" />}
                    >
                      Create New User
                    </Button>
                  </FlexItem>
                  <FlexItem>
                    <Button
                      variant="secondary"
                      component={(props: LinkProps) => <Link {...props} to="/admin" />}
                    >
                      Admin Dashboard
                    </Button>
                  </FlexItem>
                </Flex>
              </CardBody>
            </Card>
          </GridItem>
        )}
      </Grid>
    </PageSection>
  );
};

export { Dashboard };
