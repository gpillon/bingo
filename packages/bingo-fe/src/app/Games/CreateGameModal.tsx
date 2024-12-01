import React, { useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalVariant,
  Alert,
} from '@patternfly/react-core';
import { useGameStore } from '../store/gameState';
import { GameForm, GameFormData } from './GameForm';

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateGameModal: React.FC<CreateGameModalProps> = ({ isOpen, onClose }) => {
  const { createGame } = useGameStore();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: GameFormData) => {
    try {
      setError(null);
      await createGame(formData);
      onClose();
    } catch (error) {
      setError(error.message);
      console.error('Error creating game:', error);
    }
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="create-game-modal-title"
      aria-describedby="create-game-modal-body"
    >
      <ModalHeader title="Create New Game" />
      <ModalBody id="create-game-modal-body">
        {error && (
          <Alert
            variant="danger"
            title="Error creating game"
            isInline
            style={{ marginBottom: '1rem' }}
          >
            {error}
          </Alert>
        )}
        <GameForm
          onSubmit={handleSubmit}
          submitLabel="Create Game"
        />
      </ModalBody>
    </Modal>
  );
};
