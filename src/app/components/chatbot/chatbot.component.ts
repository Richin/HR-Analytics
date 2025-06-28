import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../models/chat.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Chat Toggle Button -->
    <div class="chat-toggle" (click)="toggleChat()" *ngIf="!isOpen">
      <div class="chat-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <div class="notification-dot" *ngIf="hasUnreadMessages"></div>
    </div>

    <!-- Chat Window -->
    <div class="chat-window" [class.open]="isOpen" *ngIf="isOpen">
      <!-- Chat Header -->
      <div class="chat-header">
        <div class="chat-title">
          <div class="bot-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
          </div>
          <div class="title-text">
            <h3>HR Analytics Assistant</h3>
            <span class="status" [class.online]="true">Online</span>
          </div>
        </div>
        <div class="chat-actions">
          <button class="action-btn" (click)="clearChat()" title="Clear Chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
          <button class="action-btn" (click)="toggleChat()" title="Close Chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Chat Messages -->
      <div class="chat-messages" #messagesContainer>
        <div class="message" 
             *ngFor="let message of messages" 
             [class.user-message]="message.sender === 'user'"
             [class.bot-message]="message.sender === 'bot'">
          
          <div class="message-content">
            <div class="message-avatar" *ngIf="message.sender === 'bot'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
            </div>
            
            <div class="message-bubble">
              <div class="message-text" *ngIf="!message.isLoading">
                {{ message.text }}
              </div>
              <div class="loading-dots" *ngIf="message.isLoading">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="message-time">
                {{ message.timestamp | date:'shortTime' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="chat-input">
        <div class="input-container">
          <input 
            type="text" 
            [(ngModel)]="currentMessage" 
            (keyup.enter)="sendMessage()"
            placeholder="Type your message..."
            [disabled]="isLoading"
            class="message-input"
            #messageInput>
          <button 
            class="send-btn" 
            (click)="sendMessage()" 
            [disabled]="!currentMessage.trim() || isLoading">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22,2 15,22 11,13 2,9"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Chat Toggle Button */
    .chat-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      z-index: 1000;
    }

    .chat-toggle:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
    }

    .chat-icon {
      color: white;
    }

    .notification-dot {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 12px;
      height: 12px;
      background: #ff4757;
      border-radius: 50%;
      border: 2px solid white;
    }

    /* Chat Window */
    .chat-window {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 380px;
      height: 500px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      z-index: 1001;
      transform: translateY(100px) scale(0.8);
      opacity: 0;
      transition: all 0.3s ease;
    }

    .chat-window.open {
      transform: translateY(0) scale(1);
      opacity: 1;
    }

    /* Chat Header */
    .chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px 16px 0 0;
      color: white;
    }

    .chat-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .bot-avatar {
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .title-text h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .status {
      font-size: 12px;
      opacity: 0.8;
    }

    .status.online::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #2ed573;
      border-radius: 50%;
      margin-right: 6px;
    }

    .chat-actions {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.2s ease;
    }

    .action-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    /* Chat Messages */
    .chat-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .message {
      display: flex;
      align-items: flex-end;
    }

    .user-message {
      justify-content: flex-end;
    }

    .bot-message {
      justify-content: flex-start;
    }

    .message-content {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      max-width: 80%;
    }

    .message-avatar {
      width: 24px;
      height: 24px;
      background: #f1f3f4;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .message-bubble {
      background: #f1f3f4;
      padding: 12px 16px;
      border-radius: 18px;
      position: relative;
    }

    .user-message .message-bubble {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .message-text {
      line-height: 1.4;
      word-wrap: break-word;
    }

    .message-time {
      font-size: 11px;
      opacity: 0.6;
      margin-top: 4px;
    }

    /* Loading Animation */
    .loading-dots {
      display: flex;
      gap: 4px;
      padding: 8px 0;
    }

    .loading-dots span {
      width: 6px;
      height: 6px;
      background: #999;
      border-radius: 50%;
      animation: loading 1.4s infinite ease-in-out;
    }

    .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
    .loading-dots span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes loading {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }

    /* Chat Input */
    .chat-input {
      padding: 16px;
      border-top: 1px solid #e0e0e0;
    }

    .input-container {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .message-input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #e0e0e0;
      border-radius: 24px;
      outline: none;
      font-size: 14px;
      transition: border-color 0.2s ease;
    }

    .message-input:focus {
      border-color: #667eea;
    }

    .message-input:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }

    .send-btn {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .send-btn:hover:not(:disabled) {
      transform: scale(1.05);
    }

    .send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Responsive Design */
    @media (max-width: 480px) {
      .chat-window {
        width: calc(100vw - 40px);
        height: calc(100vh - 120px);
        bottom: 10px;
        right: 20px;
      }
    }

    /* Scrollbar Styling */
    .chat-messages::-webkit-scrollbar {
      width: 4px;
    }

    .chat-messages::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 2px;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 2px;
    }

    .chat-messages::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  `]
})
export class ChatbotComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  messages: ChatMessage[] = [];
  isOpen = false;
  currentMessage = '';
  isLoading = false;
  hasUnreadMessages = false;
  private subscription = new Subscription();

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // Subscribe to messages
    this.subscription.add(
      this.chatService.messages$.subscribe(messages => {
        this.messages = messages;
        this.scrollToBottom();
      })
    );

    // Subscribe to chat open state
    this.subscription.add(
      this.chatService.isOpen$.subscribe(isOpen => {
        this.isOpen = isOpen;
        if (isOpen) {
          this.hasUnreadMessages = false;
          // Focus input when chat opens
          setTimeout(() => {
            this.messageInput?.nativeElement?.focus();
          }, 100);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage(): void {
    const message = this.currentMessage.trim();
    if (!message || this.isLoading) return;

    this.isLoading = true;
    this.currentMessage = '';

    this.chatService.sendMessage(message).subscribe({
      next: (response) => {
        console.log('Chat response:', response);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Chat error:', error);
        // Add error message
        this.chatService['addBotMessage']('Sorry, I encountered an error. Please try again.');
        this.isLoading = false;
      }
    });
  }

  toggleChat(): void {
    this.chatService.toggleChat();
  }

  clearChat(): void {
    this.chatService.clearChat();
  }

  private scrollToBottom(): void {
    try {
      const element = this.messagesContainer?.nativeElement;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
} 