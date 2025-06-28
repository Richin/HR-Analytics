import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { AIAnalysisService } from '../../services/ai-analysis.service';
import { ChatMessage, MessageAnalysis, AIInsight } from '../../models/chat.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chatbot-container">
      <!-- AI Analysis Panel -->
      <div class="ai-analysis-panel" *ngIf="showAnalysis">
        <div class="analysis-header">
          <h4>🤖 AI Analysis</h4>
          <button class="close-btn" (click)="toggleAnalysis()">×</button>
        </div>
        
        <!-- Message Analysis -->
        <div class="analysis-section" *ngIf="currentAnalysis">
          <h5>Message Analysis</h5>
          <div class="analysis-grid">
            <div class="analysis-item">
              <span class="label">Sentiment:</span>
              <span class="value sentiment-{{ currentAnalysis.sentiment }}">
                {{ currentAnalysis.sentiment | titlecase }}
              </span>
            </div>
            <div class="analysis-item">
              <span class="label">Intent:</span>
              <span class="value">{{ currentAnalysis.intent | titlecase }}</span>
            </div>
            <div class="analysis-item">
              <span class="label">Confidence:</span>
              <span class="value">{{ (currentAnalysis.confidence * 100) | number:'1.0-0' }}%</span>
            </div>
            <div class="analysis-item">
              <span class="label">HR Relevance:</span>
              <span class="value">{{ (currentAnalysis.hrRelevance * 100) | number:'1.0-0' }}%</span>
            </div>
          </div>
          
          <!-- Keywords -->
          <div class="keywords-section" *ngIf="currentAnalysis.keywords.length > 0">
            <h6>Keywords:</h6>
            <div class="keywords-list">
              <span class="keyword" *ngFor="let keyword of currentAnalysis.keywords">
                {{ keyword }}
              </span>
            </div>
          </div>

          <!-- Entities -->
          <div class="entities-section" *ngIf="currentAnalysis.entities.length > 0">
            <h6>Entities:</h6>
            <div class="entities-list">
              <div class="entity" *ngFor="let entity of currentAnalysis.entities">
                <span class="entity-name">{{ entity.name }}</span>
                <span class="entity-type">{{ entity.type }}</span>
                <span class="entity-value">{{ entity.value }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Insights -->
        <div class="insights-section" *ngIf="insights.length > 0">
          <h5>💡 AI Insights</h5>
          <div class="insights-list">
            <div class="insight-item" *ngFor="let insight of insights.slice(0, 2)">
              <div class="insight-header">
                <span class="insight-type">{{ insight.type | titlecase }}</span>
                <span class="insight-confidence">{{ (insight.confidence * 100) | number:'1.0-0' }}%</span>
              </div>
              <div class="insight-title">{{ insight.title }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Interface -->
      <div class="chat-interface">
        <div class="chat-header">
          <div class="header-content">
            <div class="bot-avatar">🤖</div>
            <div class="header-info">
              <h3>HR Analytics Assistant</h3>
              <span class="status" [class.online]="isOnline">● {{ isOnline ? 'Online' : 'Offline' }}</span>
            </div>
          </div>
          <div class="header-actions">
            <button class="analysis-toggle" (click)="toggleAnalysis()" [class.active]="showAnalysis">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3v18h18"/>
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
              </svg>
            </button>
            <button class="clear-btn" (click)="clearChat()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="chat-messages" #messageContainer>
          <div class="message" 
               *ngFor="let message of messages" 
               [class.user-message]="message.sender === 'user'"
               [class.bot-message]="message.sender === 'bot'">
            
            <div class="message-content">
              <div class="message-avatar" *ngIf="message.sender === 'bot'">🤖</div>
              <div class="message-bubble">
                <div class="message-text">{{ message.text }}</div>
                <div class="message-time">{{ message.timestamp | date:'shortTime' }}</div>
                
                <!-- Message Analysis Badge -->
                <div class="analysis-badge" *ngIf="message.analysis && message.sender === 'user'">
                  <span class="sentiment-{{ message.analysis.sentiment }}">
                    {{ message.analysis.sentiment | titlecase }}
                  </span>
                  <span class="confidence">{{ (message.analysis.confidence * 100) | number:'1.0-0' }}%</span>
                </div>
              </div>
              <div class="message-avatar" *ngIf="message.sender === 'user'">👤</div>
            </div>

            <!-- Loading indicator -->
            <div class="loading-indicator" *ngIf="message.isLoading">
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <div class="input-container">
            <input 
              type="text" 
              [(ngModel)]="userInput" 
              (keyup.enter)="sendMessage()"
              placeholder="Ask about jobs, candidates, metrics..."
              [disabled]="isLoading"
              class="message-input"
            >
            <button 
              (click)="sendMessage()" 
              [disabled]="!userInput.trim() || isLoading"
              class="send-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 2L11 13"/>
                <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
          
          <!-- Quick Actions -->
          <div class="quick-actions" *ngIf="!isLoading">
            <button class="quick-btn" (click)="sendQuickMessage('Show me job openings')">
              💼 Jobs
            </button>
            <button class="quick-btn" (click)="sendQuickMessage('How many candidates do we have?')">
              👥 Candidates
            </button>
            <button class="quick-btn" (click)="sendQuickMessage('What are our key metrics?')">
              📊 Metrics
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chatbot-container {
      display: flex;
      height: 600px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .ai-analysis-panel {
      width: 300px;
      background: #f8f9fa;
      border-right: 1px solid #e0e0e0;
      padding: 20px;
      overflow-y: auto;
    }

    .analysis-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e0e0e0;
    }

    .analysis-header h4 {
      margin: 0;
      color: #333;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #666;
    }

    .analysis-section, .insights-section {
      margin-bottom: 20px;
    }

    .analysis-section h5, .insights-section h5 {
      margin: 0 0 15px 0;
      color: #555;
      font-size: 14px;
    }

    .analysis-grid {
      display: grid;
      gap: 8px;
    }

    .analysis-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: white;
      border-radius: 6px;
      font-size: 12px;
    }

    .analysis-item .label {
      color: #666;
    }

    .analysis-item .value {
      font-weight: 600;
    }

    .sentiment-positive { color: #2ed573; }
    .sentiment-negative { color: #ff4757; }
    .sentiment-neutral { color: #747d8c; }

    .keywords-section, .entities-section {
      margin-top: 15px;
    }

    .keywords-section h6, .entities-section h6 {
      margin: 0 0 8px 0;
      color: #555;
      font-size: 12px;
    }

    .keywords-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .keyword {
      background: #667eea;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
    }

    .entities-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .entity {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 10px;
      background: white;
      border-radius: 6px;
      font-size: 11px;
    }

    .entity-name { font-weight: 600; color: #333; }
    .entity-type { color: #667eea; font-size: 10px; }
    .entity-value { color: #666; }

    .insights-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .insight-item {
      background: white;
      padding: 12px;
      border-radius: 8px;
      border-left: 3px solid #667eea;
    }

    .insight-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
    }

    .insight-type {
      font-size: 11px;
      font-weight: 600;
      color: #667eea;
    }

    .insight-confidence {
      font-size: 11px;
      color: #666;
    }

    .insight-title {
      font-size: 12px;
      color: #333;
      font-weight: 500;
    }

    .chat-interface {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
      background: #f8f9fa;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .bot-avatar {
      font-size: 24px;
    }

    .header-info h3 {
      margin: 0;
      color: #333;
      font-size: 16px;
    }

    .status {
      font-size: 12px;
      color: #666;
    }

    .status.online {
      color: #2ed573;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    .analysis-toggle, .clear-btn {
      background: none;
      border: none;
      padding: 8px;
      border-radius: 6px;
      cursor: pointer;
      color: #666;
      transition: all 0.2s ease;
    }

    .analysis-toggle:hover, .clear-btn:hover {
      background: #e9ecef;
      color: #333;
    }

    .analysis-toggle.active {
      background: #667eea;
      color: white;
    }

    .chat-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .message {
      display: flex;
      flex-direction: column;
    }

    .message-content {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .message-avatar {
      font-size: 20px;
      margin-top: 2px;
    }

    .message-bubble {
      background: #f1f3f4;
      padding: 12px 16px;
      border-radius: 18px;
      max-width: 70%;
      position: relative;
    }

    .user-message .message-bubble {
      background: #667eea;
      color: white;
    }

    .message-text {
      margin-bottom: 4px;
      line-height: 1.4;
    }

    .message-time {
      font-size: 11px;
      opacity: 0.7;
    }

    .analysis-badge {
      display: flex;
      gap: 8px;
      margin-top: 8px;
      font-size: 10px;
    }

    .analysis-badge span {
      padding: 2px 6px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.2);
    }

    .loading-indicator {
      margin-top: 8px;
      margin-left: 28px;
    }

    .typing-dots {
      display: flex;
      gap: 4px;
    }

    .typing-dots span {
      width: 6px;
      height: 6px;
      background: #667eea;
      border-radius: 50%;
      animation: typing 1.4s infinite ease-in-out;
    }

    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes typing {
      0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
      40% { transform: scale(1); opacity: 1; }
    }

    .chat-input {
      padding: 20px;
      border-top: 1px solid #e0e0e0;
    }

    .input-container {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }

    .message-input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #e0e0e0;
      border-radius: 24px;
      outline: none;
      font-size: 14px;
    }

    .message-input:focus {
      border-color: #667eea;
    }

    .send-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px;
      border-radius: 50%;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .send-btn:hover:not(:disabled) {
      background: #5a6fd8;
    }

    .send-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .quick-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .quick-btn {
      background: #f8f9fa;
      border: 1px solid #e0e0e0;
      padding: 8px 12px;
      border-radius: 16px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s ease;
    }

    .quick-btn:hover {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    @media (max-width: 768px) {
      .chatbot-container {
        flex-direction: column;
        height: 500px;
      }

      .ai-analysis-panel {
        width: 100%;
        height: 200px;
        border-right: none;
        border-bottom: 1px solid #e0e0e0;
      }
    }
  `]
})
export class ChatbotComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  messages: ChatMessage[] = [];
  userInput = '';
  isLoading = false;
  isOnline = true;
  showAnalysis = false;
  currentAnalysis: MessageAnalysis | null = null;
  insights: AIInsight[] = [];
  
  private subscription = new Subscription();

  constructor(
    private chatService: ChatService,
    private aiAnalysisService: AIAnalysisService
  ) {}

  ngOnInit() {
    // Subscribe to AI insights
    this.subscription.add(
      this.aiAnalysisService.analysis$.subscribe(insights => {
        this.insights = insights;
      })
    );

    // Add welcome message
    this.addBotMessage('Hello! I\'m your HR Analytics Assistant. I can help you with job data, candidate information, metrics, and more. How can I assist you today?');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  async sendMessage(): Promise<void> {
    if (!this.userInput.trim() || this.isLoading) return;

    const userMessage = this.userInput.trim();
    this.userInput = '';
    
    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    };
    this.messages.push(userMsg);

    // Analyze user message
    this.analyzeUserMessage(userMessage);

    // Add loading message
    const loadingMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true
    };
    this.messages.push(loadingMsg);
    this.isLoading = true;

    try {
      // Get bot response
      const response = await this.chatService.sendMessage(userMessage).toPromise();
      
      // Remove loading message and add bot response
      this.messages.pop();
      if (response) {
        this.addBotMessage(response.message);
        // Analyze bot response
        this.analyzeBotResponse(response.message, userMessage);
      } else {
        this.addBotMessage('Sorry, I received an empty response. Please try again.');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      this.messages.pop();
      this.addBotMessage('Sorry, I encountered an error. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  sendQuickMessage(message: string): void {
    this.userInput = message;
    this.sendMessage();
  }

  clearChat(): void {
    this.messages = [];
    this.addBotMessage('Chat cleared! How can I help you today?');
  }

  toggleAnalysis(): void {
    this.showAnalysis = !this.showAnalysis;
  }

  private addBotMessage(text: string): void {
    const message: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date()
    };
    this.messages.push(message);
  }

  private analyzeUserMessage(message: string): void {
    this.aiAnalysisService.analyzeMessage(message).subscribe(analysis => {
      this.currentAnalysis = analysis;
      
      // Add analysis to the last user message
      const lastUserMessage = this.messages.find(m => m.sender === 'user');
      if (lastUserMessage) {
        lastUserMessage.analysis = analysis;
      }
    });
  }

  private analyzeBotResponse(response: string, userMessage: string): void {
    this.aiAnalysisService.analyzeResponse(response, userMessage).subscribe(analysis => {
      console.log('Bot response analysis:', analysis);
      // You can use this analysis to improve future responses
    });
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