import React, { useState } from 'react';
import { Tabs, Table, Button, Form, Input, Card, Space, message, InputNumber, Switch, DatePicker, Select, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, GiftOutlined, TeamOutlined, ShopOutlined } from '@ant-design/icons';
import { useCompanies, useCreateCompany } from '../../hooks/useCompanies';
import { useGroups, useCreateGroup } from '../../hooks/useGroups';
import { useVouchers, useCreateVoucher } from '../../hooks/useVouchers';

const { Title, Text } = Typography;

const UserManagementTabs = () => {
    const [activeTab, setActiveTab] = useState('companies');

    // --- Hooks ---
    const { data: companiesData, isLoading: companiesLoading } = useCompanies();
    const createCompanyMutation = useCreateCompany();

    const { data: groupsData, isLoading: groupsLoading } = useGroups();
    const createGroupMutation = useCreateGroup();

    const { data: vouchersData, isLoading: vouchersLoading } = useVouchers();
    const createVoucherMutation = useCreateVoucher();

    // --- Form Handlers ---
    const [companyForm] = Form.useForm();
    const [groupForm] = Form.useForm();
    const [voucherForm] = Form.useForm();

    const onFinishCompany = (values) => {
        createCompanyMutation.mutate(values, {
            onSuccess: () => {
                message.success('Company created successfully');
                companyForm.resetFields();
            },
            onError: (err) => message.error('Failed to create company: ' + err.message)
        });
    };

    const onFinishGroup = (values) => {
        createGroupMutation.mutate(values, {
            onSuccess: () => {
                message.success('Group created successfully');
                groupForm.resetFields();
            },
            onError: (err) => message.error('Failed to create group: ' + err.message)
        });
    };

    const onFinishVoucher = (values) => {
        // Normalize expiryDate from DatePicker (dayjs) to ISO string
        const payload = {
            ...values,
            expiryDate: values.expiryDate ? values.expiryDate.toISOString() : undefined
        };

        createVoucherMutation.mutate(payload, {
            onSuccess: () => {
                message.success('Voucher created successfully');
                voucherForm.resetFields();
            },
            onError: (err) => message.error('Failed to create voucher: ' + err.message)
        });
    };

    // --- Table Columns ---
    const companyColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Trading As', dataIndex: 'tradingAs', key: 'tradingAs' },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Credit Hold', dataIndex: 'creditHold', key: 'creditHold', render: (val) => val ? 'Yes' : 'No' },
    ];

    const groupColumns = [
        { title: 'Association', dataIndex: 'clientAssociation', key: 'clientAssociation' },
        { title: 'Contact', dataIndex: 'primaryContactName', key: 'primaryContactName' },
        { title: 'Email', dataIndex: 'primaryContactEmail', key: 'primaryContactEmail' },
    ];

    const voucherColumns = [
        { title: 'Code', dataIndex: 'code', key: 'code' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Amount', dataIndex: 'creditAmount', key: 'creditAmount' },
        { title: 'Expiry', dataIndex: 'expiryDate', key: 'expiryDate', render: (val) => val ? new Date(val).toLocaleDateString() : 'No expiry' },
    ];

    return (
        <Card style={{ margin: '16px' }}>
            <Title level={2}>Core Management</Title>
            <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab}
                items={[
                    {
                        key: 'companies',
                        label: <span><ShopOutlined /> Companies</span>,
                        children: (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
                                <div>
                                    <Table 
                                        dataSource={Array.isArray(companiesData) ? companiesData : companiesData?.data} 
                                        columns={companyColumns} 
                                        rowKey="_id" 
                                        size="small" 
                                        loading={companiesLoading}
                                    />
                                </div>
                                <Card title="Create New Company" size="small" type="inner">
                                    <Form form={companyForm} layout="vertical" onFinish={onFinishCompany} initialValues={{ creditHold: false }}>
                                        <Form.Item name="name" label="Company Name" rules={[{ required: true }]}><Input placeholder="Heritage Minerals Ltd." /></Form.Item>
                                        <Form.Item name="tradingAs" label="Trading As"><Input placeholder="Heritage" /></Form.Item>
                                        <Form.Item name="address" label="Address"><Input /></Form.Item>
                                        <Form.Item name="email" label="Email"><Input /></Form.Item>
                                        <Form.Item name="phone" label="Phone"><Input /></Form.Item>
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <Form.Item name="creditLimit" label="Credit Limit" style={{ flex: 1 }}><InputNumber style={{ width: '100%' }} /></Form.Item>
                                            <Form.Item name="creditHold" label="Credit Hold" valuePropName="checked"><Switch /></Form.Item>
                                        </div>
                                        <Button type="primary" htmlType="submit" block icon={<PlusOutlined />} loading={createCompanyMutation.isLoading}>Create Company</Button>
                                    </Form>
                                </Card>
                            </div>
                        )
                    },
                    {
                        key: 'groups',
                        label: <span><TeamOutlined /> Groups</span>,
                        children: (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
                                <div>
                                    <Table 
                                        dataSource={Array.isArray(groupsData) ? groupsData : groupsData?.data} 
                                        columns={groupColumns} 
                                        rowKey="_id" 
                                        size="small" 
                                        loading={groupsLoading}
                                    />
                                </div>
                                <Card title="Create New Group" size="small" type="inner">
                                    <Form form={groupForm} layout="vertical" onFinish={onFinishGroup}>
                                        <Form.Item name="clientAssociation" label="Association Name" rules={[{ required: true }]}><Input placeholder="Heritage Minerals" /></Form.Item>
                                        <Form.Item name="primaryContactName" label="Contact Name"><Input placeholder="Adam Brick" /></Form.Item>
                                        <Form.Item name="primaryContactEmail" label="Contact Email"><Input /></Form.Item>
                                        <Form.Item name="primaryContactPhone" label="Contact Phone"><Input /></Form.Item>
                                        <Button type="primary" htmlType="submit" block icon={<PlusOutlined />} loading={createGroupMutation.isLoading}>Create Group</Button>
                                    </Form>
                                </Card>
                            </div>
                        )
                    },
                    {
                        key: 'vouchers',
                        label: <span><GiftOutlined /> Vouchers</span>,
                        children: (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
                                <div>
                                    <Table 
                                        dataSource={Array.isArray(vouchersData) ? vouchersData : vouchersData?.data} 
                                        columns={voucherColumns} 
                                        rowKey="_id" 
                                        size="small" 
                                        loading={vouchersLoading}
                                    />
                                </div>
                                <Card title="Create New Voucher" size="small" type="inner">
                                    <Form form={voucherForm} layout="vertical" onFinish={onFinishVoucher}>
                                        <Form.Item name="code" label="Voucher Code" rules={[{ required: true }]}><Input placeholder="VCHR-2026-001" /></Form.Item>
                                        <Form.Item name="description" label="Description"><Input.TextArea rows={2} /></Form.Item>
                                        <Form.Item name="creditAmount" label="Credit Amount"><InputNumber style={{ width: '100%' }} /></Form.Item>
                                        <Form.Item name="expiryDate" label="Expiry Date"><DatePicker style={{ width: '100%' }} /></Form.Item>
                                        <Form.Item name="usedByCompany" label="Scope to Company">
                                            <Select allowClear showSearch optionFilterProp="children">
                                                {(Array.isArray(companiesData) ? companiesData : companiesData?.data || []).map(c => (
                                                    <Select.Option key={c._id} value={c._id}>{c.name}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Button type="primary" htmlType="submit" block icon={<PlusOutlined />} loading={createVoucherMutation.isLoading}>Create Voucher</Button>
                                    </Form>
                                </Card>
                            </div>
                        )
                    },
                ]}
            />
        </Card>
    );
};

export default UserManagementTabs;
