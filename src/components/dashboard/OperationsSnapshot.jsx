import { Col, Row } from 'antd';
import StatCard from '../common/StatCard.jsx';
import { formatDate } from '../../utils/format.js';

function OperationsSnapshot({ stats, reservationCount, taskCount, voucherCount }) {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12} xl={6}>
        <StatCard title="Today" value={formatDate(stats?.date)} color="#0d5c63" />
      </Col>
      <Col xs={24} md={12} xl={6}>
        <StatCard title="Arrivals" value={stats?.arrivals || 0} color="#2c6e49" />
      </Col>
      <Col xs={24} md={12} xl={6}>
        <StatCard title="Departures" value={stats?.departures || 0} color="#b23a48" />
      </Col>
      <Col xs={24} md={12} xl={6}>
        <StatCard title="In House" value={stats?.inHouse || 0} color="#1f3c88" />
      </Col>
      <Col xs={24} md={12} xl={8}>
        <StatCard title="Reservations Visible" value={reservationCount} color="#7c5c1e" />
      </Col>
      <Col xs={24} md={12} xl={8}>
        <StatCard title="Open Tasks" value={taskCount} color="#7a3e9d" />
      </Col>
      <Col xs={24} md={12} xl={8}>
        <StatCard title="Active Vouchers" value={voucherCount} color="#9b4d16" />
      </Col>
    </Row>
  );
}

export default OperationsSnapshot;
