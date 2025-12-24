import React, { useState } from 'react';
import { Modal, Row, Col, Switch, Select, Input, Typography, Button, Space, Divider } from 'antd';
import { SaveOutlined, ReloadOutlined, CloseOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;
const { Option } = Select;

const BookingChartOptionsModal = ({ visible, onClose }) => {
    // Mock state for the UI demo
    const [settings, setSettings] = useState({
        allowHorizontalMove: false,
        excludeReservationTimes: false,
        repositionChart: false,
        showAreaDescription: false,
        showElectricityIndicator: false,
        showHousekeepingStatus: true,
        showRoomTypeDescription: true,
        showSpecialEventRow: true,
        showTariffPeriodColors: false,
        showPropertyOccupancyRow: false,
        showRateCreatingReservation: true,
        showPaxRow: false,
        showUnallocatedReservation: false,
        hideOutOfOrderArea: false,
        areaHeight: 'Small',
        areaWidth: '125',
        colorBy: 'Reservation Status',
        columnViewBy: 'Day',
        dayView: '30',
        viewBy: 'Area (by Room Type Display Order)',
        hourStart: '0:00',
        hourEnd: '24:00',
        textLabel: 'Surname'
    });

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const ToggleItem = ({ label, valueKey }) => (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <Switch
                checked={settings[valueKey]}
                onChange={(checked) => handleChange(valueKey, checked)}
                style={{ marginRight: '12px', backgroundColor: settings[valueKey] ? '#52c41a' : undefined }}
            />
            <Text style={{ fontSize: '13px', color: '#595959' }}>{label}</Text>
        </div>
    );

    const SelectItem = ({ label, valueKey, options, width = '100%' }) => (
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', marginBottom: '12px' }}>
            <Text style={{ fontSize: '13px', color: '#595959' }}>{label}:</Text>
            <Select
                value={settings[valueKey]}
                onChange={(val) => handleChange(valueKey, val)}
                style={{ width }}
                size="middle"
            >
                {options.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
            </Select>
        </div>
    );

    // Custom Header
    const customHeader = (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: '#001529', color: 'white', padding: '12px 24px',
            margin: '-20px -24px 0 -24px', borderRadius: '4px 4px 0 0' // Compensate for Modal padding if needed, but styling bodyStyle is better
        }}>
            <Title level={5} style={{ color: 'white', margin: 0 }}>Booking Chart Options</Title>
            <Space size="large">
                <Button type="text" icon={<SaveOutlined style={{ color: 'white', fontSize: '18px' }} />} />
                <Button type="text" icon={<ReloadOutlined style={{ color: 'white', fontSize: '18px' }} />} />
                <Button type="text" onClick={onClose} icon={<CloseOutlined style={{ color: 'white', fontSize: '18px' }} />} />
            </Space>
        </div>
    );

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            closable={false}
            width={1200}
            bodyStyle={{ padding: 0, borderRadius: '4px' }}
            centered
        >
            {customHeader}
            <div style={{ display: 'flex', minHeight: '500px', backgroundColor: '#fff' }}>
                {/* Sidebar */}
                <div style={{ width: '220px', backgroundColor: '#fafafa', borderRight: '1px solid #f0f0f0', padding: '20px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '8px 24px', cursor: 'pointer', borderLeft: '3px solid #1890ff', backgroundColor: '#e6f7ff' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1890ff', marginRight: '8px' }}></div>
                        <Text strong style={{ color: '#262626' }}>Options</Text>
                    </div>
                    <div style={{ padding: '12px 24px', cursor: 'pointer' }}>
                        <Text style={{ color: '#8c8c8c' }}>Room Type Defaults</Text>
                    </div>
                    <div style={{ padding: '12px 24px', cursor: 'pointer' }}>
                        <Text style={{ color: '#8c8c8c' }}>Data Window</Text>
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, padding: '24px', display: 'flex', gap: '40px' }}>
                    {/* Left Column: Toggles */}
                    <div style={{ flex: 1 }}>
                        <ToggleItem label="Allow Horizontal Area Move" valueKey="allowHorizontalMove" />
                        <ToggleItem label="Exclude Reservation Times" valueKey="excludeReservationTimes" />
                        <ToggleItem label="Reposition Chart to Edited Reservation" valueKey="repositionChart" />
                        <ToggleItem label="Show Area Description" valueKey="showAreaDescription" />
                        <ToggleItem label="Show Electricity Indicator" valueKey="showElectricityIndicator" />
                        <ToggleItem label="Show Housekeeping Status Indicator" valueKey="showHousekeepingStatus" />
                        <ToggleItem label="Show Room Type Description" valueKey="showRoomTypeDescription" />
                        <ToggleItem label="Show Special Event Row" valueKey="showSpecialEventRow" />
                        <ToggleItem label="Show Tariff Period Colors" valueKey="showTariffPeriodColors" />
                        <ToggleItem label="Show Property Occupancy Row" valueKey="showPropertyOccupancyRow" />
                        <ToggleItem label="Show Rate when creating Reservation" valueKey="showRateCreatingReservation" />
                        <ToggleItem label="Show Pax Row" valueKey="showPaxRow" />
                        <ToggleItem label="Show Unallocated Reservation" valueKey="showUnallocatedReservation" />

                        <div style={{ display: 'flex', alignItems: 'start', marginTop: '12px' }}>
                            <Switch
                                checked={settings.hideOutOfOrderArea}
                                onChange={(c) => handleChange('hideOutOfOrderArea', c)}
                                style={{ marginRight: '12px', marginTop: '2px', backgroundColor: settings.hideOutOfOrderArea ? '#52c41a' : undefined }}
                            />
                            <Text style={{ fontSize: '13px', color: '#595959', lineHeight: '1.4' }}>
                                Hide Area from view when out-of-order Area cover the entire selected date range
                            </Text>
                        </div>
                    </div>

                    {/* Right Column: Inputs */}
                    <div style={{ width: '300px' }}>
                        <SelectItem label="Area Height" valueKey="areaHeight" options={['Small', 'Medium', 'Large']} />

                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', marginBottom: '12px' }}>
                            <Text style={{ fontSize: '13px', color: '#595959' }}>Area Width:</Text>
                            <Input
                                value={settings.areaWidth}
                                onChange={(e) => handleChange('areaWidth', e.target.value)}
                            />
                        </div>

                        <SelectItem label="Color" valueKey="colorBy" options={['Reservation Status', 'Payment Status']} />
                        <SelectItem label="Column View By" valueKey="columnViewBy" options={['Day', 'Week', 'Month']} />
                        <SelectItem label="Day View" valueKey="dayView" options={['30', '60', '90']} />
                        <SelectItem label="View By" valueKey="viewBy" options={['Area (by Room Type Display Order)', 'Category']} />

                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', marginBottom: '12px' }}>
                            <Text style={{ fontSize: '13px', color: '#595959' }}>Hour Display:</Text>
                            <Space>
                                <Select value={settings.hourStart} style={{ width: 80 }} options={[{ label: '0:00', value: '0:00' }]} />
                                <Text style={{ fontSize: '12px' }}>Till</Text>
                                <Select value={settings.hourEnd} style={{ width: 80 }} options={[{ label: '24:00', value: '24:00' }]} />
                            </Space>
                        </div>

                        <SelectItem label="Text" valueKey="textLabel" options={['Surname', 'Reservation ID', 'Company']} />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default BookingChartOptionsModal;
