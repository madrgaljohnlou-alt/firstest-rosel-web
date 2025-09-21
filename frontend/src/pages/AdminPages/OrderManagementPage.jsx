import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Package, 
    Clock, 
    CheckCircle, 
    AlertCircle,
    RefreshCw,
    Filter,
    Search,
    Eye,
    Truck,
    User,
    MapPin,
    Phone,
    Calendar,
    ShoppingCart,
    MessageSquare,
    ChevronDown,
    ChevronUp,
    Edit3,
    Trash2,
    History,
    Settings
} from 'lucide-react';
import { useAdminOrderStore } from '../../store/adminOrderStore';
import AdminLayout from '../../components/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

const OrderManagementPage = () => {
    const {
        pendingOrders,
        isLoading,
        error,
        pagination,
        fetchPendingOrders,
        updateOrderStatus,
        placeLalamoveOrder,
        getAdminStatusColor,
        getAdminStatusIcon,
        getAdminStatusDescription,
        getNextStatus,
        needsAction,
        clearError
    } = useAdminOrderStore();

    // Tab state
    const [activeTab, setActiveTab] = useState('manage');

    // Manage Orders state
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedOrders, setExpandedOrders] = useState(new Set());
    const [actionLoading, setActionLoading] = useState({});

    // Orders History state
    const [historyOrders, setHistoryOrders] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState(null);
    const [historyPagination, setHistoryPagination] = useState({});
    const [expandedHistoryOrders, setExpandedHistoryOrders] = useState(new Set());
    
    // History search and filter states
    const [historySearchTerm, setHistorySearchTerm] = useState("");
    const [historyStatusFilter, setHistoryStatusFilter] = useState("");
    const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
    const [historySortBy, setHistorySortBy] = useState("createdAt");
    const [historySortOrder, setHistorySortOrder] = useState("desc");
    
    // Time filter states for history
    const [historyTimeframe, setHistoryTimeframe] = useState('today');
    const [historySelectedDate, setHistorySelectedDate] = useState('');
    const [historyRangeStart, setHistoryRangeStart] = useState('');
    const [historyRangeEnd, setHistoryRangeEnd] = useState('');
    const [historyCustomMode, setHistoryCustomMode] = useState('date');

    // Fetch history orders
    const fetchHistoryOrders = async () => {
        try {
            setHistoryLoading(true);
            setHistoryError(null);
            
            const params = new URLSearchParams({
                page: historyCurrentPage.toString(),
                limit: "10",
                sortBy: historySortBy,
                sortOrder: historySortOrder
            });
            
            if (historySearchTerm) params.append("search", historySearchTerm);
            if (historyStatusFilter) params.append("status", historyStatusFilter);
            
            // Add time filter parameters
            if (historyTimeframe !== 'all') {
                params.append("timeframe", historyTimeframe);
                
                if (historyTimeframe === 'custom') {
                    if (historyCustomMode === 'date') {
                        if (historySelectedDate) {
                            params.append("date", historySelectedDate);
                        }
                    } else if (historyCustomMode === 'range') {
                        if (historyRangeStart) params.append("start", historyRangeStart);
                        if (historyRangeEnd) params.append("end", historyRangeEnd);
                    }
                }
            }
            
            const response = await axios.get(`${API_URL}/admin/orders?${params.toString()}`);
            
            setHistoryOrders(response.data.data.orders);
            setHistoryPagination(response.data.data.pagination);
        } catch (error) {
            console.error("Error fetching history orders:", error);
            setHistoryError("Failed to fetch orders");
        } finally {
            setHistoryLoading(false);
        }
    };

    // Fetch pending orders on component mount
    useEffect(() => {
        const loadOrders = async () => {
            try {
                await fetchPendingOrders({ 
                    page: currentPage, 
                    status: statusFilter 
                });
            } catch (error) {
                console.error('Error loading orders:', error);
            }
        };

        loadOrders();
    }, [currentPage, statusFilter]);

    // Fetch history orders when tab changes or filters change
    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistoryOrders();
        }
    }, [activeTab, historyCurrentPage, historySearchTerm, historyStatusFilter, historySortBy, historySortOrder, historyTimeframe, historySelectedDate, historyRangeStart, historyRangeEnd, historyCustomMode]);

    // Clear error when component unmounts
    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    // Filter orders based on search term
    const filteredOrders = pendingOrders.filter(order => {
        if (!searchTerm) return true;
        const orderNumber = order._id.slice(-8).toUpperCase();
        const customerName = order.shippingInfo ? 
            `${order.shippingInfo.firstName || ''} ${order.shippingInfo.lastName || ''}`.trim() : 
            'Unknown';
        return (
            orderNumber.includes(searchTerm.toUpperCase()) ||
            customerName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // History order functions
    const toggleHistoryOrderExpansion = (orderId) => {
        const newExpanded = new Set(expandedHistoryOrders);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedHistoryOrders(newExpanded);
    };

    const handleHistorySearch = (e) => {
        e.preventDefault();
        setHistoryCurrentPage(1);
        fetchHistoryOrders();
    };

    const handleHistoryFilterChange = (newFilter) => {
        setHistoryStatusFilter(newFilter);
        setHistoryCurrentPage(1);
    };

    const handleHistorySortChange = (newSortBy) => {
        if (historySortBy === newSortBy) {
            setHistorySortOrder(historySortOrder === 'desc' ? 'asc' : 'desc');
        } else {
            setHistorySortBy(newSortBy);
            setHistorySortOrder('desc');
        }
    };

    // Get status color for history orders
    const getHistoryStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'PROCESSING': return 'bg-blue-100 text-blue-800';
            case 'SHIPPED': return 'bg-purple-100 text-purple-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            case 'COMPLETED': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Helper functions for Orders History summary statistics
    const getHistoryTotalSales = () => {
        if (!historyOrders || !Array.isArray(historyOrders)) return 0;
        return historyOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    };

    const getHistoryTotalOrders = () => {
        if (!historyOrders || !Array.isArray(historyOrders)) return 0;
        return historyOrders.length;
    };

    const getHistoryTotalItems = () => {
        if (!historyOrders || !Array.isArray(historyOrders)) return 0;
        return historyOrders.reduce((sum, order) => {
            // Try itemsCount first (pre-calculated field)
            if (order.itemsCount !== undefined) {
                return sum + (order.itemsCount || 0);
            }
            // Fallback to calculating from items array
            if (!order.items || !Array.isArray(order.items)) return sum;
            return sum + order.items.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0);
        }, 0);
    };

    const getHistoryAverageOrder = () => {
        if (!historyOrders || !Array.isArray(historyOrders) || historyOrders.length === 0) return 0;
        return getHistoryTotalSales() / historyOrders.length;
    };

  const handleGenerateOrdersCsv = () => {
    try {
      const csvEscape = (v) => {
        const s = String(v ?? "");
        const needsQuotes = /[",\n\r]/.test(s);
        const escaped = s.replace(/"/g, '""');
        return needsQuotes ? `"${escaped}"` : escaped;
      };

      const header = [
        'orderId',
        'customerName',
        'customerEmail',
        'items',
        'amount',
        'created',
        'status',
        'productsOrdered',
        'shippingRecipient',
        'shippingAddress',
        'shippingPhone',
        'shippingMethod',
        'paymentStatus',
        'adminStatus',
        'referenceNumber'
      ];
      const lines = [header.join(',')];

      (historyOrders || []).forEach((o) => {
        const orderId = csvEscape(o.orderId || o._id || "");
        const customerName = csvEscape(o.customerName || `${o?.shippingInfo?.firstName || ''} ${o?.shippingInfo?.lastName || ''}`.trim());
        const customerEmail = csvEscape(o.customerEmail || o?.shippingInfo?.email || '');
        const items = csvEscape(o.itemsCount ?? (Array.isArray(o.products) ? o.products.reduce((sum,it)=>sum+(it.quantity||0),0) : 0));
        const amount = csvEscape((o.totalPrice ?? o.totalAmount ?? 0).toFixed ? (o.totalPrice ?? o.totalAmount ?? 0).toFixed(2) : (Number(o.totalPrice ?? o.totalAmount ?? 0)).toFixed(2));
        const created = csvEscape(o.created || o.createdAt || "");
        const status = csvEscape(o.computedStatus || o.status || '');

        const productsOrdered = (Array.isArray(o.products) ? o.products : []).map((it) => {
          const name = it?.product?.name || it?.name || '';
          const qty = it?.quantity ?? 0;
          const price = it?.price ?? it?.product?.price ?? 0;
          return `${name} x${qty} @${price}`;
        }).join(' | ');

        const shippingRecipient = csvEscape(`${o?.shippingInfo?.firstName || ''} ${o?.shippingInfo?.lastName || ''}`.trim());
        const shippingAddress = csvEscape(o?.shippingInfo?.fullAddress || '');
        const shippingPhone = csvEscape(o?.shippingInfo?.phone || '');
        const shippingMethod = csvEscape(o?.shippingMethod || '');
        const paymentStatus = csvEscape(o?.paymentStatus || '');
        const adminStatus = csvEscape(o?.adminStatus || '');
        const referenceNumber = csvEscape(
          (o?.payment && (o.payment.referenceNumber || o.payment.refNumber)) ||
          o?.referenceNumber ||
          o?.stripeSessionId ||
          ''
        );

        lines.push([
          orderId,
          customerName,
          customerEmail,
          items,
          amount,
          created,
          status,
          csvEscape(productsOrdered),
          shippingRecipient,
          shippingAddress,
          shippingPhone,
          shippingMethod,
          paymentStatus,
          adminStatus,
          referenceNumber
        ].join(','));
      });

      const blob = new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ts = new Date();
      const pad = (n) => String(n).padStart(2,'0');
      a.setAttribute('download', `orders_report_${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to generate orders CSV:', e);
    }
  };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    };

    const toggleOrderExpansion = (orderId) => {
        const newExpanded = new Set(expandedOrders);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedOrders(newExpanded);
    };

    const handleStatusUpdate = async (orderId, newStatus, notes = '') => {
        setActionLoading(prev => ({ ...prev, [orderId]: true }));
        try {
            await updateOrderStatus(orderId, newStatus, notes);
            toast.success('Order status updated successfully');
        } catch (error) {
            toast.error('Failed to update order status');
        } finally {
            setActionLoading(prev => ({ ...prev, [orderId]: false }));
        }
    };

    const handlePlaceLalamoveOrder = async (orderId) => {
        setActionLoading(prev => ({ ...prev, [orderId]: true }));
        try {
            await placeLalamoveOrder(orderId);
            toast.success('Lalamove order placed successfully');
        } catch (error) {
            toast.error('Failed to place Lalamove order');
        } finally {
            setActionLoading(prev => ({ ...prev, [orderId]: false }));
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getActionButton = (order) => {
        const nextStatus = getNextStatus(order.adminStatus);
        const isLalamoveOrder = order.shippingMethod === 'lalamove';
        const isReadyForPlacement = order.adminStatus === 'order_prepared' && 
                                   isLalamoveOrder && 
                                   order.lalamoveDetails?.status === 'pending_placement';

        if (isReadyForPlacement) {
            return (
                <button
                    onClick={() => handlePlaceLalamoveOrder(order._id)}
                    disabled={actionLoading[order._id]}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Truck size={16} />
                    {actionLoading[order._id] ? 'Placing...' : 'Place Lalamove Order'}
                </button>
            );
        }

        if (nextStatus) {
            return (
                <button
                    onClick={() => handleStatusUpdate(order._id, nextStatus)}
                    disabled={actionLoading[order._id]}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <CheckCircle size={16} />
                    {actionLoading[order._id] ? 'Updating...' : `Mark as ${nextStatus.replace('order_', '').replace('_', ' ')}`}
                </button>
            );
        }

        return null;
    };

    if (isLoading && pendingOrders.length === 0 && activeTab === 'manage') {
        return (
            <AdminLayout>
                <div className="py-8">
                    <div className="relative z-10 container mx-auto px-4">
                        <LoadingSpinner />
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="py-8">
                <div className="relative z-10 container mx-auto px-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-[#030105]">Order Management</h1>
                        <div className="flex items-center gap-2 text-sm text-[#030105]">
                            <Package className="h-5 w-5" />
                            <span>
                                {activeTab === 'manage' 
                                    ? `Pending Orders: ${pagination?.totalOrders || 0}`
                                    : `Total Orders: ${historyPagination?.totalOrders || 0}`
                                }
                            </span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mb-6">
                        <div className="border-b border-[#f7e9b8]">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('manage')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'manage'
                                            ? 'border-[#860809] text-[#860809]'
                                            : 'border-transparent text-[#030105] hover:text-[#860809] hover:border-[#f7e9b8]'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Settings size={16} />
                                        Manage Orders
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'history'
                                            ? 'border-[#860809] text-[#860809]'
                                            : 'border-transparent text-[#030105] hover:text-[#860809] hover:border-[#f7e9b8]'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <History size={16} />
                                        Orders History
                                    </div>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'manage' ? (
                        <>
                            {/* Search and Filter Section for Manage Orders */}
                            <motion.div
                                className="bg-[#fffefc] rounded-lg shadow-lg border border-[#f7e9b8] p-6 mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Search */}
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#860809] h-5 w-5" />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Search by customer name, email, or order ID..."
                                                className="w-full pl-10 pr-4 py-2 border border-[#f7e9b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#860809] text-[#030105]"
                                            />
                                        </div>
                                    </div>

                                    {/* Status Filter */}
                                    <div className="lg:w-48">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="w-full px-3 py-2 border border-[#f7e9b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#860809] text-[#030105]"
                                        >
                                            <option value="">All Statuses</option>
                                            <option value="order_received">Order Received</option>
                                            <option value="order_preparing">Order Preparing</option>
                                            <option value="order_prepared">Order Prepared</option>
                                            <option value="order_placed">Order Placed</option>
                                            <option value="order_picked_up">Order Picked Up</option>
                                            <option value="order_completed">Order Completed</option>
                                        </select>
                                    </div>

                                    {/* Refresh Button */}
                                    <button
                                        onClick={() => fetchPendingOrders({ page: currentPage, status: statusFilter })}
                                        className="px-4 py-2 bg-[#860809] text-white rounded-md hover:bg-[#a31f17] transition-colors duration-200 flex items-center gap-2"
                                    >
                                        <RefreshCw size={16} />
                                        Refresh
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    ) : (
                        <>
                            {/* Search and Filter Section for Orders History */}
                            <motion.div
                                className="bg-[#fffefc] rounded-lg shadow-lg border border-[#f7e9b8] p-6 mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Search */}
                                    <div className="flex-1">
                                        <form onSubmit={handleHistorySearch} className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#860809] h-5 w-5" />
                                            <input
                                                type="text"
                                                value={historySearchTerm}
                                                onChange={(e) => setHistorySearchTerm(e.target.value)}
                                                placeholder="Search by customer name, email, or order ID..."
                                                className="w-full pl-10 pr-4 py-2 border border-[#f7e9b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#860809] text-[#030105]"
                                            />
                                        </form>
                                    </div>

                                    {/* Status Filter */}
                                    <div className="lg:w-48">
                                        <select
                                            value={historyStatusFilter}
                                            onChange={(e) => handleHistoryFilterChange(e.target.value)}
                                            className="w-full px-3 py-2 border border-[#f7e9b8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#860809] text-[#030105]"
                                        >
                                            <option value="">All Statuses</option>
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    {/* Refresh Button */}
                                    <button
                                        onClick={fetchHistoryOrders}
                                        className="px-4 py-2 bg-[#860809] text-white rounded-md hover:bg-[#a31f17] transition-colors duration-200 flex items-center gap-2"
                                    >
                                        <RefreshCw size={16} />
                                        Refresh
                                    </button>
                                    <button
                                        onClick={handleGenerateOrdersCsv}
                                        className="px-4 py-2 bg-[#0b5] text-white rounded-md hover:opacity-90 transition-colors duration-200"
                                    >
                                        Generate Orders Report
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}

                    {/* Orders List */}
                    <motion.div
                        className="bg-[#fffefc] rounded-lg shadow-lg border border-[#f7e9b8] overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {activeTab === 'manage' ? (
                            // Manage Orders Content
                            <>
                                {error ? (
                                    <div className="p-8 text-center text-red-600">
                                        {error}
                                    </div>
                                ) : filteredOrders.length === 0 ? (
                                    <div className="p-8 text-center text-[#030105]">
                                        No pending orders found
                                    </div>
                                ) : (
                            <>
                                {/* Table Header */}
                                <div className="bg-[#f7e9b8] px-6 py-4">
                                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-[#030105] uppercase tracking-wider">
                                        <div className="col-span-1"></div>
                                        <div className="col-span-2">Order ID</div>
                                        <div className="col-span-2">Customer</div>
                                        <div className="col-span-1">Items</div>
                                        <div className="col-span-1">Amount</div>
                                        <div className="col-span-2">Created</div>
                                        <div className="col-span-1">Status</div>
                                        <div className="col-span-2">Actions</div>
                                    </div>
                                </div>

                                {/* Table Body */}
                                <div className="divide-y divide-[#f7e9b8]">
                                    {filteredOrders.map((order) => (
                                        <div key={order._id}>
                                            {/* Main Order Row */}
                                            <div className="px-6 py-4 hover:bg-[#f7e9b8] hover:bg-opacity-30 transition-colors duration-200">
                                                <div className="grid grid-cols-12 gap-4 items-center">
                                                    {/* Expand/Collapse Button */}
                                                    <div className="col-span-1">
                                                        <button
                                                            onClick={() => toggleOrderExpansion(order._id)}
                                                            className="p-1 rounded hover:bg-[#f7e9b8] transition-colors duration-200"
                                                        >
                                                            {expandedOrders.has(order._id) ? '−' : '+'}
                                                        </button>
                                                    </div>

                                                    {/* Order ID */}
                                                    <div className="col-span-2">
                                                        <div className="text-sm font-medium text-[#030105]">
                                                            #{order.orderId}
                                                        </div>
                                                    </div>

                                                    {/* Customer */}
                                                    <div className="col-span-2">
                                                        <div className="text-sm text-[#030105]">
                                                            <div className="font-medium">{order.customerName}</div>
                                                            <div className="text-xs text-gray-500">{order.customerEmail}</div>
                                                        </div>
                                                    </div>

                                                    {/* Items Count */}
                                                    <div className="col-span-1">
                                                        <div className="text-sm text-[#030105] flex items-center">
                                                            <ShoppingCart className="h-4 w-4 mr-1" />
                                                            {order.itemsCount}
                                                        </div>
                                                    </div>

                                                    {/* Amount */}
                                                    <div className="col-span-1">
                                                        <div className="text-sm font-medium text-[#030105] flex items-center">
                                                            ₱{(order.totalPrice || 0).toFixed(2)}
                                                        </div>
                                                    </div>

                                                    {/* Created Date */}
                                                    <div className="col-span-2">
                                                        <div className="text-sm text-[#030105] flex items-center">
                                                            <Calendar className="h-4 w-4 mr-1" />
                                                            {formatDate(order.created)}
                                                        </div>
                                                    </div>

                                                    {/* Status */}
                                                    <div className="col-span-1">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAdminStatusColor(order.adminStatus)}`}>
                                                            {getAdminStatusIcon(order.adminStatus)} {order.adminStatus.replace('order_', '').replace('_', ' ')}
                                                        </span>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="col-span-2">
                                                        <div className="flex items-center gap-2">
                                                            {getActionButton(order)}
                                                            <button
                                                                onClick={() => setSelectedOrder(order)}
                                                                className="p-1 rounded hover:bg-[#f7e9b8] transition-colors duration-200"
                                                                title="View Details"
                                                            >
                                                                <Eye className="h-4 w-4 text-[#860809]" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expanded Products Section */}
                                            {expandedOrders.has(order._id) && (
                                                <motion.div
                                                    className="bg-gray-50 px-6 py-4 border-t border-[#f7e9b8]"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                        {/* Products */}
                                                        <div>
                                                            <h4 className="text-sm font-medium text-[#030105] mb-3">Products Ordered:</h4>
                                                            <div className="space-y-3">
                                                                {order.products.map((item, index) => (
                                                                    <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-[#f7e9b8]">
                                                                        <img
                                                                            src={item.product?.image || '/placeholder-product.jpg'}
                                                                            alt={item.product?.name || 'Product'}
                                                                            className="h-12 w-12 rounded-lg object-cover"
                                                                        />
                                                                        <div className="flex-1">
                                                                            <div className="text-sm font-medium text-[#030105]">
                                                                                {item.product?.name || 'Unknown Product'}
                                                                            </div>
                                                                            <div className="text-xs text-gray-500">
                                                                                Qty: {item.quantity} × ₱{(item.price || 0).toFixed(2)}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-sm font-medium text-[#030105]">
                                                                            ₱{((item.quantity || 0) * (item.price || 0)).toFixed(2)}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Order Details */}
                                                        <div>
                                                            <h4 className="text-sm font-medium text-[#030105] mb-3">Order Details:</h4>
                                                            <div className="space-y-3">
                                                                <div className="p-3 bg-white rounded-lg border border-[#f7e9b8]">
                                                                    <div className="text-sm text-[#030105]">
                                                                        <div className="font-medium mb-2">Shipping Information:</div>
                                                                        <div className="space-y-1 text-xs">
                                                                            <div className="flex items-center gap-2">
                                                                                <User size={12} />
                                                                                {order.shippingInfo?.firstName} {order.shippingInfo?.lastName}
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <Phone size={12} />
                                                                                {order.shippingInfo?.phone}
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <MapPin size={12} />
                                                                                {order.shippingInfo?.fullAddress}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="p-3 bg-white rounded-lg border border-[#f7e9b8]">
                                                                    <div className="text-sm text-[#030105]">
                                                                        <div className="font-medium mb-2">Status Information:</div>
                                                                        <div className="space-y-1 text-xs">
                                                                            <div>Current Status: {getAdminStatusDescription(order.adminStatus)}</div>
                                                                            <div>Payment Status: {order.paymentStatus}</div>
                                                                            <div>Shipping Method: {order.shippingMethod}</div>
                                                                            {order.lalamoveDetails && (
                                                                                <div>Lalamove Status: {order.lalamoveDetails.status}</div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                                )}
                            </>
                        ) : (
                            // Orders History Content
                            <>
                                {historyLoading ? (
                                    <div className="p-8 text-center">
                                        <RefreshCw className="w-8 h-8 text-[#a31f17] animate-spin mx-auto mb-2" />
                                        <p className="text-[#a48674]">Loading orders...</p>
                                    </div>
                                ) : historyError ? (
                                    <div className="p-8 text-center text-red-600">
                                        {historyError}
                                    </div>
                                ) : historyOrders.length === 0 ? (
                                    <div className="p-8 text-center text-[#030105]">
                                        No orders found
                                    </div>
                                ) : (
                            <>
                                {/* Summary Cards for Orders History */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                    <div className="bg-white rounded-lg shadow-sm border border-[#f7e9b8] p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-[#a48674] mb-1">New Orders</p>
                                                <p className="text-2xl font-bold text-[#860809]">
                                                    {getHistoryTotalOrders()}
                                                </p>
                                            </div>
                                            <ShoppingCart className="w-8 h-8 text-[#a31f17]" />
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow-sm border border-[#f7e9b8] p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-[#a48674] mb-1">Total Sales</p>
                                                <p className="text-2xl font-bold text-[#860809]">
                                                    {getHistoryTotalItems()}
                                                </p>
                                            </div>
                                            <Package className="w-8 h-8 text-[#a31f17]" />
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow-sm border border-[#f7e9b8] p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-[#a48674] mb-1">Total Revenue</p>
                                                <p className="text-2xl font-bold text-[#860809]">
                                                    {formatCurrency(getHistoryTotalSales())}
                                                </p>
                                            </div>
                                            <span className="text-2xl font-bold text-[#a31f17]">₱</span>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow-sm border border-[#f7e9b8] p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-[#a48674] mb-1">Average Value</p>
                                                <p className="text-2xl font-bold text-[#860809]">
                                                    {formatCurrency(getHistoryAverageOrder())}
                                                </p>
                                            </div>
                                            <User className="w-8 h-8 text-[#a31f17]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Time Filter */}
                                <div className='flex items-center justify-center mb-6'>
                                    <div className='flex gap-2 items-center bg-[#f7e9b8] p-1 rounded-lg'>
                                        <span className='text-sm font-medium text-[#030105] mr-2'>Time Filter:</span>
                                        {[
                                            { key: 'today', label: 'Today' },
                                            { key: 'week', label: 'Week' },
                                            { key: 'month', label: 'Month' },
                                            { key: 'year', label: 'Year' },
                                            { key: 'custom', label: 'Custom' },
                                            { key: 'all', label: 'All Time' },
                                        ].map((option) => (
                                            <button
                                                key={option.key}
                                                onClick={() => {
                                                    setHistoryTimeframe(option.key);
                                                    if (option.key !== 'custom') {
                                                        setHistorySelectedDate('');
                                                        setHistoryRangeStart('');
                                                        setHistoryRangeEnd('');
                                                    }
                                                }}
                                                className={`${
                                                    historyTimeframe === option.key
                                                        ? 'bg-[#860809] text-[#fffefc]'
                                                        : 'bg-[#f7e9b8] text-[#030105]'
                                                } px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                        {historyTimeframe === 'custom' && (
                                            <div className='flex items-center gap-3'>
                                                <div className='flex gap-2'>
                                                    <button onClick={()=>setHistoryCustomMode('date')} className={`px-2 py-1 rounded-md text-sm ${historyCustomMode==='date' ? 'bg-[#860809] text-[#fffefc]' : 'bg-[#f7e9b8] text-[#030105]'}`}>Select Date</button>
                                                    <button onClick={()=>setHistoryCustomMode('range')} className={`px-2 py-1 rounded-md text-sm ${historyCustomMode==='range' ? 'bg-[#860809] text-[#fffefc]' : 'bg-[#f7e9b8] text-[#030105]'}`}>Range</button>
                                                </div>
                                                {historyCustomMode === 'date' && (
                                                    <div className='flex items-center gap-2'>
                                                        <input
                                                            type='date'
                                                            value={historySelectedDate}
                                                            onChange={(e)=>{ setHistorySelectedDate(e.target.value); }}
                                                            className='px-2 py-1 rounded-md border border-[#f7e9b8] text-[#030105] bg-[#fffefc]'
                                                        />
                                                        {historySelectedDate && (
                                                            <button onClick={()=>setHistorySelectedDate('')} className='px-2 py-1 rounded-md text-sm bg-[#f7e9b8] text-[#030105]'>Clear</button>
                                                        )}
                                                    </div>
                                                )}
                                                {historyCustomMode === 'range' && (
                                                    <div className='flex items-center gap-2'>
                                                        <input
                                                            type='date'
                                                            value={historyRangeStart}
                                                            onChange={(e)=>{ setHistoryRangeStart(e.target.value); }}
                                                            className='px-2 py-1 rounded-md border border-[#f7e9b8] text-[#030105] bg-[#fffefc]'
                                                        />
                                                        <span className='text-[#030105] text-sm'>to</span>
                                                        <input
                                                            type='date'
                                                            value={historyRangeEnd}
                                                            onChange={(e)=>{ setHistoryRangeEnd(e.target.value); }}
                                                            className='px-2 py-1 rounded-md border border-[#f7e9b8] text-[#030105] bg-[#fffefc]'
                                                        />
                                                        {(historyRangeStart || historyRangeEnd) && (
                                                            <button onClick={()=>{ setHistoryRangeStart(''); setHistoryRangeEnd(''); }} className='px-2 py-1 rounded-md text-sm bg-[#f7e9b8] text-[#030105]'>Clear</button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Table Header */}
                                <div className="bg-[#f7e9b8] px-6 py-4">
                                    <div className="grid grid-cols-11 gap-4 text-sm font-medium text-[#030105] uppercase tracking-wider">
                                        <div className="col-span-1"></div>
                                        <div className="col-span-2">
                                            Order ID
                                        </div>
                                        <div className="col-span-2 flex items-center gap-1">
                                            Customer
                                            <div className="flex flex-col">
                                                <button
                                                    onClick={() => handleHistorySortChange('customerName')}
                                                    className={`p-0.5 ${historySortBy === 'customerName' && historySortOrder === 'asc' ? 'text-[#860809]' : 'text-gray-400'}`}
                                                >
                                                    <ChevronUp size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleHistorySortChange('customerName')}
                                                    className={`p-0.5 ${historySortBy === 'customerName' && historySortOrder === 'desc' ? 'text-[#860809]' : 'text-gray-400'}`}
                                                >
                                                    <ChevronDown size={12} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-span-1 flex items-center gap-1">
                                            Items
                                            <div className="flex flex-col">
                                                <button
                                                    onClick={() => handleHistorySortChange('itemsCount')}
                                                    className={`p-0.5 ${historySortBy === 'itemsCount' && historySortOrder === 'asc' ? 'text-[#860809]' : 'text-gray-400'}`}
                                                >
                                                    <ChevronUp size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleHistorySortChange('itemsCount')}
                                                    className={`p-0.5 ${historySortBy === 'itemsCount' && historySortOrder === 'desc' ? 'text-[#860809]' : 'text-gray-400'}`}
                                                >
                                                    <ChevronDown size={12} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-span-1 flex items-center gap-1">
                                            Amount
                                            <div className="flex flex-col">
                                                <button
                                                    onClick={() => handleHistorySortChange('totalAmount')}
                                                    className={`p-0.5 ${historySortBy === 'totalAmount' && historySortOrder === 'asc' ? 'text-[#860809]' : 'text-gray-400'}`}
                                                >
                                                    <ChevronUp size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleHistorySortChange('totalAmount')}
                                                    className={`p-0.5 ${historySortBy === 'totalAmount' && historySortOrder === 'desc' ? 'text-[#860809]' : 'text-gray-400'}`}
                                                >
                                                    <ChevronDown size={12} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-span-2 flex items-center gap-1">
                                            Created
                                            <div className="flex flex-col">
                                                <button
                                                    onClick={() => handleHistorySortChange('createdAt')}
                                                    className={`p-0.5 ${historySortBy === 'createdAt' && historySortOrder === 'asc' ? 'text-[#860809]' : 'text-gray-400'}`}
                                                >
                                                    <ChevronUp size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleHistorySortChange('createdAt')}
                                                    className={`p-0.5 ${historySortBy === 'createdAt' && historySortOrder === 'desc' ? 'text-[#860809]' : 'text-gray-400'}`}
                                                >
                                                    <ChevronDown size={12} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-span-1 flex items-center gap-1">
                                            Status
                                            <div className="flex flex-col">
                                                <button
                                                    onClick={() => handleHistorySortChange('status')}
                                                    className={`p-0.5 ${historySortBy === 'status' && historySortOrder === 'asc' ? 'text-[#860809]' : 'text-gray-400'}`}
                                                >
                                                    <ChevronUp size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleHistorySortChange('status')}
                                                    className={`p-0.5 ${historySortBy === 'status' && historySortOrder === 'desc' ? 'text-[#860809]' : 'text-gray-400'}`}
                                                >
                                                    <ChevronDown size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Table Body */}
                                <div className="divide-y divide-[#f7e9b8]">
                                    {historyOrders.map((order) => (
                                        <div key={order._id}>
                                            {/* Main Order Row */}
                                            <div className="px-6 py-4 hover:bg-[#f7e9b8] hover:bg-opacity-30 transition-colors duration-200">
                                                <div className="grid grid-cols-11 gap-4 items-center">
                                                    {/* Expand/Collapse Button */}
                                                    <div className="col-span-1">
                                                        <button
                                                            onClick={() => toggleHistoryOrderExpansion(order._id)}
                                                            className="p-1 rounded hover:bg-[#f7e9b8] transition-colors duration-200"
                                                        >
                                                            {expandedHistoryOrders.has(order._id) ? '−' : '+'}
                                                        </button>
                                                    </div>

                                                    {/* Order ID */}
                                                    <div className="col-span-2">
                                                        <div className="text-sm font-medium text-[#030105]">
                                                            #{order.orderId}
                                                        </div>
                                                    </div>

                                                    {/* Customer */}
                                                    <div className="col-span-2">
                                                        <div className="text-sm text-[#030105]">
                                                            <div className="font-medium">{order.customerName}</div>
                                                            <div className="text-xs text-gray-500">{order.customerEmail}</div>
                                                        </div>
                                                    </div>

                                                    {/* Items Count */}
                                                    <div className="col-span-1">
                                                        <div className="text-sm text-[#030105] flex items-center">
                                                            <ShoppingCart className="h-4 w-4 mr-1" />
                                                            {order.itemsCount}
                                                        </div>
                                                    </div>

                                                    {/* Amount */}
                                                    <div className="col-span-1">
                                                        <div className="text-sm font-medium text-[#030105] flex items-center">
                                                            ₱{(order.totalAmount || 0).toFixed(2)}
                                                        </div>
                                                    </div>

                                                    {/* Created Date */}
                                                    <div className="col-span-2">
                                                        <div className="text-sm text-[#030105] flex items-center">
                                                            <Calendar className="h-4 w-4 mr-1" />
                                                            {formatDate(order.createdAt)}
                                                        </div>
                                                    </div>

                                                    {/* Status */}
                                                    <div className="col-span-1">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHistoryStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expanded Products Section */}
                                            {expandedHistoryOrders.has(order._id) && (
                                                <motion.div
                                                    className="bg-gray-50 px-6 py-4 border-t border-[#f7e9b8]"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                        {/* Products */}
                                                        <div>
                                                            <h4 className="text-sm font-medium text-[#030105] mb-3">Products Ordered:</h4>
                                                            <div className="space-y-3">
                                                                {order.products.map((item, index) => (
                                                                    <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-[#f7e9b8]">
                                                                        <img
                                                                            src={item.product?.image || '/placeholder-product.jpg'}
                                                                            alt={item.product?.name || 'Product'}
                                                                            className="h-12 w-12 rounded-lg object-cover"
                                                                        />
                                                                        <div className="flex-1">
                                                                            <div className="text-sm font-medium text-[#030105]">
                                                                                {item.product?.name || 'Unknown Product'}
                                                                            </div>
                                                                            <div className="text-xs text-gray-500">
                                                                                Qty: {item.quantity} × ₱{(item.price || 0).toFixed(2)}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-sm font-medium text-[#030105]">
                                                                            ₱{((item.quantity || 0) * (item.price || 0)).toFixed(2)}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Order Details */}
                                                        <div>
                                                            <h4 className="text-sm font-medium text-[#030105] mb-3">Order Details:</h4>
                                                            <div className="space-y-3">
                                                                <div className="p-3 bg-white rounded-lg border border-[#f7e9b8]">
                                                                    <div className="text-sm text-[#030105]">
                                                                        <div className="font-medium mb-2">Shipping Information:</div>
                                                                        <div className="space-y-1 text-xs">
                                                                            <div className="flex items-center gap-2">
                                                                                <User size={12} />
                                                                                {order.shippingInfo?.firstName} {order.shippingInfo?.lastName}
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <Phone size={12} />
                                                                                {order.shippingInfo?.phone}
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <MapPin size={12} />
                                                                                {order.shippingInfo?.fullAddress}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="p-3 bg-white rounded-lg border border-[#f7e9b8]">
                                                                    <div className="text-sm text-[#030105]">
                                                                        <div className="font-medium mb-2">Status Information:</div>
                                                                        <div className="space-y-1 text-xs">
                                                                            <div>Current Status: {order.status}</div>
                                                                            <div>Payment Status: {order.paymentStatus}</div>
                                                                            <div>Shipping Method: {order.shippingMethod}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                                )}
                            </>
                        )}
                    </motion.div>

                    {/* Pagination */}
                    {activeTab === 'manage' ? (
                        // Manage Orders Pagination
                        pagination && pagination.totalPages > 1 && (
                            <motion.div
                                className="flex items-center justify-between mt-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <div className="text-sm text-[#030105]">
                                    Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalOrders)} of {pagination.totalOrders} orders
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={!pagination.hasPrevPage}
                                        className="px-3 py-1 rounded-md border border-[#f7e9b8] text-[#030105] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f7e9b8] transition-colors duration-200"
                                    >
                                        Previous
                                    </button>
                                    
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                            const pageNum = i + 1;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`px-3 py-1 rounded-md text-sm ${
                                                        currentPage === pageNum
                                                            ? 'bg-[#860809] text-white'
                                                            : 'border border-[#f7e9b8] text-[#030105] hover:bg-[#f7e9b8]'
                                                    } transition-colors duration-200`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    
                                    <button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={!pagination.hasNextPage}
                                        className="px-3 py-1 rounded-md border border-[#f7e9b8] text-[#030105] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f7e9b8] transition-colors duration-200"
                                    >
                                        Next
                                    </button>
                                </div>
                            </motion.div>
                        )
                    ) : (
                        // Orders History Pagination
                        historyPagination && historyPagination.totalPages > 1 && (
                            <motion.div
                                className="flex items-center justify-between mt-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <div className="text-sm text-[#030105]">
                                    Showing {((historyPagination.currentPage - 1) * 10) + 1} to {Math.min(historyPagination.currentPage * 10, historyPagination.totalOrders)} of {historyPagination.totalOrders} orders
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setHistoryCurrentPage(historyCurrentPage - 1)}
                                        disabled={!historyPagination.hasPrevPage}
                                        className="px-3 py-1 rounded-md border border-[#f7e9b8] text-[#030105] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f7e9b8] transition-colors duration-200"
                                    >
                                        Previous
                                    </button>
                                    
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, historyPagination.totalPages) }, (_, i) => {
                                            const pageNum = i + 1;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setHistoryCurrentPage(pageNum)}
                                                    className={`px-3 py-1 rounded-md text-sm ${
                                                        historyCurrentPage === pageNum
                                                            ? 'bg-[#860809] text-white'
                                                            : 'border border-[#f7e9b8] text-[#030105] hover:bg-[#f7e9b8]'
                                                    } transition-colors duration-200`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    
                                    <button
                                        onClick={() => setHistoryCurrentPage(historyCurrentPage + 1)}
                                        disabled={!historyPagination.hasNextPage}
                                        className="px-3 py-1 rounded-md border border-[#f7e9b8] text-[#030105] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f7e9b8] transition-colors duration-200"
                                    >
                                        Next
                                    </button>
                                </div>
                            </motion.div>
                        )
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default OrderManagementPage;
