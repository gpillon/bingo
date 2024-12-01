import React from 'react';
import {
  Form,
  FormGroup,
  TextInput,
  FormSelect,
  FormSelectOption,
  HelperText,
  HelperTextItem,
  FormHelperText,
} from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';

interface UserFormData {
  username: string;
  name: string;
  email: string;
  password?: string;
  role: string;
}

interface ValidationState {
  username: ValidateState;
  name: ValidateState;
  email: ValidateState;
  password?: ValidateState;
}

type ValidateState = 'success' | 'warning' | 'error' | 'default';

interface UserFormProps {
  formData: UserFormData;
  onChange: (data: UserFormData) => void;
  showPassword?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({ formData, onChange, showPassword = false }) => {
  const [validation, setValidation] = React.useState<ValidationState>({
    username: 'default',
    name: 'default',
    email: 'default',
    password: 'default'
  });

  const validateUsername = (value: string): ValidateState => {
    if (value === '') return 'default';
    return value.length >= 3 ? 'success' : 'error';
  };

  const validateName = (value: string): ValidateState => {
    if (value === '') return 'default';
    return value.length >= 2 ? 'success' : 'error';
  };

  const validateEmail = (value: string): ValidateState => {
    if (value === '') return 'default';
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'success' : 'error';
  };

  const validatePassword = (value: string): ValidateState => {
    if (value === '') return 'default';
    return value.length >= 8 ? 'success' : 'error';
  };

  const handleChange = (key: keyof UserFormData, value: string) => {
    const newData = { ...formData, [key]: value };
    onChange(newData);

    setValidation(prev => ({
      ...prev,
      [key]: key === 'password'
        ? validatePassword(value)
        : key === 'email'
        ? validateEmail(value)
        : key === 'username'
        ? validateUsername(value)
        : validateName(value)
    }));
  };

  return (
    <Form>
      <FormGroup label="Username" isRequired fieldId="username">
        <TextInput
          isRequired
          type="text"
          id="username"
          name="username"
          value={formData.username}
          validated={validation.username}
          onChange={(_, value) => handleChange('username', value)}
          aria-describedby="username-helper"
        />
        <FormHelperText>
          <HelperText>
            <HelperTextItem
              icon={validation.username === 'error' ? <ExclamationCircleIcon /> : undefined}
              variant={validation.username}
            >
              {validation.username === 'error'
                ? 'Username must be at least 3 characters long'
                : 'Enter a username (minimum 3 characters)'}
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>

      <FormGroup label="Name" isRequired fieldId="name">
        <TextInput
          isRequired
          type="text"
          id="name"
          name="name"
          value={formData.name}
          validated={validation.name}
          onChange={(_, value) => handleChange('name', value)}
          aria-describedby="name-helper"
        />
        <FormHelperText>
          <HelperText>
            <HelperTextItem
              icon={validation.name === 'error' ? <ExclamationCircleIcon /> : undefined}
              variant={validation.name}
            >
              {validation.name === 'error'
                ? 'Name must be at least 2 characters long'
                : 'Enter your full name'}
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>

      <FormGroup label="Email" isRequired fieldId="email">
        <TextInput
          isRequired
          type="email"
          id="email"
          name="email"
          value={formData.email}
          validated={validation.email}
          onChange={(_, value) => handleChange('email', value)}
          aria-describedby="email-helper"
        />
        <FormHelperText>
          <HelperText>
            <HelperTextItem
              icon={validation.email === 'error' ? <ExclamationCircleIcon /> : undefined}
              variant={validation.email}
            >
              {validation.email === 'error'
                ? 'Please enter a valid email address'
                : 'Enter your email address'}
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>

      {showPassword && (
        <FormGroup label="Password" isRequired fieldId="password">
          <TextInput
            isRequired
            type="password"
            id="password"
            name="password"
            value={formData.password || ''}
            validated={validation.password}
            onChange={(_, value) => handleChange('password', value)}
            aria-describedby="password-helper"
          />
          <FormHelperText>
            <HelperText>
              <HelperTextItem
                icon={validation.password === 'error' ? <ExclamationCircleIcon /> : undefined}
                variant={validation.password}
              >
                {validation.password === 'error'
                  ? 'Password must be at least 8 characters long'
                  : 'Enter a password (minimum 8 characters)'}
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        </FormGroup>
      )}

      <FormGroup label="Role" isRequired fieldId="role">
        <FormSelect
          value={formData.role}
          onChange={(_, value) => handleChange('role', value)}
          id="role"
          name="role"
          aria-label="Select role"
        >
          <FormSelectOption value="user" label="User" />
          <FormSelectOption value="admin" label="Admin" />
        </FormSelect>
      </FormGroup>
    </Form>
  );
};
