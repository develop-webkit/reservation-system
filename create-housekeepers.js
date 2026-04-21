#!/usr/bin/env node

/**
 * Script to create multiple housekeeper users in the RMS system
 * Run: node create-housekeepers.js
 */

import axios from 'axios';
import readline from 'readline';

const API_BASE_URL = 'http://localhost:3000';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createHousekeepers() {
    try {
        console.log('🏨 Housekeeping Staff Creator\n');

        // Get login credentials
        const clientNumber = await question('Enter Client Number: ');
        const username = await question('Enter Admin Username: ');
        const password = await question('Enter Admin Password: ');

        console.log('\n🔐 Logging in...');

        // Login to get JWT token
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
            clientNumber,
            username,
            password
        });

        const token = loginResponse.data.accessToken;
        console.log('✅ Logged in successfully\n');

        // Housekeeper data
        const housekeepers = [
            { username: 'hazel', fullName: 'Hazel Thompson', email: 'hazel@example.com' },
            { username: 'maria', fullName: 'Maria Garcia', email: 'maria@example.com' },
            { username: 'sarah', fullName: 'Sarah Johnson', email: 'sarah@example.com' },
            { username: 'jasmine', fullName: 'Jasmine Patel', email: 'jasmine@example.com' },
            { username: 'keiko', fullName: 'Keiko Tanaka', email: 'keiko@example.com' },
            { username: 'rosa', fullName: 'Rosa Martinez', email: 'rosa@example.com' },
            { username: 'elena', fullName: 'Elena Sokolov', email: 'elena@example.com' },
            { username: 'amy', fullName: 'Amy Chen', email: 'amy@example.com' },
            { username: 'helena', fullName: 'Helena Bergman', email: 'helena@example.com' },
            { username: 'lucia', fullName: 'Lucia Silva', email: 'lucia@example.com' }
        ];

        console.log(`📋 Creating ${housekeepers.length} housekeepers...\n`);

        let created = 0;
        let failed = 0;

        for (const hk of housekeepers) {
            try {
                const response = await axios.post(
                    `${API_BASE_URL}/user`,
                    {
                        clientNumber,
                        username: hk.username,
                        password: 'password123',
                        role: 'housekeeper',
                        fullName: hk.fullName,
                        email: hk.email
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log(`✅ Created: ${hk.fullName} (${hk.username})`);
                created++;
            } catch (error) {
                if (error.response?.status === 409 || error.message.includes('duplicate')) {
                    console.log(`⚠️  Already exists: ${hk.fullName} (${hk.username})`);
                } else {
                    console.log(`❌ Failed to create ${hk.fullName}: ${error.response?.data?.message || error.message}`);
                    failed++;
                }
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`   ✅ Created: ${created}`);
        console.log(`   ⚠️  Already existed: ${housekeepers.length - created - failed}`);
        console.log(`   ❌ Failed: ${failed}`);
        console.log(`\n🎉 Done! Login with any housekeeper username and password 'password123'`);

    } catch (error) {
        console.error('❌ Error:', error.response?.data?.message || error.message);
    } finally {
        rl.close();
    }
}

createHousekeepers();
