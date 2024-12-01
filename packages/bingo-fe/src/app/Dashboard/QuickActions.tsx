import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Gallery,
  GalleryItem,
  Button,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import {
  PlusCircleIcon,
  PlayIcon,
  UsersIcon
} from '@patternfly/react-icons';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authState';

export const QuickActions: React.FC = () => {
  const { isAdmin } = useAuthStore();

  const adminActions = [
    {
      title: 'Create Game',
      icon: <PlusCircleIcon />,
      link: '/admin/games/new',
      description: 'Create a new bingo game'
    },
    {
      title: 'Add User',
      icon: <UsersIcon />,
      link: '/admin/users/new',
      description: 'Add a new user to the system'
    }
  ];

  const userActions = [
    {
      title: 'Play Game',
      icon: <PlayIcon />,
      link: '/games',
      description: 'Join an available bingo game'
    }
  ];

  const actions = isAdmin ? [...adminActions, ...userActions] : userActions;

  return (
    <Card>
      <CardTitle>Quick Actions</CardTitle>
      <CardBody>
        <Gallery hasGutter minWidths={{ default: '200px' }}>
          {actions.map((action) => (
            <GalleryItem key={action.title}>
              <Card isHoverable component="div">
                <CardBody>
                  <Split hasGutter>
                    <SplitItem>{action.icon}</SplitItem>
                    <SplitItem isFilled>
                      <Button
                        variant="link"
                        component={(props) => <Link {...props} to={action.link} />}
                      >
                        {action.title}
                      </Button>
                      <p>{action.description}</p>
                    </SplitItem>
                  </Split>
                </CardBody>
              </Card>
            </GalleryItem>
          ))}
        </Gallery>
      </CardBody>
    </Card>
  );
};
