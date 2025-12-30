import React, { useState, useMemo, useEffect } from 'react';
import { Input, Select, DatePicker, Button, Typography, Divider, Table, AutoComplete } from 'antd';
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
import { useSearchParams } from 'react-router-dom';
import { mockClients } from '../data/mockClients';
import { COUNTRY_CODES } from '../data/countryCodes';

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const TITLE_OPTIONS = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Sr', 'Jr'];
const CLIENT_TYPE_OPTIONS = ['Client', 'Contractor', 'Sales Lead', 'Staff'];
const TARIFF_TYPE_OPTIONS = ["Occupied Room Rate PRPN", "Rack Rate", "Corporate Rate"];
const ROOM_TYPE_OPTIONS = ["Staff Accommodation", "Standard Ensuite Benjamin", "Standard Ensuite Shiel", "Standard Ensuite Wallace"];
const STATUS_OPTIONS = ['Unconfirmed', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled'];
const BKG_SOURCE_OPTIONS = ["Contracted with Meals", "Contracted Hold Night", "Non-Contracted", "Room Only - NO MEALS", "WalkIn"];
const VOUCHER_OPTIONS = ["V-1001", "V-1002", "V-1003"];
const AREA_OPTIONS = [
    // Staff Accommodation
    { area: '01 Manager', cleanStatus: 'Clean', description: '', resCount: 5, category: 'Staff Accommodation' },
    { area: '02 Other Staff', cleanStatus: 'Clean', description: '', resCount: 3, category: 'Staff Accommodation' },

    // Standard Ensuite Benjamin
    { area: 'B01', cleanStatus: 'Dirty', description: '', resCount: 11, category: 'Standard Ensuite Benjamin' },
    { area: 'B02', cleanStatus: 'Dirty', description: '', resCount: 13, category: 'Standard Ensuite Benjamin' },
    { area: 'B03', cleanStatus: 'Clean', description: '', resCount: 12, category: 'Standard Ensuite Benjamin' },
    { area: 'B04', cleanStatus: 'Clean', description: '', resCount: 11, category: 'Standard Ensuite Benjamin' },
    { area: 'B05', cleanStatus: 'Clean', description: '', resCount: 11, category: 'Standard Ensuite Benjamin' },
    { area: 'B06', cleanStatus: 'Dirty', description: '', resCount: 12, category: 'Standard Ensuite Benjamin' },
    { area: 'B07', cleanStatus: 'Clean', description: '', resCount: 8, category: 'Standard Ensuite Benjamin' },
    { area: 'B08', cleanStatus: 'Clean', description: '', resCount: 13, category: 'Standard Ensuite Benjamin' },
    { area: 'B09', cleanStatus: 'Clean', description: '', resCount: 13, category: 'Standard Ensuite Benjamin' },

    // Standard Ensuite Shiel
    { area: 'S01', cleanStatus: 'Clean', description: '', resCount: 6, category: 'Standard Ensuite Shiel' },
    { area: 'S02', cleanStatus: 'Dirty', description: '', resCount: 4, category: 'Standard Ensuite Shiel' },
    { area: 'S03', cleanStatus: 'Clean', description: '', resCount: 2, category: 'Standard Ensuite Shiel' },
    { area: 'S04', cleanStatus: 'Clean', description: '', resCount: 5, category: 'Standard Ensuite Shiel' },
    { area: 'S05', cleanStatus: 'Clean', description: '', resCount: 7, category: 'Standard Ensuite Shiel' },
    { area: 'S06', cleanStatus: 'Clean', description: '', resCount: 3, category: 'Standard Ensuite Shiel' },
    { area: 'S07', cleanStatus: 'Clean', description: '', resCount: 1, category: 'Standard Ensuite Shiel' },
    { area: 'S08', cleanStatus: 'Clean', description: '', resCount: 0, category: 'Standard Ensuite Shiel' },

    // Standard Ensuite Wallace
    { area: 'W01', cleanStatus: 'Dirty', description: '', resCount: 9, category: 'Standard Ensuite Wallace' },
    { area: 'W02', cleanStatus: 'Clean', description: '', resCount: 8, category: 'Standard Ensuite Wallace' },
    { area: 'W03', cleanStatus: 'Clean', description: '', resCount: 7, category: 'Standard Ensuite Wallace' },
    { area: 'W04', cleanStatus: 'Clean', description: '', resCount: 10, category: 'Standard Ensuite Wallace' },
    { area: 'W05', cleanStatus: 'Clean', description: '', resCount: 5, category: 'Standard Ensuite Wallace' },
    { area: 'W06', cleanStatus: 'Dirty', description: '', resCount: 4, category: 'Standard Ensuite Wallace' },
    { area: 'W07', cleanStatus: 'Clean', description: '', resCount: 6, category: 'Standard Ensuite Wallace' },
    { area: 'W08', cleanStatus: 'Clean', description: '', resCount: 3, category: 'Standard Ensuite Wallace' },
];
const COMPANY_OPTIONS = [
    { name: 'Heritage Minerals', address: '123 Mineral Way', creditHold: 'No', tradingAs: 'HM' },
    { name: 'Mt Morgan Hospital', address: '45 Hospital St', creditHold: 'Yes', tradingAs: 'MMH' },
    { name: 'QPS Mount Morgan', address: '89 Police Rd', creditHold: 'Yes', tradingAs: 'QPS' },
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
    isRange = false,
    isAutoComplete = false,
    suffix,
    addonAfter,
    prefixSelect,
    labelStyle = {},
    yellowBg = false,
    disabled = false
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
                textDecoration: label === 'Company' ? 'underline' : 'none',
                cursor: label === 'Company' ? 'pointer' : 'default',
                ...labelStyle
            }}>
                {label}
            </Text>
            <div style={{ display: 'flex', width: '100%', gap: '4px', alignItems: 'center' }}>
                {prefixSelect && (
                    prefixSelect.isAutoComplete ? (
                        <AutoComplete
                            value={prefixSelect.value}
                            onChange={prefixSelect.onChange}
                            options={prefixSelect.options.map(opt => ({ value: opt.code }))}
                            style={{ width: prefixSelect.width || '80px' }}
                            size="small"
                            placeholder="Code"
                            filterOption={(inputValue, option) =>
                                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                        />
                    ) : (
                        <Select
                            value={prefixSelect.value}
                            onChange={prefixSelect.onChange}
                            style={{ width: prefixSelect.width || '80px' }}
                            size="small"
                            suffixIcon={<CaretDownOutlined style={{ fontSize: '10px' }} />}
                            dropdownMatchSelectWidth={false}
                        >
                            {prefixSelect.options.map(opt => (
                                <Option key={opt.code} value={opt.code}>
                                    {opt.code}
                                </Option>
                            ))}
                        </Select>
                    )
                )}
                <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
                    {isRange ? (
                        <RangePicker
                            value={[
                                clientData?.arrive ? dayjs(clientData.arrive) : null,
                                clientData?.depart ? dayjs(clientData.depart) : null
                            ]}
                            onChange={(dates) => {
                                handleFieldChange?.('bookingDates', dates);
                            }}
                            format="ddd, D MMM YYYY - h:mm A"
                            showTime={{
                                format: 'h:mm A',
                                use12Hours: true,
                                // This sets the default position of the clock for Arrive and Depart
                                defaultValue: [
                                    dayjs('14:00', 'HH:mm'),
                                    dayjs('10:00', 'HH:mm')
                                ]
                            }}
                            style={{ width: '100%', backgroundColor: finalBgColor }}
                            size="small"
                            placeholder={['Arrive', 'Depart']}
                        // Removed disabledDate so you can select previous dates
                        />
                    ) : isAutoComplete ? (
                        <AutoComplete
                            value={displayValue}
                            options={options.map(opt => ({ value: opt }))}
                            onChange={(val) => handleFieldChange?.(field, val)}
                            style={{ width: '100%' }}
                            size="small"
                            disabled={disabled}
                            placeholder={label}
                            filterOption={(inputValue, option) =>
                                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                        />
                    ) : isDropdown ? (
                        <Select
                            value={displayValue}
                            onChange={(val) => handleFieldChange?.(field, val)}
                            style={{ width: '100%' }}
                            size="small"
                            disabled={disabled}
                            suffixIcon={suffix || <CaretDownOutlined style={{ fontSize: '10px' }} />}
                            dropdownMatchSelectWidth={['Company', 'Area'].includes(label) ? false : true}
                            optionLabelProp={['Company', 'Area'].includes(label) ? "label" : undefined}
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
                            ) : label === 'Area' ? (menu) => (
                                <div style={{ minWidth: '600px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', backgroundColor: '#fff', borderRadius: '4px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '150px 150px 200px 100px', padding: '8px', backgroundColor: '#f5f5f5', fontWeight: 'bold', fontSize: '11px', borderBottom: '1px solid #e8e8e8' }}>
                                        <span>Area</span>
                                        <span>Clean Status</span>
                                        <span>AreaDescription</span>
                                        <span>Res Count</span>
                                    </div>
                                    {menu}
                                </div>
                            ) : undefined}
                        >
                            {options.length > 0 ? (
                                options.map(opt => (
                                    <Option
                                        key={typeof opt === 'string' ? opt : (opt.name || opt.area)}
                                        value={typeof opt === 'string' ? opt : (opt.name || opt.area)}
                                        label={typeof opt === 'string' ? opt : (opt.name || opt.area)}
                                    >
                                        {typeof opt === 'string' ? opt : label === 'Company' ? (
                                            <div style={{ display: 'grid', gridTemplateColumns: '200px 150px 100px 150px', fontSize: '11px' }}>
                                                <span>{opt.name}</span>
                                                <span>{opt.address}</span>
                                                <span>{opt.creditHold}</span>
                                                <span>{opt.tradingAs}</span>
                                            </div>
                                        ) : label === 'Area' ? (
                                            <div style={{ display: 'grid', gridTemplateColumns: '150px 150px 200px 100px', fontSize: '11px' }}>
                                                <span>{opt.area}</span>
                                                <span>{opt.cleanStatus}</span>
                                                <span>{opt.description}</span>
                                                <span>{opt.resCount}</span>
                                            </div>
                                        ) : (opt.name || opt.area)}
                                    </Option>
                                ))
                            ) : (
                                <Option value={displayValue} label={displayValue}>{displayValue}</Option>
                            )}
                        </Select>
                    ) : isDate ? (
                        <DatePicker
                            value={displayValue ? dayjs(displayValue) : null}
                            onChange={(val) => handleFieldChange?.(field, val)}
                            format="ddd, D MMM YYYY - h:mm A"
                            showTime={{ format: 'h:mm A', use12Hours: true }}
                            style={{ width: '100%', backgroundColor: finalBgColor }}
                            size="small"
                        />
                    ) : (
                        <Input
                            value={displayValue}
                            onChange={(e) => handleFieldChange?.(field, e.target.value)}
                            disabled={disabled}
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
    const [searchParams] = useSearchParams();

    // Extract values from query params
    const arriveParam = searchParams.get('arrive');
    const areaParam = searchParams.get('area');
    const roomTypeParam = searchParams.get('roomType');

    // --- State for Form Fields ---
    const [clientData, setClientData] = useState({
        smartSearch: '',
        clientNo: '',
        groupname: '',
        surname: '',
        given: '',
        title: '',
        email: '',
        phoneAH: '',
        mobile: '',
        mobilePrefix: '+61',
        email2: '',
        blackList: '',
        clientType: '',
        company: '',
        dateCreated: '',
        dateModified: '',
        // Reservation fields
        resNo: '(New Reservation)',
        masterResNo: '(New Reservation)',
        status: 'Unconfirmed',
        arrive: arriveParam ? dayjs(arriveParam).hour(14).minute(0).second(0).toDate() : dayjs('2026-02-04').hour(14).minute(0).toDate(),
        depart: arriveParam ? dayjs(arriveParam).add(1, 'day').hour(10).minute(0).second(0).toDate() : dayjs('2026-02-05').hour(10).minute(0).toDate(),
        nights: 1,
        adults: 1,
        tariffType: 'Occupied Room Rate PRPN',
        roomType: roomTypeParam || 'Standard Ensuite Benjamin',
        area: areaParam || 'B01',
        bkgSource: 'Contracted with Meals',
        fixed: 'Yes',
        voucherNo: '',
        madeBy: 'Super Admin',
        dateMade: '',
        cancelled: '',
        cancelledBy: '',
        confirmed: '',
        confirmedBy: '',
        accountNo: '(New Account)',
        baseTariff: '200.00 / 200.00',
        package: '0.00 / 0.00',
        totalTariff: '200.00 / 200.00',
        avgUpgradeTariff: '0.00',
        accomm: '0.00',
        ar: '0.00',
        activeAccounts: '(None)'
    });

    // Update state when query params change
    useEffect(() => {
        if (arriveParam || areaParam || roomTypeParam) {
            setClientData(prev => ({
                ...prev,
                arrive: arriveParam ? dayjs(arriveParam).hour(14).minute(0).second(0).toDate() : prev.arrive,
                depart: arriveParam ? dayjs(arriveParam).add(1, 'day').hour(10).minute(0).second(0).toDate() : prev.depart,
                area: areaParam || prev.area,
                roomType: roomTypeParam || prev.roomType,
                nights: 1
            }));
        }
    }, [arriveParam, areaParam, roomTypeParam]);

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

    const filteredAreaOptions = useMemo(() => {
        return AREA_OPTIONS.filter(opt => opt.category === clientData.roomType);
    }, [clientData.roomType]);

    const handleFieldChange = (field, value) => {
        setClientData(prev => {
            const newData = { ...prev, [field]: value };

            if (field === 'roomType') {
                const firstAreaMatch = AREA_OPTIONS.find(opt => opt.category === value);
                if (firstAreaMatch) {
                    newData.area = firstAreaMatch.area;
                } else {
                    newData.area = '';
                }
            }

            // Trigger Smart Search if the field has a search icon (for client-related fields)
            const clientSearchFields = ['smartSearch', 'clientNo', 'groupname', 'surname', 'given', 'email', 'mobile'];
            if (clientSearchFields.includes(field)) {
                if (typeof value === 'string' && value.length > 0) {
                    setSmartSearch({ isOpen: true, term: value });
                } else if (!value) {
                    setSmartSearch({ isOpen: false, term: '' });
                }
            }

            // Auto-calculation logic for nights and default times
            if (field === 'bookingDates') {
                if (value && value[0] && value[1]) {
                    let arrive = dayjs(value[0]);
                    let depart = dayjs(value[1]);

                    // 1. Apply Default Times if they haven't been set by the user yet
                    // Ant Design defaults to 00:00 if only a date is clicked.
                    if (arrive.hour() === 0 && arrive.minute() === 0) {
                        arrive = arrive.hour(14).minute(0).second(0);
                    }
                    if (depart.hour() === 0 && depart.minute() === 0) {
                        depart = depart.hour(10).minute(0).second(0);
                    }

                    // 2. Enforce Minimum 1 Night stay
                    // If the user selects the same day or a day before, 
                    // we force the departure to be the next day at 10 AM.
                    if (depart.isBefore(arrive, 'day') || depart.isSame(arrive, 'day')) {
                        depart = arrive.add(1, 'day').hour(10).minute(0).second(0);
                    }

                    newData.arrive = arrive.toDate();
                    newData.depart = depart.toDate();
                    newData.nights = depart.startOf('day').diff(arrive.startOf('day'), 'day');
                } else {
                    // Handle clear action
                    newData.arrive = null;
                    newData.depart = null;
                    newData.nights = 0;
                }
            }

            return newData;
        });
    };

    const handleSelectClient = (client) => {
        setClientData(prev => ({
            ...prev,
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
        }));
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
            <div style={{ width: '450px', backgroundColor: '#fff', borderRight: '1px solid #e8e8e8', padding: '16px', overflowY: 'auto' }}>
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
                    prefixSelect={{
                        value: clientData.mobilePrefix,
                        onChange: (val) => handleFieldChange('mobilePrefix', val),
                        options: COUNTRY_CODES,
                        width: '85px',
                        isAutoComplete: true
                    }}
                />
                <FormField label="Email 2" field="email2" clientData={clientData} handleFieldChange={handleFieldChange} />

                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', alignItems: 'center', marginBottom: '4px', minHeight: '32px' }}>
                    <Text style={{ fontSize: '12px', color: '#262626', paddingRight: '8px' }}>Black List</Text>
                    <Button size="small" style={{ width: '100%', textAlign: 'center', backgroundColor: '#f0f0f0' }}>No</Button>
                </div>

                <FormField label="Date Created" field="dateCreated" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                <FormField label="Date Modified" field="dateModified" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
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
                <div style={{ width: '520px', backgroundColor: '#fff', borderRight: '1px solid #e8e8e8', padding: '16px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <Text strong style={{ fontSize: '16px' }}>Reservation</Text>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Button type="text" size="small" icon={<SearchOutlined />} />
                            <Button type="text" size="small" icon={<SaveOutlined />} />
                            <Button type="text" size="small" icon={<MoreOutlined />} />
                        </div>
                    </div>

                    <FormField label="Res No" field="resNo" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Master Res No" field="masterResNo" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Status" field="status" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={STATUS_OPTIONS} bgColor="#ffa940" />
                    <FormField label="Stay Dates" field="bookingDates" clientData={clientData} handleFieldChange={handleFieldChange} isRange yellowBg />
                    <FormField label="Nights" field="nights" clientData={clientData} handleFieldChange={handleFieldChange} type="number" />
                    <FormField label="Adults" field="adults" clientData={clientData} handleFieldChange={handleFieldChange} type="number" />
                    <FormField label="Tariff Type" field="tariffType" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={TARIFF_TYPE_OPTIONS} />
                    <FormField label="Room Type" field="roomType" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={ROOM_TYPE_OPTIONS} />
                    <FormField label="Area" field="area" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={filteredAreaOptions} />
                    <FormField label="Bkg Source" field="bkgSource" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={BKG_SOURCE_OPTIONS} />
                    <FormField label="Fixed" field="fixed" clientData={clientData} handleFieldChange={handleFieldChange} bgColor="#b7eb8f" />
                    <FormField label="Company" field="company" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={COMPANY_OPTIONS} suffix={<SearchOutlined style={{ fontSize: '10px' }} />} />
                    <FormField label="Voucher No" field="voucherNo" clientData={clientData} handleFieldChange={handleFieldChange} isAutoComplete options={VOUCHER_OPTIONS} />
                    <FormField label="Made By" field="madeBy" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Date Made" field="dateMade" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Cancelled" field="cancelled" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Cancelled By" field="cancelledBy" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Confirmed" field="confirmed" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Confirmed By" field="confirmedBy" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
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

                    <FormField label="Account No" field="accountNo" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Base Tariff" field="baseTariff" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Package" field="package" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Total Tariff" field="totalTariff" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Tariff On Master" value="Yes" bgColor="#b7eb8f" />
                    <FormField label="Deposit" value="XXXX" />
                    <FormField label="Dep Req By" value="Sun, 23 Nov 2025" />
                    <FormField label="POS On Master" value="No" />
                    <FormField label="Bill Room Type" value="" isDropdown />
                    <FormField label="Upgrade Reason" value="" isDropdown />
                    <FormField label="Hide Tariff On Correspondence" value="No" />
                    <FormField label="Avg Upgrade Tariff" field="avgUpgradeTariff" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Accomm" field="accomm" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="A/R" field="ar" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Active Accounts" field="activeAccounts" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                </div>
            </div>
        </div>
    );
};

export default ReservationsListPage;
