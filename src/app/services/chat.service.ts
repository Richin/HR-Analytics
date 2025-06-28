import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ChatMessage, ChatResponse, ChatRequest } from '../models/chat.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  private sessionId = this.generateSessionId();

  constructor(private http: HttpClient) {
    // Initialize with welcome message
    this.addBotMessage('Hello! I\'m your HR Analytics assistant. How can I help you today?');
  }

  // Observable streams
  messages$ = this.messagesSubject.asObservable();
  isOpen$ = this.isOpenSubject.asObservable();

  // Send message to chatbot API
  sendMessage(message: string): Observable<ChatResponse> {
    // Add user message to chat
    this.addUserMessage(message);

    // Create request payload
    const request: ChatRequest = {
      message: message,
      sessionId: this.sessionId,
      userId: 'user-123', // You can make this dynamic
      context: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      }
    };

    // Add loading message
    const loadingMessageId = this.addBotMessage('', true);

    // Make API call with fallback to mock data
    return this.http.post<ChatResponse>('https://hr.gofreefolk.com/chat', request).pipe(
      map(response => {
        // Remove loading message and add bot response
        this.removeMessage(loadingMessageId);
        this.addBotMessage(response.message);
        return response;
      })
    ).pipe(
      // Add error handling with mock data fallback
      catchError(error => {
        console.log('API call failed, using mock response:', error);
        // Remove loading message
        this.removeMessage(loadingMessageId);
        
        // Get mock response
        const mockResponse = this.getMockResponse(message);
        this.addBotMessage(mockResponse.message);
        
        return of(mockResponse);
      })
    );
  }

  // Add user message to chat
  private addUserMessage(text: string): void {
    const message: ChatMessage = {
      id: this.generateMessageId(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };
    this.addMessage(message);
  }

  // Add bot message to chat
  private addBotMessage(text: string, isLoading: boolean = false): string {
    const messageId = this.generateMessageId();
    const message: ChatMessage = {
      id: messageId,
      text: text,
      sender: 'bot',
      timestamp: new Date(),
      isLoading: isLoading
    };
    this.addMessage(message);
    return messageId;
  }

  // Add message to chat
  private addMessage(message: ChatMessage): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  // Remove message from chat
  private removeMessage(messageId: string): void {
    const currentMessages = this.messagesSubject.value;
    const filteredMessages = currentMessages.filter(msg => msg.id !== messageId);
    this.messagesSubject.next(filteredMessages);
  }

  // Toggle chat window
  toggleChat(): void {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }

  // Open chat window
  openChat(): void {
    this.isOpenSubject.next(true);
  }

  // Close chat window
  closeChat(): void {
    this.isOpenSubject.next(false);
  }

  // Clear chat history
  clearChat(): void {
    this.messagesSubject.next([]);
    this.addBotMessage('Hello! I\'m your HR Analytics assistant. How can I help you today?');
  }

  // Generate unique message ID
  private generateMessageId(): string {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Generate session ID
  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get current messages
  getMessages(): ChatMessage[] {
    return this.messagesSubject.value;
  }

  // Get chat open state
  isChatOpen(): boolean {
    return this.isOpenSubject.value;
  }

  // Get mock response based on user message
  private getMockResponse(message: string): ChatResponse {
    const lowerMessage = message.toLowerCase();
    
    // HR Analytics specific responses
    if (lowerMessage.includes('job') || lowerMessage.includes('position') || lowerMessage.includes('opening')) {
      return {
        message: "I can help you with job-related information! We currently have 5 active job openings across different departments. Would you like to know about specific positions or see the latest job metrics?",
        confidence: 0.9,
        intent: "job_inquiry"
      };
    }
    
    if (lowerMessage.includes('candidate') || lowerMessage.includes('applicant') || lowerMessage.includes('resume')) {
      return {
        message: "Great question about candidates! We've received 5 new resumes this week and have 2 candidates currently in the interview process. The average time to hire is 21.5 days. Would you like more specific details?",
        confidence: 0.85,
        intent: "candidate_inquiry"
      };
    }
    
    if (lowerMessage.includes('metric') || lowerMessage.includes('dashboard') || lowerMessage.includes('analytics')) {
      return {
        message: "Here are your key HR metrics: 3 open positions, 2 closed positions, 5 total resumes, and 2 candidates in process. The hiring velocity shows an average time to fill of 21.5 days. Is there a specific metric you'd like to explore?",
        confidence: 0.9,
        intent: "metrics_inquiry"
      };
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return {
        message: "I'm here to help with your HR Analytics! I can provide information about jobs, candidates, metrics, hiring velocity, and more. Just ask me about any aspect of your hiring process.",
        confidence: 0.95,
        intent: "help_request"
      };
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return {
        message: "Hello! I'm your HR Analytics assistant. I can help you with job openings, candidate information, hiring metrics, and more. What would you like to know about today?",
        confidence: 0.9,
        intent: "greeting"
      };
    }
    
    if (lowerMessage.includes('thank')) {
      return {
        message: "You're welcome! I'm here to help with all your HR Analytics needs. Feel free to ask me anything about jobs, candidates, or metrics anytime.",
        confidence: 0.9,
        intent: "gratitude"
      };
    }
    
    if (lowerMessage.includes('hiring') || lowerMessage.includes('recruitment') || lowerMessage.includes('process')) {
      return {
        message: "Our hiring process includes: Application Review → Screening → Shortlisting → Interview → HR Round → Offer. Currently, we have 2 candidates in the interview stage and 1 in the HR round. Would you like specific details about any stage?",
        confidence: 0.88,
        intent: "hiring_process"
      };
    }
    
    if (lowerMessage.includes('department') || lowerMessage.includes('team')) {
      return {
        message: "We have job openings across multiple departments: Engineering (Software Engineer), Marketing (Product Manager), Sales (Sales Executive), Finance (Data Analyst), and Marketing (Marketing Specialist). Which department interests you?",
        confidence: 0.85,
        intent: "department_inquiry"
      };
    }
    
    if (lowerMessage.includes('location') || lowerMessage.includes('remote') || lowerMessage.includes('office')) {
      return {
        message: "Our positions are available in various locations: New York, San Francisco, Austin, Boston, and Remote. We have 1 remote position (Data Analyst) and 4 office-based positions. Would you like location-specific details?",
        confidence: 0.87,
        intent: "location_inquiry"
      };
    }
    
    // Default response for unrecognized queries
    return {
      message: "I understand you're asking about '" + message + "'. While I'm primarily designed to help with HR Analytics, I can assist with job openings, candidate information, hiring metrics, and recruitment processes. Could you rephrase your question or ask about something HR-related?",
      confidence: 0.7,
      intent: "general_inquiry"
    };
  }
} 