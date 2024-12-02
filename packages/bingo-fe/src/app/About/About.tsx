import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Label,
  List,
  ListItem,
  PageSection,
  Title,
} from '@patternfly/react-core';
import {
  CubesIcon,
  GiftIcon,
  GithubIcon,
  InfoCircleIcon,
  UsersIcon,
} from '@patternfly/react-icons';

export const About: React.FC = () => {
  return (
    <PageSection>
      <Grid hasGutter>
        {/* Header Section */}
        <GridItem span={12}>
          <Card>
            <CardBody>
              <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }}>
                <FlexItem>
                  <Title headingLevel="h1" size="4xl">
                    GPS &ldquo;Tombola&rdquo;
                  </Title>
                </FlexItem>
                <FlexItem>
                  <Label icon={<GiftIcon />} color="blue" isCompact>
                    Christmas Edition
                  </Label>
                </FlexItem>
                <FlexItem>
                  <p>
                      An open-source digital version of the traditional Italian Christmas game &ldquo;Tombola&rdquo;
                  </p>
                </FlexItem>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>

        {/* Features Section */}
        <GridItem span={6}>
          <Card>
            <CardHeader>
              <CardTitle>
                <Title headingLevel="h2" size="xl">
                  <CubesIcon /> Features
                </Title>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <List>
                <ListItem>Real-time multiplayer bingo experience</ListItem>
                <ListItem>Multiple game variants support</ListItem>
                <ListItem>Customizable prizes and rewards</ListItem>
                <ListItem>Administrative controls for game management</ListItem>
                <ListItem>User authentication and role-based access</ListItem>
                <ListItem>Responsive design for all devices</ListItem>
              </List>
            </CardBody>
          </Card>
        </GridItem>

        {/* Technical Details */}
        <GridItem span={6}>
          <Card>
            <CardHeader>
              <CardTitle>
                <Title headingLevel="h2" size="xl">
                  <InfoCircleIcon /> Technical Stack
                </Title>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>Frontend</DescriptionListTerm>
                  <DescriptionListDescription>
                    React, TypeScript, PatternFly 6
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>State Management</DescriptionListTerm>
                  <DescriptionListDescription>
                    Zustand
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Backend</DescriptionListTerm>
                  <DescriptionListDescription>
                    Node.js, Express, PostgreSQL
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        </GridItem>

        {/* Team Section */}
        <GridItem span={12}>
          <Card>
            <CardHeader>
              <CardTitle>
                <Title headingLevel="h2" size="xl">
                  <UsersIcon /> Team
                </Title>
              </CardTitle>
            </CardHeader>
            <CardBody>
                <p>
                  This project was created with ❤️ by the GPS team as a fun way to celebrate Christmas together.
                  It demonstrates our commitment to innovation while preserving traditional holiday customs.
                </p>
              <Divider className="pf-v5-u-my-md" />
              <Flex justifyContent={{ default: 'justifyContentCenter' }}>
                <FlexItem>
                  <Button
                    component="a"
                    href="https://github.com/gpillon/bingo"
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<GithubIcon />}
                    variant="link"
                  >
                    View on GitHub
                  </Button>
                </FlexItem>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </PageSection>
  );
};
