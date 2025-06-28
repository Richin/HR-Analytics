import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIAnalysisService } from '../../services/ai-analysis.service';
import { TrainingData, PerformanceMetric } from '../../models/chat.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ai-training',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ai-training-container">
      <div class="training-header">
        <h2>🤖 AI Training & Model Management</h2>
        <p>Train and improve your HR Analytics AI model with conversation data and feedback</p>
      </div>

      <!-- Training Status -->
      <div class="status-section">
        <h3>📊 Training Status</h3>
        <div class="status-grid">
          <div class="status-card">
            <div class="status-icon active">🟢</div>
            <div class="status-info">
              <h4>Model Status</h4>
              <p>Active & Learning</p>
            </div>
          </div>
          <div class="status-card">
            <div class="status-icon">📈</div>
            <div class="status-info">
              <h4>Accuracy</h4>
              <p>{{ (currentAccuracy * 100) | number:'1.1-1' }}%</p>
            </div>
          </div>
          <div class="status-card">
            <div class="status-icon">🔄</div>
            <div class="status-info">
              <h4>Last Training</h4>
              <p>{{ lastTrainingDate | date:'short' }}</p>
            </div>
          </div>
          <div class="status-card">
            <div class="status-icon">💬</div>
            <div class="status-info">
              <h4>Conversations</h4>
              <p>{{ totalConversations }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Training Controls -->
      <div class="training-controls">
        <h3>🎯 Training Controls</h3>
        <div class="controls-grid">
          <div class="control-card">
            <h4>Manual Training</h4>
            <p>Train the model with new conversation data</p>
            <button class="train-btn primary" (click)="startTraining()" [disabled]="isTraining">
              {{ isTraining ? 'Training...' : '🚀 Start Training' }}
            </button>
          </div>
          
          <div class="control-card">
            <h4>Auto-Learning</h4>
            <p>Enable continuous learning from conversations</p>
            <div class="toggle-container">
              <label class="toggle">
                <input type="checkbox" [(ngModel)]="autoLearning" (change)="toggleAutoLearning()">
                <span class="slider"></span>
              </label>
              <span class="toggle-label">{{ autoLearning ? 'Enabled' : 'Disabled' }}</span>
            </div>
          </div>

          <div class="control-card">
            <h4>Model Reset</h4>
            <p>Reset the model to factory settings</p>
            <button class="train-btn danger" (click)="resetModel()">
              🔄 Reset Model
            </button>
          </div>
        </div>
      </div>

      <!-- Training Data -->
      <div class="training-data">
        <h3>📚 Training Data</h3>
        <div class="data-section">
          <div class="data-card">
            <h4>Conversation History</h4>
            <div class="data-stats">
              <div class="stat">
                <span class="stat-value">{{ conversationCount }}</span>
                <span class="stat-label">Total Conversations</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ messageCount }}</span>
                <span class="stat-label">Total Messages</span>
              </div>
            </div>
            <button class="export-btn" (click)="exportConversations()">
              📥 Export Data
            </button>
          </div>

          <div class="data-card">
            <h4>User Feedback</h4>
            <div class="data-stats">
              <div class="stat">
                <span class="stat-value">{{ feedbackCount }}</span>
                <span class="stat-label">Feedback Entries</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ averageRating | number:'1.1-1' }}</span>
                <span class="stat-label">Average Rating</span>
              </div>
            </div>
            <button class="export-btn" (click)="exportFeedback()">
              📥 Export Feedback
            </button>
          </div>
        </div>
      </div>

      <!-- Performance Metrics -->
      <div class="performance-section">
        <h3>📈 Performance Metrics</h3>
        <div class="metrics-chart">
          <div class="metric-row" *ngFor="let metric of performanceMetrics">
            <div class="metric-date">{{ metric.date | date:'shortDate' }}</div>
            <div class="metric-values">
              <div class="metric-item">
                <span class="metric-label">Conversations:</span>
                <span class="metric-value">{{ metric.totalConversations }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Satisfaction:</span>
                <span class="metric-value">{{ metric.averageSatisfaction | number:'1.1-1' }}/5</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Response Time:</span>
                <span class="metric-value">{{ metric.responseTime }}s</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Accuracy:</span>
                <span class="metric-value">{{ (metric.accuracy * 100) | number:'1.0-0' }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Training Log -->
      <div class="training-log">
        <h3>📝 Training Log</h3>
        <div class="log-container">
          <div class="log-entry" *ngFor="let log of trainingLogs">
            <div class="log-time">{{ log.timestamp | date:'short' }}</div>
            <div class="log-message">{{ log.message }}</div>
            <div class="log-status" [class]="log.status">{{ log.status }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ai-training-container {
      padding: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .training-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .training-header h2 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 28px;
    }

    .training-header p {
      margin: 0;
      color: #666;
      font-size: 16px;
    }

    .status-section, .training-controls, .training-data, .performance-section, .training-log {
      margin-bottom: 40px;
    }

    .status-section h3, .training-controls h3, .training-data h3, .performance-section h3, .training-log h3 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 20px;
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .status-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .status-icon {
      font-size: 24px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
    }

    .status-icon.active {
      background: #e8f5e8;
      color: #2ed573;
    }

    .status-info h4 {
      margin: 0 0 5px 0;
      color: #333;
      font-size: 14px;
    }

    .status-info p {
      margin: 0;
      color: #666;
      font-size: 18px;
      font-weight: 600;
    }

    .controls-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .control-card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .control-card h4 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 16px;
    }

    .control-card p {
      margin: 0 0 20px 0;
      color: #666;
      font-size: 14px;
    }

    .train-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
    }

    .train-btn.primary {
      background: #667eea;
      color: white;
    }

    .train-btn.primary:hover:not(:disabled) {
      background: #5a6fd8;
    }

    .train-btn.danger {
      background: #ff4757;
      color: white;
    }

    .train-btn.danger:hover {
      background: #e63946;
    }

    .train-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .toggle-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .toggle {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 24px;
    }

    .toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #667eea;
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }

    .toggle-label {
      font-size: 14px;
      color: #666;
    }

    .data-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .data-card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .data-card h4 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 16px;
    }

    .data-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 20px;
    }

    .stat {
      text-align: center;
    }

    .stat-value {
      display: block;
      font-size: 24px;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 12px;
      color: #666;
    }

    .export-btn {
      width: 100%;
      padding: 10px;
      background: #f8f9fa;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .export-btn:hover {
      background: #e9ecef;
    }

    .metrics-chart {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .metric-row {
      display: flex;
      align-items: center;
      padding: 15px 20px;
      border-bottom: 1px solid #f0f0f0;
    }

    .metric-row:last-child {
      border-bottom: none;
    }

    .metric-date {
      width: 120px;
      font-weight: 600;
      color: #333;
    }

    .metric-values {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
    }

    .metric-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .metric-label {
      color: #666;
      font-size: 14px;
    }

    .metric-value {
      font-weight: 600;
      color: #333;
    }

    .log-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      max-height: 300px;
      overflow-y: auto;
    }

    .log-entry {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      border-bottom: 1px solid #f0f0f0;
    }

    .log-entry:last-child {
      border-bottom: none;
    }

    .log-time {
      width: 120px;
      font-size: 12px;
      color: #666;
    }

    .log-message {
      flex: 1;
      font-size: 14px;
      color: #333;
    }

    .log-status {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }

    .log-status.success {
      background: #e8f5e8;
      color: #2ed573;
    }

    .log-status.error {
      background: #ffe8e8;
      color: #ff4757;
    }

    .log-status.warning {
      background: #fff3e0;
      color: #ffa502;
    }

    @media (max-width: 768px) {
      .ai-training-container {
        padding: 20px;
      }

      .status-grid, .controls-grid, .data-section {
        grid-template-columns: 1fr;
      }

      .metric-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      .metric-date {
        width: auto;
      }
    }
  `]
})
export class AITrainingComponent implements OnInit, OnDestroy {
  isTraining = false;
  autoLearning = true;
  currentAccuracy = 0.87;
  lastTrainingDate = new Date();
  totalConversations = 156;
  conversationCount = 156;
  messageCount = 1247;
  feedbackCount = 89;
  averageRating = 4.2;
  
  performanceMetrics: PerformanceMetric[] = [];
  trainingLogs: any[] = [];
  
  private subscription = new Subscription();

  constructor(private aiAnalysisService: AIAnalysisService) {}

  ngOnInit() {
    // Subscribe to performance metrics
    this.subscription.add(
      this.aiAnalysisService.performance$.subscribe(metrics => {
        this.performanceMetrics = metrics;
      })
    );

    // Load initial data
    this.loadPerformanceMetrics();
    this.loadTrainingLogs();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  startTraining(): void {
    this.isTraining = true;
    this.addTrainingLog('Training started', 'success');
    
    // Simulate training process
    setTimeout(() => {
      this.isTraining = false;
      this.currentAccuracy = Math.min(0.95, this.currentAccuracy + 0.02);
      this.lastTrainingDate = new Date();
      this.addTrainingLog('Training completed successfully', 'success');
    }, 3000);
  }

  toggleAutoLearning(): void {
    this.addTrainingLog(
      `Auto-learning ${this.autoLearning ? 'enabled' : 'disabled'}`, 
      'success'
    );
  }

  resetModel(): void {
    if (confirm('Are you sure you want to reset the AI model? This will erase all training data.')) {
      this.addTrainingLog('Model reset initiated', 'warning');
      this.currentAccuracy = 0.75;
      this.lastTrainingDate = new Date();
      setTimeout(() => {
        this.addTrainingLog('Model reset completed', 'success');
      }, 2000);
    }
  }

  exportConversations(): void {
    this.addTrainingLog('Conversation data exported', 'success');
    alert('Conversation data exported successfully!');
  }

  exportFeedback(): void {
    this.addTrainingLog('Feedback data exported', 'success');
    alert('Feedback data exported successfully!');
  }

  private loadPerformanceMetrics(): void {
    this.aiAnalysisService.getPerformanceMetrics().subscribe(metrics => {
      this.performanceMetrics = metrics;
    });
  }

  private loadTrainingLogs(): void {
    // Mock training logs
    this.trainingLogs = [
      {
        timestamp: new Date(),
        message: 'System initialized',
        status: 'success'
      },
      {
        timestamp: new Date(Date.now() - 60000),
        message: 'Auto-learning enabled',
        status: 'success'
      },
      {
        timestamp: new Date(Date.now() - 120000),
        message: 'Model accuracy improved to 87%',
        status: 'success'
      }
    ];
  }

  private addTrainingLog(message: string, status: 'success' | 'error' | 'warning'): void {
    this.trainingLogs.unshift({
      timestamp: new Date(),
      message,
      status
    });
  }
} 