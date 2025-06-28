export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
  analysis?: MessageAnalysis;
}

export interface ChatResponse {
  message: string;
  confidence?: number;
  intent?: string;
  entities?: any[];
  analysis?: ResponseAnalysis;
  suggestions?: string[];
  insights?: AIInsight[];
}

export interface ChatRequest {
  message: string;
  userId?: string;
  sessionId?: string;
  context?: any;
  trainingData?: TrainingData;
}

export interface MessageAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  keywords: string[];
  intent: string;
  confidence: number;
  entities: Entity[];
  hrRelevance: number;
}

export interface ResponseAnalysis {
  responseQuality: number;
  suggestedImprovements: string[];
  nextBestActions: string[];
  dataInsights: DataInsight[];
}

export interface AIInsight {
  type: 'trend' | 'anomaly' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface Entity {
  name: string;
  type: 'department' | 'position' | 'location' | 'skill' | 'metric';
  value: string;
  confidence: number;
}

export interface DataInsight {
  metric: string;
  currentValue: number;
  previousValue: number;
  trend: 'up' | 'down' | 'stable';
  significance: number;
  recommendation: string;
}

export interface TrainingData {
  conversations: Conversation[];
  feedback: UserFeedback[];
  performanceMetrics: PerformanceMetric[];
}

export interface Conversation {
  id: string;
  messages: ChatMessage[];
  outcome: 'successful' | 'failed' | 'partial';
  userSatisfaction: number;
  timestamp: Date;
}

export interface UserFeedback {
  conversationId: string;
  rating: number;
  comment: string;
  helpful: boolean;
  timestamp: Date;
}

export interface PerformanceMetric {
  date: Date;
  totalConversations: number;
  averageSatisfaction: number;
  responseTime: number;
  accuracy: number;
  commonIntents: string[];
} 