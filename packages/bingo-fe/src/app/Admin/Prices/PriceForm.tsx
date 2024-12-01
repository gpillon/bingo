import React from 'react';
import {
  Form,
  FormGroup,
  TextInput,
  FormHelperText,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';

export interface PriceFormData {
  name: string;
  description: string;
}

interface ValidationState {
  name: ValidateState;
  description: ValidateState;
}

type ValidateState = 'success' | 'warning' | 'error' | 'default';

interface PriceFormProps {
  formData: PriceFormData;
  onChange: (data: PriceFormData) => void;
}

export const PriceForm: React.FC<PriceFormProps> = ({
  formData,
  onChange,
}) => {
  const [validation, setValidation] = React.useState<ValidationState>({
    name: 'default',
    description: 'default'
  });

  const validateName = (value: string): ValidateState => {
    if (value === '') return 'default';
    return value.length >= 3 ? 'success' : 'error';
  };

  const validateDescription = (value: string): ValidateState => {
    if (value === '') return 'default';
    return value.length >= 10 ? 'success' : 'error';
  };

  const handleChange = (key: keyof PriceFormData, value: string) => {
    const newData = { ...formData, [key]: value };
    onChange(newData);

    setValidation(prev => ({
      ...prev,
      [key]: key === 'name'
        ? validateName(value)
        : validateDescription(value)
    }));
  };

  return (
    <Form>
      <FormGroup label="Name" isRequired fieldId="price-name">
        <TextInput
          isRequired
          type="text"
          id="price-name"
          name="name"
          value={formData.name}
          validated={validation.name}
          onChange={(_, value) => handleChange('name', value)}
        />
        <FormHelperText>
          <HelperText>
            <HelperTextItem
              icon={validation.name === 'error' ? <ExclamationCircleIcon /> : undefined}
              variant={validation.name}
            >
              {validation.name === 'error'
                ? 'Name must be at least 3 characters long'
                : 'Enter a name for the price'}
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>

      <FormGroup label="Description" isRequired fieldId="price-description">
        <TextInput
          isRequired
          type="text"
          id="price-description"
          name="description"
          value={formData.description}
          validated={validation.description}
          onChange={(_, value) => handleChange('description', value)}
        />
        <FormHelperText>
          <HelperText>
            <HelperTextItem
              icon={validation.description === 'error' ? <ExclamationCircleIcon /> : undefined}
              variant={validation.description}
            >
              {validation.description === 'error'
                ? 'Description must be at least 10 characters long'
                : 'Enter a description for the price'}
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>
    </Form>
  );
};
