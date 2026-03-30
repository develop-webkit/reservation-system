import React from 'react';
import { Table, Button, Space, Typography, Card, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useClients, useDeleteClient } from '../../hooks/useClients';

const { Title } = Typography;

const ClientList = () => {
    const navigate = useNavigate();
    const { data: clientsFromApi, isLoading } = useClients();
    const deleteClientMutation = useDeleteClient();

    // Normalize client data from API (in case it's wrapped in { data: [...] })
    const clients = React.useMemo(() => {
        if (!clientsFromApi) return [];
        return Array.isArray(clientsFromApi) ? clientsFromApi : (clientsFromApi.data || []);
    }, [clientsFromApi]);

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this client?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                deleteClientMutation.mutate(id, {
                    onSuccess: () => message.success('Client deleted successfully'),
                    onError: (err) => message.error('Failed to delete client: ' + err.message)
                });
            },
        });
    };

    const columns = [
        {
            title: 'Client No',
            dataIndex: 'clientNo',
            key: 'clientNo',
            sorter: (a, b) => (a.clientNo || '').localeCompare(b.clientNo || ''),
        },
        {
            title: 'Client Name',
            dataIndex: 'clientName',
            key: 'clientName',
            sorter: (a, b) => (a.clientName || '').localeCompare(b.clientName || ''),
        },
        {
            title: 'Group Name',
            dataIndex: 'groupName',
            key: 'groupName',
        },
        {
            title: 'Company',
            dataIndex: 'company',
            key: 'company',
            render: (company) => typeof company === 'object' ? company?.name : (company || 'N/A'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Mobile',
            dataIndex: 'mobile',
            key: 'mobile',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        icon={<EyeOutlined />} 
                        size="small"
                        onClick={() => navigate(`/clients/${record._id || record.id}?mode=view`)}
                    >
                        View
                    </Button>
                    <Button 
                        icon={<EditOutlined />} 
                        type="primary" 
                        size="small"
                        onClick={() => navigate(`/clients/${record._id || record.id}`)}
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
                <Title level={3} style={{ margin: 0 }}>Client Management</Title>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => navigate('/clients/new')}
                >
                    Create Client
                </Button>
            </div>
            <Table 
                columns={columns} 
                dataSource={clients} 
                rowKey={(record) => record._id || record.id}
                loading={isLoading}
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );
};

export default ClientList;
