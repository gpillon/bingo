import React, { useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Alert,
} from '@patternfly/react-core';
import { usePriceStore, Price } from '../../store/priceState';
import { PriceForm, PriceFormData } from './PriceForm';

interface EditPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  price: Price;
}

export const EditPriceModal: React.FC<EditPriceModalProps> = ({
  isOpen,
  onClose,
  price
}) => {
  const { updatePrice } = usePriceStore();
  const [formData, setFormData] = useState<PriceFormData>({
    name: price.name,
    description: price.description,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await updatePrice(price.id, {
        name: formData.name,
        description: formData.description,
      });
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
      title="Edit Price"
      variant="medium"
    >
      <ModalHeader title="Edit Price" />
      <ModalBody>
        {error && (
          <Alert variant="danger" title="Error updating price" isInline>
            {error}
          </Alert>
        )}
        <PriceForm
          formData={formData}
          onChange={setFormData}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          key="save"
          variant="primary"
          onClick={handleSubmit}
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
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
