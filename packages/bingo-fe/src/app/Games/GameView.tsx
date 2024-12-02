import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Bullseye,
  PageSection,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import { useGameStore } from '../store/gameState';
import { useCardStore } from '../store/cardState';
import { useHasRole } from '../store/authState';
import { GameHeader } from './components/GameHeader';
import { GameNumbers } from './components/GameNumbers';
import { PlayerCards } from './components/PlayerCards';
import { IGameStatus } from '../store/gameState';
import { EditGameModal } from './EditGameModal';

export const GameView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentGame, fetchGame, updateGameStatus, extractNumber } = useGameStore();
  const { userCards, allUserCards, fetchUserCards, fetchAllUserCards, buyCard } = useCardStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const isAdmin = useHasRole('admin');

  const handleStatusChange = useCallback(async (newStatus: IGameStatus) => {
    if (!currentGame?.id) return;
    try {
      await updateGameStatus(currentGame.id, newStatus);
      await fetchAllUserCards(currentGame.id);
    } catch (error) {
      console.error('Failed to update game status:', error);
    }
  }, [currentGame?.id, updateGameStatus, fetchAllUserCards]);

  const handleExtractNumber = useCallback(async () => {
    if (!currentGame?.id) return;
    try {
      await extractNumber(currentGame.id);
    } catch (error) {
      console.error('Failed to extract number:', error);
    }
  }, [currentGame?.id, extractNumber]);

  const handleBuyCard = useCallback(async () => {
    if (!currentGame?.id) return;
    try {
      await buyCard(currentGame.id);
      if (isAdmin) {
        await fetchAllUserCards(currentGame.id);
      } else {
        await fetchUserCards(currentGame.id);
      }
    } catch (error) {
      console.error('Failed to buy card:', error);
    }
  }, [currentGame?.id, isAdmin, buyCard, fetchAllUserCards, fetchUserCards]);

  const userCardsMap = useMemo(() => {
    if (!allUserCards) return new Map();
    return allUserCards.reduce((acc, card) => {
      const userId = card.owner.id;
      if (!acc.has(userId)) {
        acc.set(userId, []);
      }
      acc.get(userId)?.push(card);
      return acc;
    }, new Map());
  }, [allUserCards]);

  useEffect(() => {
    if (id) {
      fetchGame(id);
      if (isAdmin) {
        fetchAllUserCards(id);
      } else {
        fetchUserCards(id);
      }
    }
  }, [id, isAdmin, fetchGame, fetchUserCards, fetchAllUserCards]);


  if (!currentGame) {
    return (
      <PageSection>
        <Bullseye>
          <Title headingLevel="h1" size="lg">Loading game...</Title>
        </Bullseye>
      </PageSection>
    );
  }

  return (
    <Stack hasGutter>
      <StackItem>
        <GameHeader
          game={currentGame}
          onStatusChange={handleStatusChange}
          onEditClick={() => setIsEditModalOpen(true)}
          onExtractNumber={handleExtractNumber}
        />
      </StackItem>

      <StackItem>
        <GameNumbers game={currentGame} />
      </StackItem>

      {!isAdmin && (
        <StackItem>
          <PlayerCards
            game={currentGame}
            cards={userCards}
            title="My Cards"
            onBuyCard={handleBuyCard}
          />
        </StackItem>
      )}

      {isAdmin && currentGame.allowedUsers.map(user => (
        <StackItem key={user.id}>
          <PlayerCards
            game={currentGame}
            cards={userCardsMap.get(user.id) || []}
            title="Player Cards"
            playerName={user.name}
          />
        </StackItem>
      ))}

      {currentGame && (
        <EditGameModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          game={currentGame}
        />
      )}
    </Stack>
  );
};
