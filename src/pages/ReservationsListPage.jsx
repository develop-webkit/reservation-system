import React, { useState, useMemo } from 'react';
import { Input, Select, DatePicker, Button, Typography, Divider, Table } from 'antd';
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
    MoreOutlined,
    CloseOutlined,
    DollarOutlined,
    UserSwitchOutlined,
    CaretDownOutlined,
    EllipsisOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { mockClients } from '../data/mockClients';

const { Text } = Typography;
const { Option } = Select;

const TITLE_OPTIONS = ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof', 'Sir', 'Lady'];
const CLIENT_TYPE_OPTIONS = ['Client', 'Contractor', 'Sales Lead', 'Staff'];
const MOBILE_TYPE_OPTIONS = ['Mobile', 'Home', 'Work', 'Other'];
const COMPANY_OPTIONS = [
    { name: 'Heritage Minerals', address: '', creditHold: 'No', tradingAs: '' },
    { name: 'Mt Morgan Hospital', address: '', creditHold: 'Yes', tradingAs: '' },
    { name: 'QPS Mount Morgan', address: '', creditHold: 'Yes', tradingAs: '' }
];

const FormField = ({
    label,
    field,
    value,
    clientData,
    handleFieldChange,
    setSmartSearch,
    bgColor = 'transparent',
    isDropdown = false,
    options = [],
    isDate = false,
    suffix,
    addonAfter,
    prefixSelect,
    labelStyle = {},
    yellowBg = false
}) => {
    const displayValue = field ? clientData?.[field] : value;
    const finalBgColor = yellowBg ? '#fffbe6' : bgColor;

    return (
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
            <div style={{ display: 'flex', width: '100%', gap: '0' }}>
                {prefixSelect && (
                    <Select
                        defaultValue={prefixSelect.options[0]}
                        style={{ width: '80px' }}
                        size="small"
                        suffixIcon={<CaretDownOutlined style={{ fontSize: '10px' }} />}
                    >
                        {prefixSelect.options.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
                    </Select>
                )}
                <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
                    {isDropdown ? (
                        <Select
                            value={displayValue}
                            onChange={(val) => handleFieldChange?.(field, val)}
                            style={{ width: '100%' }}
                            size="small"
                            suffixIcon={suffix || <CaretDownOutlined style={{ fontSize: '10px' }} />}
                            dropdownMatchSelectWidth={label === 'Company' ? false : true}
                            dropdownRender={label === 'Company' ? (menu) => (
                                <div style={{ minWidth: '600px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', backgroundColor: '#fff', borderRadius: '4px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '200px 150px 100px 150px', padding: '8px', backgroundColor: '#f5f5f5', fontWeight: 'bold', fontSize: '11px', borderBottom: '1px solid #e8e8e8' }}>
                                        <span>Company</span>
                                        <span>Address</span>
                                        <span>Credit Hold/...</span>
                                        <span>Trading As</span>
                                    </div>
                                    {menu}
                                </div>
                            ) : undefined}
                        >
                            {options.length > 0 ? (
                                options.map(opt => (
                                    <Option key={typeof opt === 'string' ? opt : opt.name} value={typeof opt === 'string' ? opt : opt.name}>
                                        {typeof opt === 'string' ? opt : (
                                            <div style={{ display: 'grid', gridTemplateColumns: '200px 150px 100px 150px', fontSize: '11px' }}>
                                                <span>{opt.name}</span>
                                                <span>{opt.address}</span>
                                                <span>{opt.creditHold}</span>
                                                <span>{opt.tradingAs}</span>
                                            </div>
                                        )}
                                    </Option>
                                ))
                            ) : (
                                <Option value={displayValue}>{displayValue}</Option>
                            )}
                        </Select>
                    ) : isDate ? (
                        <DatePicker
                            value={displayValue ? dayjs(displayValue, 'DD MMM YYYY') : null}
                            format="DD MMM YYYY"
                            style={{ width: '100%', backgroundColor: finalBgColor }}
                            size="small"
                        />
                    ) : (
                        <Input
                            value={displayValue}
                            onChange={(e) => handleFieldChange?.(field, e.target.value)}
                            onFocus={() => {
                                if (field && displayValue && setSmartSearch) {
                                    setSmartSearch(prev => ({ ...prev, isOpen: true, term: displayValue }));
                                }
                            }}
                            size="small"
                            style={{ backgroundColor: finalBgColor, fontSize: '12px' }}
                            suffix={suffix}
                        />
                    )}
                    {addonAfter && (
                        <div style={{ marginLeft: '4px' }}>
                            {addonAfter}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ReservationsListPage = () => {
    const [selectedTab, setSelectedTab] = useState('Reservation');

    // --- State for Form Fields ---
    const [clientData, setClientData] = useState({
        smartSearch: '',
        clientNo: '',
        groupname: '',
        surname: '',
        given: '',
        title: 'Mr',
        email: '',
        phoneAH: '',
        mobile: '',
        email2: '',
        blackList: 'No',
        clientType: 'Client',
        company: '',
        dateCreated: '05 Nov 2025',
        dateModified: '05 Nov 2025'
    });

    // --- State for Smart Search ---
    const [smartSearch, setSmartSearch] = useState({
        isOpen: false,
        term: '',
    });

    const filteredClients = useMemo(() => {
        if (!smartSearch.term) return [];
        const term = smartSearch.term.toLowerCase();
        return mockClients.filter(c =>
            c.clientName.toLowerCase().includes(term) ||
            c.surname.toLowerCase().includes(term) ||
            c.clientNo.includes(term)
        );
    }, [smartSearch.term]);

    const handleFieldChange = (field, value) => {
        setClientData(prev => ({ ...prev, [field]: value }));

        // Trigger Smart Search if the field has a search icon (based on logic or specific fields)
        const searchableFields = ['smartSearch', 'clientNo', 'groupname', 'surname', 'given', 'email', 'mobile'];
        if (searchableFields.includes(field) && value.length > 0) {
            setSmartSearch({ isOpen: true, term: value });
        } else if (value.length === 0) {
            setSmartSearch({ isOpen: false, term: '' });
        }
    };

    const handleSelectClient = (client) => {
        setClientData({
            smartSearch: client.clientName,
            clientNo: client.clientNo,
            groupname: client.groupName,
            surname: client.surname,
            given: client.given,
            title: client.title,
            email: client.email,
            phoneAH: client.phoneAH,
            mobile: client.mobile,
            email2: '',
            blackList: 'No',
            clientType: client.clientType || 'Client',
            company: client.company,
            dateCreated: client.dateCreated || '05 Nov 2025',
            dateModified: client.dateModified || '05 Nov 2025'
        });
        setSmartSearch({ isOpen: false, term: '' });
    };

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

    const smartSearchColumns = [
        { title: 'Client No', dataIndex: 'clientNo', key: 'clientNo', width: 80 },
        { title: 'Groupname', dataIndex: 'groupName', key: 'groupName', width: 120 },
        { title: 'Client Name', dataIndex: 'clientName', key: 'clientName', width: 150 },
        { title: 'Company', dataIndex: 'company', key: 'company', width: 100 },
        { title: 'Address', dataIndex: 'address', key: 'address', width: 150 },
        { title: 'Mobile', dataIndex: 'mobile', key: 'mobile', width: 100 },
        { title: 'Phone AH', dataIndex: 'phoneAH', key: 'phoneAH', width: 100 },
        { title: 'Phone BH', dataIndex: 'phoneBH', key: 'phoneBH', width: 100 },
    ];

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 64px)', backgroundColor: '#f5f5f5', position: 'relative' }}>
            {/* Sidebar Navigation */}
            <div style={{ width: '160px', backgroundColor: '#fff', borderRight: '1px solid #e8e8e8', padding: '16px 0' }}>
                <div style={{ padding: '0 16px 16px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HomeOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
                    <Text strong style={{ fontSize: '14px' }}>Reservation</Text>
                </div>
                <Divider style={{ margin: '0 0 8px 0' }} />
                {sidebarItems.map(item => (
                    <div
                        key={item.key}
                        onClick={() => setSelectedTab(item.key)}
                        style={{
                            padding: '8px 16px',
                            cursor: 'pointer',
                            backgroundColor: selectedTab === item.key ? '#e6f7ff' : 'transparent',
                            borderLeft: selectedTab === item.key ? '3px solid #1890ff' : '3px solid transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ color: selectedTab === item.key ? '#1890ff' : '#8c8c8c', fontSize: '12px' }}>
                            {item.icon}
                        </span>
                        <Text style={{ color: selectedTab === item.key ? '#262626' : '#8c8c8c', fontSize: '12px' }}>
                            {item.label}
                        </Text>
                    </div>
                ))}
            </div>

            {/* Client Panel */}
            <div style={{ width: '380px', backgroundColor: '#fff', borderRight: '1px solid #e8e8e8', padding: '16px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Text strong style={{ fontSize: '16px' }}>Client</Text>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button type="text" size="small" icon={<DollarOutlined />} />
                        <Button type="text" size="small" icon={<UserSwitchOutlined />} />
                        <Button type="text" size="small" icon={<MoreOutlined />} />
                    </div>
                </div>

                <FormField label="RMS SmartSearch" field="smartSearch" clientData={clientData} handleFieldChange={handleFieldChange} setSmartSearch={setSmartSearch} suffix={<SearchOutlined />} />
                <FormField label="Client No" field="clientNo" clientData={clientData} handleFieldChange={handleFieldChange} setSmartSearch={setSmartSearch} suffix={<SearchOutlined />} yellowBg />
                <FormField label="Groupname" field="groupname" clientData={clientData} handleFieldChange={handleFieldChange} setSmartSearch={setSmartSearch} suffix={<SearchOutlined />} />
                <FormField label="Surname" field="surname" clientData={clientData} handleFieldChange={handleFieldChange} setSmartSearch={setSmartSearch} suffix={<SearchOutlined />} />
                <FormField label="Given" field="given" clientData={clientData} handleFieldChange={handleFieldChange} setSmartSearch={setSmartSearch} suffix={<SearchOutlined />} />
                <FormField label="Title" field="title" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={TITLE_OPTIONS} />
                <FormField
                    label="Email"
                    field="email"
                    clientData={clientData}
                    handleFieldChange={handleFieldChange}
                    setSmartSearch={setSmartSearch}
                    suffix={<SearchOutlined />}
                    addonAfter={<Button size="small" type="primary" danger icon={<EllipsisOutlined />} style={{ padding: '0 4px', height: '24px' }} />}
                />
                <FormField label="Phone AH" field="phoneAH" clientData={clientData} handleFieldChange={handleFieldChange} />
                <FormField
                    label="Mobile"
                    field="mobile"
                    clientData={clientData}
                    handleFieldChange={handleFieldChange}
                    setSmartSearch={setSmartSearch}
                    prefixSelect={{ options: MOBILE_TYPE_OPTIONS }}
                />
                <FormField label="Email 2" field="email2" clientData={clientData} handleFieldChange={handleFieldChange} />

                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', alignItems: 'center', marginBottom: '4px', minHeight: '32px' }}>
                    <Text style={{ fontSize: '12px', color: '#262626', paddingRight: '8px' }}>Black List</Text>
                    <Button size="small" style={{ width: '100%', textAlign: 'center', backgroundColor: '#f0f0f0' }}>No</Button>
                </div>

                <FormField label="Date Created" field="dateCreated" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg />
                <FormField label="Date Modified" field="dateModified" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg />
                <FormField label="Client Type" field="clientType" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={CLIENT_TYPE_OPTIONS} />
                <FormField label="Company" field="company" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={COMPANY_OPTIONS} suffix={<SearchOutlined />} />
            </div>

            {/* Main Content Area (Reservation + Account) with Overlay Container */}
            <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>

                {/* Smart Search Overlay */}
                {smartSearch.isOpen && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: '#fff',
                        zIndex: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '-2px 0 8px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong style={{ fontSize: '16px' }}>
                                Client RMS SmartSearch - {filteredClients.length} Found
                            </Text>
                            <Button
                                type="text"
                                icon={<CloseOutlined />}
                                onClick={() => setSmartSearch({ ...smartSearch, isOpen: false })}
                            />
                        </div>
                        <div style={{ flex: 1, overflow: 'auto' }}>
                            <Table
                                columns={smartSearchColumns}
                                dataSource={filteredClients}
                                rowKey="id"
                                pagination={false}
                                size="small"
                                onRow={(record) => ({
                                    onDoubleClick: () => handleSelectClient(record),
                                    style: { cursor: 'pointer' }
                                })}
                            />
                        </div>
                    </div>
                )}

                {/* Reservation Panel */}
                <div style={{ width: '420px', backgroundColor: '#fff', borderRight: '1px solid #e8e8e8', padding: '16px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <Text strong style={{ fontSize: '16px' }}>Reservation</Text>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Button type="text" size="small" icon={<SearchOutlined />} />
                            <Button type="text" size="small" icon={<SaveOutlined />} />
                            <Button type="text" size="small" icon={<MoreOutlined />} />
                        </div>
                    </div>

                    <FormField label="Res No" value="(New Reservation)" yellowBg />
                    <FormField label="Master Res No" value="(New Reservation)" yellowBg />
                    <FormField label="Status" value="Unconfirmed" bgColor="#ffa940" />
                    <FormField label="Arrive" value="Mon, 24 Nov 2025 - 2:00 PM" isDate yellowBg />
                    <FormField label="Depart" value="Tue, 25 Nov 2025 - 10:00 AM" isDate yellowBg />
                    <FormField label="Nights" value="1" />
                    <FormField label="Adults" value="1" />
                    <FormField label="Total Nights" value="" yellowBg />
                    <FormField label="Tariff Type" value="Occupied Room Rate PRPN" isDropdown bgColor="#e6f7ff" />
                    <FormField label="Room Type" value="Staff Accommodation" isDropdown bgColor="#e6f7ff" />
                    <FormField label="Area" value="01 Manager" isDropdown bgColor="#e6f7ff" />
                    <FormField label="Bkg Source" value="" isDropdown />
                    <FormField label="Fixed" value="Yes" bgColor="#b7eb8f" />
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
                <div style={{ width: '320px', backgroundColor: '#fff', padding: '16px', overflowY: 'auto' }}>
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
        </div>
    );
};

export default ReservationsListPage;
