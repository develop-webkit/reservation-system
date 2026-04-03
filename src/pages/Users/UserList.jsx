import React from 'react';
import { Table, Button, Space, Typography, Card, Tag, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useUsers, useDeleteUser } from '../../hooks/useUsers';

const { Title } = Typography;

const UserList = ({ role = 'customer' }) => {
    const navigate = useNavigate();
    const { data: allUsers, isLoading } = useUsers();
    const deleteUserMutation = useDeleteUser();

    // Filter users by role
    const users = React.useMemo(() => {
        if (!allUsers) return [];
        const roleMap = { customer: 'user', employee: 'housekeeper' };
        const targetRole = roleMap[role] || role;
        const filtered = Array.isArray(allUsers)
            ? allUsers.filter(u => u.role === targetRole)
            : allUsers.data?.filter(u => u.role === targetRole) || [];
        console.log(`[UserList] Role: ${role}, Target: ${targetRole}, All Users:`, allUsers, 'Filtered:', filtered);
        return filtered;
    }, [allUsers, role]);

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this user?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                deleteUserMutation.mutate(id, {
                    onSuccess: () => message.success('User deleted successfully'),
                    onError: (err) => message.error('Failed to delete user: ' + err.message)
                });
            },
        });
    };

    const columns = [
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color={role === 'admin' ? 'red' : 'blue'}>
                    {role ? role.toUpperCase() : 'N/A'}
                </Tag>
            ),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => navigate(`/users/${role}s/${record._id || record.id}?mode=view`)}
                    >
                        View
                    </Button>
                    <Button
                        icon={<EditOutlined />}
                        type="primary"
                        size="small"
                        onClick={() => navigate(`/users/${role}s/${record._id || record.id}`)}
                    >
                        Edit
                    </Button>
                    <Button 
                        icon={<DeleteOutlined />} 
                        danger 
                        size="small"
                        onClick={() => handleDelete(record._id || record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Title level={3} style={{ margin: 0 }}>
                    {role === 'employee' ? 'Employees / Cleaners' : 'Users / Customers'}
                </Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate(`/users/${role}s/new`)}
                >
                    Create {role === 'employee' ? 'Employee' : 'Customer'}
                </Button>
            </div>
            <Table 
                columns={columns} 
                dataSource={users} 
                rowKey={(record) => record._id || record.id}
                loading={isLoading}
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );
};

export default UserList;
