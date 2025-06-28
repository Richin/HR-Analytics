import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
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

    // Make API call
    return this.http.post<ChatResponse>('https://hr.gofreefolk.com/chat', request).pipe(
      map(response => {
        // Remove loading message and add bot response
        this.removeMessage(loadingMessageId);
        this.addBotMessage(response.message);
        return response;
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
} 