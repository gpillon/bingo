import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  ActionsColumn,
  IAction
} from '@patternfly/react-table';
import { Button, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import { AuthenticatedImage } from '../../components/AuthenticatedImage';
import { Price, usePriceStore } from '../../store/priceState';
import { ImageUploadModal } from './ImageUploadModal';

interface PriceTableProps {
  prices: Price[];
  onEditPrice: (price: Price) => void;
  onCreatePrice: () => void;
}

export const PriceTable: React.FC<PriceTableProps> = ({
  prices,
  onEditPrice,
  onCreatePrice
}) => {
  const { deletePrice, fetchPrices } = usePriceStore();
  const [selectedPriceForImage, setSelectedPriceForImage] = useState<Price | null>(null);

  const handleImageUploadComplete = async () => {
    setSelectedPriceForImage(null);
    await fetchPrices(); // Refresh prices after image upload
  };

  const getActions = (price: Price): IAction[] => {
    const actions: IAction[] = [
      {
        title: 'Edit',
        onClick: () => onEditPrice(price)
      }
    ];

    // Add image actions
    if (price.hasImage) {
      actions.push({
        title: 'Remove Image',
        onClick: () => {
          if (window.confirm('Are you sure you want to remove this image?')) {
            removeImage(price.id);
          }
        },
        style: { color: 'var(--pf-v5-global--danger-color--100)' }
      });
    } else {
      actions.push({
        title: 'Add Image',
        onClick: () => setSelectedPriceForImage(price)
      });
    }

    actions.push({
      title: 'Delete',
      onClick: () => {
        if (window.confirm('Are you sure you want to delete this price?')) {
          deletePrice(price.id);
        }
      }
    });

    return actions;
  };

  const removeImage = async (priceId: number) => {
    try {
      await usePriceStore.getState().removeImage(priceId);
      await fetchPrices(); // Refresh prices after image removal
    } catch (error) {
      console.error('Failed to remove image:', error);
    }
  };

  return (
    <>
      <Table aria-label="Prices table">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Image</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {prices.map((price) => (
            <Tr key={price.id}>
              <Td>{price.name}</Td>
              <Td>{price.description}</Td>
              <Td>
                {price.hasImage && price.imageUrl && (
                  <AuthenticatedImage
                    src={price.imageUrl}
                    alt={price.name}
                    style={{
                      maxWidth: '50px',
                      maxHeight: '50px',
                      borderRadius: '4px',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </Td>
              <Td>
                <ActionsColumn
                  items={getActions(price)}
                  aria-label={`Actions for ${price.name}`}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {selectedPriceForImage && (
        <ImageUploadModal
          isOpen={true}
          onClose={() => setSelectedPriceForImage(null)}
          priceId={selectedPriceForImage.id}
          priceName={selectedPriceForImage.name}
          onUploadComplete={handleImageUploadComplete}
        />
      )}
    </>
  );
};
