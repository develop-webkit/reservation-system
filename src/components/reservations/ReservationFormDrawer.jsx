import { useCallback, useState } from 'react';
import {
  Alert, AutoComplete, Button, DatePicker, Drawer, Form, Input,
  InputNumber, Select, Switch,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { STATUS_OPTIONS } from '../../data/options';
import clientGroupsApi from '../../api/services/clientGroups.js';
import dayjs from 'dayjs';

const STATUS_COLOR_MAP = {
  'Unconfirmed': '#faad14',
  'Confirmed': '#52c41a',
  'Checked In': '#1890ff',
  'Checked Out': '#eb2f96',
  'Canceled': '#d9d9d9',
};

const normalizeStatusForForm = (status) => {
  if (!status) return undefined;
  const s = status.toLowerCase().replace(/\s+/g, '');
  if (s.includes('unconfirm')) return 'Unconfirmed';
  if (s.includes('checkedin') || s.includes('checkin')) return 'Checked In';
  if (s.includes('checkedout') || s.includes('checkout') || s.includes('depart')) return 'Checked Out';
  if (s.includes('cancel')) return 'Canceled';
  if (s.includes('confirm')) return 'Confirmed';
  return status;
};

function ReservationFormDrawer({
  open,
  onClose,
  onSubmit,
  loading,
  rooms,
  clients,
  companies,
  initialValues,
  hideBillingFields = false,
}) {
  const [form] = Form.useForm();
  const [memberOptions, setMemberOptions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const isEditing = Boolean(initialValues?._id || initialValues?.id);

  const mappedValues = initialValues
    ? {
        ...initialValues,
        room: initialValues.room?._id || initialValues.room,
        client: initialValues.client?._id || initialValues.client,
        company: initialValues.company?._id || initialValues.company,
        checkIn: initialValues.checkIn ? dayjs(initialValues.checkIn) : null,
        checkOut: initialValues.checkOut ? dayjs(initialValues.checkOut) : null,
        status: normalizeStatusForForm(initialValues.status),
        totalTariff: Number(initialValues.totalTariff) || 0,
        balance: Number(initialValues.balance) || 0,
        adults: Number(initialValues.adults) || 1,
        children: Number(initialValues.children) || 0,
        infants: Number(initialValues.infants) || 0,
      }
    : {
        adults: 1, children: 0, infants: 0, isFixed: false, totalTariff: 0, balance: 0,
        checkIn: dayjs().hour(15).minute(0).second(0),
        checkOut: dayjs().add(1, 'day').hour(6).minute(0).second(0),
      };

  const isCanceled = normalizeStatusForForm(initialValues?.status) === 'Canceled';

  const handleFormSubmit = (values) => {
    onSubmit({
      ...values,
      checkIn: values.checkIn?.toISOString(),
      checkOut: values.checkOut?.toISOString(),
      totalTariff: Number(values.totalTariff) || 0,
      balance: Number(values.balance) || 0,
    });
  };

  const handleMemberSearch = useCallback(async (searchText) => {
    if (!searchText || searchText.trim().length < 1) {
      setMemberOptions([]);
      return;
    }
    setSearchLoading(true);
    try {
      const results = await clientGroupsApi.searchMembers(searchText);
      setMemberOptions(
        (results || []).map((member) => ({
          value: member.name,
          label: (
            <div>
              <div style={{ fontWeight: 500 }}>{member.name}</div>
              <div style={{ fontSize: 11, color: '#8c8c8c' }}>
                {member.groupName} · {member.companyName}
              </div>
            </div>
          ),
          member,
        })),
      );
    } catch {
      setMemberOptions([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleMemberSelect = (_, option) => {
    if (!option?.member) return;
    const { member } = option;

    form.setFieldsValue({
      guestName: member.name,
      guestPhone: member.phone || '',
      guestEmail: member.email || '',
      groupName: member.groupName || '',
    });

    // Auto-resolve billing client from the member's linked client number.
    if (member.linkedClientNo && clients?.length) {
      const matched = clients.find((c) => c.clientNo === member.linkedClientNo);
      if (matched) {
        form.setFieldValue('client', matched._id);
      }
    }

    // Auto-match company by name.
    const matchedCompany = (companies || []).find(
      (c) => (c.name || c.companyName || '').toLowerCase() === member.companyName?.toLowerCase(),
    );
    if (matchedCompany) {
      form.setFieldValue('company', matchedCompany._id);
    }
  };

  return (
    <Drawer
      title={initialValues ? 'Edit reservation' : 'New reservation'}
      open={open}
      onClose={onClose}
      width={520}
      destroyOnHidden
      afterOpenChange={(visible) => {
        if (visible) {
          form.setFieldsValue(mappedValues);
        } else {
          form.resetFields();
          setMemberOptions([]);
        }
      }}
    >
      {isCanceled && (
        <Alert
          type="warning"
          message="This reservation is Canceled"
          description="Changing status will re-activate the reservation and re-block the room on the chart."
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleFormSubmit} validateTrigger={[]}>
        {isEditing && (
          <Form.Item label="Reservation No" name="resNo">
            <Input disabled style={{ backgroundColor: '#f5f5f5' }} />
          </Form.Item>
        )}

        {/* Group member search — auto-fills guest details and billing client */}
        <Form.Item label="Search Group Member">
          <AutoComplete
            options={memberOptions}
            onSearch={handleMemberSearch}
            onSelect={handleMemberSelect}
            placeholder="Type a member name to search…"
            notFoundContent={searchLoading ? 'Searching…' : 'No members found'}
            suffixIcon={<SearchOutlined />}
            allowClear
          />
          <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 4 }}>
            Select a group member to auto-fill guest details.
          </div>
        </Form.Item>

        {/* Hidden — auto-populated from member selection; submitted for backend billing resolution */}
        <Form.Item name="client" noStyle>
          <Input type="hidden" />
        </Form.Item>

        <Form.Item
          label="Guest name"
          name="guestName"
          rules={[{ required: true, message: 'Guest name is required.' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Phone" name="guestPhone">
          <Input placeholder="+61 400 000 000" />
        </Form.Item>

        <Form.Item label="Email" name="guestEmail">
          <Input placeholder="guest@example.com" />
        </Form.Item>

        <Form.Item label="Group Name" name="groupName">
          <Input placeholder="e.g. Maintenance Team" />
        </Form.Item>

        <Form.Item label="Room" name="room" rules={[{ required: true, message: 'Room is required.' }]}>
          <Select
            allowClear
            showSearch
            placeholder="Select a room"
            options={(rooms || []).map((room) => ({ label: room.name, value: room._id }))}
          />
        </Form.Item>

        <Form.Item label="Company" name="company">
          <Select
            allowClear
            showSearch
            placeholder="Select company"
            options={(companies || []).map((company) => ({
              label: company.name || company.companyName || company._id,
              value: company._id,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Check in"
          name="checkIn"
          rules={[{ required: true, message: 'Check in is required.' }]}
        >
          <DatePicker showTime className="full-width" format="YYYY-MM-DD HH:mm" />
        </Form.Item>

        <Form.Item
          label="Check out"
          name="checkOut"
          rules={[{ required: true, message: 'Check out is required.' }]}
        >
          <DatePicker showTime className="full-width" format="YYYY-MM-DD HH:mm" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Status is required.' }]}
        >
          <Select placeholder="Select status">
            {STATUS_OPTIONS.map((s) => (
              <Select.Option key={s} value={s}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: STATUS_COLOR_MAP[s] || '#8c8c8c',
                    flexShrink: 0,
                    display: 'inline-block',
                  }} />
                  {s}
                </span>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {!hideBillingFields && (
          <>
            <Form.Item label="Booking source" name="bookingSource">
              <Input placeholder="Direct" />
            </Form.Item>

            <Form.Item label="Voucher No" name="voucherNo">
              <Input placeholder="VCHR-2026-001" />
            </Form.Item>

            <Form.Item label="Total tariff" name="totalTariff">
              <InputNumber min={0} className="full-width" prefix="$" />
            </Form.Item>
          </>
        )}

        <Form.Item label="Adults" name="adults">
          <InputNumber min={0} className="full-width" />
        </Form.Item>

        <Form.Item label="Children" name="children">
          <InputNumber min={0} className="full-width" />
        </Form.Item>

        <Form.Item label="Infants" name="infants">
          <InputNumber min={0} className="full-width" />
        </Form.Item>

        <Form.Item label="Fixed reservation" name="isFixed" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} block size="large">
          {isEditing ? 'Update reservation' : 'Create reservation'}
        </Button>
      </Form>
    </Drawer>
  );
}

export default ReservationFormDrawer;
