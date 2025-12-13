// src/components/chart/RoomRow.jsx
import React, { useCallback } from 'react';
import { Space, Typography, theme } from 'antd'; 
import { HomeOutlined, SettingOutlined } from '@ant-design/icons'; // <-- FIX APPLIED: Changed BedOutlined to HomeOutlined
import { getReservationGridStyles } from '../../utils/chartUtils'; 

const { Text } = Typography;
const { useToken } = theme;

// Utility function to determine the color for the reservation status
const getStatusColor = (status) => {
    switch (status) {
        case 'Checked In':
            return '#52c41a'; // AntD Success Green
        case 'Confirmed':
            return '#1890ff'; // AntD Primary Blue
        case 'Tentative':
            return '#faad14'; // AntD Warning Yellow
        case 'Out of Order':
            return '#ff4d4f'; // AntD Error Red
        default:
            return '#999999'; // Gray
    }
};

const RoomRow = ({ room, chartDays, ROOM_COL_WIDTH, onMouseEnter, onMouseLeave, onContextMenu }) => {
    const { token } = useToken();
    const dateGridColumns = `repeat(${chartDays}, 1fr)`;

    const handleCellContextMenu = useCallback((e, reservation = null) => {
        const contextType = reservation ? 'reservation' : 'cell'; 
        onContextMenu(e, contextType, { room, reservation });
    }, [room, onContextMenu]);

    return (
        <div 
            className="chart-row-grid"
            style={{
                display: 'grid',
                gridTemplateColumns: `${ROOM_COL_WIDTH} ${dateGridColumns}`,
                borderBottom: `1px dashed ${token.colorBorderSecondary}`, 
                minHeight: '40px', 
                lineHeight: '40px', 
            }}
        >
            
            {/* 1. Room Label Column (Static Width) */}
            <div 
                className="room-label-col" 
                style={{ 
                    padding: `0 ${token.paddingSM}px`,
                    borderRight: `1px solid ${token.colorBorderSecondary}`,
                    backgroundColor: token.colorBgLayout, 
                    cursor: 'pointer',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
            >
                <Space size="small">
                    {/* Updated icon used here */}
                    <HomeOutlined style={{ color: token.colorTextSecondary }} /> 
                    
                    <Text strong>{room.name}</Text>
                    <SettingOutlined style={{ fontSize: '10px', color: token.colorTextTertiary }} />
                </Space>
            </div>

            {/* 2. Reservation Grid (Dynamic Columns) */}
            {/* ... (rest of the component remains the same) ... */}
            <div 
                className="reservation-grid-area" 
                style={{ 
                    display: 'grid',
                    gridTemplateColumns: dateGridColumns, 
                    position: 'relative', 
                    height: '100%',
                    width: '100%',
                }}
                onContextMenu={handleCellContextMenu} 
            >
                {/* 2a. Visual Grid Lines */}
                {Array.from({ length: chartDays }).map((_, index) => (
                    <div 
                        key={`grid-line-${index}`}
                        className="day-grid-line"
                        style={{ 
                            borderRight: `1px solid ${token.colorBorderSecondary}`,
                            height: '100%',
                            opacity: 0.5,
                            pointerEvents: 'none', 
                        }}
                    />
                ))}

                {/* 2b. Reservation Blocks */}
                {room.reservations.map(reservation => {
                    const gridStyles = getReservationGridStyles(reservation, chartDays); 
                    const statusColor = getStatusColor(reservation.status);

                    return (
                        <div
                            key={reservation.id}
                            className={`reservation-block reservation-${reservation.id}`}
                            style={{
                                ...gridStyles,
                                position: 'absolute',
                                zIndex: 1,
                                height: '80%',
                                top: '10%',
                                borderRadius: token.borderRadiusSM,
                                
                                backgroundColor: statusColor,
                                border: `1px solid ${statusColor}`, 
                                opacity: 0.9, 
                                
                                color: token.colorTextLightSolid, 
                                textAlign: 'center',
                                fontSize: '0.75rem',
                                padding: '0 4px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                
                                cursor: 'grab', 
                            }}
                            onMouseEnter={(e) => onMouseEnter(e, reservation, room)}
                            onMouseLeave={onMouseLeave}
                            onContextMenu={(e) => handleCellContextMenu(e, reservation)}
                        >
                            {reservation.guestName}
                        </div>
                    );
                })}

            </div>
        </div>
    );
};

export default RoomRow;