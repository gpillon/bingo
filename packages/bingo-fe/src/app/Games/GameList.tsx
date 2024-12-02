import React, { useEffect, useState } from 'react';
import { Link, LinkProps, useHistory, useLocation } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  EmptyState,
  EmptyStateBody,
  Gallery,
  GalleryItem,
  Label,
  PageSection,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import { CubesIcon, PlayIcon, PlusCircleIcon, UserIcon } from '@patternfly/react-icons';
import { Game, useGameStore } from '../store/gameState';
import { useHasRole } from '../store/authState';
import { CreateGameModal } from './CreateGameModal';

const GameList: React.FC = () => {
  const { games, loading, error, fetchGames, deleteGame } = useGameStore();
  const isAdmin = useHasRole('admin');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  useEffect(() => {
    if (location.pathname === '/games/new' && isAdmin) {
      setIsCreateModalOpen(true);
    }
  }, [location.pathname, isAdmin]);

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    if (location.pathname === '/games/new') {
      history.push('/games');
    }
  };

  const sortGames = (games: Game[]) => {
    const statusPriority = {
      'Running': 0,
      'Created': 1,
      'Closed': 2
    };

    return [...games].sort((a, b) => {
      // First sort by status priority
      const statusDiff = statusPriority[a.gameStatus] - statusPriority[b.gameStatus];
      if (statusDiff !== 0) return statusDiff;

      // If status is the same, sort by creation date (newest first)
      return new Date(b.createTs).getTime() - new Date(a.createTs).getTime();
    });
  };

  if (loading) {
    return (
      <PageSection>
        <EmptyState titleText="Loading games..." headingLevel="h4" icon={CubesIcon}>
        </EmptyState>
      </PageSection>
    );
  }

  if (error) {
    return (
      <PageSection>
        <EmptyState headingLevel="h2" icon={CubesIcon}>
          <Title headingLevel="h2" size="lg">Error loading games</Title>
          <EmptyStateBody>{error}</EmptyStateBody>
        </EmptyState>
      </PageSection>
    );
  }

  const handleDeleteGame = async (gameId: string) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        await deleteGame(gameId);
      } catch (error) {
        console.error('Error deleting game:', error);
        // You might want to show an error notification here
      }
    }
  };

  return (
    <PageSection>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Title headingLevel="h1" size="lg">Available Games</Title>
        {isAdmin && (
          <Button
            variant="primary"
            icon={<PlusCircleIcon />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create New Game
          </Button>
        )}
      </div>

      <CreateGameModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
      />

      {games.length === 0 ? (
        <EmptyState headingLevel="h2" icon={CubesIcon}>
          <Title headingLevel="h2" size="lg">No games available</Title>
          <EmptyStateBody>
            There are currently no bingo games available to join.
          </EmptyStateBody>
        </EmptyState>
      ) : (
        <Gallery hasGutter minWidths={{ default: '400px' }}>
          {sortGames(games).map((game) => (
            <GalleryItem key={game.id}>
              <Card>
                <CardTitle>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{ game.name ? `${game.name} (#${game.id})` : `Game #${game.id}`}</span>
                    <Label
                      color={game.gameStatus === 'Created' ? 'green' :
                             game.gameStatus === 'Running' ? 'blue' :
                             game.gameStatus === 'Closed' ? 'grey' : 'grey'
                            }
                    >
                      {game.gameStatus}
                    </Label>
                  </div>
                </CardTitle>
                <CardBody>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    height: '100%'
                  }}>
                    <div style={{ flex: 1 }}>
                      <p><strong>Variant:</strong> {game.variant}</p>
                      <p><strong>Description:</strong> {game.description || 'No description'}</p>
                      <p><strong>Max Cards:</strong> {game.maxCards}</p>
                      <p>
                        <strong>Players:</strong>{' '}
                        <Tooltip
                          content={
                            game.allowedUsers.length > 0
                              ? game.allowedUsers.map(user => user.name).join(', ')
                              : 'No players yet'
                          }
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'help' }}>
                            {game.allowedUsers.length}
                            <UserIcon />
                          </span>
                        </Tooltip>
                      </p>

                      <p><strong>Owner:</strong> {game.owner?.name}</p>
                      <p><strong>Created:</strong> {game.createTs ? new Date(game.createTs).toLocaleString() : 'Not created'}</p>
                      <p><strong>Started:</strong> {game.startTs ? new Date(game.startTs).toLocaleString() : 'Not started'}</p>
                      <p><strong>Closed:</strong> {game.endTs ? new Date(game.endTs).toLocaleString() : 'Not closed'}</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 'auto' }}>
                      {isAdmin && (
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteGame(game.id)}
                        >
                          Delete Game
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        icon={<PlayIcon />}
                        component={(props: LinkProps) => <Link {...props} to={`/games/${game.id}`} />}
                      >
                        Join Game
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </GalleryItem>
          ))}
        </Gallery>
      )}
    </PageSection>
  );
};

export { GameList };
