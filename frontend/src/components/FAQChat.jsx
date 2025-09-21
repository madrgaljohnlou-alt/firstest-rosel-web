import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, ArrowLeft, Search } from 'lucide-react';
import { useChatStore } from '../store/chatStore.js';

const FAQChat = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const messagesEndRef = useRef(null);
    
    const { 
        faqs, 
        isLoading, 
        error, 
        getFAQs, 
        createChat, 
        currentChat, 
        messages, 
        getChatMessages,
        sendMessage,
        sendFAQResponse,
        openChat,
        clearMessages
    } = useChatStore();

    const categories = [
        { value: '', label: 'All Categories' },
        { value: 'delivery', label: 'Delivery' },
        { value: 'payment', label: 'Payment' },
        { value: 'products', label: 'Products' },
        { value: 'orders', label: 'Orders' },
        { value: 'returns', label: 'Returns' },
        { value: 'general', label: 'General' }
    ];

    useEffect(() => {
        // Load FAQs on component mount
        getFAQs();
    }, [getFAQs]);

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // Clear messages when entering FAQ chat to start fresh
        if (currentChat && currentChat.type === 'faq') {
            // Don't load past messages for FAQ - start fresh each time
            clearMessages();
        }
    }, [currentChat, clearMessages]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        
        setIsSearching(true);
        try {
            await getFAQs(selectedCategory, searchQuery);
        } finally {
            setIsSearching(false);
        }
    };

    const handleQuestionClick = async (faq) => {
        try {
            let chat = currentChat;
            
            // Create new FAQ chat if none exists
            if (!chat || chat.type !== 'faq') {
                chat = await createChat('faq');
            }
            
            // Send the question as a user message
            await sendMessage(chat.chatId, faq.question, 'text');
            
            // Send FAQ response using the store function
            setTimeout(async () => {
                try {
                    await sendFAQResponse(chat.chatId, faq._id);
                } catch (error) {
                    console.error('Error sending FAQ response:', error);
                }
            }, 1000);
            
        } catch (error) {
            console.error('Error handling FAQ question:', error);
        }
    };

    const handleBackToSelection = () => {
        openChat('selection');
    };

    const filteredFAQs = faqs.filter(faq => {
        const matchesCategory = !selectedCategory || faq.category === selectedCategory;
        const matchesSearch = !searchQuery || 
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.keywords.some(keyword => keyword.includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex flex-col h-full">
            {/* Header with back button */}
            <div className="p-4 border-b border-[#f7e9b8] bg-[#f7e9b8]">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleBackToSelection}
                        className="w-8 h-8 bg-[#860809] hover:bg-[#a31f17] 
                                 rounded-full flex items-center justify-center
                                 transition-colors duration-200"
                    >
                        <ArrowLeft className="w-4 h-4 text-[#fffefc]" />
                    </button>
                    <div>
                        <h3 className="font-bold text-[#030105]">FAQ Assistant</h3>
                        <p className="text-sm text-[#030105] opacity-70">
                            Find answers to common questions
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="p-4 border-b border-[#f7e9b8] bg-[#fffefc]">
                <div className="space-y-3">
                    {/* Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search FAQs..."
                            className="w-full pl-10 pr-4 py-2 border border-[#f7e9b8] 
                                     rounded-lg focus:ring-2 focus:ring-[#860809] 
                                     focus:border-transparent bg-[#fffefc] text-[#030105]"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                         w-4 h-4 text-[#860809]" />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-[#f7e9b8] 
                                 rounded-lg focus:ring-2 focus:ring-[#860809] 
                                 focus:border-transparent bg-[#fffefc] text-[#030105]"
                    >
                        {categories.map(category => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="w-full bg-[#860809] hover:bg-[#a31f17] 
                                 disabled:opacity-50 text-[#fffefc] py-2 px-4 
                                 rounded-lg font-medium transition-colors duration-200
                                 flex items-center justify-center space-x-2"
                    >
                        {isSearching ? (
                            <div className="w-4 h-4 border-2 border-[#ffd901] border-t-transparent 
                                         rounded-full animate-spin" />
                        ) : (
                            <>
                                <Search className="w-4 h-4" />
                                <span>Search</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {currentChat && messages.length > 0 ? (
                    /* Chat Messages */
                    <div className="p-4 space-y-4">
                        <AnimatePresence>
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex ${message.senderType === 'customer' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex items-start space-x-2 max-w-[80%] ${message.senderType === 'customer' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            message.senderType === 'customer' 
                                                ? 'bg-[#860809]' 
                                                : 'bg-[#f7e9b8]'
                                        }`}>
                                            {message.senderType === 'customer' ? (
                                                <User className="w-4 h-4 text-[#fffefc]" />
                                            ) : (
                                                <Bot className="w-4 h-4 text-[#030105]" />
                                            )}
                                        </div>
                                        <div className={`px-4 py-2 rounded-lg ${
                                            message.senderType === 'customer'
                                                ? 'bg-[#860809] text-[#fffefc]'
                                                : 'bg-[#f7e9b8] text-[#030105]'
                                        }`}>
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                            <p className={`text-xs mt-1 ${
                                                message.senderType === 'customer' 
                                                    ? 'text-[#fffefc] opacity-70' 
                                                    : 'text-[#030105] opacity-70'
                                            }`}>
                                                {new Date(message.createdAt).toLocaleTimeString([], { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>
                ) : (
                    /* FAQ List */
                    <div className="p-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="w-6 h-6 border-2 border-[#901414] border-t-transparent 
                                             rounded-full animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <p className="text-[#860809] font-medium">Error loading FAQs</p>
                                <p className="text-sm text-[#030105] opacity-70 mt-1">{error}</p>
                            </div>
                        ) : filteredFAQs.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-[#030105] font-medium">No FAQs found</p>
                                <p className="text-sm text-[#030105] opacity-70 mt-1">
                                    Try adjusting your search or category filter
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredFAQs.map((faq, index) => (
                                    <motion.button
                                        key={faq._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleQuestionClick(faq)}
                                        className="w-full p-4 bg-[#f7e9b8] hover:bg-[#f0d896] 
                                                 rounded-lg border border-[#f7e9b8] 
                                                 transition-all duration-200 text-left
                                                 group"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-[#030105] mb-2 group-hover:text-[#860809] transition-colors">
                                                    {faq.question}
                                                </h4>
                                                <p className="text-sm text-[#030105] opacity-70 line-clamp-2">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                            <div className="ml-3 flex-shrink-0">
                                                <div className="w-6 h-6 bg-[#860809] rounded-full 
                                                             flex items-center justify-center
                                                             opacity-0 group-hover:opacity-100
                                                             transition-opacity duration-200">
                                                    <Send className="w-3 h-3 text-[#fffefc]" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center space-x-2">
                                            <span className="text-xs bg-[#860809] text-[#fffefc] 
                                                          px-2 py-1 rounded-full">
                                                {faq.category}
                                            </span>
                                            {faq.priority > 5 && (
                                                <span className="text-xs bg-[#a31f17] text-[#fffefc] 
                                                              px-2 py-1 rounded-full">
                                                    Popular
                                                </span>
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Need more help section */}
            {(!currentChat || currentChat.type !== 'faq') && (
                <div className="p-4 border-t border-[#f7e9b8] bg-[#fffefc]">
                    <div className="text-center">
                        <p className="text-sm text-[#030105] opacity-70 mb-3">
                            Still need help?
                        </p>
                        <button
                            onClick={() => openChat('support')}
                            className="bg-[#860809] hover:bg-[#a31f17] text-[#fffefc] 
                                     px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                        >
                            Contact Support
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FAQChat;
