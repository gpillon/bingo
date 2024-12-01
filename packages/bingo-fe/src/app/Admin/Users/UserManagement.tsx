import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  PageSection,
  Title,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Card,
  CardBody,
  EmptyState,
  EmptyStateBody,
  Spinner,
} from '@patternfly/react-core';
import { PlusCircleIcon, UsersIcon } from '@patternfly/react-icons';
import { UserTable } from './UserTable';
import { CreateUserModal } from './CreateUserModal';
import { EditUserModal } from './EditUserModal';
import { useUserStore, User } from '../../store/userState';

export const UserManagement: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { users, fetchUsers } = useUserStore();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const isCreateModalOpen = location.pathname === '/admin/users/new';

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateModalClose = () => {
    history.push('/admin/users');
  };

  if (!users) {
    return (
      <PageSection>
        <Card>
          <CardBody>
            <EmptyState headingLevel="h2" icon={Spinner}  >
              <Title headingLevel="h2" size="lg">Loading users...</Title>
              <EmptyStateBody>Loading users...</EmptyStateBody>
            </EmptyState>
          </CardBody>
        </Card>
      </PageSection>
    );
  }

  return (
    <PageSection>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <Title headingLevel="h1" size="2xl">
              User Management
            </Title>
          </ToolbarItem>
          <ToolbarItem align={{ default: 'alignRight' }}>
            <Button
              variant="primary"
              icon={<PlusCircleIcon />}
              onClick={() => history.push('/admin/users/new')}
            >
              Create User
            </Button>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Card>
        <CardBody>
          {users.length === 0 ? (
            <EmptyState headingLevel="h2" icon={UsersIcon}>
              <Title headingLevel="h2" size="lg">
                No Users Found
              </Title>
              <EmptyStateBody>
                There are no users in the system. Click the button above to create one.
              </EmptyStateBody>
            </EmptyState>
          ) : (
            <UserTable users={users} onEditUser={setEditingUser} />
          )}
        </CardBody>
      </Card>

      {isCreateModalOpen && (
        <CreateUserModal
          isOpen={true}
          onClose={handleCreateModalClose}
        />
      )}

      {editingUser && (
        <EditUserModal
          isOpen={true}
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </PageSection>
  );
};
