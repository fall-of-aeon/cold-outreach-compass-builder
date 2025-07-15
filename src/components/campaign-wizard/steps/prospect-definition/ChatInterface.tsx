
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Send, Bot, User, CheckCircle } from "lucide-react";
import { sendChatMessage } from "../../n8nService";
import { SupabaseService } from "@/services/supabaseService";
import { CampaignData } from "../../types";
import { toast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  campaignData: CampaignData;
  campaignId?: string | null;
  onApplyToForm?: (data: Partial<CampaignData>) => void;
}

export const ChatInterface = ({ isOpen, onClose, campaignData, campaignId, onApplyToForm }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history when dialog opens
  useEffect(() => {
    if (isOpen && campaignId) {
      loadChatHistory();
    } else if (isOpen && messages.length === 0) {
      initializeConversation();
    }
  }, [isOpen, campaignId]);

  const loadChatHistory = async () => {
    if (!campaignId) return;

    try {
      // First, try to get existing session from campaign
      const campaign = await SupabaseService.getCampaign(campaignId);
      const existingSessionId = campaign?.chat_session_id;

      if (existingSessionId) {
        const history = await SupabaseService.getChatHistory(existingSessionId);
        const formattedMessages = history.map(msg => ({
          id: msg.message_id,
          content: msg.message,
          sender: msg.sender as 'user' | 'assistant',
          timestamp: new Date(msg.created_at),
          metadata: msg.metadata ? (typeof msg.metadata === 'string' ? JSON.parse(msg.metadata) : msg.metadata as Record<string, any>) : undefined
        }));
        setMessages(formattedMessages);
      } else {
        // Link this session to the campaign and initialize
        await SupabaseService.updateCampaignSession(campaignId, sessionId);
        initializeConversation();
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      initializeConversation();
    }
  };

  const initializeConversation = async () => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      content: "Hi! I'm here to help you define your ideal prospects. You can describe your target audience in natural language instead of using the dropdown menus. For example, you could say 'I want marketing directors at fast-growing SaaS companies in the US' or 'Find me founders who recently raised Series A funding in major cities'. What kind of prospects are you looking for?",
      sender: 'assistant',
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);

    // Log welcome message to database if we have a campaign
    if (campaignId) {
      try {
        await SupabaseService.logChatMessage(
          campaignId,
          sessionId,
          welcomeMessage.content,
          'assistant'
        );
      } catch (error) {
        console.error('Error logging welcome message:', error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    // Log user message to database
    if (campaignId) {
      try {
        await SupabaseService.logChatMessage(
          campaignId,
          sessionId,
          userMessage.content,
          'user'
        );
      } catch (error) {
        console.error('Error logging user message:', error);
      }
    }

    try {
      const isNewSession = messages.length <= 1;
      const result = await sendChatMessage(
        currentMessage,
        sessionId,
        isNewSession,
        campaignData
      );

      if (result.success && result.response) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: result.response,
          sender: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);

        // Log AI response to database
        if (campaignId) {
          try {
            await SupabaseService.logChatMessage(
              campaignId,
              sessionId,
              aiMessage.content,
              'assistant'
            );
          } catch (error) {
            console.error('Error logging AI message:', error);
          }
        }
      } else {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: "I'm sorry, I encountered an error. Please try again or use the dropdown form instead.",
          sender: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error. Please try again or use the dropdown form instead.",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleApplyToForm = async () => {
    const successMessage: ChatMessage = {
      id: Date.now().toString(),
      content: "Great! I'll help you apply these criteria to your form. The conversation will be processed to extract the targeting parameters.",
      sender: 'assistant',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, successMessage]);

    // Log success message to database
    if (campaignId) {
      try {
        await SupabaseService.logChatMessage(
          campaignId,
          sessionId,
          successMessage.content,
          'assistant'
        );
      } catch (error) {
        console.error('Error logging success message:', error);
      }
    }
    
    if (onApplyToForm) {
      onApplyToForm({
        prospectDescription: "AI-generated targeting criteria from chat conversation"
      });
    }

    toast({
      title: "Chat Applied",
      description: "Your conversation has been saved and linked to this campaign."
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Prospect Targeting Assistant
            {campaignId && (
              <span className="text-xs text-muted-foreground ml-2">
                Session: {sessionId.slice(-8)}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted border'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted border rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t pt-4 space-y-3">
          <div className="flex gap-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your ideal prospects..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!currentMessage.trim() || isLoading}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {messages.length > 2 && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleApplyToForm}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Apply to Form
              </Button>
              <Button variant="outline" onClick={onClose}>
                Continue with Dropdowns
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
