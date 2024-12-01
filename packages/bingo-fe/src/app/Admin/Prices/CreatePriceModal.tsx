import React, { useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Alert,
} from '@patternfly/react-core';
import { usePriceStore } from '../../store/priceState';
import { PriceForm, PriceFormData } from './PriceForm';

interface CreatePriceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePriceModal: React.FC<CreatePriceModalProps> = ({ isOpen, onClose }) => {
  const { createPrice, uploadPriceImage } = usePriceStore();
  const [formData, setFormData] = useState<PriceFormData>({
    name: '',
    description: '',
    image: null
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // First create the price
      const newPrice = await createPrice({
        name: formData.name,
        description: formData.description
      });

      // Then upload the image if one was selected
      if (formData.image) {
        await uploadPriceImage(newPrice.id, formData.image);
      }

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
      aria-labelledby="create-price-modal-title"
      aria-describedby="create-price-modal-body"
      variant="medium"
      position="top"
    >
      <ModalHeader title="Create New Price" id="create-price-modal-title" />
      <ModalBody id="create-price-modal-body">
        {error && (
          <Alert variant="danger" title="Error creating price" isInline>
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
          key="confirm"
          variant="primary"
          onClick={handleSubmit}
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Create Price
        </Button>
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
