import { Col, Row } from 'antd';
import SectionCard from '../components/common/SectionCard.jsx';
import LoadingBlock from '../components/common/LoadingBlock.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import OperationsSnapshot from '../components/dashboard/OperationsSnapshot.jsx';
import RecentReservationsTable from '../components/dashboard/RecentReservationsTable.jsx';
import TaskSummaryTable from '../components/dashboard/TaskSummaryTable.jsx';
import { useDashboardStats } from '../hooks/useDashboardStats.js';
import { useReservationsQuery } from '../hooks/useReservationsQuery.js';
import { useTasksQuery } from '../hooks/useTasksQuery.js';
import { useVouchersQuery } from '../hooks/useVouchersQuery.js';

function DashboardPage() {
  const statsQuery = useDashboardStats();
  const reservationsQuery = useReservationsQuery({});
  const tasksQuery = useTasksQuery();
  const vouchersQuery = useVouchersQuery();

  if (statsQuery.isLoading && reservationsQuery.isLoading) {
    return <LoadingBlock rows={10} />;
  }

  const reservations = reservationsQuery.data || [];
  const tasks = tasksQuery.data || [];
  const vouchers = vouchersQuery.data || [];

  return (
    <div className="page-stack">
      <PageHeader
        title="Dashboard"
        subtitle="Monitor arrivals, departures, occupancy, operational load, and visible tenant data."
      />
      <OperationsSnapshot
        stats={statsQuery.data}
        reservationCount={reservations.length}
        taskCount={tasks.filter((task) => task.status !== 'Completed').length}
        voucherCount={vouchers.filter((voucher) => voucher.isActive !== false).length}
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <SectionCard title="Recent reservations">
            <RecentReservationsTable data={reservations.slice(0, 6)} loading={reservationsQuery.isLoading} />
          </SectionCard>
        </Col>
        <Col xs={24} xl={10}>
          <SectionCard title="Task workload">
            <TaskSummaryTable data={tasks.slice(0, 6)} loading={tasksQuery.isLoading} />
          </SectionCard>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;
