import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Plus, 
    Search, 
    Filter, 
    RefreshCw,
    Package,
    AlertCircle,
    XCircle
} from 'lucide-react';
import { useReplacementRequestStore } from '../../store/replacementRequestStore';
import ReplacementRequestCard from '../../components/ReplacementRequestCard';
import ReplacementRequestModal from '../../components/ReplacementRequestModal';
import LoadingSpinner from '../../components/LoadingSpinner';

const ReplacementRequestsPage = () => {
    const navigate = useNavigate();
    const {
        requests,
        currentRequest,
        isLoading,
        error,
        pagination,
        getCustomerRequests,
        getRequestDetails,
        clearError,
        clearMessage
    } = useReplacementRequestStore();

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch requests on component mount
    useEffect(() => {
        const loadRequests = async () => {
            try {
                await getCustomerRequests({
                    page: currentPage,
                    status: statusFilter,
                    limit: 10
                });
            } catch (error) {
                console.error('Error loading replacement requests:', error);
            }
        };

        loadRequests();
    }, [currentPage, statusFilter]);

    const handleRequestClick = async (request) => {
        try {
            await getRequestDetails(request._id);
            setSelectedRequest(request);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error loading request details:', error);
        }
    };

    const handleRefresh = async () => {
        try {
            await getCustomerRequests({
                page: currentPage,
                status: statusFilter,
                limit: 10
            });
        } catch (error) {
            console.error('Error refreshing requests:', error);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const filteredRequests = requests.filter(request => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            request.requestNumber.toLowerCase().includes(searchLower) ||
            request.product?.name?.toLowerCase().includes(searchLower) ||
            request.description.toLowerCase().includes(searchLower)
        );
    });

    if (isLoading && requests.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen pt-24 pb-8" style={{ backgroundColor: '#fffefc' }}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80 mb-4"
                                style={{ color: '#860809' }}
                            >
                                <ArrowLeft size={16} />
                                Back to Home
                            </Link>
                            <h1 className="text-3xl font-bold" style={{ color: '#860809' }}>
                                My Replacement Requests
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Track and manage your product replacement requests
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                style={{ backgroundColor: '#f8f3ed' }}
                            >
                                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                                Refresh
                            </button>
                            <Link
                                to="/replacement-request/new"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <Plus size={16} />
                                New Request
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Filters and Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="rounded-lg shadow-sm border p-6 mb-8"
                    style={{ backgroundColor: '#f8f3ed' }}
                >
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by request number, product name, or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="sm:w-48">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="under_review">Under Review</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                    >
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                            <p className="text-red-800">{error}</p>
                            <button
                                onClick={clearError}
                                className="ml-auto text-red-600 hover:text-red-800"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Requests List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-4"
                >
                    {filteredRequests.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No replacement requests found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm || statusFilter ? 'Try adjusting your search or filter criteria.' : 'You haven\'t submitted any replacement requests yet.'}
                            </p>
                            {!searchTerm && !statusFilter && (
                                <div className="mt-6">
                                    <Link
                                        to="/replacement-request/new"
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                    >
                                        <Plus size={16} className="mr-2" />
                                        Create Your First Request
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        filteredRequests.map((request, index) => (
                            <motion.div
                                key={request._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <ReplacementRequestCard
                                    request={request}
                                    onClick={() => handleRequestClick(request)}
                                />
                            </motion.div>
                        ))
                    )}
                </motion.div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex items-center justify-center gap-2 mt-8"
                    >
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!pagination.hasPrevPage}
                            className="px-3 py-2 text-sm font-medium text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: '#f8f3ed' }}
                        >
                            Previous
                        </button>
                        <span className="px-3 py-2 text-sm text-gray-700">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!pagination.hasNextPage}
                            className="px-3 py-2 text-sm font-medium text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: '#f8f3ed' }}
                        >
                            Next
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Request Details Modal */}
            <ReplacementRequestModal
                request={currentRequest}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedRequest(null);
                }}
                isAdmin={false}
            />
        </div>
    );
};

export default ReplacementRequestsPage;
