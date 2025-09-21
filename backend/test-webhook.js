#!/usr/bin/env node

/**
 * Test script for webhook debugging
 * Run with: node test-webhook.js
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Test data based on the actual Lalamove webhook format you provided
const testWebhookData = {
    apiKey: "pk_test_c68358d847953299e2993899f2370dbc",
    timestamp: Math.floor(Date.now() / 1000),
    signature: "test_signature_123",
    eventId: "TEST_EVENT_ID_123",
    eventType: "ORDER_STATUS_CHANGED",
    eventVersion: "v3",
    data: {
        order: {
            orderId: "3316227378875113563",
            scheduleAt: "2025-09-10T19:00.00Z",
            shareLink: "https://share.sandbox.lalamove.com?PH100250910190105872520010059483757&lang=en_PH&sign=f44bb3cf37bf64cd56753cd6327bbee0&source=api_wrapper",
            market: "PH_MNL",
            createdAt: "2025-09-10T19:01.00Z",
            driverId: "80557",
            previousStatus: "PICKED_UP",
            status: "COMPLETED"
        },
        updatedAt: "2025-09-10T19:02.00Z"
    }
};

async function testWebhook() {
    console.log('🧪 Testing webhook endpoints...\n');

    try {
        // Test 1: Debug endpoint
        console.log('1. Testing debug endpoint...');
        const debugResponse = await axios.post(`${API_URL}/webhooks/debug`, testWebhookData);
        console.log('✅ Debug endpoint response:', debugResponse.data);
        console.log('');

        // Test 2: Test endpoint
        console.log('2. Testing test endpoint...');
        const testResponse = await axios.post(`${API_URL}/webhooks/test`, { message: 'test' });
        console.log('✅ Test endpoint response:', testResponse.data);
        console.log('');

        // Test 3: Simulate webhook
        console.log('3. Testing simulate endpoint...');
        const simulateResponse = await axios.post(`${API_URL}/webhooks/simulate`, {
            eventType: 'ORDER_STATUS_CHANGED',
            orderId: 'test123',
            status: 'COMPLETED'
        });
        console.log('✅ Simulate endpoint response:', simulateResponse.data);
        console.log('');

        // Test 4: Actual webhook endpoint
        console.log('4. Testing actual webhook endpoint...');
        const webhookResponse = await axios.post(`${API_URL}/webhooks/lalamove`, testWebhookData);
        console.log('✅ Webhook endpoint response:', webhookResponse.data);
        console.log('');

        console.log('🎉 All tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        console.error('Headers:', error.response?.headers);
    }
}

// Run the test
testWebhook();
