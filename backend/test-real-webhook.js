#!/usr/bin/env node

/**
 * Test script for webhook with real order data
 * Run with: node test-real-webhook.js
 */

import axios from 'axios';
import mongoose from 'mongoose';
import Order from './models/order.model.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const API_URL = 'http://localhost:5000/api';

async function testWithRealOrder() {
    try {
        console.log('🔍 Environment check:');
        console.log('MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
        
        if (!process.env.MONGO_URI) {
            console.log('❌ MONGO_URI not found in environment variables');
            console.log('💡 Make sure .env file exists in the root directory with MONGO_URI');
            return;
        }
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find a real order with Lalamove details
        const order = await Order.findOne({ 
            'lalamoveDetails.orderId': { $exists: true, $ne: null } 
        }).populate('products.product');

        if (!order) {
            console.log('❌ No orders with Lalamove details found in database');
            console.log('💡 Create an order first through the normal checkout process');
            return;
        }

        console.log(`✅ Found order: ${order._id}`);
        console.log(`📦 Lalamove Order ID: ${order.lalamoveDetails.orderId}`);
        console.log(`📊 Current Status: ${order.lalamoveDetails.status}`);

        // Test webhook with real order data
        const testWebhookData = {
            eventType: "ORDER_STATUS_CHANGED",
            eventId: "TEST_EVENT_ID_" + Math.random().toString(36).substr(2, 9),
            timestamp: Math.floor(Date.now() / 1000),
            data: {
                order: {
                    orderId: order.lalamoveDetails.orderId,
                    status: "COMPLETED",
                    driverId: "test_driver_123",
                    previousStatus: "PICKED_UP"
                }
            }
        };

        console.log('\n🧪 Testing webhook with real order data...');
        console.log('📋 Webhook data:', JSON.stringify(testWebhookData, null, 2));

        const response = await axios.post(`${API_URL}/webhooks/lalamove`, testWebhookData);
        
        console.log('\n✅ Webhook response:', response.data);

        // Check updated order
        const updatedOrder = await Order.findById(order._id);
        console.log('\n📊 Updated order status:', updatedOrder.lalamoveDetails.status);
        console.log('📊 Updated order main status:', updatedOrder.status);

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response?.status) {
            console.error('Status:', error.response.status);
        }
    } finally {
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
    }
}

// Run the test
testWithRealOrder();
