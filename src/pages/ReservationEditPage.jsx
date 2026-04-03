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
    EllipsisOutlined,
    ArrowLeftOutlined,
    FilePdfOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import InvoiceModal from '../components/InvoiceModal';
import { useRooms, useUpdateRoomStatus } from '../hooks/useRooms';
import { useReservation, useUpdateReservation, useReservations } from '../hooks/useReservations';
import { useBookings } from '../hooks/useBookings';
import { useClients } from '../hooks/useClients';
import { useCompanies } from '../hooks/useCompanies';
import { useVouchers } from '../hooks/useVouchers';
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
                                defaultValue: [
                                    dayjs('14:00', 'HH:mm'),
                                    dayjs('10:00', 'HH:mm')
                                ]
                            }}
                            style={{ width: '100%', backgroundColor: finalBgColor }}
                            size="small"
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
                            suffixIcon={suffix || <CaretDownOutlined style={{ fontSize: '10px' }} />}
                            dropdownMatchSelectWidth={['Company', 'Area'].includes(label) ? false : true}
                            optionLabelProp={['Company', 'Area'].includes(label) ? "label" : undefined}
                        >
                            {options.length > 0 ? (
                                options.map(opt => (
                                    <Option
                                        key={typeof opt === 'string' ? opt : (opt.name || opt.area)}
                                        value={typeof opt === 'string' ? opt : (opt._id || opt.id)}
                                        label={typeof opt === 'string' ? opt : opt.name}
                                    >
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', width: '100%' }}>
                                            {typeof opt !== 'string' && label === 'Company' && (
                                                <>
                                                    <span>{opt.name}</span>
                                                    <span>{opt.address}</span>
                                                    <span>{opt.creditHold || '-'}</span>
                                                    <span>{opt.tradingAs || '-'}</span>
                                                </>
                                            )}
                                            {typeof opt !== 'string' && label === 'Area' && (
                                                <>
                                                    <span>{opt.name}</span>
                                                    <span>{opt.status}</span>
                                                    <span>{opt.description}</span>
                                                    <span>{opt.resCount || '-'}</span>
                                                    <span>{opt.outOrder ? 'Yes' : 'No'}</span>
                                                    <span>{opt.lastClean || '-'}</span>
                                                    <span>{opt.daysDirty || '-'}</span>
                                                </>
                                            )}
                                            {typeof opt === 'string' && <span>{opt}</span>}
                                        </div>
                                    </Option>
                                ))
                            ) : (
                                <Option disabled>No options</Option>
                            )}
                        </Select>
                    ) : (
                        <Input
                            value={displayValue}
                            onChange={(e) => handleFieldChange?.(field, e.target.value)}
                            size="small"
                            style={{ backgroundColor: finalBgColor }}
                            disabled={disabled}
                            placeholder={label}
                            suffix={suffix}
                            addonAfter={addonAfter}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const ReservationEditPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Extract reservation ID and URL params for fallback pre-fill
    const reservationId = searchParams.get('reservationId');
    const resNoParam = searchParams.get('resNo');
    const masterResNoParam = searchParams.get('masterResNo');
    const arriveParam = searchParams.get('arrive');
    const departParam = searchParams.get('depart');
    const areaParam = searchParams.get('area');
    const roomTypeParam = searchParams.get('roomType');
    const givenParam = searchParams.get('given');
    const surnameParam = searchParams.get('surname');
    const statusParam = searchParams.get('status');
    const clientIdParam = searchParams.get('clientId');
    const peopleParam = searchParams.get('people');
    const companyParam = searchParams.get('company');
    const bkgSourceParam = searchParams.get('bkgSource');
    const tariffTypeParam = searchParams.get('tariffType');
    const totalTariffParam = searchParams.get('totalTariff');
    const fixedParam = searchParams.get('fixed');
    const groupnameParam = searchParams.get('groupname');

    // Fetch reservation from API
    const { data: reservationData, isLoading: isLoadingReservation } = useReservation(reservationId);

    // Fetch related data for dropdowns
    const { data: roomsFromApi } = useRooms();
    const { data: vouchersFromApi } = useVouchers();
    const { data: clientsFromApi } = useClients();
    const { data: companiesFromApi } = useCompanies();
    const { data: bookingsFromApi } = useBookings();

    const updateReservationMutation = useUpdateReservation();
    const updateRoomStatusMutation = useUpdateRoomStatus();

    // Normalize rooms, clients, etc.
    const allRooms = useMemo(() => {
        if (!roomsFromApi) return [];
        return Array.isArray(roomsFromApi) ? roomsFromApi : (roomsFromApi.data || roomsFromApi.rooms || []);
    }, [roomsFromApi]);

    const allClients = useMemo(() => {
        if (!clientsFromApi) return [];
        return Array.isArray(clientsFromApi) ? clientsFromApi : (clientsFromApi.data || clientsFromApi.clients || []);
    }, [clientsFromApi]);

    const allCompanies = useMemo(() => {
        if (!companiesFromApi) return [];
        return Array.isArray(companiesFromApi) ? companiesFromApi : (companiesFromApi.data || companiesFromApi.companies || []);
    }, [companiesFromApi]);

    const allBookings = useMemo(() => {
        if (!bookingsFromApi) return [];
        return Array.isArray(bookingsFromApi) ? bookingsFromApi : (bookingsFromApi.data || bookingsFromApi.bookings || []);
    }, [bookingsFromApi]);

    const allVouchers = useMemo(() => {
        if (!vouchersFromApi) return [];
        const arr = Array.isArray(vouchersFromApi) ? vouchersFromApi : (vouchersFromApi.data || vouchersFromApi.vouchers || []);
        return arr.map(v => v.voucherNo || v.number || v.code || '');
    }, [vouchersFromApi]);

    // State for form data
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
        resNo: '',
        masterResNo: '',
        status: 'Unconfirmed',
        arrive: dayjs('2026-02-04').hour(14).minute(0).toDate(),
        depart: dayjs('2026-02-05').hour(10).minute(0).toDate(),
        nights: 1,
        adults: 1,
        tariffType: 'Occupied Room Rate PRPN',
        roomType: '',
        area: '',
        bkgSource: '',
        fixed: 'No',
        voucherNo: '',
        madeBy: 'Admin',
        dateMade: '',
        cancelled: '',
        cancelledBy: '',
        confirmed: '',
        confirmedBy: '',
        accountNo: '',
        baseTariff: '0.00 / 0.00',
        package: '0.00 / 0.00',
        totalTariff: '0.00 / 0.00',
        avgUpgradeTariff: '0.00',
        accomm: '0.00',
        ar: '0.00',
        activeAccounts: '(None)',
        clientId: '',
        companyId: '',
        children: 0,
        infants: 0
    });

    const [selectedTab, setSelectedTab] = useState('Reservation');
    const [smartSearch, setSmartSearch] = useState({ isOpen: false, term: '' });
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

    // Populate form from API data when reservation loads
    useEffect(() => {
        if (!reservationData) return;

        const res = reservationData.data || reservationData;
        console.log('[EDIT PAGE] Reservation data loaded:', res);

        setClientData(prev => ({
            ...prev,
            resNo: res.resNo || prev.resNo,
            masterResNo: res.masterResNo || prev.masterResNo,
            given: res.guestName ? res.guestName.split(' ')[0] : prev.given,
            surname: res.guestName ? res.guestName.split(' ').slice(1).join(' ') : prev.surname,
            arrive: res.checkIn ? new Date(res.checkIn) : prev.arrive,
            depart: res.checkOut ? new Date(res.checkOut) : prev.depart,
            status: res.status || prev.status,
            adults: res.adults || 1,
            children: res.children || 0,
            infants: res.infants || 0,
            tariffType: res.tariffType || prev.tariffType,
            totalTariff: res.totalTariff ? `${res.totalTariff} / ${res.totalTariff}` : prev.totalTariff,
            bkgSource: res.bookingSource || prev.bkgSource,
            fixed: res.isFixed ? 'Yes' : 'No',
            voucherNo: res.voucherNo || '',
            groupname: res.groupName || '',
            confirmedBy: res.confirmedBy || '',
            confirmedDate: res.confirmedDate ? dayjs(res.confirmedDate).format('YYYY-MM-DD') : '',
            clientId: res.client?._id || res.client || '',
            companyId: res.company?._id || res.company || '',
        }));
    }, [reservationData]);

    // Fallback URL-param pre-fill while API loads (same as ReservationsListPage)
    useEffect(() => {
        if (arriveParam || areaParam || roomTypeParam || resNoParam) {
            setClientData(prev => ({
                ...prev,
                resNo: resNoParam || prev.resNo,
                masterResNo: masterResNoParam || prev.masterResNo,
                arrive: arriveParam ? dayjs(arriveParam).hour(14).minute(0).second(0).toDate() : prev.arrive,
                depart: departParam ? dayjs(departParam).hour(10).minute(0).second(0).toDate() : (arriveParam ? dayjs(arriveParam).add(1, 'day').hour(10).minute(0).second(0).toDate() : prev.depart),
                area: areaParam || prev.area,
                roomType: roomTypeParam || prev.roomType,
                given: givenParam || prev.given,
                surname: surnameParam || prev.surname,
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

    // Auto-select client when clientIdParam is provided
    useEffect(() => {
        if (clientIdParam && allClients.length > 0) {
            const selectedClient = allClients.find(c => c._id === clientIdParam || c.id === clientIdParam);
            if (selectedClient) {
                handleSelectClient(selectedClient);
            }
        }
    }, [clientIdParam, allClients]);

    const handleFieldChange = (field, value) => {
        if (field === 'bookingDates' && value) {
            const [arrival, departure] = value;
            const arrivalDate = arrival.toDate();
            const departureDate = departure.toDate();
            const arrivalWithTime = new Date(arrivalDate.getFullYear(), arrivalDate.getMonth(), arrivalDate.getDate(), 14, 0, 0);
            const departureWithTime = new Date(departureDate.getFullYear(), departureDate.getMonth(), departureDate.getDate(), 10, 0, 0);
            const nights = Math.max(1, Math.ceil((departureWithTime - arrivalWithTime) / (1000 * 60 * 60 * 24)));

            setClientData(prev => ({
                ...prev,
                arrive: arrivalWithTime,
                depart: departureWithTime,
                nights
            }));
        } else if (field === 'roomType' && value) {
            const roomsInCategory = allRooms.filter(r => r.category === value);
            const firstRoomInCategory = roomsInCategory.length > 0 ? roomsInCategory[0].name : '';
            setClientData(prev => ({
                ...prev,
                roomType: value,
                area: firstRoomInCategory
            }));
        } else if (['smartSearch', 'clientNo', 'groupname', 'surname', 'given', 'email', 'mobile'].includes(field)) {
            setSmartSearch({ isOpen: true, term: value });
            setClientData(prev => ({ ...prev, [field]: value }));
        } else {
            setClientData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSelectClient = (client) => {
        setClientData(prev => ({
            ...prev,
            clientId: client._id || client.id,
            clientNo: client.clientNo || '',
            groupname: client.groupName || '',
            surname: client.lastName || '',
            given: client.firstName || '',
            title: client.title || '',
            email: client.email || '',
            phoneAH: client.phoneAH || '',
            mobile: client.mobile || '',
            email2: client.email2 || '',
            clientType: client.clientType || '',
            company: client.company?.name || '',
            companyId: client.company?._id || client.company || '',
            dateCreated: client.createdAt ? dayjs(client.createdAt).format('DD MMM YYYY') : '',
            dateModified: client.updatedAt ? dayjs(client.updatedAt).format('DD MMM YYYY') : ''
        }));
        setSmartSearch({ isOpen: false, term: '' });
    };

    const handleSaveReservation = () => {
        console.log('[BUTTON CLICKED] Save button was clicked');
        console.log('[DEBUG] clientData:', clientData);
        console.log('[DEBUG] allRooms:', allRooms);
        console.log('[DEBUG] allBookings:', allBookings);

        // Validation
        if (!clientData.arrive || !clientData.depart) {
            console.log('[VALIDATION] Missing dates');
            message.error('Please select valid stay dates.');
            return;
        }
        if (!clientData.area) {
            console.log('[VALIDATION] Missing area');
            message.error('Please select an Area (Room).');
            return;
        }
        if (!clientData.surname) {
            console.log('[VALIDATION] Missing surname');
            message.error('Please enter a Guest Name (Surname).');
            return;
        }

        const selectedRoom = allRooms.find(r => r.name === clientData.area);
        console.log('[DEBUG] selectedRoom:', selectedRoom);

        if (!selectedRoom) {
            console.log('[VALIDATION] Room not found');
            message.error(`Selected room '${clientData.area}' not found.`);
            return;
        }

        const arriveDate = dayjs(clientData.arrive);
        const departDate = dayjs(clientData.depart);
        const newArriveDate = arriveDate.format('YYYY-MM-DD');
        const newDepartDate = departDate.format('YYYY-MM-DD');

        // Double-booking check (exclude current reservation being edited)
        const conflictingBookings = allBookings.filter(booking => {
            // Skip the current reservation being edited
            if (booking.reservationId === reservationId || booking._id === reservationId) {
                return false;
            }

            const bookingRoomId = booking.roomId || booking.room?._id || booking.room?.id || booking.room;
            const isSameRoom = bookingRoomId === selectedRoom._id || bookingRoomId === selectedRoom.id || bookingRoomId === selectedRoom.name;

            if (!isSameRoom) return false;
            if (booking.status === 'Canceled' || booking.isParked) return false;

            const bookingStartDate = dayjs(booking.startDate).format('YYYY-MM-DD');
            const bookingEndDate = dayjs(booking.endDate).format('YYYY-MM-DD');
            const hasOverlap = newArriveDate < bookingEndDate && newDepartDate > bookingStartDate;

            return hasOverlap;
        });

        console.log('[DEBUG] conflictingBookings:', conflictingBookings);

        if (conflictingBookings.length > 0) {
            console.log('[VALIDATION] Booking conflict found');
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

        const mongoRoomId = selectedRoom._id || selectedRoom.id;
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(mongoRoomId);

        console.log('[DEBUG] mongoRoomId:', mongoRoomId, 'isMongoId:', isMongoId);

        if (!isMongoId) {
            console.log('[VALIDATION] Invalid room ID format');
            console.warn('ID provided for room is not a Mongo ID:', mongoRoomId);
            message.error(`Room ID error: '${mongoRoomId}' is not a valid database ID.`);
            return;
        }

        // Helper to validate MongoDB ID format
        const isValidMongoId = (id) => !id || /^[0-9a-fA-F]{24}$/.test(id);
        const isValidMongoIdRequired = (id) => /^[0-9a-fA-F]{24}$/.test(id);

        console.log('[DEBUG] clientId:', clientData.clientId, 'valid:', isValidMongoId(clientData.clientId));
        console.log('[DEBUG] companyId:', clientData.companyId, 'valid:', isValidMongoId(clientData.companyId));

        if (clientData.clientId && !isValidMongoId(clientData.clientId)) {
            console.log('[VALIDATION] Invalid client ID');
            message.error('Invalid Client ID format.');
            return;
        }
        // Don't validate companyId if it's not a valid mongo ID - just exclude it from payload
        // (company can be a string name from the UI, not always an ID)

        console.log('[VALIDATION] All checks passed, proceeding to save');

        const payload = {
            resNo: clientData.resNo,
            masterResNo: clientData.masterResNo,
            room: mongoRoomId,
            guestName: `${clientData.given} ${clientData.surname}`.trim(),
            checkIn: clientData.arrive.toISOString(),
            checkOut: clientData.depart.toISOString(),
            arriveTime: dayjs(clientData.arrive).format('HH:mm'),
            departTime: dayjs(clientData.depart).format('HH:mm'),
            status: clientData.status || 'Confirmed',
            adults: clientData.adults || 1,
            children: clientData.children || 0,
            infants: clientData.infants || 0,
            tariffType: clientData.tariffType || 'Corporate',
            totalTariff: parseFloat(clientData.totalTariff.split(' / ')[0]) || 0,
            balance: parseFloat(clientData.totalTariff.split(' / ')[0]) || 0,
            bookingSource: clientData.bkgSource || 'Direct',
            isFixed: clientData.fixed === 'Yes'
        };

        // Add optional fields only if they have values and are valid MongoDB IDs where required

        if (clientData.clientId && isValidMongoIdRequired(clientData.clientId)) {
            payload.client = clientData.clientId;
        }
        if (clientData.companyId && isValidMongoIdRequired(clientData.companyId)) {
            payload.company = clientData.companyId;
        }
        if (clientData.groupname) payload.groupName = clientData.groupname;
        if (clientData.confirmedBy && isValidMongoIdRequired(clientData.confirmedBy)) {
            payload.confirmedBy = clientData.confirmedBy;
        }
        if (clientData.confirmedDate) payload.confirmedDate = clientData.confirmedDate;
        if (clientData.voucherNo) payload.voucherNo = clientData.voucherNo;

        console.log('[SAVE] Reservation ID:', reservationId);
        console.log('[SAVE] Payload:', JSON.stringify(payload, null, 2));

        if (!reservationId) {
            message.error('No reservation ID found. Cannot update.');
            return;
        }

        updateReservationMutation.mutate(
            { id: reservationId, data: payload },
            {
                onSuccess: (data) => {
                    console.log('[SUCCESS] Reservation updated:', data);

                    // If status is "Departed", mark room as dirty
                    if (clientData.status === 'Departed' && selectedRoom) {
                        updateRoomStatusMutation.mutate({
                            id: selectedRoom._id || selectedRoom.id,
                            status: 'Dirty'
                        }, {
                            onSuccess: () => {
                                console.log('Room marked as Dirty');
                                message.success('Reservation updated successfully!');
                                navigate(-1);
                            },
                            onError: (err) => {
                                console.error('Failed to update room status:', err);
                                message.success('Reservation updated successfully!');
                                navigate(-1);
                            }
                        });
                    } else {
                        message.success('Reservation updated successfully!');
                        navigate(-1);
                    }
                },
                onError: (err) => {
                    console.error('[ERROR] Update failed:', err);
                    console.error('[ERROR] Response:', err.response?.data);
                    message.error('Failed to update reservation: ' + (err.response?.data?.message || err.message));
                }
            }
        );
    };

    // Invoice data memo
    const invoiceData = useMemo(() => ({
        resNo: clientData.resNo,
        guestName: `${clientData.given} ${clientData.surname}`.trim(),
        clientNo: clientData.clientNo,
        company: clientData.company,
        area: clientData.area,
        roomType: clientData.roomType,
        arrive: clientData.arrive ? dayjs(clientData.arrive).format('ddd, D MMM YYYY h:mm A') : '',
        depart: clientData.depart ? dayjs(clientData.depart).format('ddd, D MMM YYYY h:mm A') : '',
        nights: clientData.nights,
        baseTariff: parseFloat(clientData.baseTariff.split(' / ')[0]) || 0,
        package: parseFloat(clientData.package.split(' / ')[0]) || 0,
        totalTariff: parseFloat(clientData.totalTariff.split(' / ')[0]) || 0,
        accomm: parseFloat(clientData.accomm) || 0,
        ar: parseFloat(clientData.ar) || 0,
        accountNo: clientData.accountNo,
        generatedDate: dayjs().format('D MMM YYYY'),
    }), [clientData]);

    // Invoice handlers
    const handleGenerateInvoice = () => {
        if (!reservationId || clientData.resNo === '(New Reservation)') {
            message.warning('Please save the reservation first.');
            return;
        }
        setIsInvoiceModalOpen(true);
    };

    const handleConfirmInvoice = () => {
        const doUpdate = clientData.status === 'Unconfirmed' && reservationId;
        if (doUpdate) {
            // Build update payload with required fields
            const updatePayload = {
                status: 'Confirmed',
                guestName: `${clientData.given} ${clientData.surname}`.trim(),
                checkIn: clientData.arrive.toISOString(),
                checkOut: clientData.depart.toISOString(),
            };

            updateReservationMutation.mutate(
                { id: reservationId, data: updatePayload },
                {
                    onSuccess: () => {
                        setClientData(prev => ({ ...prev, status: 'Confirmed' }));
                        message.success('Reservation confirmed and invoice generated.');
                        setIsInvoiceModalOpen(false);
                        // Print the PDF iframe
                        setTimeout(() => {
                            const iframe = document.querySelector('.invoice-pdf-viewer iframe');
                            if (iframe) iframe.contentWindow.print();
                        }, 500);
                    },
                    onError: (err) => message.error('Failed: ' + (err.response?.data?.message || err.message))
                }
            );
        } else {
            setIsInvoiceModalOpen(false);
            setTimeout(() => {
                const iframe = document.querySelector('.invoice-pdf-viewer iframe');
                if (iframe) iframe.contentWindow.print();
            }, 500);
        }
    };

    const sidebarItems = [
        { key: 'Reservation', label: 'Reservation', icon: <HomeOutlined /> },
        { key: 'Area', label: 'Area', icon: <EnvironmentOutlined /> },
        { key: 'Client', label: 'Client', icon: <UserOutlined /> },
    ];

    const dynamicCompanyOptions = useMemo(() => {
        return allCompanies.map(c => ({
            name: c.name || c.companyName,
            address: c.address || '',
            creditHold: c.creditHold || '',
            tradingAs: c.tradingAs || '',
            _id: c._id || c.id
        }));
    }, [allCompanies]);

    const dynamicRoomOptions = useMemo(() => {
        return allRooms.map(room => ({
            name: room.name || room.roomNumber,
            status: room.status || 'Available',
            description: room.description || room.category || '',
            resCount: room.resNo || '-',
            outOrder: room.outOrder || false,
            lastClean: room.lastClean || '-',
            daysDirty: room.daysDirty || '-',
            _id: room._id || room.id,
            category: room.category || 'Standard'
        }));
    }, [allRooms]);

    if (isLoadingReservation) {
        return <div style={{ padding: '20px' }}>Loading reservation...</div>;
    }

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 64px)', backgroundColor: '#f5f5f5', position: 'relative' }}>
            {/* Sidebar Navigation */}
            <div style={{ width: '160px', backgroundColor: '#fff', borderRight: '1px solid #e8e8e8', padding: '16px 0' }}>
                <div style={{ padding: '0 16px 16px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HomeOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
                    <Text strong style={{ fontSize: '14px' }}>Edit Reservation</Text>
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
                <FormField label="Email" field="email" clientData={clientData} handleFieldChange={handleFieldChange} setSmartSearch={setSmartSearch} suffix={<SearchOutlined />} />
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
                <FormField label="Company" field="company" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={dynamicCompanyOptions} suffix={<SearchOutlined />} />
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
                {/* Reservation Panel */}
                <div style={{ flex: 1, backgroundColor: '#fff', borderRight: '1px solid #e8e8e8', padding: '16px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Button type="text" size="small" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
                            <Text strong style={{ fontSize: '16px' }}>Reservation</Text>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Button type="text" size="small" icon={<SearchOutlined />} />
                            <Button
                                type="text"
                                size="small"
                                icon={<SaveOutlined />}
                                onClick={handleSaveReservation}
                                loading={updateReservationMutation.isLoading}
                            />
                            <Button type="text" size="small" icon={<MoreOutlined />} />
                        </div>
                    </div>

                    <FormField label="Res No" field="resNo" clientData={clientData} handleFieldChange={handleFieldChange} bgColor="#b7eb8f" />
                    <FormField label="Master Res No" field="masterResNo" clientData={clientData} handleFieldChange={handleFieldChange} bgColor="#b7eb8f" />
                    <FormField label="Status" field="status" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={STATUS_OPTIONS} />
                    <FormField label="Stay" field="bookingDates" clientData={clientData} handleFieldChange={handleFieldChange} isRange={true} />
                    <FormField label="Nights" field="nights" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Adults" field="adults" clientData={clientData} handleFieldChange={handleFieldChange} />
                    <FormField label="Tariff Type" field="tariffType" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={TARIFF_TYPE_OPTIONS} />
                    <FormField label="Room Type" field="roomType" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={dynamicRoomOptions.map(r => r.category)} />
                    <FormField label="Area" field="area" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={dynamicRoomOptions} suffix={<SearchOutlined />} />
                    <FormField label="Bkg Source" field="bkgSource" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={BKG_SOURCE_OPTIONS} />
                    <FormField label="Fixed" field="fixed" clientData={clientData} handleFieldChange={handleFieldChange} bgColor="#b7eb8f" />
                    <FormField label="Company" field="company" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={dynamicCompanyOptions} suffix={<SearchOutlined />} />
                    <FormField label="Voucher No" field="voucherNo" clientData={clientData} handleFieldChange={handleFieldChange} isAutoComplete options={allVouchers} />
                    <FormField label="Made By" field="madeBy" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Date Made" field="dateMade" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Cancelled" field="cancelled" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Cancelled By" field="cancelledBy" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Confirmed" field="confirmed" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                    <FormField label="Confirmed By" field="confirmedBy" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg disabled={true} />
                </div>

                {/* Account Panel */}
                <div style={{ width: '400px', backgroundColor: '#fff', borderRight: '1px solid #e8e8e8', padding: '16px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <Text strong style={{ fontSize: '16px' }}>Account</Text>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Button type="text" size="small" icon={<CopyOutlined />} />
                            <Button
                                type="primary"
                                size="small"
                                icon={<FilePdfOutlined />}
                                onClick={handleGenerateInvoice}
                                disabled={!reservationId || clientData.resNo === '(New Reservation)'}
                            >
                                Invoice
                            </Button>
                            <Button type="text" size="small" icon={<MoreOutlined />} />
                        </div>
                    </div>

                    <FormField label="Account No" field="accountNo" clientData={clientData} handleFieldChange={handleFieldChange} bgColor="#b7eb8f" />
                    <FormField label="Base Tariff" field="baseTariff" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg />
                    <FormField label="Package" field="package" clientData={clientData} handleFieldChange={handleFieldChange} yellowBg />
                    <FormField label="Total Tariff" field="totalTariff" clientData={clientData} handleFieldChange={handleFieldChange} />
                    <FormField label="Avg Upgrade Tariff" field="avgUpgradeTariff" clientData={clientData} handleFieldChange={handleFieldChange} />
                    <FormField label="Accomm" field="accomm" clientData={clientData} handleFieldChange={handleFieldChange} />
                    <FormField label="A/R" field="ar" clientData={clientData} handleFieldChange={handleFieldChange} />
                    <FormField label="Active Accounts" field="activeAccounts" clientData={clientData} handleFieldChange={handleFieldChange} isDropdown options={['(None)', 'Account1', 'Account2']} />
                </div>
            </div>

            <InvoiceModal
                open={isInvoiceModalOpen}
                onClose={() => setIsInvoiceModalOpen(false)}
                onConfirm={handleConfirmInvoice}
                invoiceData={invoiceData}
                isConfirming={updateReservationMutation.isPending}
            />
        </div>
    );
};

export default ReservationEditPage;
