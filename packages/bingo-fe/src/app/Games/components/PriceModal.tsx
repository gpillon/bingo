import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@patternfly/react-core';
import { AuthenticatedImage } from '@app/components/AuthenticatedImage';

interface PriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  price: {
    id: number;
    name: string;
    description?: string;
    hasImage?: boolean;
  };
}

export const PriceModal: React.FC<PriceModalProps> = ({
  isOpen,
  onClose,
  price
}) => {
  const handleModalToggle = (_event: KeyboardEvent | React.MouseEvent) => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalToggle}
      aria-labelledby="price-modal-title"
      aria-describedby="price-modal-body"
      ouiaId="PriceModal"
      width="40%"
      maxWidth="600px"
    >
      <ModalHeader title={price.name} labelId="price-modal-title" />
      <ModalBody id="price-modal-body">
        {price.description && (
          <p>{price.description}</p>
        )}
        {price.hasImage && (
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <AuthenticatedImage
              src={`/api/prices/${price.id}/image`}
              alt={price.name}
              style={{
                maxWidth: '100%',
                height: 'auto',
                maxHeight: '400px',
                objectFit: 'contain'
              }}
            />
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button key="close" variant="primary" onClick={handleModalToggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};
