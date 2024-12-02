import React, { useEffect, useState } from 'react';
import {
  ActionGroup,
  Alert,
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  InputGroup,
  InputGroupText,
  PageSection,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { ExclamationCircleIcon, EyeIcon, EyeSlashIcon } from '@patternfly/react-icons';
import { useAuthStore } from '../store/authState';

export const Profile: React.FC = () => {
  const { name, email, userName, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    name: name || '',
    email: email || '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation states
  const [nameValidated, setNameValidated] = useState<'success' | 'warning' | 'error' | 'default'>('default');
  const [emailValidated, setEmailValidated] = useState<'success' | 'warning' | 'error' | 'default'>('default');
  const [passwordValidated, setPasswordValidated] = useState<'success' | 'warning' | 'error' | 'default'>('default');

  useEffect(() => {
    setFormData({
      name: name || '',
      email: email || '',
      password: '',
      confirmPassword: '',
    });
  }, [name, email]);

  const validateName = (value: string) => {
    if (value.length >= 3) {
      setNameValidated('success');
    } else {
      setNameValidated('error');
    }
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      setEmailValidated('success');
    } else {
      setEmailValidated('error');
    }
  };

  const validatePassword = (value: string) => {
    if (value.length >= 8 || value === '') {
      setPasswordValidated('success');
    } else {
      setPasswordValidated('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    const updateData: { name: string; email: string; password?: string } = {
      name: formData.name,
      email: formData.email,
    };

    if (formData.password) {
      updateData.password = formData.password;
    }

    try {
      await updateProfile(updateData);
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageSection>
      <Card>
        <CardBody>
          <Title headingLevel="h1">Profile</Title>
          {error && (
            <Alert variant="danger" title="Error" isInline>
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" title="Success" isInline>
              Profile updated successfully
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <FormGroup label="Username" fieldId="username">
              <TextInput
                id="username"
                value={userName || ''}
                isDisabled
                type="text"
              />
            </FormGroup>

            <FormGroup label="Name" fieldId="name" isRequired>
              <TextInput
                id="name"
                value={formData.name}
                onChange={(_, value) => {
                  setFormData(prev => ({ ...prev, name: value }));
                  validateName(value);
                }}
                type="text"
                validated={nameValidated}
              />
              <FormHelperText>
                <HelperText>
                  <HelperTextItem variant={nameValidated} {...(nameValidated === 'error' && { icon: <ExclamationCircleIcon /> })}>
                    {nameValidated === 'error' ? 'Name must be at least 3 characters long' : 'Enter your name'}
                  </HelperTextItem>
                </HelperText>
              </FormHelperText>
            </FormGroup>

            <FormGroup label="Email" fieldId="email" isRequired>
              <TextInput
                id="email"
                value={formData.email}
                onChange={(_, value) => {
                  setFormData(prev => ({ ...prev, email: value }));
                  validateEmail(value);
                }}
                type="email"
                validated={emailValidated}
              />
              <FormHelperText>
                <HelperText>
                  <HelperTextItem variant={emailValidated} {...(emailValidated === 'error' && { icon: <ExclamationCircleIcon /> })}>
                    {emailValidated === 'error' ? 'Enter a valid email address' : 'Enter your email'}
                  </HelperTextItem>
                </HelperText>
              </FormHelperText>
            </FormGroup>

            <FormGroup label="Password" fieldId="password">
              <InputGroup>
                <TextInput
                  id="password"
                  value={formData.password}
                  onChange={(_, value) => {
                    setFormData(prev => ({ ...prev, password: value }));
                    validatePassword(value);
                  }}
                  type={showPassword ? 'text' : 'password'}
                  validated={passwordValidated}
                />
                <InputGroupText onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </InputGroupText>
              </InputGroup>
              <FormHelperText>
                <HelperText>
                  <HelperTextItem variant={passwordValidated} {...(passwordValidated === 'error' && { icon: <ExclamationCircleIcon /> })}>
                    {passwordValidated === 'error' ? 'Password must be at least 8 characters long' : 'Enter a password (Leave empty to keep the current password)'}
                  </HelperTextItem>
                </HelperText>
              </FormHelperText>
            </FormGroup>

            <FormGroup label="Confirm Password" fieldId="confirm-password">
              <TextInput
                id="confirm-password"
                value={formData.confirmPassword}
                onChange={(_, value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
                type={showPassword ? 'text' : 'password'}
              />
            </FormGroup>

            <ActionGroup>
              <Button
                variant="primary"
                type="submit"
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
              >
                Save Changes
              </Button>
            </ActionGroup>
          </Form>
        </CardBody>
      </Card>
    </PageSection>
  );
};
