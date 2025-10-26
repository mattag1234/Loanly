import { useState, useRef } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Switch } from "./ui/switch";
import { Bot, Send, Settings, TrendingUp, TrendingDown, CheckCircle, User, Loader2, AlertCircle } from "lucide-react";
import { sendChatMessage } from "../utils/ai-api";
import { useUser } from "../contexts/UserContext";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export function CrediBotPage() {
  const { profile } = useUser();
  const userName = `${profile.firstName} ${profile.lastName}`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: `Hi ${profile.firstName}! I'm Mr. LoanLy, your AI financial assistant. I can help you understand your Credibility Index, analyze your financial health, and provide personalized insights. How can I help you today?`,
      timestamp: "10:30 AM"
    },
    {
      id: 2,
      sender: "user",
      text: "What's my current credibility index?",
      timestamp: "10:31 AM"
    },
    {
      id: 3,
      sender: "bot",
      text: "Your current Credibility Index is 82/100, which places you in the Low Risk tier. This is excellent! Your strong payment history and stable income are the main contributors to this score.",
      timestamp: "10:31 AM"
    },
    {
      id: 4,
      sender: "user",
      text: "How can I improve it further?",
      timestamp: "10:32 AM"
    },
    {
      id: 5,
      sender: "bot",
      text: "Great question! Based on your profile, here are 3 actionable steps: 1) Reduce your debt-to-income ratio from 28% to below 25% by making extra payments. 2) Continue your perfect payment streak - you're at 24 months! 3) Increase your savings ratio above 15% to demonstrate stronger financial reserves.",
      timestamp: "10:32 AM"
    }
  ]);

  const [inputValue, setInputValue] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useLetta, setUseLetta] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      // For Letta, just send the user's question directly (Letta maintains its own conversation memory)
      // For Google AI, we need to provide context manually
      let messageToSend = currentInput;
      
      if (!useLetta) {
        // Build conversation history for Google AI (last 3 exchanges)
        const recentMessages = messages.slice(-6); // Last 3 exchanges (6 messages)
        if (recentMessages.length > 0) {
          const conversationContext = recentMessages
            .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
            .join('\n');
          messageToSend = `Previous conversation:\n${conversationContext}\n\nCurrent question: ${currentInput}`;
        }
      }

      // Call the backend API using utility function
      const aiResponse = await sendChatMessage(
        messageToSend,
        {
          income: 5000,
          debt: 1400,
          creditHistoryYears: 5,
          recentInquiries: 2
        },
        useLetta
      );

      const botResponse: Message = {
        id: messages.length + 2,
        sender: "bot",
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to get AI response");
      console.error("Error calling AI:", error);
      setError(error.message);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: messages.length + 2,
        sender: "bot",
        text: "I apologize, but I'm having trouble connecting to the AI service right now. Please check that your API keys are configured correctly and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectLetta = () => {
    if (apiKey.trim()) {
      setIsConnected(true);
      setDialogOpen(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] gap-6 pb-6">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Chat Header */}
        <Card className="p-4 mb-4 bg-gradient-to-r from-[#1ABC9C] to-[#16A085] flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Bot className="w-7 h-7 text-[#1ABC9C]" />
              </div>
              <div>
                <h2 className="text-xl text-white">Mr. LoanLy</h2>
                <p className="text-sm text-white/90">AI Financial Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                <Label htmlFor="letta-toggle" className="text-sm text-white cursor-pointer">
                  Use Letta AI
                </Label>
                <Switch
                  id="letta-toggle"
                  checked={useLetta}
                  onCheckedChange={setUseLetta}
                  className="data-[state=checked]:bg-white"
                />
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>AI Configuration</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="text-sm text-gray-900 mb-2">API Keys Configured</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Google AI Studio API Key</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Letta API Key</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Letta Agent ID (Optional)</Label>
                      <Input
                        type="text"
                        placeholder="Enter custom agent ID..."
                        className="mt-2"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Leave blank to use the default agent. Your API keys are securely stored in environment variables.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>

        {/* Chat Messages */}
        <Card className="flex-1 p-6 mb-4 flex flex-col min-h-0 overflow-hidden">
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === "bot" 
                      ? "bg-gradient-to-br from-[#1ABC9C] to-[#16A085]" 
                      : "bg-gray-300"
                  }`}>
                    {message.sender === "bot" ? (
                      <Bot className="w-5 h-5 text-white" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className={`flex-1 ${message.sender === "user" ? "flex flex-col items-end" : ""}`}>
                    <div className={`inline-block px-4 py-3 rounded-2xl max-w-[80%] ${
                      message.sender === "bot"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-[#1ABC9C] text-white"
                    }`}>
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 px-2">{message.timestamp}</span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#1ABC9C] to-[#16A085]">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block px-4 py-3 rounded-2xl bg-gray-100">
                      <Loader2 className="w-5 h-5 animate-spin text-[#1ABC9C]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </Card>

        {/* Input Area */}
        <Card className="p-4 flex-shrink-0">
          <div className="flex gap-3">
            <Input
              placeholder="Ask Mr. LoanLy about your financial health..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-[#1ABC9C] hover:bg-[#16A085]"
              disabled={isLoading || !inputValue.trim()}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Metrics Sidebar */}
      <div className="w-80 space-y-4">
        {/* User Info Card */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-12 h-12 bg-gradient-to-br from-[#1ABC9C] to-[#16A085]">
              <div className="flex items-center justify-center w-full h-full text-white font-semibold">
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
            </Avatar>
            <div>
              <h3 className="text-gray-900">{userName}</h3>
              <p className="text-sm text-gray-600">Premium Member</p>
            </div>
          </div>
          <Badge className="bg-[#1ABC9C]/10 text-[#1ABC9C] hover:bg-[#1ABC9C]/20">
            Credibility Index: 82/100
          </Badge>
        </Card>

        {/* Metrics Panel */}
        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">Financial Metrics</h3>
          <div className="space-y-4">
            {/* Credit Score Trend */}
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Credit Score Trend</span>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-2xl text-gray-900">+12 pts</p>
              <p className="text-xs text-gray-600 mt-1">Last 3 months</p>
            </div>

            {/* Debt Ratio */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Debt-to-Income Ratio</span>
                <TrendingDown className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl text-gray-900">28%</p>
              <p className="text-xs text-gray-600 mt-1">Healthy range</p>
            </div>

            {/* Payment History */}
            <div className="p-4 bg-gradient-to-br from-[#1ABC9C]/10 to-[#1ABC9C]/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Payment History</span>
                <CheckCircle className="w-4 h-4 text-[#1ABC9C]" />
              </div>
              <p className="text-2xl text-gray-900">100%</p>
              <p className="text-xs text-gray-600 mt-1">24 months on-time</p>
            </div>
          </div>
        </Card>

        {/* AI Insights */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
          <h3 className="text-gray-900 mb-2">💡 AI Insight</h3>
          <p className="text-sm text-gray-700">
            Based on your spending patterns, you could save an additional $200/month by optimizing subscription services.
          </p>
        </Card>
      </div>
    </div>
  );
}
