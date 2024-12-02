import React, { useState } from 'react';
import {
  Modal,
  ModalVariant,
  ModalHeader,
  ModalBody,
  Alert,
} from '@patternfly/react-core';
import { useGameStore } from '../store/gameState';
import { Game } from '../store/gameState';
import { GameForm, GameFormData } from './GameForm';

interface EditGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game;
}

export const EditGameModal: React.FC<EditGameModalProps> = ({ isOpen, onClose, game }) => {
  const { editGame } = useGameStore();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: GameFormData) => {
    try {
      setError(null);
      await editGame(game.id, formData);
      onClose();
    } catch (error: unknown) {
      setError((error as Error).message);
      console.error('Error editing game:', error);
    }
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="edit-game-modal-title"
      aria-describedby="edit-game-modal-body"
    >
      <ModalHeader title="Edit Game" />
      <ModalBody id="edit-game-modal-body">
        {error && (
          <Alert
            variant="danger"
            title="Error editing game"
            isInline
            style={{ marginBottom: '1rem' }}
          >
            {error}
          </Alert>
        )}
        <GameForm
          initialData={{
            name: game.name,
            description: game.description || '',
            variant: game.variant,
            maxCards: game.maxCards,
            allowedUsers: game.allowedUsers.map(user => user.id),
            bingoPrice: game.bingoPrice,
            miniBingoPrice: game.miniBingoPrice,
            cinquinaPrice: game.cinquinaPrice
          }}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      </ModalBody>
    </Modal>
  );
};
