import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Flex,
  FlexItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Button,
  Label,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@patternfly/react-core';
import {
  ClockIcon,
  EditIcon,
  GiftIcon,
  PlayIcon,
  RedoIcon,
  StopIcon,
  TrophyIcon,
  WarningTriangleIcon,
} from '@patternfly/react-icons';
import { Game, IGameStatus } from '../../store/gameState';
import { useHasRole } from '@app/store/authState';
import { PriceModal } from './PriceModal';
interface GameHeaderProps {
  game: Game;
  onStatusChange: (status: IGameStatus) => Promise<void>;
  onEditClick: () => void;
  onExtractNumber: () => Promise<void>;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  game,
  onStatusChange,
  onEditClick,
  onExtractNumber,
}) => {
  const isAdmin = useHasRole('admin');
  const [selectedPrice, setSelectedPrice] = useState<{
    id: number;
    name: string;
    description?: string;
    hasImage?: boolean;
  } | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const renderPrizes = () => {
    const prizes: { type: string; id: number; name: string; description?: string; hasImage?: boolean }[] = [];
    if (game.cinquinaPrice) {
      prizes.push({ type: 'Cinquina', ...game.cinquinaPrice });
    }
    if (game.bingoPrice) {
      prizes.push({ type: 'Bingo', ...game.bingoPrice });
    }
    if (game.miniBingoPrice) {
      prizes.push({ type: 'Mini Bingo', ...game.miniBingoPrice });
    }
    return prizes;
  };

  const handleResetModalToggle = (_event: KeyboardEvent | React.MouseEvent) => {
    setIsResetModalOpen(!isResetModalOpen);
  };

  return (
    <PageSection variant="default" padding={{ default: 'padding' }}>
      <Split hasGutter>
        <SplitItem isFilled>
          <Stack hasGutter>
            <StackItem>
              <Flex direction={{ default: 'row' }} spaceItems={{ default: 'spaceItemsMd' }}>
                <FlexItem>
                  <Title headingLevel="h1">
                    {game.name ? `${game.name} (#${game.id})` : `Game #${game.id}`}
                  </Title>
                </FlexItem>
                <FlexItem>
                  <Label
                    color={game.gameStatus === 'Running' ? 'green' : 'blue'}
                    icon={game.gameStatus === 'Running' ? <PlayIcon /> : undefined}
                  >
                    {game.gameStatus}
                  </Label>
                </FlexItem>
              </Flex>
            </StackItem>

            {game.description && (
              <StackItem>
                <p>{game.description}</p>
              </StackItem>
            )}

            <StackItem>
              <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                <FlexItem>
                  <ClockIcon /> Created: {new Date(game.createTs).toLocaleString()}
                </FlexItem>
                {game.startTs && (
                  <FlexItem>
                    <ClockIcon /> Started: {new Date(game.startTs).toLocaleString()}
                  </FlexItem>
                )}
              </Flex>
            </StackItem>

            {/* Winners and Prizes Row */}
            <StackItem>
              <Split hasGutter>
                {/* Winners Section - Always visible */}
                <SplitItem style={{ flex: '1 1 50%', minWidth: '250px' }}>
                  <Card>
                    <CardBody>
                      <Stack hasGutter>
                        <StackItem>
                          <Title headingLevel="h3" size="md">
                            <TrophyIcon /> Winners
                          </Title>
                        </StackItem>
                        {game.cinquinaCard && (
                          <StackItem>
                            <Flex>
                              <FlexItem>Cinquina:</FlexItem>
                              <FlexItem>
                                <Label color="grey" isCompact>{game.cinquinaCard.owner?.name || 'Unknown'}</Label>
                                {game.cinquinaNumber && <> at number {game.cinquinaNumber}</>}
                              </FlexItem>
                            </Flex>
                          </StackItem>
                        )}
                        {game.bingoCard && (
                          <StackItem>
                            <Flex>
                              <FlexItem>Bingo:</FlexItem>
                              <FlexItem>
                                <Label color="yellow" isCompact>{game.bingoCard.owner?.name || 'Unknown'}</Label>
                                {game.bingoNumber && <> at number {game.bingoNumber}</>}
                              </FlexItem>
                            </Flex>
                          </StackItem>
                        )}
                        {game.miniBingoCard && (
                          <StackItem>
                            <Flex>
                              <FlexItem>Mini Bingo:</FlexItem>
                              <FlexItem>
                                <Label color="green" isCompact>{game.miniBingoCard.owner?.name || 'Unknown'}</Label>
                                {game.miniBingoNumber && <> at number {game.miniBingoNumber}</>}
                              </FlexItem>
                            </Flex>
                          </StackItem>
                        )}
                        {!game.cinquinaCard && !game.bingoCard && !game.miniBingoCard && (
                          <StackItem>No winners yet</StackItem>
                        )}
                      </Stack>
                    </CardBody>
                  </Card>
                </SplitItem>

                {/* Prizes Section - Only visible when there are prizes */}
                {renderPrizes().length > 0 && (
                  <SplitItem style={{ flex: '1 1 50%', minWidth: '250px' }}>
                    <Card>
                      <CardBody>
                        <Stack hasGutter>
                          <StackItem>
                            <Title headingLevel="h3" size="md">
                              <GiftIcon /> Prizes
                            </Title>
                          </StackItem>
                          {renderPrizes().map((prize) => (
                            <StackItem key={`${prize.type}-${prize.id}`}>
                              <Flex>
                                <FlexItem>{prize.type}:</FlexItem>
                                <FlexItem>
                                  <Button
                                    variant="link"
                                    isInline
                                    onClick={() => setSelectedPrice(prize)}
                                    style={{
                                      color: 'blue',
                                      textDecoration: 'none',
                                      borderBottom: '1px dashed var(--pf-v5-global--link--Color)'
                                    }}
                                  >
                                    {prize.name}
                                  </Button>
                                </FlexItem>
                              </Flex>
                            </StackItem>
                          ))}
                        </Stack>
                      </CardBody>
                    </Card>
                  </SplitItem>
                )}
              </Split>
            </StackItem>
          </Stack>
        </SplitItem>

        {/* Admin Controls - Right Column */}
        <SplitItem>
          {isAdmin && (
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem>
                  <Button
                    variant="secondary"
                    icon={<EditIcon />}
                    onClick={onEditClick}
                  >
                    Edit
                  </Button>
                </ToolbarItem>
                <ToolbarItem>
                  {game.gameStatus === 'Created' && (
                    <Button
                      variant="primary"
                      icon={<PlayIcon />}
                      onClick={() => onStatusChange(IGameStatus.RUNNING)}
                    >
                      Start Game
                    </Button>
                  )}
                  {game.gameStatus === 'Running' && (
                    <>
                      <Button
                        variant="primary"
                        icon={<StopIcon />}
                        onClick={() => onStatusChange(IGameStatus.CLOSED)}
                      >
                        End Game
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={onExtractNumber}
                        isDisabled={game.extractedNumbers.length === 90}
                      >
                        Extract Number
                      </Button>
                      <Button
                        variant="danger"
                        icon={<WarningTriangleIcon />}
                        onClick={() => setIsResetModalOpen(true)}
                      >
                        Reset Game
                      </Button>
                    </>
                  )}
                  {game.gameStatus === 'Closed' && (
                    <Button
                      variant="warning"
                      icon={<RedoIcon />}
                      onClick={() => onStatusChange(IGameStatus.RUNNING)}
                    >
                      Reopen Game
                    </Button>
                  )}
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
          )}
        </SplitItem>
      </Split>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={handleResetModalToggle}
        aria-labelledby="reset-modal-title"
        aria-describedby="reset-modal-body"
        width="40%"
        maxWidth="600px"
      >
        <ModalHeader title="Reset Game" labelId="reset-modal-title" />
        <ModalBody id="reset-modal-body">
          Are you sure you want to reset this game? This action will:
          <ul>
            <li>Clear all winners</li>
            <li>Reset the game status</li>
            <li>Clear all extracted numbers</li>
          </ul>
          This action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <Button
            key="confirm"
            variant="danger"
            onClick={() => {
              onStatusChange(IGameStatus.CREATED);
              setIsResetModalOpen(false);
            }}
          >
            Reset
          </Button>
          <Button
            key="cancel"
            variant="link"
            onClick={handleResetModalToggle}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Prize Modal */}
      {selectedPrice && (
        <PriceModal
          isOpen={!!selectedPrice}
          onClose={() => setSelectedPrice(null)}
          price={selectedPrice}
        />
      )}
    </PageSection>
  );
};
