import React from 'react';
import { Modal, Button, Spin } from 'antd';
import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';

const DownloadButton = ({ invoiceData }) => (
    <PDFDownloadLink
        document={<InvoicePDF invoiceData={invoiceData} />}
        fileName={`Invoice-${invoiceData.resNo}.pdf`}
    >
        {({ loading }) => (
            <Button
                icon={<DownloadOutlined />}
                loading={loading}
                disabled={loading}
            >
                Download PDF
            </Button>
        )}
    </PDFDownloadLink>
);

const InvoiceModal = ({
    open,
    onClose,
    onConfirm,
    invoiceData,
    isConfirming
}) => {
    return (
        <Modal
            title="Generate Invoice"
            open={open}
            onCancel={onClose}
            width={900}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <DownloadButton key="download" invoiceData={invoiceData} />,
                <Button
                    key="confirm"
                    type="primary"
                    icon={<PrinterOutlined />}
                    onClick={onConfirm}
                    loading={isConfirming}
                    disabled={isConfirming}
                >
                    {isConfirming ? 'Confirming...' : 'Confirm & Print'}
                </Button>,
            ]}
        >
            <div style={{ width: '100%', height: 600, position: 'relative' }}>
                {isConfirming && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            zIndex: 10,
                        }}
                    >
                        <Spin tip="Processing..." />
                    </div>
                )}
                <div className="invoice-pdf-viewer" style={{ width: '100%', height: '100%' }}>
                    <PDFViewer style={{ width: '100%', height: '100%' }}>
                        <InvoicePDF invoiceData={invoiceData} />
                    </PDFViewer>
                </div>
            </div>
        </Modal>
    );
};

export default InvoiceModal;
