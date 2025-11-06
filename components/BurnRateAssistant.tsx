'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  LineChart,
  Monitor,
  Table,
  FileText,
  Timer,
  Share2,
  Camera,
  Grid,
  TrendingUp,
  Settings,
  Search,
  Bell,
  Plus,
  ArrowUp,
  ArrowLeft,
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
  Pause,
  Square,
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

// Quick actions data
const quickActions: string[] = [
  'Show projections for next 3 months',
  'Compare monthly burn rate to previous year',
  'Identify funding options before runway ends',
  'Breakdown top expense categories',
  'Recommend cost-saving measures',
];

const titleText = 'Burn Rate Analysis with Runway Projections';

export function BurnRateAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [showMetrics, setShowMetrics] = useState(false);
  // Quick actions do not require dedicated state; we reuse input setter
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [streamedTitle, setStreamedTitle] = useState('');
  const streamControllerRef = useRef<{ shouldPause: boolean; shouldStop: boolean }>({ shouldPause: false, shouldStop: false });
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamedText]);

  const streamText = async (text: string) => {
    setStreamedText('');
    setIsStreaming(true);
    setIsPaused(false);
    streamControllerRef.current = { shouldPause: false, shouldStop: false };
    
    // Stream character by character for smoother effect - faster speed
    for (let i = 0; i < text.length; i++) {
      // Check if paused
      while (streamControllerRef.current.shouldPause && !streamControllerRef.current.shouldStop) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Check if stopped
      if (streamControllerRef.current.shouldStop) {
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 5));
      setStreamedText(prev => prev + text[i]);
    }
    
    setIsStreaming(false);
    setIsPaused(false);
  };

  const streamTitle = async (text: string) => {
    setStreamedTitle('');
    const words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
      if (streamControllerRef.current.shouldStop) break;
      await new Promise(resolve => setTimeout(resolve, 120));
      setStreamedTitle(prev => (prev ? prev + ' ' : '') + words[i]);
    }
  };

  const handlePause = () => {
    // Stop streaming and save current streamed text as a message
    streamControllerRef.current.shouldStop = true;
    streamControllerRef.current.shouldPause = false;
    
    // If there's streamed text, save it as a message
    if (streamedText.trim()) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'assistant',
          content: streamedText,
          timestamp: new Date(),
        },
      ]);
    }
    
    setIsStreaming(false);
    setIsPaused(false);
    setIsThinking(false);
    setStreamedText('');
    setIsProcessing(false);
    setCurrentStep(0);
    // Clear input to allow new message
    setInputValue('');
  };

  const processSteps = async () => {
    setIsProcessing(true);
    setShowRightPanel(true);

    for (let i = 0; i < steps.length; i++) {
      // Check if streaming was stopped
      if (streamControllerRef.current.shouldStop) {
        return;
      }
      setCurrentStep(i + 1);
      await new Promise(resolve => setTimeout(resolve, steps[i].delay));

      if (i === 1) {
        setShowMetrics(true);
      }
    }

    // Check if streaming was stopped
    if (streamControllerRef.current.shouldStop) {
      return;
    }

    // briefly show the final step (4/4) then clear the step indicator
    await new Promise(resolve => setTimeout(resolve, 700));
    setCurrentStep(0);

    await streamText(assistantResponse);

    // Check if streaming was stopped before adding message
    if (streamControllerRef.current.shouldStop) {
      return;
    }

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
    setIsStreaming(false);
    setIsPaused(false);
    // End of processing
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    // Reset any previous streaming state
    streamControllerRef.current = { shouldPause: false, shouldStop: false };
    setStreamedText('');

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue('');
    
    // Show thinking state for 2-3 seconds
    setIsThinking(true);
    setIsStreaming(true);
    
    // Wait for thinking animation (2.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Check if stopped during thinking
    if (streamControllerRef.current.shouldStop) {
      setIsThinking(false);
      setIsStreaming(false);
      return;
    }
    
    setIsThinking(false);
    // After thinking, stream the title
    streamTitle(titleText);
    await processSteps();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-y-hidden overflow-x-hidden text-neutral-800">
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
            className={`fixed lg:sticky top-0 left-0 z-50 w-16 bg-white border-r border-neutral-200 flex-shrink-0 flex flex-col items-center py-4 overflow-y-auto ${
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            } transition-transform duration-300`}
          >
            {/* Top Logo Section */}
            <div className="pb-3">
              <button className="h-12 w-12 grid place-items-center rounded-md hover:bg-neutral-100/60 transition-colors">
                <Sun className="w-7 h-7 text-neutral-950" strokeWidth={2} />
              </button>
            </div>

            {/* Divider removed to avoid double top line */}

            {/* Main Icon List - 10 icons */}
            <div className="flex flex-col gap-2 w-full px-2 flex-1 mt-3 sm:mt-4 overflow-y-auto pb-4">
              <button className="h-11 w-11 mx-auto grid place-items-center hover:bg-neutral-100/60 rounded-md transition-colors">
                <LineChart className="w-5 h-5 text-neutral-800" strokeWidth={2} />
              </button>
              <button className="h-11 w-11 mx-auto grid place-items-center hover:bg-neutral-100/60 rounded-md transition-colors">
                <Monitor className="w-5 h-5 text-neutral-800" strokeWidth={2} />
              </button>
              <button className="h-11 w-11 mx-auto grid place-items-center hover:bg-neutral-100/60 rounded-md transition-colors">
                <Table className="w-5 h-5 text-neutral-800" strokeWidth={2} />
              </button>
              <button className="h-11 w-11 mx-auto grid place-items-center hover:bg-neutral-100/60 rounded-md transition-colors">
                <FileText className="w-5 h-5 text-neutral-800" strokeWidth={2} />
              </button>
              <button className="h-11 w-11 mx-auto grid place-items-center hover:bg-neutral-100/60 rounded-md transition-colors">
                <Timer className="w-5 h-5 text-neutral-800" strokeWidth={2} />
              </button>
              <button className="h-11 w-11 mx-auto grid place-items-center hover:bg-neutral-100/60 rounded-md transition-colors">
                <Share2 className="w-5 h-5 text-neutral-800" strokeWidth={2} />
              </button>
              <button className="h-11 w-11 mx-auto grid place-items-center hover:bg-neutral-100/60 rounded-md transition-colors">
                <Camera className="w-5 h-5 text-neutral-800" strokeWidth={2} />
              </button>
              <button className="h-11 w-11 mx-auto grid place-items-center hover:bg-neutral-100/60 rounded-md transition-colors">
                <Grid className="w-5 h-5 text-neutral-800" strokeWidth={2} />
              </button>
              <button className="h-11 w-11 mx-auto grid place-items-center hover:bg-neutral-100/60 rounded-md transition-colors">
                <Settings className="w-5 h-5 text-neutral-800" strokeWidth={2} />
              </button>
            </div>

            {/* Bottom button */}
            <div className="pt-5">
              <button className="w-11 h-11 grid place-items-center rounded-md border border-neutral-200 bg-white hover:bg-neutral-50">
                <span className="text-base sm:text-lg font-extrabold text-neutral-950">L</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      
        <div className="flex-1 flex flex-col">
        <header className="relative flex items-center justify-between px-6 pt-4 pb-3 bg-white">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Menu className="w-5 h-5 text-neutral-800" />
            </button>
            
            <div className="relative flex-1 max-w-md min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Find anything..."
                className="w-full pl-10 pr-3 py-2 text-sm border-none focus:outline-none text-neutral-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button className="hidden sm:block text-sm text-neutral-700 hover:text-neutral-900 transition-colors px-3 h-9 border border-neutral-300 bg-white rounded-full">
              Feedback
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 transition-colors">
              <Bell className="w-5 h-5 text-neutral-800" />
            </button>
            <Avatar className="w-8 h-8 hidden sm:flex">
              <AvatarImage src="https://i.pravatar.cc/150?img=68" alt="User" />
              <AvatarFallback className="bg-black text-white text-xs">U</AvatarFallback>
            </Avatar>
          </div>
          {/* Full-width divider above sidebar to make the line collide */}
          <div className="pointer-events-none absolute right-0 -left-16 bottom-0 border-b border-neutral-200 z-[60]" />
        </header>

        <div className="flex-1 flex flex-col lg:flex-row overflow-x-hidden overflow-y-hidden min-w-0">
          <div className="flex-1 flex flex-col min-w-0">
            {/* Main Content Header with centered title, left chevron, right actions */}
            <div className="px-5 py-3 mt-5 sm:mt-6 grid grid-cols-3 items-center">
              {/* Left: Back */}
              <div className="flex items-center">
                <button className="h-9 w-9 grid place-items-center rounded-md transition-colors flex-shrink-0 border border-neutral-200 bg-white hover:bg-neutral-50">
                  <ArrowLeft className="w-5 h-5 text-neutral-700" strokeWidth={2} />
                </button>
              </div>
              {/* Center: Title */}
              <div className="flex items-center justify-center">
                {streamedTitle && (
                  <h1 className="text-sm font-medium text-neutral-700 text-center leading-5">
                    {streamedTitle}
                  </h1>
                )}
              </div>
              {/* Right: Actions */}
              <div className="flex items-center justify-end gap-3 sm:gap-4 pr-2 sm:pr-3">
                <button className="h-9 w-9 grid place-items-center rounded-md transition-colors border border-neutral-200 bg-white hover:bg-neutral-50">
                  <Plus className="w-5 h-5 text-neutral-800" />
                </button>
                <button className="h-9 w-9 grid place-items-center rounded-md transition-colors border border-neutral-200 bg-white hover:bg-neutral-50">
                  <Menu className="w-5 h-5 text-neutral-800" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {messages.length === 0 && !isProcessing && (
                <div className="h-full">
                </div>
              )}

              <div className="w-full pr-3 sm:pr-4 pl-2 sm:pl-4 space-y-4 sm:space-y-6">
                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => {
                    // Always render previous messages to avoid visual cutting during streaming
                  // Standard placement: user on right, assistant on left
                  const shouldCenterUserMessage = false;
                  const hideAssistantAvatar = message.type === 'assistant' && (
                    message.content.includes('Monthly Burn Rate') ||
                    message.content.includes("I'm currently gathering financial data")
                  );
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                        className={`flex ${
                          message.type === 'user'
                            ? 'justify-end pr-4 sm:pr-6'
                            : 'justify-start pl-2 sm:pl-3'
                        }`}
                    >
                      {message.type === 'user' ? (
                        // User: bubble on right, small avatar to the right of bubble
                        <div className="flex items-end justify-end gap-1 max-w-[90%] sm:max-w-[85%]">
                          <div className="rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 bg-neutral-100 text-neutral-900 shadow-sm">
                            <p className="text-xs sm:text-sm whitespace-pre-wrap break-words text-neutral-900">{message.content}</p>
                          </div>
                          <Avatar className="w-4 h-4 sm:w-5 sm:h-5">
                            <AvatarImage src="https://i.pravatar.cc/150?img=68" alt="User" />
                            <AvatarFallback className="bg-black text-white text-[10px]">U</AvatarFallback>
                          </Avatar>
                        </div>
                      ) : (
                        // Assistant: avatar left, bubble right
                        <div className={`flex gap-2 sm:gap-3 max-w-[95%] sm:max-w-[88%] flex-row`}>
                          {!hideAssistantAvatar && (
                            <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                              <AvatarFallback className="bg-gray-100 text-xs">A</AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex flex-col min-w-0">
                            <div className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-3 bg-neutral-50`}>
                              <div className="text-xs sm:text-sm text-neutral-700">
                                {message.content.split('\n\n').map((paragraph, idx) => {
                                  const trimmed = paragraph.trim();
                                  if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                                    const heading = trimmed.replace(/\*\*/g, '').trim();
                                    return (
                                      <h3 key={idx} className="font-medium text-neutral-900 mb-2 mt-3 sm:mt-4 first:mt-0 text-xs sm:text-sm">
                                        {heading}
                                      </h3>
                                    );
                                  }
                                  return (
                                    <p key={idx} className="mb-3 sm:mb-4 leading-relaxed last:mb-0 text-xs sm:text-sm text-neutral-700">
                                      {trimmed}
                                    </p>
                                  );
                                })}
                              </div>
                            </div>
                            {/* Action icons below the message bubble */}
                            <div className="flex items-center gap-1 sm:gap-2 mt-2 ml-2 sm:ml-4 flex-wrap">
                              <button className="p-1 sm:p-1.5 hover:bg-gray-200 rounded transition-colors">
                                <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700" />
                              </button>
                              <button className="p-1 sm:p-1.5 hover:bg-gray-200 rounded transition-colors">
                                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700" />
                              </button>
                              <button className="p-1 sm:p-1.5 hover:bg-gray-200 rounded transition-colors">
                                <ThumbsUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700" />
                              </button>
                              <button className="p-1 sm:p-1.5 hover:bg-gray-200 rounded transition-colors">
                                <ThumbsDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700" />
                              </button>
                              <button className="p-1 sm:p-1.5 hover:bg-gray-200 rounded transition-colors">
                                <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      </motion.div>
                    );
                  })}

                  {isThinking && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-center"
                    >
                      <p className="text-xs sm:text-sm text-neutral-500 animate-pulse">Thinking...</p>
                    </motion.div>
                  )}

                  {isProcessing && currentStep > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="inline-flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-md px-2.5 py-1 animate-pulse">
                        <TrendingUp className="w-4 h-4 text-neutral-600" />
                        <p className="text-xs font-medium text-neutral-800">Getting Burn Rate Data</p>
                      </div>
                    </motion.div>
                  )}

                  {streamedText && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 pr-1 sm:pr-2"
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="bg-neutral-50 rounded-2xl px-3 sm:px-4 py-2 sm:py-3">
                          <div className="text-xs sm:text-sm text-neutral-700">
                            {streamedText.split('\n\n').map((paragraph, idx) => {
                              const trimmed = paragraph.trim();
                              if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                                const heading = trimmed.replace(/\*\*/g, '').trim();
                                return (
                                  <h3 key={idx} className="font-medium text-neutral-900 mb-2 mt-3 sm:mt-4 first:mt-0 text-xs sm:text-sm">
                                    {heading}
                                  </h3>
                                );
                              }
                              return (
                                <p key={idx} className="mb-3 sm:mb-4 leading-relaxed last:mb-0 text-xs sm:text-sm text-neutral-700">
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
                              <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700" />
                            </button>
                            <button className="p-1 sm:p-1.5 hover:bg-gray-200 rounded transition-colors">
                              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700" />
                            </button>
                            <button className="p-1 sm:p-1.5 hover:bg-gray-200 rounded transition-colors">
                              <ThumbsUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700" />
                            </button>
                            <button className="p-1 sm:p-1.5 hover:bg-gray-200 rounded transition-colors">
                              <ThumbsDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700" />
                            </button>
                            <button className="p-1 sm:p-1.5 hover:bg-gray-200 rounded transition-colors">
                              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick actions row */}
                {(() => {
                  const hasAssistantMessage = messages.some(m => m.type === 'assistant');
                  const canShowQuickActions = hasAssistantMessage && !isProcessing && !isStreaming && !isThinking && streamedText === '';
                  return canShowQuickActions;
                })() && (
                  <div className="pt-1">
                    <div className="relative">
                      {/* horizontally scrollable only for buttons */}
                      <div className="overflow-x-auto overflow-y-hidden -mx-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="px-1 inline-flex gap-2">
                          {quickActions.map((action, idx) => (
                            <button
                              key={idx}
                              onClick={() => setInputValue(action)}
                              className="shrink-0 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 text-xs sm:text-sm px-3 py-1.5"
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            </div>

            <div className="px-5 py-3 bg-white">
              <div className="max-w-3xl mx-auto">
                {(isStreaming || isThinking) ? (
                  // Streaming/Thinking state - two-row layout: placeholder then controls row
                  <div className="relative rounded-md bg-neutral-50 border border-neutral-200 p-3 space-y-2">
                    {/* Soft fade only inside this small box */}
                    <div className="pointer-events-none absolute -top-px left-0 right-0 h-2 bg-gradient-to-b from-neutral-300/40 to-transparent rounded-t-md" />
                    <div className="flex items-center">
                      <input
                        type="text"
                        placeholder="Ask me anything"
                        className="w-full bg-transparent border-none outline-none text-sm text-neutral-600 placeholder:text-neutral-400"
                        disabled
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button className="h-7 w-7 grid place-items-center hover:bg-neutral-100/60 rounded-md transition-colors">
                        <Plus className="w-4 h-4 text-neutral-800" />
                      </button>
                      <button
                        onClick={handlePause}
                        className="h-9 w-9 bg-black text-white rounded-md hover:bg-neutral-800 transition-colors grid place-items-center"
                      >
                        <Square className="w-3.5 h-3.5 fill-white" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // Normal state - two-row layout: textarea then controls row
                  <div className="relative rounded-md bg-neutral-50 border border-neutral-200 p-3 space-y-2">
                    {/* Soft fade only inside this small box */}
                    <div className="pointer-events-none absolute -top-px left-0 right-0 h-2 bg-gradient-to-b from-neutral-300/40 to-transparent rounded-t-md" />
                    <div className="flex items-end">
                      <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything"
                        rows={1}
                        className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-neutral-700 placeholder:text-neutral-400"
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button className="h-7 w-7 grid place-items-center hover:bg-neutral-100/60 rounded-md transition-colors">
                        <Plus className="w-4 h-4 text-neutral-800" />
                      </button>
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isProcessing}
                        className="h-9 w-9 bg-black text-white rounded-md hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed grid place-items-center"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
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
                className="hidden lg:block w-[640px] flex-shrink-0 bg-transparent overflow-y-auto p-4"
              >
                <div className="relative flex flex-col">
                  {/* Boxed analysis panel */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 lg:p-6 relative flex flex-col">
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

                        {/* Removed duplicate "analysis complete" card */}

                        {isProcessing && currentStep > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start justify-between"
                          >
                            <div className="flex items-start gap-2">
                              <Loader2 className="w-4 h-4 animate-spin text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{steps[currentStep - 1].label}</p>
                                {steps[currentStep - 1].sublabel && (
                                  <p className="text-xs text-gray-500 mt-0.5">{steps[currentStep - 1].sublabel}</p>
                                )}
                              </div>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">{currentStep}/{steps.length}</span>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Circular 'A' button placed below the text */}
                  <div className="mt-4 lg:mt-6 flex justify-end">
                    <button className="bg-black text-white rounded-full w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors">
                      <span className="text-xs lg:text-sm font-medium">A</span>
                    </button>
                  </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
