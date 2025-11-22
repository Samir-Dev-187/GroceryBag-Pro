import { useState } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  cards?: {
    title: string;
    subtitle: string;
    action: string;
  }[];
}

const quickCommands = [
  'Show dues',
  'Last 7 days sales',
  'Any unusual pattern?',
  'Monthly summary',
];

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'bot',
    text: 'Hi! I\'m your AI assistant. I can help you with sales data, customer dues, and business insights. What would you like to know?',
    timestamp: new Date(),
  },
];

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');

  const handleSend = (message?: string) => {
    const textToSend = message || inputValue;
    if (!textToSend.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: textToSend,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      let botResponse: Message;

      if (textToSend.toLowerCase().includes('dues') || textToSend.toLowerCase().includes('outstanding')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          text: 'Here are the customers with outstanding dues:',
          timestamp: new Date(),
          cards: [
            { title: 'Rajesh Kumar', subtitle: '₹18,920 outstanding', action: 'View Details' },
            { title: 'Priya Sharma', subtitle: '₹12,450 outstanding', action: 'View Details' },
            { title: 'Amit Patel', subtitle: '₹8,300 outstanding', action: 'View Details' },
          ],
        };
      } else if (textToSend.toLowerCase().includes('sales') || textToSend.toLowerCase().includes('7 days')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          text: 'Last 7 days sales summary:\n\n• Total Units: 847\n• Total Revenue: ₹1,45,280\n• Top Bag Size: 10kg (342 units)\n• Average Daily Sales: 121 units\n\nSales are up 24% compared to previous week! 📈',
          timestamp: new Date(),
        };
      } else if (textToSend.toLowerCase().includes('unusual') || textToSend.toLowerCase().includes('pattern')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          text: '⚠️ I detected 2 unusual patterns:\n\n1. 10kg bag sales spiked by 180% - possible bulk order\n2. Purchase activity is 45% lower than usual\n\nWould you like more details on any of these?',
          timestamp: new Date(),
        };
      } else if (textToSend.toLowerCase().includes('monthly') || textToSend.toLowerCase().includes('summary')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          text: 'November 2024 Summary:\n\n💰 Total Revenue: ₹3,45,280\n📦 Units Sold: 2,847\n💵 Cash: ₹45,280\n💳 Online: ₹32,450\n⚠️ Outstanding: ₹18,920\n\nBest selling: 10kg bags (1,245 units)\nProfit margin: 22.5%',
          timestamp: new Date(),
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          text: 'I can help you with:\n\n• Customer dues and payments\n• Sales analytics and trends\n• Purchase history\n• Unusual patterns and alerts\n• Monthly summaries\n\nWhat would you like to know?',
          timestamp: new Date(),
        };
      }

      setMessages((prev) => [...prev, botResponse]);
    }, 800);

    setInputValue('');
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 lg:bottom-6 right-6 w-14 h-14 bg-[#0F9D58] hover:bg-[#0d8a4d] text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-transform hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Panel - Mobile (Slide Up) */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Mobile Chat Modal */}
          <div className="fixed inset-x-0 bottom-0 top-20 lg:hidden bg-white z-50 rounded-t-3xl shadow-2xl animate-slide-up flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0F9D58] rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900">AI Assistant</h3>
                  <div className="text-green-600 text-xs">Online</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-[#0F9D58]" />
                    </div>
                  )}
                  <div className={`flex flex-col max-w-[75%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-[#0F9D58] text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                    {message.cards && (
                      <div className="mt-2 space-y-2 w-full">
                        {message.cards.map((card, index) => (
                          <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow"
                          >
                            <div className="text-sm text-gray-900 mb-1">{card.title}</div>
                            <div className="text-xs text-gray-500 mb-2">{card.subtitle}</div>
                            <button className="text-[#0F9D58] text-xs hover:underline">
                              {card.action} →
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Commands */}
            <div className="px-4 py-2 border-t border-gray-200">
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {quickCommands.map((command) => (
                  <button
                    key={command}
                    onClick={() => handleSend(command)}
                    className="px-4 py-2 bg-green-50 text-[#0F9D58] rounded-full text-sm whitespace-nowrap hover:bg-green-100 transition-colors flex-shrink-0"
                  >
                    {command}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 h-12 rounded-xl"
                />
                <Button
                  onClick={() => handleSend()}
                  className="h-12 w-12 bg-[#0F9D58] hover:bg-[#0d8a4d] rounded-xl flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Desktop Chat Panel */}
          <div className="hidden lg:block fixed right-6 bottom-6 w-96 h-[600px] bg-white z-50 rounded-2xl shadow-2xl animate-slide-up flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0F9D58] rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900">AI Assistant</h3>
                  <div className="text-green-600 text-xs">Online</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-[#0F9D58]" />
                    </div>
                  )}
                  <div className={`flex flex-col max-w-[75%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-[#0F9D58] text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                    {message.cards && (
                      <div className="mt-2 space-y-2 w-full">
                        {message.cards.map((card, index) => (
                          <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow"
                          >
                            <div className="text-sm text-gray-900 mb-1">{card.title}</div>
                            <div className="text-xs text-gray-500 mb-2">{card.subtitle}</div>
                            <button className="text-[#0F9D58] text-xs hover:underline">
                              {card.action} →
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Commands */}
            <div className="px-4 py-2 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {quickCommands.map((command) => (
                  <button
                    key={command}
                    onClick={() => handleSend(command)}
                    className="px-3 py-1.5 bg-green-50 text-[#0F9D58] rounded-full text-xs whitespace-nowrap hover:bg-green-100 transition-colors"
                  >
                    {command}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 rounded-b-2xl">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 h-10 rounded-xl"
                />
                <Button
                  onClick={() => handleSend()}
                  className="h-10 w-10 bg-[#0F9D58] hover:bg-[#0d8a4d] rounded-xl flex-shrink-0 p-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}