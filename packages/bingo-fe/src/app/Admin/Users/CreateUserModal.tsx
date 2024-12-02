import React, { useRef, useState } from 'react';
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@patternfly/react-core';
import { useUserStore } from '../../store/userState';
import { UserForm } from './UserForm';

interface UserFormData {
  username: string;
  name: string;
  email: string;
  password?: string;
  role: string;
}

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
    password: '' as string | undefined,
    role: 'user'
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  const handleFormChange = (data: UserFormData) => {
    setFormData(data as typeof formData);
  };

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
      <ModalHeader title="Create New User" />
      <ModalBody id="create-user-modal-body">
        {error && (
          <Alert variant="danger" title="Error creating user" isInline>
            {error}
          </Alert>
        )}
        <UserForm
          formData={formData}
          onChange={handleFormChange}
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
