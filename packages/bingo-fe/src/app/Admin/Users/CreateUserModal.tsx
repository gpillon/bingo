import React, { useState, useRef } from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Alert,
} from '@patternfly/react-core';
import { useUserStore } from '../../store/userState';
import { UserForm } from './UserForm';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose }) => {
  const { createUser } = useUserStore();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await createUser(formData);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="create-user-modal-title"
      aria-describedby="create-user-modal-body"
      variant="medium"
      position="top"
      disableFocusTrap={false}
    >
      <ModalHeader title="Create New User" id="create-user-modal-title" />
      <ModalBody id="create-user-modal-body">
        {error && (
          <Alert variant="danger" title="Error creating user" isInline>
            {error}
          </Alert>
        )}
        <UserForm
          formData={formData}
          onChange={setFormData}
          showPassword={true}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          key="confirm"
          variant="primary"
          onClick={handleSubmit}
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          ref={initialFocusRef}
        >
          Create User
        </Button>
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
