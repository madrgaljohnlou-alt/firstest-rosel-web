import { motion } from "framer-motion";
import { cartStore } from "../../store/cartStore";
import { MoveRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
const OrderSummary = () => {
  
    const {total, subtotal, cart} = cartStore();
    const { user, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    const formattedSubtotal = subtotal.toFixed(2);
    const formattedTotal = total.toFixed(2);
  
	const handleCheckout = () => {
		// Require login and customer role for checkout
		if (!isAuthenticated) {
			navigate('/login');
			return;
		}
		if (user?.role === 'admin') {
			return;
		}
		// Navigate to Information page for checkout process
		navigate('/information');
	};

    return (
        <motion.div
			className='space-y-4 rounded-lg border p-4 shadow-sm sm:p-6'
			style={{ 
				borderColor: '#f7e9b8', 
				backgroundColor: '#f8f3ed',
				boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
			}}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
            <p className='text-xl font-bold' style={{ color: '#901414' }}>Order Summary</p>

            <div className='space-y-4'>
                {/* Item Breakdown */}
                <div className='space-y-3'>
                    <h4 className='text-sm font-medium' style={{ color: '#a31f17' }}>Items ({cart.length})</h4>
                    <div className='space-y-2 max-h-48 overflow-y-auto'>
                        {cart.map((item) => {
                            const itemQuantity = item.cartQuantity || item.quantity;
                            const itemTotal = item.price * itemQuantity;
                            return (
                                <div key={item._id} className='flex items-center justify-between text-sm'>
                                    <div className='flex-1 min-w-0'>
                                        <p className='font-medium truncate' style={{ color: '#030105' }}>
                                            {item.name}
                                        </p>
                                        <p className='text-xs' style={{ color: '#a31f17' }}>
                                            {itemQuantity} × ₱{item.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className='ml-2 font-medium' style={{ color: '#030105' }}>
                                        ₱{itemTotal.toFixed(2)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className='space-y-2 border-t pt-3' style={{ borderColor: '#f7e9b8' }}>
                    <dl className='flex items-center justify-between gap-4'>
                        <dt className='text-base font-normal' style={{ color: '#a31f17' }}>Subtotal</dt>
							<dd className='text-base font-medium' style={{ color: '#030105' }}>₱{formattedSubtotal}</dd>
                    </dl>

                    <dl className='flex items-center justify-between gap-4 border-t pt-2' style={{ borderColor: '#f7e9b8' }}>
							<dt className='text-base font-bold' style={{ color: '#030105' }}>Total</dt>
							<dd className='text-base font-bold' style={{ color: '#860809' }}>₱{formattedTotal}</dd>
					</dl>

                </div>

                <motion.button
					className='flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-4'
					style={{ 
						backgroundColor: '#860809',
						focusRingColor: '#a31f17'
					}}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleCheckout}
					disabled={cart.length === 0 || user?.role === 'admin'}
				>
					Proceed to Checkout
				</motion.button>
                
                <div className='flex items-center justify-center gap-2'>
					<span className='text-sm font-normal' style={{ color: '#a31f17' }}>or</span>
					<Link
						to='/products'
						className='inline-flex items-center gap-2 text-sm font-medium underline transition-colors hover:opacity-80'
						style={{ color: '#860809' }}
					>
						Continue Shopping
						<MoveRight size={16} />
					</Link>
				</div>

            </div>

        </motion.div>
    )
}

export default OrderSummary