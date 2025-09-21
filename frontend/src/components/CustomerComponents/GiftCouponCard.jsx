import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";



const GiftCouponCard = () => {

    const [userInputCode, setUserInputCode] = useState("");
    const { coupon, isCouponApplied, getMyCoupon, applyCoupon, removeCoupon } = cartStore();
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();


	useEffect(() => {
		if (isAuthenticated) {
			getMyCoupon();
		}
	}, [getMyCoupon, isAuthenticated]);

	useEffect(() => { 
		if(coupon) {
			setUserInputCode(coupon.code);
		}
	}, [coupon]);

	const handleApplyCoupon = () => {
		if (!userInputCode) return;
		if (!isAuthenticated) {
			navigate('/login');
			return;
		}
		applyCoupon(userInputCode);
	};

	const handleRemoveCoupon = async () => {
		if (!isAuthenticated) return;
		await removeCoupon();
		setUserInputCode("");
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
			transition={{ duration: 0.5, delay: 0.2 }}
		>
            <div className='space-y-4'>
            <div>
					<label htmlFor='voucher' className='mb-2 block text-sm font-medium' style={{ color: '#030105' }}>
						Do you have a voucher or gift card?
					</label>
					<input
						type='text'
						id='voucher'
						className='block w-full rounded-lg border p-2.5 text-sm transition-colors focus:outline-none focus:ring-2'
						style={{ 
							borderColor: '#f7e9b8', 
							backgroundColor: '#fffefc',
							color: '#030105',
							'::placeholder': { color: '#a31f17' }
						}}
						placeholder='Enter code here (optional)'
						value={userInputCode}
						onChange={(e) => setUserInputCode(e.target.value)}
					/>
				</div>
            
                <motion.button
					type='button'
					className='flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-4'
					style={{ 
						backgroundColor: '#860809',
						focusRingColor: '#a31f17'
					}}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleApplyCoupon}
				>
					Apply Code
				</motion.button>
                </div>
                {isCouponApplied && coupon && (
				<div className='mt-4'>
					<h3 className='text-lg font-medium' style={{ color: '#030105' }}>Applied Coupon</h3>

					<p className='mt-2 text-sm' style={{ color: '#a31f17' }}>
						{coupon.code} - {coupon.type === 'percent' ? `${coupon.amount}% off` : `₱${coupon.amount} off`}
					</p>

					<motion.button
						type='button'
						className='mt-2 flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-4'
						style={{ 
							backgroundColor: '#a31f17',
							focusRingColor: '#860809'
						}}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleRemoveCoupon}
					>
						Remove Coupon
					</motion.button>
				</div>
			)}

            {coupon && (
				<div className='mt-4'>
					<h3 className='text-lg font-medium' style={{ color: '#030105' }}>Your Available Coupon:</h3>
					<p className='mt-2 text-sm' style={{ color: '#a31f17' }}>
						{coupon.code} - {coupon.type === 'percent' ? `${coupon.amount}% off` : `₱${coupon.amount} off`}
					</p>
				</div>
			)}
            
			
		</motion.div>
		
  );


};

export default GiftCouponCard