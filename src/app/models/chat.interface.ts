export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatResponse {
  message: string;
  confidence?: number;
  intent?: string;
  entities?: any[];
}

export interface ChatRequest {
  message: string;
  userId?: string;
  sessionId?: string;
  context?: any;
} 