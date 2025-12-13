// src/components/BookingFormDrawer.jsx

import React from 'react';
import { Drawer, Form, Input, Select, DatePicker, Button, Space, Typography, Row, Col, Divider } from 'antd';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

// Mock data options
const roomOptions = [
    { value: 'R001', label: 'Deluxe King (R001)' },
    { value: 'R004', label: 'Executive Suite (R004)' },
    // ... other room options from roomsData
];
const statusOptions = ['CONFIRMED', 'PENDING', 'CHECKED_IN', 'CANCELLED'];
const sourceOptions = ['Website', 'Walk-in', 'Booking.com', 'Expedia'];

const BookingFormDrawer = ({ visible, onClose, initialData = {} }) => {
    const [form] = Form.useForm();
    
    // Set initial form values based on the cell clicked in the chart
    React.useEffect(() => {
        if (visible) {
            form.setFieldsValue({
                ...initialData,
                checkIn: initialData.checkIn ? moment(initialData.checkIn) : null,
                checkOut: initialData.checkOut ? moment(initialData.checkOut) : null,
            });
        }
    }, [visible, initialData, form]);

    const onFinish = (values) => {
        console.log('Booking Submitted:', {
            ...values,
            // Format dates back to string for backend
            checkIn: values.checkIn ? values.checkIn.format('YYYY-MM-DD') : null,
            checkOut: values.checkOut ? values.checkOut.format('YYYY-MM-DD') : null,
        });
        // Logic to save the booking and refresh the chart would go here
        onClose(); 
    };

    return (
        <Drawer
            title={initialData.id ? `Edit Booking: ${initialData.id}` : `New Reservation for ${initialData.roomName || 'Unknown Room'}`}
            width={720}
            onClose={onClose}
            open={visible}
            bodyStyle={{ paddingBottom: 80, backgroundColor: '#000' }}
            headerStyle={{ backgroundColor: '#141414', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
            // Footer with action buttons
            footer={
                <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={form.submit} type="primary">
                        {initialData.id ? 'Update Booking' : 'Create Booking'}
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ status: 'CONFIRMED', source: 'Website', adults: 1 }}
            >
                {/* --- GUEST INFORMATION --- */}
                <Divider orientation="left" style={{ color: '#ccc' }}>Guest Details</Divider>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="guestName"
                            label={<Text style={{ color: '#ccc' }}>Full Name</Text>}
                            rules={[{ required: true, message: 'Please enter guest name' }]}
                        >
                            <Input placeholder="John Smith" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label={<Text style={{ color: '#ccc' }}>Email</Text>}
                            rules={[{ type: 'email', message: 'The input is not valid E-mail!' }]}
                        >
                            <Input placeholder="john@example.com" />
                        </Form.Item>
                    </Col>
                </Row>
                
                {/* --- BOOKING DETAILS --- */}
                <Divider orientation="left" style={{ color: '#ccc' }}>Reservation Details</Divider>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="roomId"
                            label={<Text style={{ color: '#ccc' }}>Unit/Room</Text>}
                            rules={[{ required: true, message: 'Please select a Room' }]}
                        >
                            <Select placeholder="Select a Room">
                                {roomOptions.map(r => <Option key={r.value} value={r.value}>{r.label}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="source"
                            label={<Text style={{ color: '#ccc' }}>Source</Text>}
                        >
                            <Select placeholder="Select Source">
                                {sourceOptions.map(s => <Option key={s} value={s}>{s}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                
                {/* --- DATES AND STATUS --- */}
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="checkIn"
                            label={<Text style={{ color: '#ccc' }}>Check-in Date</Text>}
                            rules={[{ required: true, message: 'Please select Check-in date' }]}
                        >
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="checkOut"
                            label={<Text style={{ color: '#ccc' }}>Check-out Date</Text>}
                            rules={[{ required: true, message: 'Please select Check-out date' }]}
                        >
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="status"
                            label={<Text style={{ color: '#ccc' }}>Status</Text>}
                        >
                            <Select>
                                {statusOptions.map(s => <Option key={s} value={s}>{s.replace('_', ' ')}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                
                {/* --- RATE AND GUESTS --- */}
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="rate"
                            label={<Text style={{ color: '#ccc' }}>Rate ($)</Text>}
                            rules={[{ required: true, message: 'Rate is required' }]}
                        >
                            <Input type="number" placeholder="150.00" addonBefore="$" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="adults"
                            label={<Text style={{ color: '#ccc' }}>Adults</Text>}
                        >
                            <Input type="number" min={1} placeholder="1" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="children"
                            label={<Text style={{ color: '#ccc' }}>Children</Text>}
                        >
                            <Input type="number" min={0} placeholder="0" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
};

export default BookingFormDrawer;