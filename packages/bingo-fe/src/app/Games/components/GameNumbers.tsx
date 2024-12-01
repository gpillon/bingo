import React, { useEffect } from 'react';
import {
  PageSection,
  Grid,
  GridItem,
  Card,
  CardBody,
  Stack,
  StackItem,
  Flex,
  FlexItem,
  Title,
  Badge,
  Label,
} from '@patternfly/react-core';
import { Game } from '../../store/gameState';
import { useVariantStore } from '../../store/variantState';

interface GameNumbersProps {
  game: Game;
}

export const GameNumbers: React.FC<GameNumbersProps> = ({ game }) => {
  const { variants, fetchVariants } = useVariantStore();
  const currentNumber = game.extractedNumbers[(game.currentNumber || 0) - 1];
  const currentLabel = variants[game.variant]?.labels[currentNumber];

  useEffect(() => {
    fetchVariants();
  }, [fetchVariants]);

  return (
    <PageSection>
      <Grid hasGutter>
        <GridItem span={12}>
          <Card>
            <CardBody>
              <Stack hasGutter>
                <StackItem>
                  <Flex justifyContent={{ default: 'justifyContentCenter' }}>
                    <FlexItem>
                      <Stack>
                        <StackItem>
                          <Title headingLevel="h2" size="4xl">
                            Current Number: <Badge style={{fontSize: '2rem'}} isRead>{currentNumber || '-'}</Badge>
                          </Title>
                        </StackItem>
                        {currentLabel && (
                          <StackItem>
                            <Title headingLevel="h3" size="xl">
                              {currentLabel}
                            </Title>
                          </StackItem>
                        )}
                      </Stack>
                    </FlexItem>
                  </Flex>
                </StackItem>
                <StackItem>
                  <Title headingLevel="h3" size="md">
                    Drawn Numbers &nbsp;
                    <Badge isRead>{game.currentNumber}</Badge>
                  </Title>
                  <Flex spaceItems={{ default: 'spaceItemsSm' }} flexWrap={{ default: 'wrap' }} style={{marginTop: '1rem'}}>
                    {game.extractedNumbers.map(num => (
                      <FlexItem key={num}>
                        <Label style={{fontSize: '1.5rem'}} color="blue" isCompact>{num}</Label>
                      </FlexItem>
                    ))}
                  </Flex>
                </StackItem>
              </Stack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </PageSection>
  );
};
