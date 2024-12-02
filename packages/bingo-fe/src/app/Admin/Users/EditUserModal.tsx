import React, { useState, useRef } from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Alert,
} from '@patternfly/react-core';
import { useUserStore, User } from '../../store/userState';
import { UserForm } from './UserForm';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user }) => {
  const { updateUser } = useUserStore();
  const [formData, setFormData] = useState({
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await updateUser(user.id, formData);
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
      aria-labelledby="edit-user-modal-title"
      aria-describedby="edit-user-modal-body"
      variant="medium"
      position="top"
      disableFocusTrap={false}
    >
      <ModalHeader title={`Edit User: ${user.username}`} />
      <ModalBody id="edit-user-modal-body">
        {error && (
          <Alert variant="danger" title="Error updating user" isInline>
            {error}
          </Alert>
        )}
        <UserForm
          formData={formData}
          onChange={setFormData}
          showPassword={false}
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
          Save Changes
        </Button>
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
