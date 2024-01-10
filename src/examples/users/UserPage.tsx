import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Button, Table } from 'antd';

interface UserInfo {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
      city: string;
    };
    phone: string;
    website: string;
    company: {
      name: string;
    };
  }

interface UserPageProps {
  userId: number;
  onCloseUserPage: () => void;
}

const UserPage: React.FC<UserPageProps> = ({ userId, onCloseUserPage }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { data }: any = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
        setUser(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching user info', err);
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);
  const columns = [
    {
      title: 'Attribute',
      dataIndex: 'attribute',
      key: 'attribute',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const dataSource = [
    { key: '1', attribute: 'Name', value: user?.name },
    { key: '2', attribute: 'User Name', value: user?.username },
    { key: '3', attribute: 'Email', value: user?.email },
    { key: '4', attribute: 'City', value: user?.address.city },
    { key: '5', attribute: 'Phone', value: user?.phone },
    { key: '6', attribute: 'Website', value: user?.website },
    { key: '7', attribute: 'Company Name', value: user?.company.name },
  ];
  return (
    <div>
      <Spin spinning={isLoading} size='large'>
        {user ? (
          <div>
            <h1 onClick={() => onCloseUserPage()}>User ID: {userId}</h1>
            <Table dataSource={dataSource} columns={columns} pagination={false} />
          </div>
        ) : (
          <p>No user information available</p>
        )}
        <Button onClick={() => onCloseUserPage()}>Back</Button>
      </Spin>
    </div>
  );
};

export default UserPage;