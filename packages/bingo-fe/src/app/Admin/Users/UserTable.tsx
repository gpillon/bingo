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
import { Label } from '@patternfly/react-core';
import { useUserStore, User } from '../../store/userState';
import { ChangePasswordModal } from './ChangePasswordModal';

interface UserTableProps {
  users: User[];
  onEditUser: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onEditUser }) => {
  const { deleteUser } = useUserStore();
  const [passwordModalUser, setPasswordModalUser] = useState<User | null>(null);

  const columns = [
    { title: 'Username', key: 'username' },
    { title: 'Name', key: 'name' },
    { title: 'Email', key: 'email' },
    { title: 'Role', key: 'role' },
    { title: 'Actions', key: 'actions' }
  ];

  const getActions = (user: User): IAction[] => [
    {
      title: 'Edit',
      onClick: () => onEditUser(user)
    },
    {
      title: 'Change Password',
      onClick: () => setPasswordModalUser(user)
    },
    {
      title: 'Delete',
      onClick: () => {
        if (window.confirm(`Are you sure you want to delete user ${user.username}?`)) {
          deleteUser(user.id);
        }
      }
    }
  ];

  return (
    <>
      <Table aria-label="Users table">
        <Thead>
          <Tr>
            {columns.map(({ title, key }) => (
              <Th key={key}>{title}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{user.username}</Td>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>
                <Label color={user.role === 'admin' ? 'blue' : 'green'}>
                  {user.role}
                </Label>
              </Td>
              <Td>
                <ActionsColumn
                  items={getActions(user)}
                  aria-label={`Actions for ${user.username}`}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {passwordModalUser && (
        <ChangePasswordModal
          isOpen={true}
          user={passwordModalUser}
          onClose={() => setPasswordModalUser(null)}
        />
      )}
    </>
  );
};
