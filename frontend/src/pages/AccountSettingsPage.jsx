import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import { Camera, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ProvinceDropdown from "../components/ProvinceDropdown";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { validatePhilippinePhone, formatPhoneInput, getPhoneErrorMessage } from "../utils/phoneValidation";
import toast from "react-hot-toast";

const AccountSettingsPage = () => {
    const { user, updateProfile, changePassword, changeEmail, isLoading } = useAuthStore();
    
    // Tab state
    const [activeTab, setActiveTab] = useState('details');
    
    // Form states
    const [formData, setFormData] = useState({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        phone: user?.phone || '',
        street: user?.address?.street || '',
        barangay: user?.address?.barangay || '',
        city: user?.address?.city || '',
        province: user?.address?.province || '',
        country: user?.address?.country || 'Philippines',
        postalCode: user?.address?.postalCode || '',
        profileImage: user?.profileImageUrl || user?.avatarUrl || user?.profileImage || user?.photoURL || user?.photo || ''
    });
    
    // Password form states
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    // Email change states
    const [emailData, setEmailData] = useState({
        newEmail: '',
        currentPassword: ''
    });
    
    // UI states
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
        emailPassword: false
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handlePhoneChange = (value) => {
        const formatted = formatPhoneInput(value);
        setFormData(prev => ({ ...prev, phone: formatted }));
        
        const phoneError = getPhoneErrorMessage(formatted);
        if (phoneError) {
            setErrors(prev => ({ ...prev, phone: phoneError }));
        } else {
            setErrors(prev => ({ ...prev, phone: null }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, profileImage: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmitDetails = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const payload = {
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                phone: formData.phone,
                address: {
                    street: formData.street,
                    barangay: formData.barangay,
                    city: formData.city,
                    province: formData.province,
                    country: formData.country,
                    postalCode: formData.postalCode
                }
            };

            if (formData.profileImage.startsWith('data:')) {
                payload.image = formData.profileImage;
            } else if (formData.profileImage) {
                payload.avatarUrl = formData.profileImage;
            }

            await updateProfile(payload);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setErrors({ confirmPassword: 'Passwords do not match' });
            setIsSubmitting(false);
            return;
        }

        try {
            await changePassword(passwordData.currentPassword, passwordData.newPassword);
            toast.success('Password changed successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.message || 'Failed to change password');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            await changeEmail(emailData.newEmail, emailData.currentPassword);
            toast.success('Email change request sent! Please check your new email for verification.');
            setEmailData({ newEmail: '', currentPassword: '' });
        } catch (error) {
            toast.error(error.message || 'Failed to change email');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = async () => {
        try {
            await useAuthStore.getState().forgotPassword(user.email);
            toast.success('Password reset link sent to your email!');
        } catch (error) {
            toast.error(error.message || 'Failed to send reset link');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className='max-w-4xl w-full mx-auto px-4 sm:px-6 md:px-8 pt-24 pb-8'
        >
            {/* Back to Home Link */}
            <div className="mb-4">
                <Link
                    to="/"
                    className="inline-flex items-center text-[#901414] hover:text-[#a31f17] transition-colors duration-300"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
            </div>
            
            <h1 className='text-2xl md:text-3xl font-bold text-[#901414] mb-8'>Account Settings</h1>

            <div className='bg-[#feffff] rounded-lg shadow-lg'>
                {/* Tab Navigation */}
                <div className='border-b border-[#f8f3ed]'>
                    <nav className='flex space-x-8 px-6'>
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'details'
                                    ? 'border-[#901414] text-[#901414]'
                                    : 'border-transparent text-[#82695b] hover:text-[#901414]'
                            }`}
                        >
                            My Details
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'password'
                                    ? 'border-[#901414] text-[#901414]'
                                    : 'border-transparent text-[#82695b] hover:text-[#901414]'
                            }`}
                        >
                            Password
                        </button>
                    </nav>
                </div>

                <div className='p-6'>
                    {/* My Details Tab */}
                    {activeTab === 'details' && (
                        <form onSubmit={handleSubmitDetails} className='space-y-6'>
                            {/* Profile Picture */}
                            <div>
                                <label className='block text-sm font-medium text-[#82695b] mb-3'>Profile Picture</label>
                                <div className='flex items-center gap-4'>
                                    <div className='relative'>
                                        <div className='w-20 h-20 rounded-full bg-[#f8f3ed] border-2 border-[#82695b] overflow-hidden flex items-center justify-center'>
                                            {formData.profileImage ? (
                                                <img src={formData.profileImage} alt='Profile' className='w-full h-full object-cover' />
                                            ) : (
                                                <div className='text-[#82695b] text-2xl font-semibold'>
                                                    {formData.firstName?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                            )}
                                        </div>
                                        <label className='absolute -bottom-1 -right-1 w-8 h-8 bg-[#901414] hover:bg-[#7a1010] text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors'>
                                            <Camera size={16} />
                                            <input type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
                                        </label>
                                    </div>
                                    <div>
                                        <p className='text-sm text-gray-600'>Click the camera icon to change your profile picture</p>
                                    </div>
                                </div>
                            </div>

                            {/* Name Fields */}
                            <div className='grid md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-[#82695b] mb-2'>First Name</label>
                                    <input
                                        type='text'
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901414] focus:border-[#901414]'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-[#82695b] mb-2'>Last Name</label>
                                    <input
                                        type='text'
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901414] focus:border-[#901414]'
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className='block text-sm font-medium text-[#82695b] mb-2'>Email Address</label>
                                <div className='flex gap-2'>
                                    <input
                                        type='email'
                                        value={formData.email}
                                        disabled
                                        className='flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setActiveTab('password')}
                                        className='px-4 py-2 bg-[#ffd901] hover:bg-[#e6c200] text-[#82695b] rounded-md font-medium transition-colors'
                                    >
                                        Change
                                    </button>
                                </div>
                                <p className='text-xs text-gray-500 mt-1'>To change your email, use the Password tab</p>
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className='block text-sm font-medium text-[#82695b] mb-2'>Phone Number</label>
                                <input
                                    type='tel'
                                    value={formData.phone}
                                    onChange={(e) => handlePhoneChange(e.target.value)}
                                    placeholder='+63 9XX XXX XXXX'
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#901414] focus:border-[#901414] ${
                                        errors.phone ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.phone && <p className='text-red-500 text-sm mt-1'>{errors.phone}</p>}
                            </div>

                            {/* Address Fields */}
                            <div>
                                <h3 className='text-lg font-semibold text-[#82695b] mb-4'>Address</h3>
                                <div className='grid md:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-[#82695b] mb-2'>Street</label>
                                        <input
                                            type='text'
                                            value={formData.street}
                                            onChange={(e) => handleInputChange('street', e.target.value)}
                                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901414] focus:border-[#901414]'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-[#82695b] mb-2'>Barangay</label>
                                        <input
                                            type='text'
                                            value={formData.barangay}
                                            onChange={(e) => handleInputChange('barangay', e.target.value)}
                                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901414] focus:border-[#901414]'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-[#82695b] mb-2'>City</label>
                                        <input
                                            type='text'
                                            value={formData.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901414] focus:border-[#901414]'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-[#82695b] mb-2'>Province</label>
                                        <ProvinceDropdown
                                            value={formData.province}
                                            onChange={(value) => handleInputChange('province', value)}
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-[#82695b] mb-2'>Country</label>
                                        <select
                                            value={formData.country}
                                            onChange={(e) => handleInputChange('country', e.target.value)}
                                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901414] focus:border-[#901414]'
                                        >
                                            <option value='Philippines'>Philippines</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-[#82695b] mb-2'>Postal Code</label>
                                        <input
                                            type='text'
                                            value={formData.postalCode}
                                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901414] focus:border-[#901414]'
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className='flex justify-end'>
                                <button
                                    type='submit'
                                    disabled={isLoading || isSubmitting}
                                    className='px-6 py-2 bg-[#901414] hover:bg-[#7a1010] text-white rounded-md font-medium transition-colors disabled:opacity-50'
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <div className='space-y-8'>
                            {/* Change Password Form */}
                            <form onSubmit={handleSubmitPassword} className='space-y-6'>
                                <h3 className='text-lg font-semibold text-[#82695b]'>Change Password</h3>
                                
                                <div>
                                    <label className='block text-sm font-medium text-[#82695b] mb-2'>Current Password</label>
                                    <div className='relative'>
                                        <input
                                            type={showPasswords.current ? 'text' : 'password'}
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                            className='w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901414] focus:border-[#901414]'
                                            required
                                        />
                                        <button
                                            type='button'
                                            onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                            className='absolute inset-y-0 right-0 pr-3 flex items-center'
                                        >
                                            {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-[#82695b] mb-2'>New Password</label>
                                    <div className='relative'>
                                        <input
                                            type={showPasswords.new ? 'text' : 'password'}
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                            className='w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901414] focus:border-[#901414]'
                                            required
                                        />
                                        <button
                                            type='button'
                                            onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                            className='absolute inset-y-0 right-0 pr-3 flex items-center'
                                        >
                                            {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <PasswordStrengthMeter password={passwordData.newPassword} />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-[#82695b] mb-2'>Confirm New Password</label>
                                    <div className='relative'>
                                        <input
                                            type={showPasswords.confirm ? 'text' : 'password'}
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#901414] focus:border-[#901414] ${
                                                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            required
                                        />
                                        <button
                                            type='button'
                                            onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                            className='absolute inset-y-0 right-0 pr-3 flex items-center'
                                        >
                                            {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className='text-red-500 text-sm mt-1'>{errors.confirmPassword}</p>}
                                </div>

                                <div className='flex justify-end'>
                                    <button
                                        type='submit'
                                        disabled={isLoading || isSubmitting}
                                        className='px-6 py-2 bg-[#901414] hover:bg-[#7a1010] text-white rounded-md font-medium transition-colors disabled:opacity-50'
                                    >
                                        {isSubmitting ? 'Changing...' : 'Change Password'}
                                    </button>
                                </div>
                            </form>

                            {/* Change Email Form */}
                            <form onSubmit={handleSubmitEmail} className='space-y-6 border-t border-[#f8f3ed] pt-6'>
                                <h3 className='text-lg font-semibold text-[#82695b]'>Change Email Address</h3>
                                
                                <div>
                                    <label className='block text-sm font-medium text-[#82695b] mb-2'>New Email Address</label>
                                    <input
                                        type='email'
                                        value={emailData.newEmail}
                                        onChange={(e) => setEmailData(prev => ({ ...prev, newEmail: e.target.value }))}
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901414] focus:border-[#901414]'
                                        required
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-[#82695b] mb-2'>Current Password</label>
                                    <div className='relative'>
                                        <input
                                            type={showPasswords.emailPassword ? 'text' : 'password'}
                                            value={emailData.currentPassword}
                                            onChange={(e) => setEmailData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                            className='w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#901414] focus:border-[#901414]'
                                            required
                                        />
                                        <button
                                            type='button'
                                            onClick={() => setShowPasswords(prev => ({ ...prev, emailPassword: !prev.emailPassword }))}
                                            className='absolute inset-y-0 right-0 pr-3 flex items-center'
                                        >
                                            {showPasswords.emailPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className='flex justify-end'>
                                    <button
                                        type='submit'
                                        disabled={isLoading || isSubmitting}
                                        className='px-6 py-2 bg-[#901414] hover:bg-[#7a1010] text-white rounded-md font-medium transition-colors disabled:opacity-50'
                                    >
                                        {isSubmitting ? 'Changing...' : 'Change Email'}
                                    </button>
                                </div>
                            </form>

                            {/* Reset Password Link */}
                            <div className='border-t border-[#f8f3ed] pt-6'>
                                <h3 className='text-lg font-semibold text-[#82695b] mb-4'>Reset Password</h3>
                                <p className='text-gray-600 mb-4'>
                                    If you forgot your password, you can request a reset link to be sent to your email.
                                </p>
                                <button
                                    type='button'
                                    onClick={handleForgotPassword}
                                    className='px-6 py-2 bg-[#ffd901] hover:bg-[#e6c200] text-[#82695b] rounded-md font-medium transition-colors'
                                >
                                    Send Reset Link
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default AccountSettingsPage;
