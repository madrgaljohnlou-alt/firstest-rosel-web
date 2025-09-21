#!/usr/bin/env node

/**
 * Test script for the simple webhook endpoint
 * Run with: node test-simple-webhook.js
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Test data that matches the actual Lalamove webhook format
const testWebhookData = {
    eventType: "ORDER_STATUS_CHANGED",
    eventId: "8B343F60-220B-4330-A242-61AFE4DA10B5",
    timestamp: Math.floor(Date.now() / 1000),
    data: {
        order: {
            orderId: "3316227378875113563",
            status: "COMPLETED",
            driverId: "80557",
            previousStatus: "PICKED_UP"
        }
    }
};

async function testSimpleWebhook() {
    console.log('🧪 Testing simple webhook endpoint...\n');

    try {
        // Test the simple webhook endpoint
        console.log('📝 Sending webhook to simple endpoint...');
        const response = await axios.post(`${API_URL}/webhooks/simple`, testWebhookData);
        
        console.log('✅ Simple webhook response:', response.data);
        console.log('');

        // Test the main webhook endpoint
        console.log('📝 Sending webhook to main endpoint...');
        const mainResponse = await axios.post(`${API_URL}/webhooks/lalamove`, testWebhookData);
        
        console.log('✅ Main webhook response:', mainResponse.data);
        console.log('');

        console.log('🎉 All tests completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        if (error.response?.data) {
            console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

// Run the test
testSimpleWebhook();
