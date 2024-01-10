import { Component } from 'react';
import { Button, Modal, Table, Tag, Form, Input } from 'antd';
import { IEntity } from './types';
import * as Mappers from './mappers';
import Spinner from './spinner';
import UserPage from './UserPage';

interface UsersState {
  users: IEntity.User[];
  isLoading: boolean;
  selectedUserId: number | null;
  isEditing: boolean;
  editedUser: IEntity.User | null;
}

export default class Users extends Component<any, UsersState> {
  state: UsersState = {
    users: [],
    isLoading: true,
    selectedUserId: null,
    isEditing: false,
    editedUser: null
  };
  onEdit = (user: IEntity.User) => {
    this.setState({ isEditing: true, editedUser: user });
  };
  onCloseEditModal = () => {
    this.setState({ isEditing: false, editedUser: null });
  };
  onSaveEdit = () => {
    this.setState({ isEditing: false, editedUser: null });
  };
  onLoadUsers = async () => {
    try {
      this.setState({ isLoading: true });
      await new Promise(res => setTimeout(() => res(20), 500));

      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      const data: any[] = await res.json();
      const users = (data || []).map(Mappers.User);
      this.setState({ users, isLoading: false });
    } catch (err) {
      this.setState({ isLoading: false });
    }
  };

  onDelete = (userId: number) => {
    const userIndex = this.state.users.findIndex(user => user.id === userId);
    if (userIndex === -1) throw new Error('User Id not found');

    const users = [...this.state.users];
    users.splice(userIndex, 1);
    this.setState({ users });
  };

  onOpenInfo = (userId: number) => {
    this.setState({ selectedUserId: userId });
  };

  onCloseUserPage = () => {
    this.setState({ selectedUserId: null });
  };
  
  componentDidMount(): void {
    window.addEventListener('popstate', () => {
      console.log('pathname: ', window.location.pathname);
    });

    this.onLoadUsers();
  }

  render() {
    const { isLoading, users, selectedUserId, isEditing, editedUser } = this.state;

    if (selectedUserId) {
      return (
        <UserPage
          userId={selectedUserId}
          onCloseUserPage={this.onCloseUserPage}
        />
      );
    }
    
    return (
      <div className="mx-auto w-[1400px]">
        {!!users.length && (
          <Table
            bordered
            rowKey="id"
            columns={[
              {
                title: '🆔',
                dataIndex: 'id',
                width: 40
              },
              {
                title: 'Name 🌀',
                dataIndex: 'name'
              },
              {
                title: 'Username 🤦🏻',
                dataIndex: 'username'
              },
              {
                title: 'Email 📧',
                dataIndex: 'email'
              },
              {
                title: 'City 🌆',
                dataIndex: 'city'
              },
              {
                title: 'ZipCode 🔒',
                dataIndex: 'zipcode',
                render: zipcode => <Tag>🎌 {zipcode}</Tag>
              },
              {
                title: 'Website ⛬',
                dataIndex: 'website'
              },
              {
                title: 'Company 💼',
                dataIndex: 'company'
              },
              {
                title: 'Actions',
                dataIndex: '',
                render: (value, user) => (
                  <Button.Group>
                    <Button type='primary' onClick={() => {this.onOpenInfo(user.id);
                     window.history.replaceState({}, '', `/${user.id}`)
                    }} >
                      Info
                    </Button>
                    <Button onClick={() => this.onEdit(user)}>Edit</Button>
                    <Button type="primary" danger onClick={() => this.onDelete(user.id)}>
                      Delete
                    </Button>
                  </Button.Group>
                )
              }
            ]}
            dataSource={users}
            pagination={false}
            rowClassName="text-center"
          />
        )}
        <Spinner visible={isLoading} />
        {isEditing && editedUser && (
        <Modal
          title="Edit User"
          visible={isEditing}
          onCancel={this.onCloseEditModal}
          footer={[
            <Button key="cancel" onClick={this.onCloseEditModal}>
              Cancel
            </Button>,
            <Button key="save" type="primary" onClick={this.onSaveEdit}>
              Save
            </Button>,
          ]}
        >
          <Form>
            <Form.Item label="Name" name="name" initialValue={editedUser.name}>
              <Input />
            </Form.Item>
            <Form.Item label="Username" name="username" initialValue={editedUser.username}>
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" initialValue={editedUser.email}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      )}
      </div>
    );
  }
}