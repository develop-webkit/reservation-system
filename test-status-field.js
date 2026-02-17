const baseUrl = 'http://localhost:7000/api/v1';

async function testBookingCreation() {
    try {
        // Login
        console.log('🔐 Logging in...');
        const loginRes = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clientNumber: '1001',
                username: 'admin',
                password: 'password123'
            })
        });

        const { access_token: token } = await loginRes.json();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        console.log('✅ Login successful\n');

        // Test creating a booking WITH status field
        console.log('📝 Creating booking WITH status field set to "Confirmed"...');
        const testPayload = {
            roomId: '696e8a7f83ac0f5b4ce1bc8d', // B01
            startDate: '2026-03-01T14:00:00.000Z',
            endDate: '2026-03-03T10:00:00.000Z',
            guestName: 'Test Status User',
            guestEmail: 'test@example.com',
            guestPhone: '1234567890',
            bookingSource: 'Direct',
            voucher: 'None',
            status: 'Confirmed' // Trying to set status
        };

        console.log('Payload:', JSON.stringify(testPayload, null, 2));

        const createRes = await fetch(`${baseUrl}/bookings`, {
            method: 'POST',
            headers,
            body: JSON.stringify(testPayload)
        });

        const createResult = await createRes.json();
        console.log('\n📋 Created booking response:');
        console.log(JSON.stringify(createResult, null, 2));

        if (createResult._id || createResult.id) {
            const bookingId = createResult._id || createResult.id;
            console.log(`\n✅ Booking created with ID: ${bookingId}`);
            console.log(`   Requested status: Confirmed`);
            console.log(`   Actual status in response: ${createResult.status}`);

            // Conclusion
            if (createResult.status === 'Confirmed') {
                console.log('\n✅ SUCCESS: Status field IS accepted during creation!');
            } else if (createResult.status === 'Unconfirmed') {
                console.log('\n⚠️  ISSUE: Backend ignores status field during creation');
                console.log('   Solution: Need to update status with a PATCH request after creation');
            }
        }

    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error(error.stack);
    }
}

testBookingCreation();
