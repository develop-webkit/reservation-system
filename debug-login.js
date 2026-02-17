
const login = async () => {
    try {
        console.log("Attempting login to http://localhost:7000/api/v1/auth/login...");
        const response = await fetch('http://localhost:7000/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clientNumber: '1001',
                username: 'admin',
                password: 'password123'
            })
        });

        console.log('Status:', response.status);
        if (response.ok) {
            const data = await response.json();
            console.log('Login Response Data:', JSON.stringify(data, null, 2));
        } else {
            console.log('Response text:', await response.text());
        }
    } catch (e) {
        console.error('Connection Error:', e.message);
        console.log('Is the backend server running on port 7000?');
    }
};
login();
