import React from 'react';
import { Modal, Typography, Checkbox, Space, Divider, Button } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AddUserProfileModal = ({ visible, onClose }) => {

    // Custom Header
    const customHeader = (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: '#001529', color: 'white', padding: '12px 24px',
            margin: '-20px -24px 0 -24px', borderRadius: '4px 4px 0 0'
        }}>
            <Title level={5} style={{ color: 'white', margin: 0 }}>Add User Profile</Title>
            <Space size="middle">
                <SaveOutlined style={{ color: 'white', fontSize: '18px', cursor: 'pointer' }} />
                <Button type="text" onClick={onClose} icon={<CloseOutlined style={{ color: 'white', fontSize: '18px' }} />} />
            </Space>
        </div>
    );

    const Column = ({ title, children, showLine = false }) => (
        <div style={{ flex: 1, padding: '0 24px', borderRight: showLine ? '1px solid #f0f0f0' : 'none' }}>
            <Title level={5} style={{ fontSize: '14px', marginBottom: '16px' }}>{title}</Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {children}
            </div>
        </div>
    );

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            closable={false}
            width={1000}
            styles={{ body: { padding: 0, borderRadius: '4px', minHeight: '500px' } }}
            centered
            maskClosable={false}
        >
            {customHeader}
            <div style={{ padding: '24px', backgroundColor: '#fff', display: 'flex', height: '100%', minHeight: '450px' }}>

                {/* Column 1: Security Profiles */}
                <Column title="Security Profiles" showLine>
                    <Checkbox>Admin Super+</Checkbox>
                    <Checkbox>Manager</Checkbox>
                    <Checkbox>Site Admin</Checkbox>
                    <Checkbox>ToniLimited</Checkbox>
                </Column>

                {/* Column 2: Accessible Properties */}
                <Column title="Accessible Properties - (1 Selected)" showLine>
                    <Checkbox defaultChecked>Mount Morgan Space Solutions</Checkbox>
                </Column>

                {/* Column 3: Accessible Room Types */}
                <Column title="Accessible Room Types - (4 Selected)">
                    <Checkbox defaultChecked>(All Room Types)</Checkbox>
                    <Checkbox defaultChecked>Staff Accommodation</Checkbox>
                    <Checkbox defaultChecked>Standard Ensuite Benjamin</Checkbox>
                    <Checkbox defaultChecked>Standard Ensuite Shiel</Checkbox>
                    <Checkbox defaultChecked>Standard Ensuite Wallace</Checkbox>
                </Column>
            </div>
        </Modal>
    );
};

export default AddUserProfileModal;
