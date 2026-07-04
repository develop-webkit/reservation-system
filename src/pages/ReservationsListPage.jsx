import React, { useState, useMemo, useEffect } from 'react';
import { Input, Select, DatePicker, Button, Typography, Divider, Table, AutoComplete, Spin, Tag } from 'antd';
import {
    HomeOutlined,
    UserOutlined,
    SearchOutlined,
    SaveOutlined,
    CloseOutlined,
    CaretDownOutlined,
    EllipsisOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { message } from 'antd'; // Added message import
import ClientFormDrawer from '../components/clients/ClientFormDrawer.jsx';
import { useRooms } from '../hooks/useRooms';
import { useCreateReservation, useUpdateReservation, useReservations } from '../hooks/useReservations';
import { useUpdateRoomStatus } from '../hooks/useRooms';
import { useBookings } from '../hooks/useBookings';
import { useClients, useUpdateClient } from '../hooks/useClients';
import { useCompanies } from '../hooks/useCompanies';
import { useVouchers } from '../hooks/useVouchers';
import { useSearchGroupMembers } from '../hooks/useClientGroups';
import useAuthStore, { selectCurrentUser } from '../store/authStore.js';
import { COUNTRY_CODES } from '../data/countryCodes';
import {
    TITLE_OPTIONS,
    CLIENT_TYPE_OPTIONS,
    TARIFF_TYPE_OPTIONS,
    STATUS_OPTIONS,
    BKG_SOURCE_OPTIONS
} from '../data/options';

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;


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
    disabled = false,
    error = null,
}) => {
    const displayValue = field ? clientData?.[field] : value;
    const finalBgColor = yellowBg ? '#fffbe6' : bgColor;
    const hasError = Boolean(error);

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '140px 1fr',
            alignItems: 'start',
            marginBottom: hasError ? '8px' : '4px',
            minHeight: '32px'
        }}>
            <Text style={{
                fontSize: '12px',
                color: '#262626',
                paddingRight: '8px',
                paddingTop: '4px',
                textAlign: 'left',
                textDecoration: label === 'Company' ? 'underline' : 'none',
                cursor: label === 'Company' ? 'pointer' : 'default',
                ...labelStyle
            }}>
                {label}
                {hasError && <span style={{ color: '#ff4d4f', marginLeft: 2 }}>*</span>}
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 0 }}>
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
                                defaultValue: [
                                    dayjs('15:00', 'HH:mm'),
                                    dayjs('06:00', 'HH:mm')
                                ]
                            }}
                            style={{ width: '100%', backgroundColor: finalBgColor }}
                            size="small"
                            status={hasError ? 'error' : ''}
                            placeholder={['Arrive', 'Depart']}
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
                            status={hasError ? 'error' : ''}
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
                                    <div style={{ display: 'grid', gridTemplateColumns: '80px 80px 100px 50px 80px 120px 80px', padding: '8px', backgroundColor: '#f5f5f5', fontWeight: 'bold', fontSize: '11px', borderBottom: '1px solid #e8e8e8' }}>
                                        <span>Area</span>
                                        <span>Status</span>
                                        <span>Description</span>
                                        <span>Res #</span>
                                        <span>Out Order</span>
                                        <span>Last Clean</span>
                                        <span>Days Dirty</span>
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
                                            <div style={{ display: 'grid', gridTemplateColumns: '80px 80px 100px 50px 80px 120px 80px', fontSize: '11px' }}>
                                                <span>{opt.area}</span>
                                                <span>{opt.cleanStatus}</span>
                                                <span>{opt.description}</span>
                                                <span>{opt.resCount}</span>
                                                <span style={{ color: opt.outOfOrder === 'Yes' ? 'red' : 'inherit' }}>{opt.outOfOrder}</span>
                                                <span>{opt.lastCleanDate}</span>
                                                <span style={{ color: opt.daysSinceLastClean > 3 ? 'orange' : 'inherit' }}>{opt.daysSinceLastClean}</span>
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
                            status={hasError ? 'error' : ''}
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
                </div>{/* closes position:relative div */}
            </div>{/* closes row flex div */}
            {hasError && (
                <span style={{ fontSize: '11px', color: '#ff4d4f', marginTop: '2px', lineHeight: 1.3 }}>
                    {error}
                </span>
            )}
            </div>{/* closes column wrapper div */}
        </div>
    );
};

const ReservationsListPage = () => {
    const currentUser = useAuthStore(selectCurrentUser);
    const isPortalUser = currentUser?.role === 'portal_user';
    const [selectedTab, setSelectedTab] = useState('Reservation');
    const [savedReservationId, setSavedReservationId] = useState(null);
    const [ownClientDrawerOpen, setOwnClientDrawerOpen] = useState(false);
    const [searchParams] = useSearchParams();

    // Extract values from query params
    const arriveParam = searchParams.get('arrive');
    const areaParam = searchParams.get('area');
    const roomTypeParam = searchParams.get('roomType');
    const reservationIdParam = searchParams.get('reservationId');
    const resNoParam = searchParams.get('resNo');
    const masterResNoParam = searchParams.get('masterResNo');
    const departParam = searchParams.get('depart');
    const givenParam = searchParams.get('given');
    const surnameParam = searchParams.get('surname');
    const statusParam = searchParams.get('status');
    const peopleParam = searchParams.get('people');
    const companyParam = searchParams.get('company');
    const bkgSourceParam = searchParams.get('bkgSource');
    const tariffTypeParam = searchParams.get('tariffType');
    const totalTariffParam = searchParams.get('totalTariff');
    const fixedParam = searchParams.get('fixed');
    const groupnameParam = searchParams.get('groupname');
    const clientIdParam = searchParams.get('clientId');

    // --- Hooks for Data and Mutation ---
    const { data: roomsFromApi } = useRooms();
    const { data: companiesFromApi } = useCompanies();
    // GET /vouchers is ADMIN/MANAGER/USER-only on the backend — skip it for portal_user
    // rather than let it 403 on every load (its only consumer, Voucher No, is hidden below).
    const { data: vouchersFromApi } = useVouchers({ enabled: !isPortalUser });
    const { data: clientsFromApi } = useClients();
    const { data: reservationsFromApi } = useReservations();
    const { data: bookingsFromApi } = useBookings();
    const createReservationMutation = useCreateReservation();
    const updateReservationMutation = useUpdateReservation();
    const updateRoomStatusMutation = useUpdateRoomStatus();
    const updateClientMutation = useUpdateClient();

    const isSaving = createReservationMutation.isPending || updateReservationMutation.isPending || updateRoomStatusMutation.isPending;

    // --- Data Normalization ---
    const allRooms = useMemo(() => {
        if (!roomsFromApi) return [];
        return Array.isArray(roomsFromApi) ? roomsFromApi : (roomsFromApi.data || roomsFromApi.rooms || []);
    }, [roomsFromApi]);

    const allReservations = useMemo(() => {
        if (!reservationsFromApi) return [];
        return Array.isArray(reservationsFromApi) ? reservationsFromApi : (reservationsFromApi.data || reservationsFromApi.reservations || []);
    }, [reservationsFromApi]);

    const allBookings = useMemo(() => {
        if (!bookingsFromApi) return [];
        return Array.isArray(bookingsFromApi) ? bookingsFromApi : (bookingsFromApi.data || bookingsFromApi.bookings || []);
    }, [bookingsFromApi]);

    const allCompanies = useMemo(() => {
        if (!companiesFromApi) return [];
        return Array.isArray(companiesFromApi) ? companiesFromApi : (companiesFromApi.data || []);
    }, [companiesFromApi]);

    const allVouchers = useMemo(() => {
        if (!vouchersFromApi) return [];
        const items = Array.isArray(vouchersFromApi) ? vouchersFromApi : (vouchersFromApi.data || []);
        return items.map(v => typeof v === 'object' ? v.code : v);
    }, [vouchersFromApi]);

    const allClients = useMemo(() => {
        if (!clientsFromApi) return [];
        return Array.isArray(clientsFromApi) ? clientsFromApi : (clientsFromApi.data || []);
    }, [clientsFromApi]);

    // UI Options mapping
    const dynamicAreaOptions = useMemo(() => {
        return allRooms.map(room => ({
            area: room.name,
            cleanStatus: room.status || 'Clean',
            description: room.category || '',
            resCount: 0,
            category: room.category,
            outOfOrder: room.status === 'Out of Order' ? 'Yes' : 'No',
            lastCleanDate: room.updatedAt ? dayjs(room.updatedAt).format('YYYY-MM-DD') : '-',
            daysSinceLastClean: 0,
            _id: room._id || room.id
        }));
    }, [allRooms]);

    const dynamicRoomTypeOptions = useMemo(() => {
        const categories = allRooms.map(r => r.category).filter(Boolean);
        return [...new Set(categories)];
    }, [allRooms]);

    const dynamicCompanyOptions = useMemo(() => {
        return allCompanies.map(c => ({
            name: c.name,
            address: c.address || '',
            creditHold: c.creditHold ? 'Yes' : 'No',
            tradingAs: c.tradingAs || '',
            _id: c._id || c.id
        }));
    }, [allCompanies]);

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
        arrive: arriveParam ? dayjs(arriveParam).hour(15).minute(0).second(0).toDate() : dayjs().hour(15).minute(0).second(0).toDate(),
        depart: arriveParam ? dayjs(arriveParam).add(1, 'day').hour(6).minute(0).second(0).toDate() : dayjs().add(1, 'day').hour(6).minute(0).second(0).toDate(),
        nights: 1,
        adults: 1,
        tariffType: 'Occupied Room Rate PRPN',
        roomType: roomTypeParam || 'Standard Ensuite Benjamin',
        area: areaParam || 'B01',
        bkgSource: 'Contracted with Meals',
        fixed: 'Yes',
        voucherNo: '',
        madeBy: isPortalUser ? 'Client' : 'Admin',
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
        activeAccounts: '(None)',
        clientId: '',
        companyId: '',
        children: 0,
        infants: 0
    });

    const [fieldErrors, setFieldErrors] = useState({});

    const clearFieldError = (field) => {
        if (field && fieldErrors[field]) {
            setFieldErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
        }
    };

    // Update state when query params change
    useEffect(() => {
        if (arriveParam || areaParam || roomTypeParam || resNoParam || givenParam || surnameParam) {
            setClientData(prev => ({
                ...prev,
                // Reservation fields from booking
                resNo: resNoParam || prev.resNo,
                masterResNo: masterResNoParam || prev.masterResNo,
                // Dates
                arrive: arriveParam ? dayjs(arriveParam).hour(15).minute(0).second(0).toDate() : prev.arrive,
                depart: departParam ? dayjs(departParam).hour(6).minute(0).second(0).toDate() : (arriveParam ? dayjs(arriveParam).add(1, 'day').hour(6).minute(0).second(0).toDate() : prev.depart),
                area: areaParam || prev.area,
                roomType: roomTypeParam || prev.roomType,
                // Client fields
                given: givenParam || prev.given,
                surname: surnameParam || prev.surname,
                // Other reservation fields
                status: statusParam || prev.status,
                people: peopleParam || prev.people,
                company: companyParam || prev.company,
                bkgSource: bkgSourceParam || prev.bkgSource,
                tariffType: tariffTypeParam || prev.tariffType,
                totalTariff: totalTariffParam || prev.totalTariff,
                fixed: fixedParam || prev.fixed,
                groupname: groupnameParam || prev.groupname,
                nights: 1
            }));
        }
    }, [arriveParam, areaParam, roomTypeParam, resNoParam, masterResNoParam, departParam, givenParam, surnameParam, statusParam, peopleParam, companyParam, bkgSourceParam, tariffTypeParam, totalTariffParam, fixedParam, groupnameParam]);

    // Auto-select client from SmartSearch when clientIdParam is provided
    useEffect(() => {
        if (clientIdParam && allClients.length > 0) {
            const selectedClient = allClients.find(c => c._id === clientIdParam || c.id === clientIdParam);
            if (selectedClient) {
                handleSelectClient(selectedClient);
            }
        }
    }, [clientIdParam, allClients]);

    // --- State for Smart Search ---
    const [smartSearch, setSmartSearch] = useState({
        isOpen: false,
        term: '',
    });

    // Group members are searched server-side — the backend scopes results to the
    // logged-in client's own members, or to all members for admin/manager.
    const { data: memberSearchResults } = useSearchGroupMembers(smartSearch.term);

    const filteredClients = useMemo(() => {
        if (!smartSearch.term) return [];
        const term = smartSearch.term.toLowerCase();
        return allClients.filter(c =>
            (c.clientName || '').toLowerCase().includes(term) ||
            (c.surname || '').toLowerCase().includes(term) ||
            (c.clientNo || '').includes(term) ||
            (c.email || '').toLowerCase().includes(term)
        );
    }, [smartSearch.term, allClients]);

    // Combine client records with group members (staff added via Group Management)
    // into one SmartSearch result list. Each row is tagged with its source so
    // double-click can route to the right selection handler.
    const smartSearchResults = useMemo(() => {
        const memberRows = (memberSearchResults || []).map(m => ({
            ...m,
            key: `member-${m.staffId}`,
            _source: 'member',
            clientNo: m.linkedClientNo,
            clientName: m.name,
            company: m.companyName,
            mobile: m.phone,
        }));
        const clientRows = filteredClients.map(c => ({
            ...c,
            key: `client-${c._id || c.id || c.clientNo}`,
            _source: 'client',
        }));
        return [...memberRows, ...clientRows];
    }, [memberSearchResults, filteredClients]);

    const filteredAreaOptions = useMemo(() => {
        return dynamicAreaOptions.filter(opt => opt.category === clientData.roomType);
    }, [clientData.roomType, dynamicAreaOptions]);

    const handleFieldChange = (field, value) => {
        // Map bookingDates to the individual arrive/depart field error keys
        const errorKey = field === 'bookingDates' ? 'bookingDates' : field;
        clearFieldError(errorKey);

        setClientData(prev => {
            const newData = { ...prev, [field]: value };

            if (field === 'roomType') {
                const firstAreaMatch = dynamicAreaOptions.find(opt => opt.category === value);
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
                        arrive = arrive.hour(15).minute(0).second(0);
                    }
                    if (depart.hour() === 0 && depart.minute() === 0) {
                        depart = depart.hour(6).minute(0).second(0);
                    }

                    // 2. Enforce Minimum 1 Night stay
                    // If the user selects the same day or a day before,
                    // we force the departure to be the next day at 6 AM.
                    if (depart.isBefore(arrive, 'day') || depart.isSame(arrive, 'day')) {
                        depart = arrive.add(1, 'day').hour(6).minute(0).second(0);
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
            smartSearch: client.clientName || `${client.given || ''} ${client.surname || ''}`.trim(),
            clientNo: client.clientNo,
            masterResNo: client.clientNo, // Sourced from MMV SmartSearch per user request
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
            company:
                typeof client.company === 'object'
                    ? (client.company?.name || client.company?.tradingAs)
                    : (client.company || client.companyName),
            companyId: typeof client.company === 'object' ? client.company?._id : client.company,
            clientId: client._id || client.id,
            dateCreated: client.createdAt ? dayjs(client.createdAt).format('DD MMM YYYY') : '05 Nov 2025',
            dateModified: client.updatedAt ? dayjs(client.updatedAt).format('DD MMM YYYY') : '05 Nov 2025'
        }));
        setSmartSearch({ isOpen: false, term: '' });
    };

    // Selecting a group member fills the client/company fields from the client
    // they're linked to (same as handleSelectClient), then overrides the guest
    // identity fields with the member's own details.
    const handleSelectMember = (member) => {
        const matchedClient = allClients.find(c => c.clientNo === member.linkedClientNo);
        if (matchedClient) {
            handleSelectClient(matchedClient);
        } else {
            message.warning(`No client record found for "${member.name}" (${member.linkedClientNo}).`);
        }

        const [given, ...surnameParts] = (member.name || '').trim().split(' ');

        setClientData(prev => ({
            ...prev,
            smartSearch: member.name || prev.smartSearch,
            given: given || prev.given,
            surname: surnameParts.join(' ') || prev.surname,
            email: member.email || prev.email,
            mobile: member.phone || prev.mobile,
            groupname: member.groupName || prev.groupname,
        }));
        setSmartSearch({ isOpen: false, term: '' });
    };

    // "Client" sidebar tab — jump straight to the logged-in user's own client
    // record instead of a separate client-selection screen.
    const handleOpenOwnClient = () => {
        const ownClient = allClients.find(c => c.clientNo === currentUser?.linkedClientNo);
        if (!ownClient) {
            message.info('No client record is linked to your account.');
            return;
        }
        setOwnClientDrawerOpen(true);
    };

    const handleUpdateOwnClient = async (values) => {
        const ownClient = allClients.find(c => c.clientNo === currentUser?.linkedClientNo);
        if (!ownClient) return;
        await updateClientMutation.mutateAsync({ id: ownClient._id, data: values });
        message.success('Client details updated.');
        setOwnClientDrawerOpen(false);
    };

    const handleSaveReservation = () => {
        // Collect all field errors at once so the user sees everything wrong at once
        const errors = {};

        if (!clientData.arrive || !clientData.depart) {
            errors.bookingDates = 'Please select valid stay dates (Arrive and Depart).';
        }
        if (!clientData.area) {
            errors.area = 'Area (Room) is required.';
        }
        if (!clientData.surname) {
            errors.surname = 'Surname is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            message.error('Please fill in all required fields.');
            return;
        }

        setFieldErrors({});

        // Find room ID - check API rooms first
        const selectedRoom = allRooms.find(r => r.name === clientData.area);

        if (!selectedRoom) {
            message.error(`Selected room '${clientData.area}' not found.`);
            return;
        }

        const arriveDate = dayjs(clientData.arrive);
        const departDate = dayjs(clientData.depart);

        // --- GUID Check: Ensure room ID is a valid MongoDB ObjectId ---
        const mongoRoomId = selectedRoom._id || selectedRoom.id;
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(mongoRoomId);

        if (!isMongoId) {
            message.error(`Room ID error: '${mongoRoomId}' is not a valid database ID. Please wait for rooms to load.`);
            return;
        }

        // ========== DOUBLE-BOOKING CHECK (Using BOOKINGS, not Reservations) ==========
        // Check if there's already a booking on this room for the requested dates
        // Bookings represent actual chart occupancy (excludes parked/hidden reservations)
        const newArriveDate = arriveDate.format('YYYY-MM-DD');
        const newDepartDate = departDate.format('YYYY-MM-DD');

        const isCanceledReservation = `${clientData.status || ''}`.toLowerCase().includes('cancel');

        const conflictingBookings = isCanceledReservation ? [] : allBookings.filter(booking => {
            // Skip the booking that belongs to the reservation being edited
            if (isEditMode && (
                booking.reservationId === reservationId ||
                booking.resNo === clientData.resNo
            )) {
                return false;
            }

            // Check if it's the same room
            const bookingRoomId = booking.roomId || booking.room?._id || booking.room?.id || booking.room;
            const isSameRoom = bookingRoomId === selectedRoom._id ||
                               bookingRoomId === selectedRoom.id ||
                               bookingRoomId === selectedRoom.name;

            if (!isSameRoom) {
                return false;
            }

            // Only check ACTIVE bookings (not canceled or parked)
            if (booking.status === 'Canceled' || booking.isParked) {
                return false;
            }

            // Check for date overlap
            const bookingStartDate = dayjs(booking.startDate).format('YYYY-MM-DD');
            const bookingEndDate = dayjs(booking.endDate).format('YYYY-MM-DD');

            // Overlap logic: new arrival is before existing checkout AND new departure is after existing checkin
            // This allows same-day bookings: if someone leaves on Apr 8, new guest can arrive Apr 8
            const hasOverlap = newArriveDate < bookingEndDate && newDepartDate > bookingStartDate;

            return hasOverlap;
        });

        // If there are conflicts, show error and don't allow booking
        if (conflictingBookings.length > 0) {
            const conflicts = conflictingBookings.map(booking => {
                const startDate = dayjs(booking.startDate).format('MMM DD, YYYY');
                const endDate = dayjs(booking.endDate).format('MMM DD, YYYY');
                return `${booking.resNo}: ${startDate} - ${endDate}`;
            }).join('\n');

            message.error(
                `❌ Room ${clientData.area} has existing booking(s) that overlap with your selected dates (${newArriveDate} to ${newDepartDate}):\n\n${conflicts}\n\nPlease select different dates or room.`,
                7
            );
            return;
        }

        // ========== END DOUBLE-BOOKING CHECK ==========

        // Validate Client and Company IDs if provided (must be 24-char hex if not blank)
        const isValidId = (id) => !id || /^[0-9a-fA-F]{24}$/.test(id);
        
        if (!isValidId(clientData.clientId)) {
             message.error(`Invalid Client ID format. Please select a client from SmartSearch.`);
             return;
        }
        if (!isValidId(clientData.companyId)) {
             message.error(`Invalid Company ID format.`);
             return;
        }

        const generatedResNo = Math.floor(100000 + Math.random() * 900000).toString();
        const totalTariffValue = parseFloat((clientData.totalTariff || '0').toString().split(' / ')[0]) || 0;

        const basePayload = {
            room: selectedRoom._id || selectedRoom.id,
            client: clientData.clientId || undefined,
            guestName: `${clientData.given} ${clientData.surname}`.trim(),
            company: clientData.companyId || undefined,
            checkIn: clientData.arrive.toISOString(),
            checkOut: clientData.depart.toISOString(),
            arriveTime: dayjs(clientData.arrive).format('HH:mm'),
            departTime: dayjs(clientData.depart).format('HH:mm'),
            status: clientData.status || 'Confirmed',
            adults: clientData.adults || 1,
            children: clientData.children || 0,
            infants: clientData.infants || 0,
            tariffType: clientData.tariffType || 'Corporate',
            totalTariff: totalTariffValue,
            balance: totalTariffValue,
            bookingSource: clientData.bkgSource || 'Direct',
            isFixed: clientData.fixed === 'Yes',
            groupName: clientData.groupname || undefined,
            confirmedBy: clientData.confirmedBy || undefined,
            confirmedDate: clientData.confirmed || undefined,
            voucherNo: clientData.voucherNo || undefined,
        };

        const markRoomDirtyIfNeeded = () => {
            if ((clientData.status === 'Departed' || clientData.status === 'Checked In') && selectedRoom) {
                updateRoomStatusMutation.mutate({ id: selectedRoom._id || selectedRoom.id, status: 'Dirty' });
            }
        };

        if (isEditMode) {
            // UPDATE existing reservation
            updateReservationMutation.mutate(
                { id: reservationId, data: basePayload },
                {
                    onSuccess: () => {
                        markRoomDirtyIfNeeded();
                        message.success('Reservation updated successfully!');
                    },
                    onError: (err) => {
                        message.error('Failed to update reservation: ' + (err.response?.data?.message || err.message));
                    },
                }
            );
        } else {
            // CREATE new reservation
            const createPayload = {
                ...basePayload,
                resNo: clientData.resNo === '(New Reservation)' ? `RES-${generatedResNo}` : clientData.resNo,
                masterResNo: clientData.masterResNo === '(New Reservation)' ? `MASTER-${generatedResNo}` : clientData.masterResNo,
                importId: `IMPORT-${generatedResNo}`,
            };

            // Portal users' new reservations auto-confirm server-side (reservations.service.ts's
            // create()) only when no status is sent at all — omit it here so that still applies,
            // instead of always sending this page's 'Unconfirmed' default and silently defeating it.
            if (isPortalUser) {
                delete createPayload.status;
            }

            createReservationMutation.mutate(createPayload, {
                onSuccess: (response) => {
                    const newId = response?.data?._id || response?.data?.id || response?._id || response?.id;
                    if (newId) setSavedReservationId(newId);
                    setClientData(prev => ({ ...prev, resNo: createPayload.resNo }));
                    markRoomDirtyIfNeeded();
                    message.success('Reservation created successfully!');
                },
                onError: (err) => {
                    message.error('Failed to create reservation: ' + (err.response?.data?.message || err.message));
                },
            });
        }
    };

    // Derive the reservation ID — prefer the explicit URL param, then a just-created ID
    const reservationId = useMemo(() => {
        if (reservationIdParam) return reservationIdParam;
        if (savedReservationId) return savedReservationId;
        if (resNoParam && allReservations.length > 0) {
            const existing = allReservations.find(r => r.resNo === resNoParam);
            return existing?._id || existing?.id || null;
        }
        return null;
    }, [reservationIdParam, savedReservationId, resNoParam, allReservations]);

    const isEditMode = Boolean(reservationId);

    // Client's Company is locked (see the disabled Company FormFields above) and auto-filled
    // from their own client record — only the company, not the rest of handleSelectClient's
    // fields, since the guest being booked is often a different staff member each time.
    useEffect(() => {
        if (isPortalUser && !isEditMode && !clientData.companyId && allClients.length > 0) {
            const ownClient = allClients.find(c => c.clientNo === currentUser?.linkedClientNo);
            if (ownClient) {
                setClientData(prev => ({
                    ...prev,
                    company: typeof ownClient.company === 'object'
                        ? (ownClient.company?.name || ownClient.company?.tradingAs)
                        : (ownClient.company || ownClient.companyName),
                    companyId: typeof ownClient.company === 'object' ? ownClient.company?._id : ownClient.company,
                }));
            }
        }
    }, [isPortalUser, isEditMode, clientData.companyId, allClients, currentUser]);

    // Sidebar navigation items — Client sub-item is admin-only; portal users manage
    // their own client record via the Client panel directly, not this nav entry.
    const sidebarItems = [
        { key: 'Reservation', label: 'Reservation', icon: <HomeOutlined /> },
        ...(isPortalUser ? [] : [{ key: 'Client', label: 'Client', icon: <UserOutlined /> }]),
    ];

    const handleSidebarItemClick = (key) => {
        setSelectedTab(key);
        if (key === 'Client') {
            handleOpenOwnClient();
        }
    };

    const smartSearchColumns = [
        {
            title: 'Type',
            key: '_source',
            width: 70,
            render: (_, record) => (
                <Tag color={record._source === 'member' ? 'purple' : 'blue'} style={{ margin: 0 }}>
                    {record._source === 'member' ? 'Member' : 'Client'}
                </Tag>
            ),
        },
        { title: 'Client No', dataIndex: 'clientNo', key: 'clientNo', width: 80 },
        { title: 'Groupname', dataIndex: 'groupName', key: 'groupName', width: 120 },
        { title: 'Client Name', dataIndex: 'clientName', key: 'clientName', width: 150 },
        {
            title: 'Company',
            dataIndex: 'company',
            key: 'company',
            width: 100,
            render: (company, record) =>
                typeof company === 'object'
                    ? (company?.name || company?.tradingAs)
                    : (company || record.companyName || '-')
        },
        { title: 'Address', dataIndex: 'address', key: 'address', width: 150 },
        { title: 'Mobile', dataIndex: 'mobile', key: 'mobile', width: 100 },
        { title: 'Phone AH', dataIndex: 'phoneAH', key: 'phoneAH', width: 100 },
        { title: 'Phone BH', dataIndex: 'phoneBH', key: 'phoneBH', width: 100 },
    ];

    return (
        <Spin
            spinning={isSaving}
            tip="Saving reservation..."
            size="large"
            style={{ maxHeight: 'none' }}
        >
        <div style={{ display: 'flex', height: 'calc(100vh - 64px)', backgroundColor: '#f5f5f5', position: 'relative' }}>
            {/* Sidebar Navigation */}
            <div style={{ width: '160px', flexShrink: 0, backgroundColor: '#fff', borderRight: '1px solid #e8e8e8', padding: '16px 0' }}>
                <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <HomeOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
                        <Text strong style={{ fontSize: '14px' }}>Reservation</Text>
                    </div>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '2px 8px',
                        borderRadius: '10px',
                        backgroundColor: isEditMode ? '#fff7e6' : '#f6ffed',
                        border: `1px solid ${isEditMode ? '#ffd591' : '#b7eb8f'}`,
                        fontSize: '11px',
                        fontWeight: 600,
                        color: isEditMode ? '#d46b08' : '#389e0d',
                    }}>
                        <span style={{
                            width: 6, height: 6, borderRadius: '50%',
                            backgroundColor: isEditMode ? '#fa8c16' : '#52c41a',
                            flexShrink: 0,
                        }} />
                        {isEditMode ? 'Editing' : 'New'}
                    </div>
                </div>
                <Divider style={{ margin: '0 0 8px 0' }} />
                {sidebarItems.map(item => (
                    <div
                        key={item.key}
                        onClick={() => handleSidebarItemClick(item.key)}
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
            <div style={{ width: '450px', flexShrink: 0, backgroundColor: '#fff', borderRight: '1px solid #e8e8e8', padding: '16px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Text strong style={{ fontSize: '16px' }}>Client</Text>
                </div>

                <FormField label="MMV SmartSearch" field="smartSearch" clientData={clientData} handleFieldChange={handleFieldChange} setSmartSearch={setSmartSearch} suffix={<SearchOutlined />} />
                <FormField label="Client No" field="clientNo" clientData={clientData} handleFieldChange={handleFieldChange} setSmartSearch={setSmartSearch} suffix={<SearchOutlined />} yellowBg />
                <FormField label="Groupname" field="groupname" clientData={clientData} handleFieldChange={handleFieldChange} setSmartSearch={setSmartSearch} suffix={<SearchOutlined />} />
                <FormField label="Surname" field="surname" clientData={clientData} handleFieldChange={handleFieldChange} setSmartSearch={setSmartSearch} suffix={<SearchOutlined />} error={fieldErrors.surname} />
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

                {/* Internal-only blacklist flag — hidden for Client */}
                {!isPortalUser && (
                    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', alignItems: 'center', marginBottom: '4px', minHeight: '32px' }}>
                        <Text style={{ fontSize: '12px', color: '#262626', paddingRight: '8px' }}>Black List</Text>
                        <Button size="small" style={{ width: '100%', textAlign: 'center', backgroundColor: '#f0f0f0' }}>No</Button>
                    </div>
                )}

                <FormField label="Date Created" field="dateCreated" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                <FormField label="Date Modified" field="dateModified" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                <FormField label="Client Type" field="clientType" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={CLIENT_TYPE_OPTIONS} />
                {/* Auto-filled from the Client's own record below — locked, not manually searchable, for portal */}
                <FormField label="Company" field="company" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={dynamicCompanyOptions} suffix={<SearchOutlined />} disabled={isPortalUser} />
            </div>

            {/* Main Content Area (Reservation + Account) with Overlay Container */}
            <div style={{ flex: 1, display: 'flex', position: 'relative', overflowX: 'auto', overflowY: 'hidden' }}>

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
                                Client MMV SmartSearch - {smartSearchResults.length} Found
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
                                dataSource={smartSearchResults}
                                rowKey="key"
                                pagination={false}
                                size="small"
                                onRow={(record) => ({
                                    onDoubleClick: () => record._source === 'member' ? handleSelectMember(record) : handleSelectClient(record),
                                    style: { cursor: 'pointer' }
                                })}
                            />
                        </div>
                    </div>
                )}

                {/* Reservation Panel */}
                <div style={{ width: '520px', flexShrink: 0, backgroundColor: '#fff', borderRight: '1px solid #e8e8e8', padding: '16px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <Text strong style={{ fontSize: '16px' }}>{isEditMode ? 'Edit Reservation' : 'New Reservation'}</Text>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Button
                                type="primary"
                                size="small"
                                icon={<SaveOutlined />}
                                onClick={handleSaveReservation}
                                loading={isSaving}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
                            </Button>
                        </div>
                    </div>

                    <FormField label="Res No" field="resNo" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Master Res No" field="masterResNo" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Status" field="status" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={STATUS_OPTIONS} bgColor="#ffa940" />
                    <FormField label="Stay Dates" field="bookingDates" clientData={clientData} handleFieldChange={handleFieldChange} isRange yellowBg error={fieldErrors.bookingDates} />
                    <FormField label="Nights" field="nights" clientData={clientData} handleFieldChange={handleFieldChange} type="number" />
                    <FormField label="Adults" field="adults" clientData={clientData} handleFieldChange={handleFieldChange} type="number" />
                    {/* Internal rate/billing classification — hidden for Client */}
                    {!isPortalUser && (
                        <FormField label="Tariff Type" field="tariffType" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={TARIFF_TYPE_OPTIONS} />
                    )}
                    <FormField label="Room Type" field="roomType" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={dynamicRoomTypeOptions} />
                    <FormField label="Area" field="area" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={filteredAreaOptions} error={fieldErrors.area} />
                    <FormField label="Booking Type" field="bkgSource" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={BKG_SOURCE_OPTIONS} />
                    {/* Internal scheduling flag — hidden for Client */}
                    {!isPortalUser && (
                        <FormField label="Fixed" field="fixed" clientData={clientData} handleFieldChange={handleFieldChange} bgColor="#b7eb8f" />
                    )}
                    {/* Auto-filled from the Client's own record below — locked, not manually searchable, for portal */}
                    <FormField label="Company" field="company" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={dynamicCompanyOptions} suffix={<SearchOutlined style={{ fontSize: '10px' }} />} disabled={isPortalUser} />
                    {/* Voucher No is billing-internal — hidden for Client entirely */}
                    {!isPortalUser && (
                        <FormField label="Voucher No" field="voucherNo" clientData={clientData} handleFieldChange={handleFieldChange} isAutoComplete options={allVouchers} />
                    )}
                    <FormField label="Made By" field="madeBy" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Date Made" field="dateMade" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Cancelled" field="cancelled" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Cancelled By" field="cancelledBy" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Confirmed" field="confirmed" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Confirmed By" field="confirmedBy" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                </div>
            </div>

            <ClientFormDrawer
                open={ownClientDrawerOpen}
                onClose={() => setOwnClientDrawerOpen(false)}
                onSubmit={handleUpdateOwnClient}
                loading={updateClientMutation.isPending}
                companies={allCompanies}
                initialValues={allClients.find(c => c.clientNo === currentUser?.linkedClientNo)}
            />
        </div>
        </Spin>
    );
};

export default ReservationsListPage;
