#!/usr/bin/env node

/**
 * Test with the exact webhook data from Lalamove
 * Run with: node test-exact-webhook.js
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Exact webhook data from Lalamove
const exactWebhookData = {
    "apiKey": "pk_test_c68358d847953299e2993899f2370dbc",
    "timestamp": 1757503305,
    "signature": "c09cda84c96d78892d00b3ad86bc78c2fea87eafa478469ba8d4c28110453f51",
    "eventId": "8B343F60-220B-4330-A242-61AFE4DA10B5",
    "eventType": "ORDER_STATUS_CHANGED",
    "eventVersion": "v3",
    "data": {
        "order": {
            "orderId": "3316227378875113604",
            "scheduleAt": "2025-09-10T19:08.00Z",
            "shareLink": "https://share.sandbox.lalamove.com?PH100250910190909430520010087055448&lang=en_PH&sign=bc88611da4c06955e9213ca165f87042&source=api_wrapper",
            "market": "PH_MNL",
            "createdAt": "2025-09-10T19:09.00Z",
            "driverId": "80557",
            "previousStatus": "ON_GOING",
            "status": "PICKED_UP"
        },
        "updatedAt": "2025-09-10T19:21.00Z"
    }
};

async function testExactWebhook() {
    console.log('🧪 Testing with exact Lalamove webhook data...\n');

    try {
        // Test the main webhook endpoint
        console.log('📝 Sending exact webhook data to main endpoint...');
        const response = await axios.post(`${API_URL}/webhooks/lalamove`, exactWebhookData);
        
        console.log('✅ Webhook response:', response.data);
        console.log('');

        console.log('🎉 Test completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        if (error.response?.data) {
            console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

// Run the test
testExactWebhook();
