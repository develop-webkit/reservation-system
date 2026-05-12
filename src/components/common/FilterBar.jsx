import { Col, Row } from 'antd';

function FilterBar({ children }) {
  return (
    <div className="filter-bar">
      <Row gutter={[12, 12]}>{children}</Row>
    </div>
  );
}

export function FilterBarItem({ children, span = 6 }) {
  return (
    <Col xs={24} sm={12} lg={span}>
      {children}
    </Col>
  );
}

export default FilterBar;
