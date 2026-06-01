import React, { useState, useCallback } from 'react';
import { Modal, Switch, Select, Input, Typography, Button, Space, message } from 'antd';
import { SaveOutlined, ReloadOutlined, CloseOutlined } from '@ant-design/icons';
import { DEFAULT_CHART_OPTIONS } from '../hooks/useChartOptions';

const { Text, Title } = Typography;
const { Option } = Select;

const SIDEBAR_TABS = ['Options', 'Room Type Defaults', 'Data Window'];

const BookingChartOptionsModal = ({ visible, onClose, settings, onSave, onRestore }) => {
    const [localSettings, setLocalSettings] = useState(settings);
    const [activeTab, setActiveTab] = useState('Options');

    // Sync local state when modal opens with fresh settings from parent
    React.useEffect(() => {
        if (visible) {
            setLocalSettings(settings);
            setActiveTab('Options');
        }
    }, [visible, settings]);

    const handleChange = useCallback((key, value) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleSave = () => {
        const success = onSave(localSettings);
        if (success !== false) {
            message.success('Chart settings saved');
            onClose();
        } else {
            message.error('Failed to save settings');
        }
    };

    const handleRestore = () => {
        const defaults = { ...DEFAULT_CHART_OPTIONS };
        setLocalSettings(defaults);
        onRestore();
        message.info('Settings restored to defaults');
    };

    const ToggleItem = ({ label, valueKey }) => (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <Switch
                checked={!!localSettings[valueKey]}
                onChange={(checked) => handleChange(valueKey, checked)}
                style={{ marginRight: '12px' }}
            />
            <Text style={{ fontSize: '13px', color: '#595959' }}>{label}</Text>
        </div>
    );

    const SelectItem = ({ label, valueKey, options, style }) => (
        <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', alignItems: 'center', marginBottom: '12px' }}>
            <Text style={{ fontSize: '13px', color: '#595959' }}>{label}:</Text>
            <Select
                value={localSettings[valueKey]}
                onChange={(val) => handleChange(valueKey, val)}
                style={style}
                size="middle"
            >
                {options.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
            </Select>
        </div>
    );

    const renderContent = () => {
        if (activeTab === 'Room Type Defaults') {
            return (
                <div style={{ flex: 1, padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', color: '#8c8c8c' }}>
                        <div style={{ fontSize: 40, marginBottom: 16 }}>🏨</div>
                        <Title level={5} style={{ color: '#8c8c8c' }}>Room Type Defaults</Title>
                        <Text style={{ color: '#bfbfbf', fontSize: 13 }}>
                            Room type default settings will be available in a future update.
                        </Text>
                    </div>
                </div>
            );
        }

        if (activeTab === 'Data Window') {
            return (
                <div style={{ flex: 1, padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', color: '#8c8c8c' }}>
                        <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
                        <Title level={5} style={{ color: '#8c8c8c' }}>Data Window</Title>
                        <Text style={{ color: '#bfbfbf', fontSize: 13 }}>
                            Data window configuration will be available in a future update.
                        </Text>
                    </div>
                </div>
            );
        }

        // Options tab
        return (
            <div style={{ flex: 1, padding: '24px', display: 'flex', gap: '40px', overflowY: 'auto' }}>
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

                    <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: '12px' }}>
                        <Switch
                            checked={!!localSettings.hideOutOfOrderArea}
                            onChange={(c) => handleChange('hideOutOfOrderArea', c)}
                            style={{ marginRight: '12px', marginTop: '2px', flexShrink: 0 }}
                        />
                        <Text style={{ fontSize: '13px', color: '#595959', lineHeight: '1.4' }}>
                            Hide Area from view when out-of-order Area cover the entire selected date range
                        </Text>
                    </div>
                </div>

                {/* Right Column: Selects & Inputs */}
                <div style={{ width: '320px', flexShrink: 0 }}>
                    <SelectItem
                        label="Area Height"
                        valueKey="areaHeight"
                        options={['Small', 'Medium', 'Large']}
                        style={{ width: '100%' }}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', alignItems: 'center', marginBottom: '12px' }}>
                        <Text style={{ fontSize: '13px', color: '#595959' }}>Area Width:</Text>
                        <Input
                            value={localSettings.areaWidth}
                            onChange={(e) => handleChange('areaWidth', e.target.value)}
                        />
                    </div>

                    <SelectItem
                        label="Color"
                        valueKey="colorBy"
                        options={['Reservation Status', 'Payment Status']}
                        style={{ width: '100%' }}
                    />
                    <SelectItem
                        label="Column View By"
                        valueKey="columnViewBy"
                        options={['Day', 'Week', 'Month']}
                        style={{ width: '100%' }}
                    />
                    <SelectItem
                        label="Day View"
                        valueKey="dayView"
                        options={['7', '14', '30', '60', '90']}
                        style={{ width: '100%' }}
                    />
                    <SelectItem
                        label="View By"
                        valueKey="viewBy"
                        options={['Area (by Room Type Display Order)', 'Category']}
                        style={{ width: '100%' }}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', alignItems: 'center', marginBottom: '12px' }}>
                        <Text style={{ fontSize: '13px', color: '#595959' }}>Hour Display:</Text>
                        <Space>
                            <Select
                                value={localSettings.hourStart}
                                onChange={(v) => handleChange('hourStart', v)}
                                style={{ width: 80 }}
                                options={['0:00', '6:00', '8:00'].map(v => ({ label: v, value: v }))}
                            />
                            <Text style={{ fontSize: '12px' }}>till</Text>
                            <Select
                                value={localSettings.hourEnd}
                                onChange={(v) => handleChange('hourEnd', v)}
                                style={{ width: 80 }}
                                options={['18:00', '20:00', '24:00'].map(v => ({ label: v, value: v }))}
                            />
                        </Space>
                    </div>

                    <SelectItem
                        label="Text"
                        valueKey="textLabel"
                        options={['Surname', 'Reservation ID', 'Company']}
                        style={{ width: '100%' }}
                    />
                </div>
            </div>
        );
    };

    const customHeader = (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#001529',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '4px 4px 0 0',
        }}>
            <Title level={5} style={{ color: 'white', margin: 0 }}>Booking Chart Options</Title>
            <Space size="large">
                <Button
                    type="text"
                    title="Save settings"
                    onClick={handleSave}
                    icon={<SaveOutlined style={{ color: 'white', fontSize: '18px' }} />}
                />
                <Button
                    type="text"
                    title="Restore defaults"
                    onClick={handleRestore}
                    icon={<ReloadOutlined style={{ color: 'white', fontSize: '18px' }} />}
                />
                <Button
                    type="text"
                    title="Close"
                    onClick={onClose}
                    icon={<CloseOutlined style={{ color: 'white', fontSize: '18px' }} />}
                />
            </Space>
        </div>
    );

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            closable={false}
            width={1000}
            styles={{ body: { padding: 0 }, content: { padding: 0, borderRadius: '4px' } }}
            centered
        >
            {customHeader}
            <div style={{ display: 'flex', minHeight: '480px', backgroundColor: '#fff' }}>
                {/* Sidebar */}
                <div style={{ width: '200px', flexShrink: 0, backgroundColor: '#fafafa', borderRight: '1px solid #f0f0f0', padding: '16px 0' }}>
                    {SIDEBAR_TABS.map(tab => {
                        const isActive = activeTab === tab;
                        return (
                            <div
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    borderLeft: isActive ? '3px solid #1890ff' : '3px solid transparent',
                                    backgroundColor: isActive ? '#e6f7ff' : 'transparent',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {isActive && (
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#1890ff', marginRight: 8, flexShrink: 0 }} />
                                )}
                                <Text
                                    style={{
                                        fontSize: '13px',
                                        color: isActive ? '#262626' : '#8c8c8c',
                                        fontWeight: isActive ? 600 : 400,
                                        marginLeft: isActive ? 0 : 14,
                                    }}
                                >
                                    {tab}
                                </Text>
                            </div>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {renderContent()}
                </div>
            </div>
        </Modal>
    );
};

export default BookingChartOptionsModal;
