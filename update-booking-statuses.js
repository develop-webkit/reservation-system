import fs from 'fs';

const baseUrl = 'http://localhost:7000/api/v1';

const statuses = ['Confirmed', 'Checked In', 'Unconfirmed', 'Pending'];

function getRandomStatus() {
    return statuses[Math.floor(Math.random() * statuses.length)];
}

async function updateBookingStatuses() {
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

        // Fetch bookings using chart endpoint (we know this works)
        console.log('📋 Fetching all bookings via chart endpoint...');
        const chartRes = await fetch(`${baseUrl}/bookings/chart?startDate=2026-02-01&endDate=2026-04-01`, { headers });
        const chartData = await chartRes.json();
        const bookings = chartData.bookings || [];
        console.log(`✅ Found ${bookings.length} bookings\n`);

        if (bookings.length === 0) {
            console.log('No bookings to update.');
            return;
        }

        // Update each booking with a random status
        console.log('🔄 Updating booking statuses...\n');
        let updated = 0;
        let failed = 0;

        for (const booking of bookings) {
            const bookingId = booking._id || booking.id;
            const newStatus = getRandomStatus();

            const updateRes = await fetch(`${baseUrl}/bookings/${bookingId}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ status: newStatus })
            });

            if (updateRes.ok) {
                updated++;
                process.stdout.write(`  ✓ Updated ${updated}/${bookings.length} bookings to varied statuses\r`);
            } else {
                failed++;
                const error = await updateRes.text();
                console.log(`\n  ✗ Failed to update ${bookingId}: ${error}`);
            }

            // Small delay to avoid overwhelming the API
            await new Promise(resolve => setTimeout(resolve, 30));
        }

        console.log(`\n\n🎉 COMPLETE!`);
        console.log(`✅ Updated: ${updated} bookings with varied statuses`);
        console.log(`   Status distribution: Confirmed, Checked In, Unconfirmed, Pending (random)`);
        if (failed > 0) console.log(`❌ Failed: ${failed} bookings`);

    } catch (error) {
        console.error('❌ ERROR:', error.message);
    }
}

updateBookingStatuses();
