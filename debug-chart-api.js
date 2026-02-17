
const testChartApi = async () => {
    const loginUrl = 'http://localhost:7000/api/v1/auth/login';
    const bookingsUrl = 'http://localhost:7000/api/v1/bookings';

    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clientNumber: '1001',
                username: 'admin',
                password: 'password123'
            })
        });

        if (!loginRes.ok) {
            console.error('Login failed:', await loginRes.text());
            return;
        }

        const loginData = await loginRes.json();
        const token = loginData.access_token;
        console.log('Login successful.');

        // 2. Fetch ALL Bookings
        console.log(`\n--- Fetching ALL Bookings ---`);
        const res = await fetch(bookingsUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('Status:', res.status);
        if (res.ok) {
            const data = await res.json();
            // Data might be wrapped in { data: [], total: ... } or just []
            const bookings = Array.isArray(data) ? data : (data.data || []);

            console.log(`Total Bookings Found: ${bookings.length}`);
            if (bookings.length > 0) {
                console.log('Sample Booking Dates:');
                bookings.slice(0, 5).forEach(b => {
                    console.log(`- ID: ${b.id || b._id}, CheckIn: ${b.checkIn}, CheckOut: ${b.checkOut}, RoomId: ${b.roomId}`);
                });
            }
        } else {
            console.log('Error:', await res.text());
        }

    } catch (e) {
        console.error('Connection Error:', e.message);
    }
};

testChartApi();
