import React, { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  FlexItem,
  PageSection,
  Title,
} from '@patternfly/react-core';
import { PriceTable } from './PriceTable';
import { CreatePriceModal } from './CreatePriceModal';
import { EditPriceModal } from './EditPriceModal';
import { Price, usePriceStore } from '../../store/priceState';

export const PriceManagement: React.FC = () => {
  const { prices, fetchPrices } = usePriceStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const handleCreatePrice = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditPrice = (price: Price) => {
    setSelectedPrice(price);
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setSelectedPrice(null);
    fetchPrices(); // Refresh prices after modal closes
  };

  return (
    <PageSection>
      <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
        <FlexItem>
          <Title headingLevel="h1">Prize Management</Title>
        </FlexItem>
        <FlexItem>
          <Button
            variant="primary"
            onClick={handleCreatePrice}
          >
            Create New Price
          </Button>
        </FlexItem>
      </Flex>

      <PriceTable
        prices={prices}
        onEditPrice={handleEditPrice}
        onCreatePrice={handleCreatePrice}
      />

      <CreatePriceModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
      />

      {selectedPrice && (
        <EditPriceModal
          isOpen={true}
          onClose={handleModalClose}
          price={selectedPrice}
        />
      )}
    </PageSection>
  );
};
