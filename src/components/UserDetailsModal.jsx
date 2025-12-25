import React, { useState } from 'react';
import { Modal, Typography, Input, Table, Button, Space, Divider } from 'antd';
import {
    SearchOutlined,
    UnlockOutlined,
    QuestionCircleOutlined,
    SaveOutlined,
    LogoutOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

import AddUserProfileModal from './AddUserProfileModal';

const UserDetailsModal = ({ visible, onClose }) => {
    const [selectedKey, setSelectedKey] = useState('Profiles');
    const [searchText, setSearchText] = useState('');
    const [isAddProfileVisible, setIsAddProfileVisible] = useState(false);

    // Mock data matching the screenshot
    const dataSource = [
        {
            key: '1',
            securityProfile: 'Admin Super+',
            properties: 'Mount Morgan Space Solutions',
        },
        {
            key: '2',
            securityProfile: 'Manager',
            properties: 'Mount Morgan Space Solutions',
        },
    ];

    const filteredData = dataSource.filter(item =>
        item.securityProfile.toLowerCase().includes(searchText.toLowerCase()) ||
        item.properties.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'Security Profile',
            dataIndex: 'securityProfile',
            key: 'securityProfile',
            width: '40%',
            render: (text) => <Text style={{ color: '#000' }}>{text}</Text>,
        },
        {
            title: 'Properties',
            dataIndex: 'properties',
            key: 'properties',
            render: (text) => <Text style={{ color: '#000' }}>{text}</Text>,
        },
    ];

    // Custom Header
    const customHeader = (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: '#001529', color: 'white', padding: '12px 24px',
            margin: '-20px -24px 0 -24px', borderRadius: '4px 4px 0 0'
        }}>
            <Title level={5} style={{ color: 'white', margin: 0 }}>Edit - HGManager</Title>
            <Space size="large">
                <SearchOutlined style={{ color: 'white', fontSize: '18px', cursor: 'pointer' }} />
                <UnlockOutlined style={{ color: 'white', fontSize: '18px', cursor: 'pointer' }} />
                <QuestionCircleOutlined style={{ color: 'white', fontSize: '18px', cursor: 'pointer' }} />
                <SaveOutlined style={{ color: 'white', fontSize: '18px', cursor: 'pointer' }} />
                <LogoutOutlined onClick={onClose} style={{ color: 'white', fontSize: '18px', cursor: 'pointer' }} rotate={180} />
            </Space>
        </div>
    );

    const SidebarItem = ({ label, isActive, onClick }) => (
        <div
            onClick={onClick}
            style={{
                padding: '12px 24px',
                cursor: 'pointer',
                backgroundColor: isActive ? '#e6f7ff' : 'transparent',
                borderLeft: isActive ? '3px solid #1890ff' : '3px solid transparent',
                color: isActive ? '#262626' : '#8c8c8c',
                fontWeight: isActive ? 'bold' : 'normal'
            }}
        >
            {label}
        </div>
    );

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            closable={false}
            width={1200}
            styles={{ body: { padding: 0, borderRadius: '4px', height: '600px', display: 'flex', flexDirection: 'column' } }}
            centered
        >
            {customHeader}
            <div style={{ display: 'flex', flex: 1, backgroundColor: '#fff', overflow: 'hidden' }}>
                {/* Sidebar */}
                <div style={{ width: '220px', backgroundColor: '#fafafa', borderRight: '1px solid #f0f0f0', padding: '20px 0' }}>
                    <div style={{ padding: '0 24px 12px 24px' }}>
                        <Input
                            placeholder="Find..."
                            suffix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>

                    <SidebarItem label="User Details" isActive={selectedKey === 'User Details'} onClick={() => setSelectedKey('User Details')} />
                    <SidebarItem label="Profiles" isActive={selectedKey === 'Profiles'} onClick={() => setSelectedKey('Profiles')} />
                    <SidebarItem label="Trusted Devices" isActive={selectedKey === 'Trusted Devices'} onClick={() => setSelectedKey('Trusted Devices')} />
                    <SidebarItem label="Audit Trail" isActive={selectedKey === 'Audit Trail'} onClick={() => setSelectedKey('Audit Trail')} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative' }}>

                    {/* Render Content Based on Selected Key */}
                    {selectedKey === 'Profiles' && (
                        <>
                            {/* Toolbar */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                                <Space>
                                    <Button type="text" icon={<PlusOutlined />} onClick={() => setIsAddProfileVisible(true)} />
                                    <Button type="text" icon={<EditOutlined />} />
                                    <Button type="text" icon={<DeleteOutlined />} />
                                </Space>
                            </div>

                            {/* Table */}
                            <Table
                                columns={columns}
                                dataSource={filteredData}
                                pagination={false}
                                size="small"
                                variant="borderless"
                                rowSelection={{ type: 'checkbox' }}
                                rowClassName={(record, index) => index === 0 ? 'ant-table-row-selected' : ''} // Mock selection styling
                            />
                        </>
                    )}

                    {selectedKey !== 'Profiles' && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#8c8c8c' }}>
                            <Text>{selectedKey} content to be implemented</Text>
                        </div>
                    )}
                </div>
            </div>
            <AddUserProfileModal visible={isAddProfileVisible} onClose={() => setIsAddProfileVisible(false)} />
        </Modal>
    );
};

export default UserDetailsModal;
