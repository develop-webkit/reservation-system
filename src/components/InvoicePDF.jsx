import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        fontFamily: 'Helvetica',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 30,
        borderBottomWidth: 2,
        borderBottomColor: '#000',
        paddingBottom: 10,
    },
    propertyName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    invoiceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    invoiceDate: {
        fontSize: 10,
        textAlign: 'right',
        color: '#555',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    twoColumnRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    column: {
        width: '48%',
    },
    detailRow: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 6,
    },
    detailLabel: {
        width: '45%',
        fontWeight: 'bold',
        fontSize: 10,
    },
    detailValue: {
        width: '55%',
        fontSize: 10,
    },
    table: {
        marginBottom: 20,
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 6,
    },
    tableRowLast: {
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 6,
    },
    tableHeaderRow: {
        display: 'flex',
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#000',
        paddingVertical: 6,
        fontWeight: 'bold',
        fontSize: 11,
        backgroundColor: '#f5f5f5',
    },
    tableCell: {
        width: '50%',
        fontSize: 10,
    },
    tableAmountCell: {
        width: '25%',
        textAlign: 'right',
        fontSize: 10,
    },
    balanceSection: {
        marginTop: 20,
        paddingTop: 10,
        borderTopWidth: 2,
        borderTopColor: '#000',
    },
    balanceRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        fontSize: 10,
    },
    balanceRowTotal: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        fontSize: 11,
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 40,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        fontSize: 9,
        textAlign: 'center',
        color: '#555',
    },
});

const InvoicePDF = ({ invoiceData }) => {
    const {
        resNo,
        guestName,
        clientNo,
        company,
        area,
        roomType,
        arrive,
        depart,
        nights,
        baseTariff,
        package: packageAmount,
        totalTariff,
        accomm,
        ar,
        accountNo,
        generatedDate,
    } = invoiceData;

    const balanceDue = (totalTariff || 0) - (accomm || 0) - (ar || 0);

    return (
        <Document title={`Invoice-${resNo}`}>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.propertyName}>Mount Morgan Space Solutions</Text>
                        <Text style={{ fontSize: 10, color: '#666' }}>Hotel Management</Text>
                    </View>
                    <View>
                        <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
                        <Text style={styles.invoiceDate}>Generated: {generatedDate}</Text>
                    </View>
                </View>

                {/* Details Section */}
                <View style={styles.twoColumnRow}>
                    <View style={styles.column}>
                        <Text style={styles.sectionTitle}>Guest Information</Text>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Guest Name:</Text>
                            <Text style={styles.detailValue}>{guestName}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Client No:</Text>
                            <Text style={styles.detailValue}>{clientNo}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Company:</Text>
                            <Text style={styles.detailValue}>{company || '—'}</Text>
                        </View>
                    </View>

                    <View style={styles.column}>
                        <Text style={styles.sectionTitle}>Reservation Details</Text>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Res No:</Text>
                            <Text style={styles.detailValue}>{resNo}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Room:</Text>
                            <Text style={styles.detailValue}>{area}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Room Type:</Text>
                            <Text style={styles.detailValue}>{roomType}</Text>
                        </View>
                    </View>
                </View>

                {/* Check-in/Check-out Section */}
                <View style={styles.twoColumnRow}>
                    <View style={styles.column}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Check-in:</Text>
                            <Text style={styles.detailValue}>{arrive}</Text>
                        </View>
                    </View>
                    <View style={styles.column}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Check-out:</Text>
                            <Text style={styles.detailValue}>{depart}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Number of Nights:</Text>
                    <Text style={styles.detailValue}>{nights}</Text>
                </View>

                {/* Billing Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Billing Details</Text>
                    <View style={styles.tableHeaderRow}>
                        <Text style={styles.tableCell}>Description</Text>
                        <Text style={styles.tableAmountCell}>Amount</Text>
                    </View>

                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Base Tariff</Text>
                        <Text style={styles.tableAmountCell}>${(baseTariff || 0).toFixed(2)}</Text>
                    </View>

                    {packageAmount > 0 && (
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Package</Text>
                            <Text style={styles.tableAmountCell}>${(packageAmount).toFixed(2)}</Text>
                        </View>
                    )}

                    <View style={styles.tableRowLast}>
                        <Text style={{ ...styles.tableCell, fontWeight: 'bold' }}>Total Tariff</Text>
                        <Text style={{ ...styles.tableAmountCell, fontWeight: 'bold' }}>
                            ${(totalTariff || 0).toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Balance Section */}
                <View style={styles.balanceSection}>
                    <Text style={styles.sectionTitle}>Payment Status</Text>
                    <View style={styles.balanceRow}>
                        <Text>Accommodation (A/R):</Text>
                        <Text>${(ar || 0).toFixed(2)}</Text>
                    </View>
                    <View style={styles.balanceRow}>
                        <Text>Paid:</Text>
                        <Text>${(accomm || 0).toFixed(2)}</Text>
                    </View>
                    <View style={styles.balanceRowTotal}>
                        <Text>Balance Due:</Text>
                        <Text>${Math.max(0, balanceDue).toFixed(2)}</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Mount Morgan Space Solutions | Hotel Management System</Text>
                    <Text style={{ marginTop: 4 }}>This is a computer-generated document.</Text>
                </View>
            </Page>
        </Document>
    );
};

export default InvoicePDF;
