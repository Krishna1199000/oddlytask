'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  TrendingUp,
  Monitor,
  Grid3x3,
  FileText,
  Clock,
  Share2,
  Briefcase,
  LayoutGrid,
  Settings,
  Search,
  Bell,
  Plus,
  ArrowUp,
  ChevronLeft,
  Copy,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  Sparkles,
  Info,
  Menu,
  X,
} from 'lucide-react';
import { BurnRateChart } from './BurnRateChart';
import { MetricsCards } from './MetricsCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Step {
  id: number;
  label: string;
  sublabel?: string;
  delay: number;
}

const steps: Step[] = [
  { id: 1, label: 'Getting Burn Rate Data', delay: 1200 },
  { id: 2, label: 'Loading burn rate data', sublabel: 'Fetching financial data from your accounts', delay: 1800 },
  { id: 3, label: 'Generating insights', sublabel: 'Running AI analysis and generating insights', delay: 2000 },
  { id: 4, label: 'Burn rate analysis complete', delay: 1000 },
];

const assistantResponse = `I'm currently gathering financial data for your burn rate analysis from September 1, 2024, to September 30, 2025, which will provide insights into your monthly burn rate, cash runway, and expense breakdown.

**Monthly Burn Rate**

Your current monthly burn rate is 12 758,56 kr

**Cash Runway**

Your cash runway is approximately 2 months, meaning you can sustain operations for the next 2 months before needing additional funding. This is critical for your business planning.

**Expense Breakdown**

Your largest expense category is Stock Dividen, accounting for 39% of your total monthly burn rate.

**Trends and Insights**

Your burn rate has decreased by 93% over the past 13 months.

The chart on the right shows your monthly burn rate trends with current vs average spending patterns, while the metrics provide additional context about your financial runway and expense breakdown.`;

const quickActions = [
  'low projections for next 3 months',
  'Compare monthly burn rate to previous year',
  'Identify funding options before cash runway ends',
];

export function BurnRateAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [showMetrics, setShowMetrics] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamedText]);

  const streamText = async (text: string) => {
    setStreamedText('');
    
    // Stream character by character for smoother effect - faster speed
    for (let i = 0; i < text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 5));
      setStreamedText(prev => prev + text[i]);
    }
  };

  const processSteps = async () => {
    setIsProcessing(true);
    setShowRightPanel(true);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i + 1);
      await new Promise(resolve => setTimeout(resolve, steps[i].delay));

      if (i === 1) {
        setShowMetrics(true);
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Reset currentStep before streaming starts to hide "Burn rate analysis complete"
    setCurrentStep(0);
    
    await streamText(assistantResponse);

    // Add message to messages array after streaming completes
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
      },
    ]);

    // Clear streamedText after adding to messages to prevent duplicate
    setStreamedText('');
    setIsProcessing(false);
    setShowQuickActions(true);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    await processSteps();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            initial={{ x: -64, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -64, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`fixed lg:static inset-y-0 left-0 z-50 w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 ${
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            } transition-transform duration-300`}
          >
            {/* Top Logo Section */}
            <div className="pb-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Sun className="w-5 h-5 text-gray-900" strokeWidth={2} />
              </button>
            </div>

            {/* Divider */}
            <div className="w-full border-b border-gray-200 mb-2" />

            {/* Main Icon List - 10 icons */}
            <div className="flex flex-col gap-1 w-full px-2 flex-1">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <TrendingUp className="w-5 h-5 text-gray-700" strokeWidth={2} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Monitor className="w-5 h-5 text-gray-700" strokeWidth={2} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Grid3x3 className="w-5 h-5 text-gray-700" strokeWidth={2} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FileText className="w-5 h-5 text-gray-700" strokeWidth={2} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Clock className="w-5 h-5 text-gray-700" strokeWidth={2} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="w-5 h-5 text-gray-700" strokeWidth={2} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Briefcase className="w-5 h-5 text-gray-700" strokeWidth={2} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <LayoutGrid className="w-5 h-5 text-gray-700" strokeWidth={2} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-700" strokeWidth={2} />
              </button>
            </div>

            {/* Bottom Avatar */}
            <div className="pt-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://i.pravatar.cc/150?img=68" alt="User" />
                <AvatarFallback className="bg-black text-white text-xs font-medium">A</AvatarFallback>
              </Avatar>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-3 sm:px-6 bg-white">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="relative flex-1 max-w-md min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Find anything..."
                className="w-full pl-10 pr-4 py-2 text-sm border-none focus:outline-none text-gray-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <button className="hidden sm:block text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Feedback
            </button>
            <div className="relative">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                1
              </span>
            </div>
            <Avatar className="w-8 h-8 hidden sm:flex">
              <AvatarImage src="https://i.pravatar.cc/150?img=68" alt="User" />
              <AvatarFallback className="bg-black text-white text-xs">U</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0">
            {/* Main Content Header - Always visible with ChevronLeft */}
            <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                  <ChevronLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
                </button>
                {messages.length > 0 && (
                  <h1 className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                    Burn Rate Analysis with Runway Projections
                  </h1>
                )}
              </div>
              {messages.length > 0 && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Grid3x3 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-8">
              {messages.length === 0 && !isProcessing && (
                <div className="h-full">
                </div>
              )}

              {messages.length > 0 && (
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Analyze my burn rate button */}
                  <div className="flex items-center gap-2">
                    <button className="bg-gray-900 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors">
                      <Sparkles className="w-4 h-4" />
                      <span className="hidden sm:inline">Analyze my burn rate</span>
                      <span className="sm:hidden">Analyze</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => {
                    // Skip assistant messages that are currently being streamed
                    if (message.type === 'assistant' && streamedText) {
                      return null;
                    }
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                            {message.type === 'user' ? (
                              <>
                                <AvatarImage src="https://i.pravatar.cc/150?img=68" alt="User" />
                                <AvatarFallback className="bg-black text-white text-xs">U</AvatarFallback>
                              </>
                            ) : (
                              <AvatarFallback className="bg-gray-100 text-xs">A</AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <div className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${message.type === 'user' ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
                              {message.type === 'assistant' ? (
                                <div className="text-xs sm:text-sm text-gray-900">
                                  {message.content.split('\n\n').map((paragraph, idx) => {
                                    const trimmed = paragraph.trim();
                                    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                                      const heading = trimmed.replace(/\*\*/g, '').trim();
                                    return (
                                      <h3 key={idx} className="font-semibold text-gray-800 mb-2 mt-3 sm:mt-4 first:mt-0 text-xs sm:text-sm">
                                        {heading}
                                      </h3>
                                    );
                                  }
                                  return (
                                    <p key={idx} className="mb-3 sm:mb-4 leading-relaxed last:mb-0 text-xs sm:text-sm">
                                      {trimmed}
                                    </p>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{message.content}</p>
                            )}
                            </div>
                            {/* Action icons below the message bubble */}
                            {message.type === 'assistant' && (
                              <div className="flex items-center gap-1 sm:gap-2 mt-2 ml-2 sm:ml-4 flex-wrap">
                                <button className="p-1 sm:p-1.5 hover:bg-gray-200 rounded transition-colors">
                                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                                </button>
                                <button className="p-1 sm:p-1.5 hover:bg-gray-200 rounded transition-colors">
                                  <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                                </button>
                                <button className="p-1 sm:p-1.5 hover:bg-gray-200 rounded transition-colors">
                                  <ThumbsUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                                </button>
                                <button className="p-1 sm:p-1.5 hover:bg-gray-200 rounded transition-colors">
                                  <ThumbsDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                                </button>
                                <button className="p-1 sm:p-1.5 hover:bg-gray-200 rounded transition-colors">
                                  <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {isProcessing && currentStep > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                        <AvatarFallback className="bg-gray-100 text-xs">A</AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-50 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 min-w-0 flex-1">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{steps[currentStep - 1].label}</p>
                            {steps[currentStep - 1].sublabel && (
                              <p className="text-xs text-gray-500 mt-1 hidden sm:block">{steps[currentStep - 1].sublabel}</p>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 font-medium flex-shrink-0">{currentStep}/4</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {streamedText && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                        <AvatarFallback className="bg-gray-100 text-xs">A</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="bg-gray-50 rounded-2xl px-3 sm:px-4 py-2 sm:py-3">
                          <div className="text-xs sm:text-sm text-gray-900">
                            {streamedText.split('\n\n').map((paragraph, idx) => {
                              const trimmed = paragraph.trim();
                              if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                                const heading = trimmed.replace(/\*\*/g, '').trim();
                                return (
                                  <h3 key={idx} className="font-semibold text-gray-800 mb-2 mt-3 sm:mt-4 first:mt-0 text-xs sm:text-sm">
                                    {heading}
                                  </h3>
                                );
                              }
                              return (
                                <p key={idx} className="mb-3 sm:mb-4 leading-relaxed last:mb-0 text-xs sm:text-sm">
                                  {trimmed}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                        {/* Action icons below the message bubble - show when streaming is complete */}
                        {!isProcessing && streamedText && (
                          <div className="flex items-center gap-1 sm:gap-2 mt-2 ml-2 sm:ml-4 flex-wrap">
                            <button className="p-1 sm:p-1.5 hover:bg-gray-200 rounded transition-colors">
                              <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                            </button>
                            <button className="p-1 sm:p-1.5 hover:bg-gray-200 rounded transition-colors">
                              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                            </button>
                            <button className="p-1 sm:p-1.5 hover:bg-gray-200 rounded transition-colors">
                              <ThumbsUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                            </button>
                            <button className="p-1 sm:p-1.5 hover:bg-gray-200 rounded transition-colors">
                              <ThumbsDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                            </button>
                            <button className="p-1 sm:p-1.5 hover:bg-gray-200 rounded transition-colors">
                              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {showQuickActions && messages.length > 0 && !isProcessing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-3"
                  >
                    <div className="w-6 sm:w-8" />
                    <div className="flex-1 overflow-x-auto min-w-0">
                      <div className="flex gap-2 mb-4 pb-2">
                        {quickActions.map((action, index) => (
                          <button
                            key={index}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap flex-shrink-0"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={chatEndRef} />
              </div>
            </div>

            <div className="border-t border-gray-200 px-3 sm:px-6 py-3 sm:py-4 bg-white">
              <div className="max-w-3xl mx-auto">
                <div className="relative flex items-end gap-2 bg-gray-50 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 focus-within:border-gray-300 transition-colors">
                  <button className="p-1 hover:bg-gray-200 rounded transition-colors mb-1 flex-shrink-0">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  </button>
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything"
                    rows={1}
                    className="flex-1 bg-transparent border-none outline-none resize-none text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 min-w-0"
                    disabled={isProcessing}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isProcessing}
                    className="p-1.5 sm:p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-0.5 flex-shrink-0"
                  >
                    <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showRightPanel && (
              <motion.aside
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="hidden lg:block w-[500px] border-l border-gray-200 bg-white overflow-y-auto"
              >
                <div className="p-4 lg:p-6 relative min-h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-medium text-gray-500">Analysis</h3>
                  </div>

                  <AnimatePresence>
                    {!showMetrics && isProcessing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6 flex-1"
                      >
                        {/* Skeleton for Chart */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="h-4 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                          <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        
                        {/* Skeleton for Metrics Cards */}
                        <div className="grid grid-cols-2 gap-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                              <div className="h-3 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
                              <div className="h-8 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                              <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Skeleton for Summary */}
                        <div className="mt-6">
                          <div className="h-4 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {showMetrics && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6 flex-1"
                      >
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <BurnRateChart />
                        </div>
                        <MetricsCards />
                        
                        {/* Summary Section */}
                        <div className="mt-6">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Summary</h3>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            The company is currently experiencing a monthly burn rate of 12,758.56 kr with a runway of just 2 months remaining, indicating a critical need for cash flow improvements. Notably, there has been a significant 93% decline over the past 13 months, with stock dividends accounting for 39% of the expenses.
                          </p>
                        </div>

                        {currentStep === 4 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                  <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">Burn rate analysis complete</p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {isProcessing && currentStep < 4 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex items-start gap-3">
                              <Loader2 className="w-5 h-5 animate-spin text-gray-400 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{steps[currentStep - 1]?.label}</p>
                                {steps[currentStep - 1]?.sublabel && (
                                  <p className="text-xs text-gray-500 mt-1">{steps[currentStep - 1].sublabel}</p>
                                )}
                              </div>
                              <span className="text-xs text-gray-400 font-medium">{currentStep}/4</span>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Circular 'A' button at bottom-right */}
                  <button className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 bg-black text-white rounded-full w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors">
                    <span className="text-xs lg:text-sm font-medium">A</span>
                  </button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
