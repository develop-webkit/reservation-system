import React, { useState } from 'react';
import { Tabs, Table, Button, Form, Input, Card, Space, message, InputNumber, Switch, DatePicker, Select, Typography, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, GiftOutlined, TeamOutlined, ShopOutlined, EditOutlined } from '@ant-design/icons';
import { useCompanies, useCreateCompany, useUpdateCompany } from '../../hooks/useCompanies';
import { useGroups, useCreateGroup, useUpdateGroup } from '../../hooks/useGroups';
import { useVouchers, useCreateVoucher, useUpdateVoucher } from '../../hooks/useVouchers';

const { Title, Text } = Typography;

const UserManagementTabs = () => {
    const [activeTab, setActiveTab] = useState('companies');
    const [editingCompany, setEditingCompany] = useState(null);
    const [editingGroup, setEditingGroup] = useState(null);
    const [editingVoucher, setEditingVoucher] = useState(null);

    // --- Pagination & Search/Filter State ---
    const [companyPageSize, setCompanyPageSize] = useState(10);
    const [companySearch, setCompanySearch] = useState('');
    const [companyCreditHoldFilter, setCompanyCreditHoldFilter] = useState(null);

    const [groupPageSize, setGroupPageSize] = useState(10);
    const [groupSearch, setGroupSearch] = useState('');

    const [voucherPageSize, setVoucherPageSize] = useState(10);
    const [voucherSearch, setVoucherSearch] = useState('');

    // --- Hooks ---
    const { data: companiesData, isLoading: companiesLoading } = useCompanies();
    const createCompanyMutation = useCreateCompany();
    const updateCompanyMutation = useUpdateCompany();

    const { data: groupsData, isLoading: groupsLoading } = useGroups();
    const createGroupMutation = useCreateGroup();
    const updateGroupMutation = useUpdateGroup();

    const { data: vouchersData, isLoading: vouchersLoading } = useVouchers();
    const createVoucherMutation = useCreateVoucher();
    const updateVoucherMutation = useUpdateVoucher();

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

    const handleEditCompany = (values) => {
        updateCompanyMutation.mutate(
            { id: editingCompany._id, data: values },
            {
                onSuccess: () => {
                    message.success('Company updated successfully');
                    setEditingCompany(null);
                },
                onError: (err) => message.error('Failed to update company: ' + err.message)
            }
        );
    };

    const handleEditGroup = (values) => {
        updateGroupMutation.mutate(
            { id: editingGroup._id, data: values },
            {
                onSuccess: () => {
                    message.success('Group updated successfully');
                    setEditingGroup(null);
                },
                onError: (err) => message.error('Failed to update group: ' + err.message)
            }
        );
    };

    const handleEditVoucher = (values) => {
        const payload = {
            ...values,
            expiryDate: values.expiryDate ? values.expiryDate.toISOString() : undefined
        };
        updateVoucherMutation.mutate(
            { id: editingVoucher._id, data: payload },
            {
                onSuccess: () => {
                    message.success('Voucher updated successfully');
                    setEditingVoucher(null);
                },
                onError: (err) => message.error('Failed to update voucher: ' + err.message)
            }
        );
    };

    // --- Filter & Search Functions ---
    const filteredCompanies = React.useMemo(() => {
        let data = Array.isArray(companiesData) ? companiesData : (companiesData?.data || []);

        if (companySearch) {
            data = data.filter(c =>
                (c.name?.toLowerCase().includes(companySearch.toLowerCase())) ||
                (c.tradingAs?.toLowerCase().includes(companySearch.toLowerCase())) ||
                (c.email?.toLowerCase().includes(companySearch.toLowerCase())) ||
                (c.phone?.toLowerCase().includes(companySearch.toLowerCase()))
            );
        }

        if (companyCreditHoldFilter !== null) {
            data = data.filter(c => c.creditHold === companyCreditHoldFilter);
        }

        return data;
    }, [companiesData, companySearch, companyCreditHoldFilter]);

    const filteredGroups = React.useMemo(() => {
        let data = Array.isArray(groupsData) ? groupsData : (groupsData?.data || []);

        if (groupSearch) {
            data = data.filter(g =>
                (g.clientAssociation?.toLowerCase().includes(groupSearch.toLowerCase())) ||
                (g.primaryContactName?.toLowerCase().includes(groupSearch.toLowerCase())) ||
                (g.primaryContactEmail?.toLowerCase().includes(groupSearch.toLowerCase()))
            );
        }

        return data;
    }, [groupsData, groupSearch]);

    const filteredVouchers = React.useMemo(() => {
        let data = Array.isArray(vouchersData) ? vouchersData : (vouchersData?.data || []);

        if (voucherSearch) {
            data = data.filter(v =>
                (v.code?.toLowerCase().includes(voucherSearch.toLowerCase())) ||
                (v.description?.toLowerCase().includes(voucherSearch.toLowerCase()))
            );
        }

        return data;
    }, [vouchersData, voucherSearch]);

    // --- Table Columns ---
    const companyColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Trading As', dataIndex: 'tradingAs', key: 'tradingAs' },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Credit Hold', dataIndex: 'creditHold', key: 'creditHold', render: (val) => val ? 'Yes' : 'No' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button icon={<EditOutlined />} size="small" onClick={() => setEditingCompany(record)}>Edit</Button>
                </Space>
            ),
        },
    ];

    const groupColumns = [
        { title: 'Association', dataIndex: 'clientAssociation', key: 'clientAssociation' },
        { title: 'Contact', dataIndex: 'primaryContactName', key: 'primaryContactName' },
        { title: 'Email', dataIndex: 'primaryContactEmail', key: 'primaryContactEmail' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button icon={<EditOutlined />} size="small" onClick={() => setEditingGroup(record)}>Edit</Button>
                </Space>
            ),
        },
    ];

    const voucherColumns = [
        { title: 'Code', dataIndex: 'code', key: 'code' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Amount', dataIndex: 'creditAmount', key: 'creditAmount' },
        { title: 'Expiry', dataIndex: 'expiryDate', key: 'expiryDate', render: (val) => val ? new Date(val).toLocaleDateString() : 'No expiry' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button icon={<EditOutlined />} size="small" onClick={() => setEditingVoucher(record)}>Edit</Button>
                </Space>
            ),
        },
    ];

    // --- Edit Company Modal ---
    const [editCompanyForm] = Form.useForm();
    React.useEffect(() => {
        if (editingCompany) {
            editCompanyForm.setFieldsValue({
                name: editingCompany.name,
                tradingAs: editingCompany.tradingAs,
                address: editingCompany.address,
                email: editingCompany.email,
                phone: editingCompany.phone,
                creditLimit: editingCompany.creditLimit,
                creditHold: editingCompany.creditHold,
            });
        }
    }, [editingCompany, editCompanyForm]);

    // --- Edit Group Modal ---
    const [editGroupForm] = Form.useForm();
    React.useEffect(() => {
        if (editingGroup) {
            editGroupForm.setFieldsValue({
                clientAssociation: editingGroup.clientAssociation,
                primaryContactName: editingGroup.primaryContactName,
                primaryContactEmail: editingGroup.primaryContactEmail,
                primaryContactPhone: editingGroup.primaryContactPhone,
            });
        }
    }, [editingGroup, editGroupForm]);

    // --- Edit Voucher Modal ---
    const [editVoucherForm] = Form.useForm();
    React.useEffect(() => {
        if (editingVoucher) {
            editVoucherForm.setFieldsValue({
                code: editingVoucher.code,
                description: editingVoucher.description,
                creditAmount: editingVoucher.creditAmount,
                expiryDate: editingVoucher.expiryDate ? new Date(editingVoucher.expiryDate) : null,
                usedByCompany: editingVoucher.usedByCompany,
            });
        }
    }, [editingVoucher, editVoucherForm]);

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
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 150px', gap: '12px', marginBottom: '16px' }}>
                                        <Input
                                            placeholder="Search by name, trading as, email, or phone..."
                                            value={companySearch}
                                            onChange={(e) => setCompanySearch(e.target.value)}
                                        />
                                        <Select
                                            placeholder="Filter by Credit Hold"
                                            allowClear
                                            value={companyCreditHoldFilter}
                                            onChange={setCompanyCreditHoldFilter}
                                        >
                                            <Select.Option value={true}>On Hold</Select.Option>
                                            <Select.Option value={false}>Active</Select.Option>
                                        </Select>
                                        <Select
                                            value={companyPageSize}
                                            onChange={setCompanyPageSize}
                                            options={[
                                                { label: '10', value: 10 },
                                                { label: '20', value: 20 },
                                                { label: '30', value: 30 },
                                            ]}
                                        />
                                    </div>
                                    <Table
                                        dataSource={filteredCompanies}
                                        columns={companyColumns}
                                        rowKey="_id"
                                        size="small"
                                        loading={companiesLoading}
                                        pagination={{ pageSize: companyPageSize, pageSizeOptions: ['10', '20', '30'], showSizeChanger: true }}
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
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '12px', marginBottom: '16px' }}>
                                        <Input
                                            placeholder="Search by association, contact name, or email..."
                                            value={groupSearch}
                                            onChange={(e) => setGroupSearch(e.target.value)}
                                        />
                                        <Select
                                            value={groupPageSize}
                                            onChange={setGroupPageSize}
                                            options={[
                                                { label: '10', value: 10 },
                                                { label: '20', value: 20 },
                                                { label: '30', value: 30 },
                                            ]}
                                        />
                                    </div>
                                    <Table
                                        dataSource={filteredGroups}
                                        columns={groupColumns}
                                        rowKey="_id"
                                        size="small"
                                        loading={groupsLoading}
                                        pagination={{ pageSize: groupPageSize, pageSizeOptions: ['10', '20', '30'], showSizeChanger: true }}
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
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '12px', marginBottom: '16px' }}>
                                        <Input
                                            placeholder="Search by code or description..."
                                            value={voucherSearch}
                                            onChange={(e) => setVoucherSearch(e.target.value)}
                                        />
                                        <Select
                                            value={voucherPageSize}
                                            onChange={setVoucherPageSize}
                                            options={[
                                                { label: '10', value: 10 },
                                                { label: '20', value: 20 },
                                                { label: '30', value: 30 },
                                            ]}
                                        />
                                    </div>
                                    <Table
                                        dataSource={filteredVouchers}
                                        columns={voucherColumns}
                                        rowKey="_id"
                                        size="small"
                                        loading={vouchersLoading}
                                        pagination={{ pageSize: voucherPageSize, pageSizeOptions: ['10', '20', '30'], showSizeChanger: true }}
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

            {/* Edit Company Modal */}
            <Modal
                title="Edit Company"
                open={!!editingCompany}
                onCancel={() => setEditingCompany(null)}
                footer={[
                    <Button key="cancel" onClick={() => setEditingCompany(null)}>Cancel</Button>,
                    <Button key="submit" type="primary" loading={updateCompanyMutation.isPending} onClick={() => editCompanyForm.submit()}>Update</Button>,
                ]}
            >
                <Form form={editCompanyForm} layout="vertical" onFinish={handleEditCompany}>
                    <Form.Item name="name" label="Company Name" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="tradingAs" label="Trading As"><Input /></Form.Item>
                    <Form.Item name="address" label="Address"><Input /></Form.Item>
                    <Form.Item name="email" label="Email"><Input /></Form.Item>
                    <Form.Item name="phone" label="Phone"><Input /></Form.Item>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Form.Item name="creditLimit" label="Credit Limit" style={{ flex: 1 }}><InputNumber style={{ width: '100%' }} /></Form.Item>
                        <Form.Item name="creditHold" label="Credit Hold" valuePropName="checked"><Switch /></Form.Item>
                    </div>
                </Form>
            </Modal>

            {/* Edit Group Modal */}
            <Modal
                title="Edit Group"
                open={!!editingGroup}
                onCancel={() => setEditingGroup(null)}
                footer={[
                    <Button key="cancel" onClick={() => setEditingGroup(null)}>Cancel</Button>,
                    <Button key="submit" type="primary" loading={updateGroupMutation.isPending} onClick={() => editGroupForm.submit()}>Update</Button>,
                ]}
            >
                <Form form={editGroupForm} layout="vertical" onFinish={handleEditGroup}>
                    <Form.Item name="clientAssociation" label="Association Name" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="primaryContactName" label="Contact Name"><Input /></Form.Item>
                    <Form.Item name="primaryContactEmail" label="Contact Email"><Input /></Form.Item>
                    <Form.Item name="primaryContactPhone" label="Contact Phone"><Input /></Form.Item>
                </Form>
            </Modal>

            {/* Edit Voucher Modal */}
            <Modal
                title="Edit Voucher"
                open={!!editingVoucher}
                onCancel={() => setEditingVoucher(null)}
                footer={[
                    <Button key="cancel" onClick={() => setEditingVoucher(null)}>Cancel</Button>,
                    <Button key="submit" type="primary" loading={updateVoucherMutation.isPending} onClick={() => editVoucherForm.submit()}>Update</Button>,
                ]}
            >
                <Form form={editVoucherForm} layout="vertical" onFinish={handleEditVoucher}>
                    <Form.Item name="code" label="Voucher Code" rules={[{ required: true }]}><Input /></Form.Item>
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
                </Form>
            </Modal>
        </Card>
    );
};

export default UserManagementTabs;
