#!/usr/bin/env node

/**
 * Check if a specific order exists in the database
 * Run with: node check-order.js
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Order from './models/order.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ MONGO_URI not found in environment variables');
    process.exit(1);
}

async function checkOrder() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // The order ID from Lalamove webhook
        const lalamoveOrderId = "3316227378875113604";
        
        console.log(`🔍 Looking for order with Lalamove ID: ${lalamoveOrderId}`);
        
        // Find the specific order
        const order = await Order.findOne({ 'lalamoveDetails.orderId': lalamoveOrderId });
        
        if (order) {
            console.log('✅ Order found!');
            console.log('Order details:', {
                _id: order._id,
                orderNumber: order.orderNumber,
                status: order.status,
                lalamoveOrderId: order.lalamoveDetails?.orderId,
                lalamoveStatus: order.lalamoveDetails?.status,
                createdAt: order.createdAt
            });
        } else {
            console.log('❌ Order not found!');
            
            // Show all orders with Lalamove details
            console.log('\n📋 All orders with Lalamove details:');
            const allOrders = await Order.find({ 'lalamoveDetails.orderId': { $exists: true } })
                .select('orderNumber lalamoveDetails.orderId lalamoveDetails.status createdAt')
                .sort({ createdAt: -1 });
            
            if (allOrders.length === 0) {
                console.log('  No orders with Lalamove details found');
            } else {
                allOrders.forEach((o, index) => {
                    console.log(`  ${index + 1}. Order ${o.orderNumber}: Lalamove ID ${o.lalamoveDetails?.orderId} (${o.lalamoveDetails?.status})`);
                });
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run the check
checkOrder();
