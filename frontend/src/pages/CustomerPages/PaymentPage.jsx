import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { cartStore } from "../../store/cartStore";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

const stripePromise = loadStripe("pk_test_51RzvsAQLpV5kMs2ThwusOgu35LHxSmEnceTJmnLtYsqkxPjcnVHGVB6El0s0hXyrcMky0LvCcVtspx1NR8bg7fI000RAeqmMYB");

const PaymentPage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();
    const { cart, clearCart } = cartStore();

    // State
    const [checkoutData, setCheckoutData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    useEffect(() => {
        // Redirect if not authenticated or not customer
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (user?.role !== 'customer') {
            navigate('/');
            return;
        }

        // Load checkout data from sessionStorage
        const savedCheckoutData = sessionStorage.getItem('checkoutData');
        if (!savedCheckoutData) {
            toast.error('Checkout information not found. Please start over.');
            navigate('/carts');
            return;
        }

        setCheckoutData(JSON.parse(savedCheckoutData));
    }, [isAuthenticated, user, navigate]);

    const handlePayment = async () => {
        if (!checkoutData) {
            toast.error('Checkout data not found');
            return;
        }

        setIsProcessing(true);
        setPaymentError(null);

        try {
            // Prepare payment data
            const paymentData = {
                products: checkoutData.cart,
                couponCode: checkoutData.coupon?.code || null,
                shippingInfo: checkoutData.shippingInfo,
                shippingMethod: checkoutData.selectedShipping,
                lalamoveQuote: checkoutData.lalamoveQuote,
                finalTotal: checkoutData.finalTotal
            };

            console.log('Payment data being sent:', paymentData);

            // Create checkout session with Stripe
            const stripe = await stripePromise;
            const response = await axios.post(`${API_URL}/payments/create-checkout-session`, paymentData);
            
            console.log('Payment response:', response.data);

            if (response.data.success) {
                const session = response.data;
                
                // Redirect to Stripe Checkout
                const result = await stripe.redirectToCheckout({
                    sessionId: session.id,
                });

                if (result.error) {
                    setPaymentError(result.error.message);
                    toast.error('Payment failed: ' + result.error.message);
                }
            } else {
                throw new Error(response.data.message || 'Failed to create payment session');
            }
        } catch (error) {
            console.error('Payment error:', error);
            setPaymentError(error.response?.data?.message || error.message || 'Payment failed');
            toast.error('Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleBackToShipping = () => {
        navigate('/shipping-options');
    };

    if (!isAuthenticated || user?.role !== 'customer' || !checkoutData) {
        return null;
    }

    const { shippingInfo, selectedShipping, lalamoveQuote, finalTotal, cart: cartItems, coupon, isCouponApplied } = checkoutData;
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.cartQuantity || item.quantity)), 0);
    const deliveryFee = selectedShipping === 'lalamove' && lalamoveQuote 
        ? parseFloat(
            lalamoveQuote.quotation?.priceBreakdown?.total || 
            lalamoveQuote.quotation?.total || 
            lalamoveQuote.quotation?.price || 
            lalamoveQuote.quotation?.data?.priceBreakdown?.total ||
            lalamoveQuote.quotation?.data?.total ||
            0
        ) 
        : 0;

    return (
        <div className='min-h-screen pt-24 pb-8 md:pt-32 md:pb-16' style={{ backgroundColor: '#fffefc' }}>
            <div className='mx-auto max-w-screen-xl px-4 2xl:px-0'>
                {/* Header */}
                <motion.div
                    className='mb-8'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <button
                        onClick={handleBackToShipping}
                        className='inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80 mb-4'
                        style={{ color: '#860809' }}
                    >
                        <ArrowLeft size={16} />
                        Back to Shipping Options
                    </button>
                    
                    <h1 className='text-3xl font-bold' style={{ color: '#030105' }}>
                        Payment
                    </h1>
                    <p className='text-sm mt-2' style={{ color: '#a31f17' }}>
                        Step 3 of 3 - Complete your order
                    </p>
                </motion.div>

                <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
                    {/* Left Side - Order Details */}
                    <motion.div
                        className='lg:col-span-2 space-y-6'
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {/* Shipping Information */}
                        <div className='rounded-lg border p-6' style={{ borderColor: '#f7e9b8', backgroundColor: '#f8f3ed' }}>
                            <h2 className='text-xl font-semibold mb-4' style={{ color: '#030105' }}>
                                Shipping Information
                            </h2>
                            
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <h3 className='text-sm font-medium mb-2' style={{ color: '#a31f17' }}>Contact</h3>
                                    <div className='space-y-1 text-sm' style={{ color: '#030105' }}>
                                        <div>{shippingInfo.email}</div>
                                        <div>{shippingInfo.phone}</div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className='text-sm font-medium mb-2' style={{ color: '#a31f17' }}>Delivery Address</h3>
                                    <div className='text-sm' style={{ color: '#030105' }}>
                                        <div>{shippingInfo.firstName} {shippingInfo.lastName}</div>
                                        <div>{shippingInfo.address}</div>
                                        <div>{shippingInfo.barangay}, {shippingInfo.city}</div>
                                        <div>{shippingInfo.province} {shippingInfo.postalCode}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Method */}
                        <div className='rounded-lg border p-6' style={{ borderColor: '#f7e9b8', backgroundColor: '#f8f3ed' }}>
                            <h2 className='text-xl font-semibold mb-4' style={{ color: '#030105' }}>
                                Shipping Method
                            </h2>
                            
                            <div className='flex items-center justify-between p-4 rounded-lg' style={{ backgroundColor: '#f8f3ed' }}>
                                <div className='flex items-center gap-3'>
                                    <div className='w-8 h-8 rounded-full flex items-center justify-center' style={{ backgroundColor: '#860809' }}>
                                        {selectedShipping === 'pickup' ? (
                                            <CheckCircle size={16} className='text-white' />
                                        ) : (
                                            <CheckCircle size={16} className='text-white' />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className='font-medium' style={{ color: '#030105' }}>
                                            {selectedShipping === 'pickup' ? 'Pick Up in Store' : 'Lalamove Delivery'}
                                        </h3>
                                        <p className='text-sm' style={{ color: '#a31f17' }}>
                                            {selectedShipping === 'pickup' 
                                                ? 'Free pickup at our location' 
                                                : `${lalamoveQuote?.serviceType} • ${lalamoveQuote?.distance?.toFixed(1) || 0}km`
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className='text-right'>
                                    <div className='font-semibold' style={{ color: '#860809' }}>
                                        {selectedShipping === 'pickup' 
                                            ? 'FREE' 
                                            : `₱${deliveryFee.toFixed(2)}`
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className='rounded-lg border p-6' style={{ borderColor: '#f7e9b8', backgroundColor: '#f8f3ed' }}>
                            <h2 className='text-xl font-semibold mb-4' style={{ color: '#030105' }}>
                                Order Items
                            </h2>
                            
                            <div className='space-y-4'>
                                {cartItems.map((item) => (
                                    <div key={item._id} className='flex items-center gap-4 p-3 rounded-lg' style={{ backgroundColor: '#f8f3ed' }}>
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className='w-16 h-16 rounded-lg object-cover'
                                        />
                                        <div className='flex-1'>
                                            <h3 className='font-medium' style={{ color: '#030105' }}>{item.name}</h3>
                                            <p className='text-sm' style={{ color: '#a31f17' }}>
                                                Quantity: {item.cartQuantity || item.quantity} • ₱{item.price} each
                                            </p>
                                        </div>
                                        <div className='text-right'>
                                            <div className='font-semibold' style={{ color: '#860809' }}>
                                                ₱{(item.price * (item.cartQuantity || item.quantity)).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side - Payment Summary */}
                    <motion.div
                        className='space-y-6'
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className='rounded-lg border p-6' style={{ borderColor: '#f7e9b8', backgroundColor: '#f8f3ed' }}>
                            <h2 className='text-xl font-semibold mb-4' style={{ color: '#030105' }}>
                                Payment Summary
                            </h2>
                            
                            <div className='space-y-3'>
                                <div className='flex justify-between text-sm'>
                                    <span style={{ color: '#030105' }}>Subtotal</span>
                                    <span style={{ color: '#030105' }}>₱{subtotal.toFixed(2)}</span>
                                </div>

                                {/* Coupon Discount */}
                                {isCouponApplied && coupon && (
                                    <div className='flex justify-between text-sm'>
                                        <span style={{ color: '#030105' }}>Coupon ({coupon.code})</span>
                                        <span className='text-green-600'>
                                            -₱{(coupon.type === 'percent' ? subtotal * (coupon.amount / 100) : Math.min(coupon.amount, subtotal)).toFixed(2)}
                                        </span>
                                    </div>
                                )}

                                {/* Shipping Fee */}
                                <div className='flex justify-between text-sm'>
                                    <span style={{ color: '#030105' }}>Shipping</span>
                                    <span style={{ color: '#030105' }}>
                                        {selectedShipping === 'pickup' ? 'FREE' : `₱${deliveryFee.toFixed(2)}`}
                                    </span>
                                </div>

                                <div className='border-t pt-3' style={{ borderColor: '#f7e9b8' }}>
                                    <div className='flex justify-between font-semibold text-lg'>
                                        <span style={{ color: '#030105' }}>Total</span>
                                        <span style={{ color: '#860809' }}>
                                            ₱{finalTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className='rounded-lg border p-6' style={{ borderColor: '#f7e9b8', backgroundColor: '#f8f3ed' }}>
                            <h2 className='text-xl font-semibold mb-4 flex items-center gap-2' style={{ color: '#030105' }}>
                                <CreditCard size={20} />
                                Payment Method
                            </h2>
                            
                            <div className='space-y-3'>
                                <div className='p-4 rounded-lg border-2 border-blue-200 bg-blue-50'>
                                    <div className='flex items-center gap-3'>
                                        <CreditCard size={20} style={{ color: '#1e40af' }} />
                                        <div>
                                            <h3 className='font-medium' style={{ color: '#1e40af' }}>Credit/Debit Card</h3>
                                            <p className='text-sm' style={{ color: '#1e3a8a' }}>
                                                Secure payment powered by Stripe
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className='text-xs' style={{ color: '#a31f17' }}>
                                    You will be redirected to Stripe's secure payment page to complete your purchase.
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {paymentError && (
                            <div className='rounded-lg border p-4' style={{ borderColor: '#ef4444', backgroundColor: '#fef2f2' }}>
                                <div className='flex items-center gap-2'>
                                    <AlertCircle size={16} style={{ color: '#ef4444' }} />
                                    <span className='text-sm font-medium' style={{ color: '#ef4444' }}>
                                        Payment Error
                                    </span>
                                </div>
                                <p className='text-sm mt-1' style={{ color: '#dc2626' }}>
                                    {paymentError}
                                </p>
                            </div>
                        )}

                        {/* Pay Button */}
                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className='w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg text-white font-medium transition-colors hover:opacity-90 focus:outline-none focus:ring-4 disabled:opacity-50'
                            style={{ backgroundColor: '#860809' }}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader size={20} className='animate-spin' />
                                    Processing Payment...
                                </>
                            ) : (
                                <>
                                    <CreditCard size={20} />
                                    Pay ₱{finalTotal.toFixed(2)}
                                </>
                            )}
                        </button>

                        {/* Security Notice */}
                        <div className='text-center text-xs' style={{ color: '#a31f17' }}>
                            <div className='flex items-center justify-center gap-2 mb-1'>
                                <CheckCircle size={12} />
                                <span>Secure SSL encrypted payment</span>
                            </div>
                            <div>Your payment information is safe and secure</div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
