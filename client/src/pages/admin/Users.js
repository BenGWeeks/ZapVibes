import React, { useRef, useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { DetailsList, Dialog, DialogType, TextField, PrimaryButton, DefaultButton } from '@fluentui/react';

console.log('Server URL:', process.env.REACT_APP_SERVER_URL);

const Users = () => {
  const nameRef = useRef();
  const nPubRef = useRef();
  const { data: users = [], refetch: refetchUsers } = useQuery('users', () =>
    fetch(`${process.env.REACT_APP_SERVER_URL}/users`).then(res => res.json())
  );
  const { data: relays = [] } = useQuery('relays', () =>
    fetch(`${process.env.REACT_APP_SERVER_URL}/relays`).then(res => res.json())
  );
  const relay = relays[0]; // Assuming there is at least one relay in the database
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const columns = [
    { key: 'name', name: 'Name', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'nPub', name: 'nPub', fieldName: 'nPub', minWidth: 100, maxWidth: 200, isResizable: true },
  ];

  const onAddUser = () => {
    setSelectedUser(null);
    setDialogVisible(true);
  };

  const onEditUser = (user) => {
    setSelectedUser(user);
    setDialogVisible(true);
  };

  const deleteMutation = useMutation((id) =>
    fetch(`${process.env.REACT_APP_SERVER_URL}/users/${id}`, {
      method: 'DELETE',
    }),
    {
      onSuccess: () => {
        refetchUsers();
      },
    }
  );

  const onDeleteUser = (user) => {
    deleteMutation.mutate(user.id);
  };

  const mutation = useMutation((user) =>
    fetch(`${process.env.REACT_APP_SERVER_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    }),
    {
      onSuccess: () => {
        refetchUsers();
      },
    }
  );

  const onSaveUser = (name, nPub) => {
    mutation.mutate({ name, nPub });
    setDialogVisible(false);
  };

  return (
    <div>
      <h1>Admin Users</h1>
      <DetailsList
        items={users}
        columns={columns}
        setKey="id"
        onItemInvoked={onEditUser}
      />
      <PrimaryButton onClick={onAddUser}>Add User</PrimaryButton>
      {selectedUser && <DefaultButton onClick={() => onDeleteUser(selectedUser)}>Delete User</DefaultButton>}
      <Dialog
        hidden={!dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: selectedUser ? 'Edit User' : 'Add User',
        }}
      >
        <TextField label="Name" defaultValue={selectedUser ? selectedUser.name : ''} componentRef={nameRef} />
        <TextField label="nPub" defaultValue={selectedUser ? selectedUser.nPub : ''} componentRef={nPubRef} />
        <PrimaryButton onClick={() => onSaveUser(nameRef.current.value, nPubRef.current.value)}>Save</PrimaryButton>
      </Dialog>
    </div>
  );
};

export default Users;
