import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  MenuToggle,
  NumberInput,
  Select,
  SelectList,
  SelectOption,
  TextArea,
  TextInput,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from '@patternfly/react-core';
import { ExclamationCircleIcon, TimesIcon } from '@patternfly/react-icons';
import { useUserStore } from '../store/userState';
import { IGameVariant } from '../store/gameState';
import { usePriceStore } from '../store/priceState';

export interface GameFormData {
  name: string;
  description: string;
  variant: IGameVariant;
  maxCards: number;
  allowedUsers: number[];
  cinquinaPrice?: { id: number };
  bingoPrice?: { id: number };
  miniBingoPrice?: { id: number };
}

interface GameFormProps {
  initialData?: Partial<GameFormData>;
  onSubmit: (data: GameFormData) => void;
  submitLabel: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export const GameForm: React.FC<GameFormProps> = ({
  initialData,
  onSubmit,
  submitLabel
}) => {
  const { fetchUsers, users } = useUserStore();
  const { prices, fetchPrices } = usePriceStore();
  const [formData, setFormData] = useState<GameFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    variant: initialData?.variant || IGameVariant.REDHAT,
    maxCards: initialData?.maxCards || 1,
    allowedUsers: initialData?.allowedUsers || [],
    cinquinaPrice: initialData?.cinquinaPrice,
    bingoPrice: initialData?.bingoPrice,
    miniBingoPrice: initialData?.miniBingoPrice
  });

  const [isUserSelectOpen, setIsUserSelectOpen] = useState(false);
  const [isVariantSelectOpen, setIsVariantSelectOpen] = useState(false);
  const [isCinquinaPriceOpen, setIsCinquinaPriceOpen] = useState(false);
  const [isBingoPriceOpen, setIsBingoPriceOpen] = useState(false);
  const [isMiniBingoPriceOpen, setIsMiniBingoPriceOpen] = useState(false);
  const [userSearchValue, setUserSearchValue] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const textInputRef = useRef<HTMLInputElement>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    fetchUsers();
    fetchPrices();
  }, [fetchUsers, fetchPrices]);

  useEffect(() => {
    if (userSearchValue) {
      setFilteredUsers(
        users.filter(user =>
          user.name.toLowerCase().includes(userSearchValue.toLowerCase()) ||
          user.email.toLowerCase().includes(userSearchValue.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [userSearchValue, users]);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (formData.maxCards < 1) {
      errors.maxCards = 'Max cards must be at least 1';
    }

    if (formData.maxCards > 99) {
      errors.maxCards = 'Max cards cannot exceed 99';
    }

    if (!formData.variant) {
      errors.variant = 'Variant is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUserSearchInputChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setUserSearchValue(value);
  };

  const onClearUserSelection = () => {
    setFormData({ ...formData, allowedUsers: [] });
    setUserSearchValue('');
    textInputRef.current?.focus();
  };

  const getSelectedUsersDisplay = () => {
    if (formData.allowedUsers.length === 0) return '';
    const selectedUsers = users
      .filter(user => formData.allowedUsers.includes(user.id))
      .map(user => user.name);
    return selectedUsers.join(', ');
  };

  const getPriceLabel = (priceId?: number) => {
    if (!priceId) return 'No Prize';
    const price = prices.find(p => p.id === priceId);
    return price ? price.name : 'No Prize';
  };

  const userToggle = (toggleRef: React.Ref<any>) => (
    <MenuToggle
      variant="typeahead"
      aria-label="Select users"
      onClick={() => setIsUserSelectOpen(!isUserSelectOpen)}
      innerRef={toggleRef}
      isExpanded={isUserSelectOpen}
      isFullWidth
    >
      <TextInputGroup>
        <TextInputGroupMain
          value={isUserSelectOpen ? userSearchValue : getSelectedUsersDisplay()}
          onClick={() => setIsUserSelectOpen(!isUserSelectOpen)}
          onChange={onUserSearchInputChange}
          autoComplete="off"
          innerRef={textInputRef}
          placeholder="Select users..."
        />
        {(formData.allowedUsers.length > 0 || userSearchValue) && (
          <TextInputGroupUtilities>
            <Button
              variant="plain"
              onClick={onClearUserSelection}
              aria-label="Clear input value"
            >
              <TimesIcon aria-hidden />
            </Button>
          </TextInputGroupUtilities>
        )}
      </TextInputGroup>
    </MenuToggle>
  );

  const variantToggle = (toggleRef: React.Ref<any>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={() => setIsVariantSelectOpen(!isVariantSelectOpen)}
      isExpanded={isVariantSelectOpen}
    >
      {formData.variant}
    </MenuToggle>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup
        label="Name"
        isRequired
        fieldId="game-name"
      >
        <TextInput
          id="game-name"
          name="name"
          value={formData.name}
          onChange={(_event, value) => {
            setFormData({ ...formData, name: value });
            setValidationErrors({ ...validationErrors, name: '' });
          }}
          isRequired
          validated={validationErrors.name ? 'error' : 'default'}
        />
        {validationErrors.name && (
          <FormHelperText>
            <HelperText>
              <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                {validationErrors.name}
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        )}
      </FormGroup>

      <FormGroup label="Description" fieldId="game-description">
        <TextArea
          id="game-description"
          name="description"
          value={formData.description}
          onChange={(_event, value) => setFormData({ ...formData, description: value })}
        />
      </FormGroup>

      {/* Game Settings Row */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <FormGroup
          label="Variant"
          isRequired
          fieldId="game-variant"
          style={{ flex: 1 }}
        >
          <Select
            id="game-variant"
            aria-label="Game variant"
            isOpen={isVariantSelectOpen}
            selected={formData.variant}
            onSelect={(_, value) => {
              setFormData({ ...formData, variant: value as IGameVariant });
              setIsVariantSelectOpen(false);
              setValidationErrors({ ...validationErrors, variant: '' });
            }}
            onOpenChange={setIsVariantSelectOpen}
            toggle={variantToggle}
          >
            <SelectList>
              {Object.values(IGameVariant).map((variant) => (
                <SelectOption key={variant} value={variant}>
                  {variant}
                </SelectOption>
              ))}
            </SelectList>
          </Select>
          {validationErrors.variant && (
            <FormHelperText>
              <HelperText>
                <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                  {validationErrors.variant}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          )}
        </FormGroup>

        <FormGroup
          label="Max Cards"
          isRequired
          fieldId="game-max-cards"
          style={{ flex: 1 }}
        >
          <NumberInput
            id="game-max-cards"
            name="maxCards"
            value={formData.maxCards}
            onMinus={() => {
              if (formData.maxCards > 1) {
                setFormData({ ...formData, maxCards: formData.maxCards - 1 });
                setValidationErrors({ ...validationErrors, maxCards: '' });
              }
            }}
            onPlus={() => {
              if (formData.maxCards < 99) {
                setFormData({ ...formData, maxCards: formData.maxCards + 1 });
                setValidationErrors({ ...validationErrors, maxCards: '' });
              }
            }}
            onChange={(event) => {
              const value = Math.min(99, Math.max(1, Number(event.target.value)));
              setFormData({ ...formData, maxCards: value });
              setValidationErrors({ ...validationErrors, maxCards: '' });
            }}
            min={1}
            max={99}
            isDisabled={false}
            validated={validationErrors.maxCards ? 'error' : 'default'}
          />
          {validationErrors.maxCards && (
            <FormHelperText>
              <HelperText>
                <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                  {validationErrors.maxCards}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          )}
        </FormGroup>
      </div>

      {/* Prizes Row */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <FormGroup label="Cinquina Prize" fieldId="game-cinquina-price" style={{ flex: 1 }}>
          <Select
            id="game-cinquina-price"
            aria-label="Cinquina prize"
            isOpen={isCinquinaPriceOpen}
            selected={formData.cinquinaPrice?.id.toString()}
            onSelect={(_, value) => {
              setFormData({ ...formData, cinquinaPrice: value ? { id: Number(value) } : undefined });
              setIsCinquinaPriceOpen(false);
            }}
            onOpenChange={setIsCinquinaPriceOpen}
            toggle={(toggleRef) => (
              <MenuToggle
                ref={toggleRef}
                onClick={() => setIsCinquinaPriceOpen(!isCinquinaPriceOpen)}
                isExpanded={isCinquinaPriceOpen}
              >
                {getPriceLabel(formData.cinquinaPrice?.id)}
              </MenuToggle>
            )}
          >
            <SelectOption key="no-price" value="">No Prize</SelectOption>
            {prices.map((price) => (
              <SelectOption
                key={price.id}
                value={price.id.toString()}
                description={price.description}
              >
                {price.name}
              </SelectOption>
            ))}
          </Select>
        </FormGroup>

        <FormGroup label="Bingo Prize" fieldId="game-bingo-price" style={{ flex: 1 }}>
          <Select
            id="game-bingo-price"
            aria-label="Bingo prize"
            isOpen={isBingoPriceOpen}
            selected={formData.bingoPrice?.id.toString()}
            onSelect={(_, value) => {
              setFormData({ ...formData, bingoPrice: value ? { id: Number(value) } : undefined });
              setIsBingoPriceOpen(false);
            }}
            onOpenChange={setIsBingoPriceOpen}
            toggle={(toggleRef) => (
              <MenuToggle
                ref={toggleRef}
                onClick={() => setIsBingoPriceOpen(!isBingoPriceOpen)}
                isExpanded={isBingoPriceOpen}
              >
                {getPriceLabel(formData.bingoPrice?.id)}
              </MenuToggle>
            )}
          >
            <SelectOption key="no-price" value="">No Prize</SelectOption>
            {prices.map((price) => (
              <SelectOption
                key={price.id}
                value={price.id.toString()}
                description={price.description}
              >
                {price.name}
              </SelectOption>
            ))}
          </Select>
        </FormGroup>

        <FormGroup label="Mini Bingo Prize" fieldId="game-mini-bingo-price" style={{ flex: 1 }}>
          <Select
            id="game-mini-bingo-price"
            aria-label="Mini bingo prize"
            isOpen={isMiniBingoPriceOpen}
            selected={formData.miniBingoPrice?.id.toString()}
            onSelect={(_, value) => {
              setFormData({ ...formData, miniBingoPrice: value ? { id: Number(value) } : undefined });
              setIsMiniBingoPriceOpen(false);
            }}
            onOpenChange={setIsMiniBingoPriceOpen}
            toggle={(toggleRef) => (
              <MenuToggle
                ref={toggleRef}
                onClick={() => setIsMiniBingoPriceOpen(!isMiniBingoPriceOpen)}
                isExpanded={isMiniBingoPriceOpen}
              >
                {getPriceLabel(formData.miniBingoPrice?.id)}
              </MenuToggle>
            )}
          >
            <SelectOption key="no-price" value="">No Prize</SelectOption>
            {prices.map((price) => (
              <SelectOption
                key={price.id}
                value={price.id.toString()}
                description={price.description}
              >
                {price.name}
              </SelectOption>
            ))}
          </Select>
        </FormGroup>
      </div>

      {/* Users Selection */}
      <FormGroup label="Allowed Users">
        <Select
          id="game-allowed-users"
          isOpen={isUserSelectOpen}
          selected={formData.allowedUsers.map(id => String(id))}
          onSelect={(_, selection) => {
            const userId = Number(selection);
            setFormData({
              ...formData,
              allowedUsers: formData.allowedUsers.includes(userId)
                ? formData.allowedUsers.filter(id => id !== userId)
                : [...formData.allowedUsers, userId]
            });
          }}
          onOpenChange={setIsUserSelectOpen}
          toggle={userToggle}
        >
          <SelectList id="user-select-listbox">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <SelectOption
                  key={user.id}
                  value={String(user.id)}
                  description={user.email}
                  hasCheckbox
                  isSelected={formData.allowedUsers.includes(user.id)}
                >
                  {user.name}
                </SelectOption>
              ))
            ) : (
              <SelectOption
                isDisabled
                value="no-results"
                description="Try a different search term"
              >
                No users found
              </SelectOption>
            )}
          </SelectList>
        </Select>
        <FormHelperText>Optional: Select users who can join this game</FormHelperText>
      </FormGroup>

      <Button
        key="submit"
        variant="primary"
        type="submit"
        isDisabled={isSubmitting}
        isLoading={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : submitLabel}
      </Button>
    </Form>
  );
};
