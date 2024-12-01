import React, { useState, useRef } from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Alert,
  Form,
  FormGroup,
  TextInput,
  HelperText,
  HelperTextItem,
  FormHelperText
} from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { useUserStore, User } from '../../store/userState';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

type ValidateState = 'success' | 'warning' | 'error' | 'default';

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, user }) => {
  const { updateUser } = useUserStore();
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState<ValidateState>('default');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  const handlePasswordChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setPassword(value);
    if (value === '') {
      setValidated('default');
    } else if (value.length >= 8) {
      setValidated('success');
    } else {
      setValidated('error');
    }
  };

  const handleSubmit = async () => {
    if (validated !== 'success') {
      setValidated('error');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await updateUser(user.id, { password });
      onClose();
      setPassword('');
      setValidated('default');
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
      aria-labelledby="change-password-modal-title"
      aria-describedby="change-password-modal-body"
      variant="small"
      position="top"
      disableFocusTrap={false}
    >
      <ModalHeader title={`Change Password: ${user.username}`} id="change-password-modal-title" />
      <ModalBody id="change-password-modal-body">
        {error && (
          <Alert variant="danger" title="Error changing password" isInline>
            {error}
          </Alert>
        )}
        <Form>
          <FormGroup
            label="New Password"
            isRequired
            fieldId="new-password"
          >
            <TextInput
              isRequired
              type="password"
              id="new-password"
              value={password}
              onChange={handlePasswordChange}
              validated={validated}
              aria-describedby="password-helper"
            />
            <FormHelperText>
              <HelperText>
                <HelperTextItem
                  icon={validated === 'error' ? <ExclamationCircleIcon /> : undefined}
                  variant={validated}
                >
                  {validated === 'error'
                    ? 'Password must be at least 8 characters long'
                    : 'Please enter a new password (minimum 8 characters)'}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          key="confirm"
          variant="primary"
          onClick={handleSubmit}
          isDisabled={isSubmitting || validated !== 'success'}
          isLoading={isSubmitting}
          ref={initialFocusRef}
        >
          Change Password
        </Button>
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
