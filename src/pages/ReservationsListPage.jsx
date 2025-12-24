import React, { useState } from 'react';
import { Input, Select, DatePicker, Button, Typography, Divider } from 'antd';
import {
    HomeOutlined,
    EnvironmentOutlined,
    UserOutlined,
    MailOutlined,
    ThunderboltOutlined,
    FileTextOutlined,
    AuditOutlined,
    AppstoreAddOutlined,
    SwapOutlined,
    SearchOutlined,
    SaveOutlined,
    CopyOutlined,
    MoreOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;
const { Option } = Select;

const ReservationsListPage = () => {
    const [selectedTab, setSelectedTab] = useState('Reservation');

    // Sidebar navigation items
    const sidebarItems = [
        { key: 'Reservation', label: 'Reservation', icon: <HomeOutlined /> },
        { key: 'Area', label: 'Area', icon: <EnvironmentOutlined /> },
        { key: 'Client', label: 'Client', icon: <UserOutlined /> },
        { key: 'Correspondence', label: 'Correspondence', icon: <MailOutlined /> },
        { key: 'Triggers', label: 'Triggers', icon: <ThunderboltOutlined /> },
        { key: 'Requirement/Trace', label: 'Requirement/Trace', icon: <FileTextOutlined /> },
        { key: 'Audit Trail', label: 'Audit Trail', icon: <AuditOutlined /> },
        { key: 'Add On', label: 'Add On', icon: <AppstoreAddOutlined /> },
        { key: 'Transfers', label: 'Transfers', icon: <SwapOutlined /> },
    ];

    const FormField = ({ label, value, type = 'text', bgColor = 'transparent', isDropdown = false, isDate = false, suffix, labelStyle = {} }) => (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '140px 1fr',
            alignItems: 'center',
            marginBottom: '4px',
            minHeight: '32px'
        }}>
            <Text style={{
                fontSize: '12px',
                color: '#262626',
                paddingRight: '8px',
                textAlign: 'left',
                ...labelStyle
            }}>
                {label}
            </Text>
            {isDropdown ? (
                <Select
                    value={value}
                    style={{ width: '100%' }}
                    size="small"
                    suffixIcon={<SearchOutlined style={{ fontSize: '10px' }} />}
                >
                    <Option value={value}>{value}</Option>
                </Select>
            ) : isDate ? (
                <DatePicker
                    value={dayjs(value, 'ddd, DD MMM YYYY - h:mm A')}
                    showTime
                    format="ddd, DD MMM YYYY - h:mm A"
                    style={{ width: '100%', backgroundColor: bgColor }}
                    size="small"
                />
            ) : (
                <Input
                    value={value}
                    size="small"
                    style={{ backgroundColor: bgColor, fontSize: '12px' }}
                    suffix={suffix}
                />
            )}
        </div>
    );

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 64px)', backgroundColor: '#f5f5f5' }}>
            {/* Sidebar Navigation */}
            <div style={{ width: '220px', backgroundColor: '#fff', borderRight: '1px solid #e8e8e8', padding: '16px 0' }}>
                <div style={{ padding: '0 16px 16px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HomeOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
                    <Text strong style={{ fontSize: '16px' }}>Reservation</Text>
                </div>
                <Divider style={{ margin: '0 0 8px 0' }} />
                {sidebarItems.map(item => (
                    <div
                        key={item.key}
                        onClick={() => setSelectedTab(item.key)}
                        style={{
                            padding: '10px 16px',
                            cursor: 'pointer',
                            backgroundColor: selectedTab === item.key ? '#e6f7ff' : 'transparent',
                            borderLeft: selectedTab === item.key ? '3px solid #1890ff' : '3px solid transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ color: selectedTab === item.key ? '#1890ff' : '#8c8c8c', fontSize: '14px' }}>
                            {item.icon}
                        </span>
                        <Text style={{ color: selectedTab === item.key ? '#262626' : '#8c8c8c', fontSize: '13px' }}>
                            {item.label}
                        </Text>
                    </div>
                ))}
            </div>

            {/* Client Panel */}
            <div style={{ width: '320px', backgroundColor: '#fff', borderRight: '1px solid #e8e8e8', padding: '16px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Text strong style={{ fontSize: '16px' }}>Client</Text>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button type="text" size="small" icon={<CopyOutlined />} />
                        <Button type="text" size="small" icon={<SaveOutlined />} />
                        <Button type="text" size="small" icon={<MoreOutlined />} />
                    </div>
                </div>

                <FormField label="RMS SmartSearch" value="" suffix={<SearchOutlined />} />
                <FormField label="Client No" value="" suffix={<SearchOutlined />} />
                <FormField label="Groupname" value="" suffix={<SearchOutlined />} />
                <FormField label="Surname" value="" suffix={<SearchOutlined />} />
                <FormField label="Given" value="" suffix={<SearchOutlined />} />
                <FormField label="Title" value="" isDropdown />
                <FormField label="Email" value="" suffix={<SearchOutlined />} />
                <FormField label="Phone AH" value="" />
                <FormField label="Mobile" value="" suffix={<SearchOutlined />} />
                <FormField label="Email 2" value="" />
                <FormField label="Black List" value="No" bgColor="#fff" />
                <FormField label="Date Created" value="" bgColor="#fffbe6" />
                <FormField label="Date Modified" value="" />
                <FormField label="Client Type" value="Client" isDropdown />
                <FormField label="Company" value="" isDropdown />
            </div>

            {/* Reservation Panel */}
            <div style={{ width: '380px', backgroundColor: '#fff', borderRight: '1px solid #e8e8e8', padding: '16px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Text strong style={{ fontSize: '16px' }}>Reservation</Text>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button type="text" size="small" icon={<SearchOutlined />} />
                        <Button type="text" size="small" icon={<SaveOutlined />} />
                        <Button type="text" size="small" icon={<MoreOutlined />} />
                    </div>
                </div>

                <FormField label="Res No" value="(New Reservation)" bgColor="#fffbe6" />
                <FormField label="Master Res No" value="(New Reservation)" bgColor="#fffbe6" />
                <FormField label="Status" value="Unconfirmed" bgColor="#ffa940" />
                <FormField label="Arrive" value="Mon, 24 Nov 2025 - 2:00 PM" isDate bgColor="#fff" />
                <FormField label="Depart" value="Tue, 25 Nov 2025 - 10:00 AM" isDate bgColor="#fff" />
                <FormField label="Nights" value="1" />
                <FormField label="Adults" value="1" />
                <FormField label="Total Nights" value="" bgColor="#fffbe6" />
                <FormField label="Tariff Type" value="Occupied Room Rate PRPN" isDropdown bgColor="#e6f7ff" />
                <FormField label="Room Type" value="Staff Accommodation" isDropdown bgColor="#e6f7ff" />
                <FormField label="Area" value="01 Manager" isDropdown bgColor="#e6f7ff" />
                <FormField label="Bkg Source" value="" isDropdown />
                <FormField label="Fixed" value="No" />
                <FormField label="Company" value="" isDropdown suffix={<SearchOutlined />} />
                <FormField label="Travel Agent" value="" isDropdown suffix={<SearchOutlined />} />
                <FormField label="Contact" value="" isDropdown />
                <FormField label="Res Type" value="" isDropdown />
                <FormField label="Voucher No" value="" />
                <FormField label="Booker Contact" value="" isDropdown />
                <FormField label="Payment Mode" value="" isDropdown />
                <FormField label="Date Made" value="" bgColor="#fffbe6" />
                <FormField label="Made By" value="" bgColor="#fffbe6" />
                <FormField label="Last Modified" value="" bgColor="#fffbe6" />
                <FormField label="Group" value="" isDropdown />
            </div>

            {/* Account Panel */}
            <div style={{ flex: 1, backgroundColor: '#fff', padding: '16px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Text strong style={{ fontSize: '16px' }}>Account</Text>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button type="text" size="small" icon={<SaveOutlined />} />
                        <Button type="text" size="small" icon={<CopyOutlined />} />
                        <Button type="text" size="small" icon={<MoreOutlined />} />
                    </div>
                </div>

                <FormField label="Account No" value="(New Account)" bgColor="#fffbe6" />
                <FormField label="Base Tariff" value="XXXXXXXXXXXX" bgColor="#fffbe6" />
                <FormField label="Package" value="XXXXXXXXXX" bgColor="#fffbe6" />
                <FormField label="Total Tariff" value="XXXXXXXXXXXX" bgColor="#fffbe6" />
                <FormField label="Tariff On Master" value="Yes" bgColor="#b7eb8f" />
                <FormField label="Deposit" value="XXXX" />
                <FormField label="Dep Req By" value="Sun, 23 Nov 2025" />
                <FormField label="POS On Master" value="No" />
                <FormField label="Bill Room Type" value="" isDropdown />
                <FormField label="Upgrade Reason" value="" isDropdown />
                <FormField label="Hide Tariff On Correspondence" value="No" />
                <FormField label="Avg Upgrade Tariff" value="0.00" bgColor="#fffbe6" />
                <FormField label="Accomm" value="XXXX" bgColor="#fffbe6" />
                <FormField label="A/R" value="0.00" bgColor="#fffbe6" />
                <FormField label="Active Accounts" value="(None)" bgColor="#fffbe6" />
            </div>
        </div>
    );
};

export default ReservationsListPage;
