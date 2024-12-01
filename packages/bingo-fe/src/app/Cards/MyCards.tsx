import React, { useEffect } from 'react';
import {
  PageSection,
  Title,
  Gallery,
  GalleryItem,
  Card,
  CardTitle,
  CardBody,
  Button,
  EmptyState,
  EmptyStateBody,
  Label,
} from '@patternfly/react-core';
import { useCardStore } from '../store/cardState';

const MyCards: React.FC = () => {
  const { userCards, loading, error, fetchAllUserCards } = useCardStore();

  useEffect(() => {
    fetchAllUserCards();
  }, [fetchAllUserCards]);

  if (loading || error) {
    return (
      <PageSection>
        <EmptyState>
          <Title headingLevel="h2" size="lg">
            {loading ? 'Loading cards...' : 'Error loading cards'}
          </Title>
          {error && <EmptyStateBody>{error}</EmptyStateBody>}
        </EmptyState>
      </PageSection>
    );
  }

  return (
    <PageSection>
      <Title headingLevel="h1" size="lg">My Bingo Cards</Title>

      <Gallery hasGutter minWidths={{ default: '300px' }}>
        {userCards.map(card => (
          <GalleryItem key={card.id}>
            <Card>
              <CardTitle>
                Card #{card.id}
                {card.completed && <Label color="green">BINGO!</Label>}
              </CardTitle>
              <CardBody>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
                  {card.numbers.flat().map((num, idx) => (
                    <Button
                      key={idx}
                      variant={card.markedNumbers.includes(num) ? "primary" : "control"}
                      isDisabled
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </CardBody>
            </Card>
          </GalleryItem>
        ))}
      </Gallery>
    </PageSection>
  );
};

export { MyCards };
