import fs from 'fs';

const baseUrl = 'http://localhost:7000/api/v1';

// Helper to generate random guest names
const guestNames = [
    'John Smith', 'Emma Wilson', 'Michael Brown', 'Sarah Davis', 'James Miller',
    'Emily Taylor', 'David Anderson', 'Olivia Thomas', 'Robert Jackson', 'Sophia White',
    'William Harris', 'Isabella Martin', 'Richard Thompson', 'Mia Garcia', 'Joseph Martinez',
    'Charlotte Robinson', 'Charles Clark', 'Amelia Rodriguez', 'Christopher Lewis', 'Harper Lee',
    'Daniel Walker', 'Evelyn Hall', 'Matthew Allen', 'Abigail Young', 'Anthony Hernandez',
    'Ella King', 'Donald Wright', 'Avery Lopez', 'Mark Hill', 'Scarlett Scott'
];

const statuses = ['Confirmed', 'Checked In', 'Unconfirmed', 'Pending'];

function getRandomName() {
    return guestNames[Math.floor(Math.random() * guestNames.length)];
}

function getRandomStatus() {
    return statuses[Math.floor(Math.random() * statuses.length)];
}

function addDays(dateStr, days) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString();
}

async function seedBookings() {
    try {
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

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const { access_token: token } = await loginRes.json();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        console.log('✅ Login successful\n');

        // Fetch all rooms
        console.log('🏠 Fetching rooms...');
        const roomsRes = await fetch(`${baseUrl}/rooms`, { headers });
        const roomsData = await roomsRes.json();
        const rooms = Array.isArray(roomsData) ? roomsData : (roomsData.data || []);
        console.log(`✅ Found ${rooms.length} rooms\n`);

        // Fetch all existing bookings
        console.log('📋 Fetching existing bookings...');
        const bookingsRes = await fetch(`${baseUrl}/bookings`, { headers });
        const bookingsData = await bookingsRes.json();
        const existingBookings = Array.isArray(bookingsData) ? bookingsData : (bookingsData.data || []);
        console.log(`✅ Found ${existingBookings.length} existing bookings\n`);

        // Delete all existing bookings
        if (existingBookings.length > 0) {
            console.log('🗑️  Deleting existing bookings...');
            let deleted = 0;
            for (const booking of existingBookings) {
                const bookingId = booking._id || booking.id;
                const delRes = await fetch(`${baseUrl}/bookings/${bookingId}`, {
                    method: 'DELETE',
                    headers
                });
                if (delRes.ok) deleted++;
            }
            console.log(`✅ Deleted ${deleted} bookings\n`);
        }

        // Create new bookings from Feb 15 to March 25, 2026
        console.log('📅 Creating new bookings from Feb 15 to March 25, 2026...\n');
        const startDate = '2026-02-15T14:00:00.000Z';
        const endDate = '2026-03-25T10:00:00.000Z';

        let createdCount = 0;
        let failedCount = 0;

        for (const room of rooms) {
            const roomId = room._id || room.id;
            let currentStart = startDate;
            let bookingNum = 1;

            console.log(`  📍 Room: ${room.name || roomId}`);

            // Fill the room with sequential bookings
            while (new Date(currentStart) < new Date(endDate)) {
                // Random stay duration between 2-7 days
                const duration = Math.floor(Math.random() * 6) + 2;
                const currentEnd = addDays(currentStart, duration);

                // Don't create bookings that extend beyond March 25
                if (new Date(currentEnd) > new Date(endDate)) break;

                const bookingData = {
                    roomId: roomId,
                    startDate: currentStart,
                    endDate: currentEnd,
                    guestName: getRandomName(),
                    status: getRandomStatus(),
                    people: '1A 0C',
                    reservationNo: `AUTO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    bookingSource: 'Direct',
                    voucher: 'None'
                };

                const createRes = await fetch(`${baseUrl}/bookings`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(bookingData)
                });

                if (createRes.ok) {
                    createdCount++;
                    process.stdout.write(`    ✓ Booking ${bookingNum++} created\r`);
                } else {
                    failedCount++;
                    const error = await createRes.text();
                    console.log(`    ✗ Failed: ${error}`);
                }

                // Move to next booking (start after current booking ends)
                currentStart = currentEnd;

                // Small delay to avoid overwhelming the API
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            console.log(`    ✅ Created ${bookingNum - 1} bookings for ${room.name || roomId}`);
        }

        console.log(`\n🎉 COMPLETE!`);
        console.log(`✅ Created: ${createdCount} bookings`);
        if (failedCount > 0) console.log(`❌ Failed: ${failedCount} bookings`);

    } catch (error) {
        console.error('❌ ERROR:', error.message);
    }
}

seedBookings();
