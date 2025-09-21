import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Search,
  Calendar,
  Filter,
  Receipt,
  User,
  Clock,
  Eye,
  Download,
  RefreshCw,
  X,
  Package
} from 'lucide-react';
import { usePOSStore } from '../../store/posStore.js';
import AdminLayout from '../../components/AdminLayout.jsx';
import { Link } from 'react-router-dom';

const POSHistoryPage = () => {
  const { getRecentTransactions, loading, error } = usePOSStore();
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Time filter states
  const [timeframe, setTimeframe] = useState('today');
  const [selectedDate, setSelectedDate] = useState('');
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [customMode, setCustomMode] = useState('date');

  // Load transactions on component mount and when time filters change
  useEffect(() => {
    loadTransactions();
  }, [timeframe, selectedDate, rangeStart, rangeEnd, customMode]);

  const loadTransactions = async () => {
    let timeframeParam = timeframe !== 'all' ? timeframe : null;
    let dateParam = null;
    let startParam = null;
    let endParam = null;
    
    if (timeframe === 'custom') {
      if (customMode === 'date' && selectedDate) {
        dateParam = selectedDate;
      } else if (customMode === 'range' && rangeStart && rangeEnd) {
        startParam = rangeStart;
        endParam = rangeEnd;
      }
    }
    
    const result = await getRecentTransactions(50, timeframeParam, dateParam, startParam, endParam);
    if (result.success) {
      setTransactions(result.data || []);
    } else {
      console.error('Failed to load transactions:', result.error);
      // Set empty array if there's an error, so the page doesn't break
      setTransactions([]);
    }
  };

  // Filter transactions based on search and date
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.cashier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.customer.name && transaction.customer.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDate = !dateFilter || 
      new Date(transaction.timestamp).toDateString() === new Date(dateFilter).toDateString();
    
    return matchesSearch && matchesDate;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalSales = () => {
    return transactions.reduce((sum, transaction) => sum + transaction.payment.total, 0);
  };

  const getTotalTransactions = () => {
    return transactions.length;
  };

  const getTotalItems = () => {
    return transactions.reduce((sum, transaction) => {
      return sum + transaction.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);
  };

  const viewTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedTransaction(null);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Link
                to="/pos"
                className="flex items-center gap-2 text-[#860809] hover:text-[#a31f17] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to POS
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-[#860809] mb-2">Transaction History</h1>
            <p className="text-[#a48674]">View and manage POS transaction records</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-[#f7e9b8] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#a48674] mb-1">New Transactions</p>
                  <p className="text-2xl font-bold text-[#860809]">
                    {getTotalTransactions()}
                  </p>
                </div>
                <Receipt className="w-8 h-8 text-[#a31f17]" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-[#f7e9b8] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#a48674] mb-1">Total Sales</p>
                  <p className="text-2xl font-bold text-[#860809]">
                    {getTotalItems()}
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
                    {formatCurrency(getTotalSales())}
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
                    {getTotalTransactions() > 0 ? formatCurrency(getTotalSales() / getTotalTransactions()) : '₱0.00'}
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
                    setTimeframe(option.key);
                    if (option.key !== 'custom') {
                      setSelectedDate('');
                      setRangeStart('');
                      setRangeEnd('');
                    }
                  }}
                  className={`${
                    timeframe === option.key
                      ? 'bg-[#860809] text-[#fffefc]'
                      : 'bg-[#f7e9b8] text-[#030105]'
                  } px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200`}
                >
                  {option.label}
                </button>
              ))}
              {timeframe === 'custom' && (
                <div className='flex items-center gap-3'>
                  <div className='flex gap-2'>
                    <button onClick={()=>setCustomMode('date')} className={`px-2 py-1 rounded-md text-sm ${customMode==='date' ? 'bg-[#860809] text-[#fffefc]' : 'bg-[#f7e9b8] text-[#030105]'}`}>Select Date</button>
                    <button onClick={()=>setCustomMode('range')} className={`px-2 py-1 rounded-md text-sm ${customMode==='range' ? 'bg-[#860809] text-[#fffefc]' : 'bg-[#f7e9b8] text-[#030105]'}`}>Range</button>
                  </div>
                  {customMode === 'date' && (
                    <div className='flex items-center gap-2'>
                      <input
                        type='date'
                        value={selectedDate}
                        onChange={(e)=>{ setSelectedDate(e.target.value); }}
                        className='px-2 py-1 rounded-md border border-[#f7e9b8] text-[#030105] bg-[#fffefc]'
                      />
                      {selectedDate && (
                        <button onClick={()=>setSelectedDate('')} className='px-2 py-1 rounded-md text-sm bg-[#f7e9b8] text-[#030105]'>Clear</button>
                      )}
                    </div>
                  )}
                  {customMode === 'range' && (
                    <div className='flex items-center gap-2'>
                      <input
                        type='date'
                        value={rangeStart}
                        onChange={(e)=>{ setRangeStart(e.target.value); }}
                        className='px-2 py-1 rounded-md border border-[#f7e9b8] text-[#030105] bg-[#fffefc]'
                      />
                      <span className='text-[#030105] text-sm'>to</span>
                      <input
                        type='date'
                        value={rangeEnd}
                        onChange={(e)=>{ setRangeEnd(e.target.value); }}
                        className='px-2 py-1 rounded-md border border-[#f7e9b8] text-[#030105] bg-[#fffefc]'
                      />
                      {(rangeStart || rangeEnd) && (
                        <button onClick={()=>{ setRangeStart(''); setRangeEnd(''); }} className='px-2 py-1 rounded-md text-sm bg-[#f7e9b8] text-[#030105]'>Clear</button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-sm border border-[#f7e9b8] p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a48674] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by transaction ID, cashier, or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#f7e9b8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a31f17] focus:border-transparent"
                />
              </div>
              <button
                onClick={loadTransactions}
                className="px-4 py-2 bg-[#a31f17] text-white rounded-lg hover:bg-[#860809] transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={() => {
                  try {
                    const csvEscape = (v) => {
                      const s = String(v ?? '');
                      const needsQuotes = /[",\n\r]/.test(s);
                      const escaped = s.replace(/"/g, '""');
                      return needsQuotes ? `"${escaped}"` : escaped;
                    };
                    const header = ['Transaction ID','Date & Time','Cashier','Customer','Payment Method','Items','Total','Transaction Details'];
                    const lines = [header.join(',')];
                    (transactions || []).forEach(t => {
                      const txId = csvEscape(t?.transactionId || t?._id || '');
                      const ts = csvEscape(new Date(t?.timestamp || t?.createdAt).toLocaleString());
                      const cashier = csvEscape(t?.cashier?.name || '');
                      const customer = csvEscape(t?.customer?.name || 'Walk-in Customer');
                      const method = csvEscape(t?.payment?.method || 'cash');
                      const itemsCount = csvEscape(Array.isArray(t?.items) ? t.items.length : 0);
                      const total = csvEscape(Number(t?.payment?.total || 0).toFixed(2));
                      const details = (Array.isArray(t?.items) ? t.items : []).map(it => {
                        const name = it?.name || it?.productId?.name || '';
                        const qty = it?.quantity ?? 0;
                        const price = Number(it?.price || 0).toFixed(2);
                        const lineTotal = Number(it?.total || (qty * (it?.price||0))).toFixed(2);
                        return `${name} x${qty} @${price} = ${lineTotal}`;
                      }).join(' | ');
                      lines.push([
                        txId, ts, cashier, customer, method, itemsCount, total, csvEscape(details)
                      ].join(','));
                    });
                    const blob = new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    const dt = new Date();
                    const pad = (n) => String(n).padStart(2,'0');
                    a.setAttribute('download', `transactions_report_${dt.getFullYear()}${pad(dt.getMonth()+1)}${pad(dt.getDate())}_${pad(dt.getHours())}${pad(dt.getMinutes())}${pad(dt.getSeconds())}.csv`);
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                  } catch (e) {
                    console.error('Failed to generate transactions CSV:', e);
                  }
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Generate Transactions Report
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-lg shadow-sm border border-[#f7e9b8] overflow-hidden">
            <div className="p-4 border-b border-[#f7e9b8]">
              <h3 className="text-lg font-semibold text-[#860809]">
                Recent Transactions ({filteredTransactions.length})
              </h3>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <RefreshCw className="w-8 h-8 text-[#a31f17] animate-spin mx-auto mb-2" />
                <p className="text-[#a48674]">Loading transactions...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={loadTransactions}
                  className="px-4 py-2 bg-[#a31f17] text-white rounded-lg hover:bg-[#860809] transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-[#a48674]">
                <Receipt className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No transactions found</p>
                <p className="text-sm">Try adjusting your search or date filter</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#f8f3ed]">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#860809]">Transaction ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#860809]">Date & Time</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#860809]">Cashier</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#860809]">Customer</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#860809]">Payment Method</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#860809]">Items</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#860809]">Total</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#860809]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f7e9b8]">
                    {filteredTransactions.map((transaction) => (
                      <motion.tr
                        key={transaction._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-[#f8f3ed] transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-mono text-[#030105]">
                          {transaction.transactionId}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#030105]">
                          {formatDate(transaction.timestamp)}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#030105]">
                          {transaction.cashier.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#030105]">
                          {transaction.customer.name || 'Walk-in Customer'}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#030105]">
                          <span className="capitalize">{transaction.payment.method || 'cash'}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#030105]">
                          {transaction.items.length} item(s)
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-[#860809]">
                          {formatCurrency(transaction.payment.total)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => viewTransactionDetails(transaction)}
                            className="text-[#a31f17] hover:text-[#860809] transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Details Modal */}
        {showDetails && selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#860809]">Transaction Details</h3>
                <button
                  onClick={closeDetails}
                  className="text-[#a48674] hover:text-[#860809] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Transaction Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#a48674] mb-1">Transaction ID</p>
                    <p className="font-mono text-[#030105]">{selectedTransaction.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#a48674] mb-1">Date & Time</p>
                    <p className="text-[#030105]">{formatDate(selectedTransaction.timestamp)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#a48674] mb-1">Cashier</p>
                    <p className="text-[#030105]">{selectedTransaction.cashier.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#a48674] mb-1">Customer</p>
                    <p className="text-[#030105]">{selectedTransaction.customer.name || 'Walk-in Customer'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#a48674] mb-1">Payment Method</p>
                    <p className="text-[#030105] capitalize">{selectedTransaction.payment.method || 'cash'}</p>
                  </div>
                  {(selectedTransaction.payment.method === 'online' || selectedTransaction.payment.method === 'bank') && selectedTransaction.customer.referenceNumber && (
                    <div>
                      <p className="text-sm text-[#a48674] mb-1">Reference Number</p>
                      <p className="text-[#030105]">{selectedTransaction.customer.referenceNumber}</p>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div>
                  <h4 className="text-lg font-semibold text-[#860809] mb-3">Items Purchased</h4>
                  <div className="space-y-2">
                    {selectedTransaction.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-[#f8f3ed] rounded-lg">
                        <div>
                          <p className="font-medium text-[#030105]">{item.name}</p>
                          <p className="text-sm text-[#a48674]">
                            {formatCurrency(item.price)} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-[#860809]">
                          {formatCurrency(item.total)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="border-t border-[#f7e9b8] pt-4">
                  <h4 className="text-lg font-semibold text-[#860809] mb-3">Payment Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#a48674]">Subtotal:</span>
                      <span className="text-[#030105]">{formatCurrency(selectedTransaction.payment.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a48674]">Tax (12%):</span>
                      <span className="text-[#030105]">{formatCurrency(selectedTransaction.payment.tax)}</span>
                    </div>
                    {selectedTransaction.payment.discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#a48674]">Discount:</span>
                        <span className="text-green-600">-{formatCurrency(selectedTransaction.payment.discount)}</span>
                      </div>
                    )}
                    <hr className="border-[#f7e9b8]" />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-[#860809]">Total:</span>
                      <span className="text-[#860809]">{formatCurrency(selectedTransaction.payment.total)}</span>
                    </div>
                    {selectedTransaction.payment.method === 'cash' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-[#a48674]">Cash Received:</span>
                          <span className="text-[#030105]">{formatCurrency(selectedTransaction.payment.cashReceived)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#a48674]">Change:</span>
                          <span className="text-[#030105]">{formatCurrency(selectedTransaction.payment.change)}</span>
                        </div>
                      </>
                    )}
                    {(selectedTransaction.payment.method === 'online' || selectedTransaction.payment.method === 'bank') && selectedTransaction.customer.referenceNumber && (
                      <div className="flex justify-between">
                        <span className="text-[#a48674]">Reference Number:</span>
                        <span className="text-[#030105]">{selectedTransaction.customer.referenceNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeDetails}
                  className="flex-1 py-2 px-4 border border-[#f7e9b8] text-[#860809] rounded-lg hover:bg-[#f7e9b8] transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement print receipt functionality
                    console.log('Print receipt for:', selectedTransaction.transactionId);
                  }}
                  className="flex-1 py-2 px-4 bg-[#a31f17] text-white rounded-lg hover:bg-[#860809] transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Print Receipt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default POSHistoryPage;
