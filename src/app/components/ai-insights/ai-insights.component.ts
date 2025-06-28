import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AIAnalysisService } from '../../services/ai-analysis.service';
import { AIInsight, PerformanceMetric } from '../../models/chat.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ai-insights',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ai-insights-panel">
      <div class="panel-header">
        <h3>🤖 AI Insights & Analysis</h3>
        <button class="refresh-btn" (click)="refreshInsights()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M8 16H3v5"/>
          </svg>
        </button>
      </div>

      <!-- Performance Metrics -->
      <div class="metrics-section">
        <h4>📊 Performance Metrics</h4>
        <div class="metrics-grid">
          <div class="metric-card" *ngFor="let metric of performanceMetrics">
            <div class="metric-value">{{ metric.totalConversations }}</div>
            <div class="metric-label">Total Conversations</div>
            <div class="metric-date">{{ metric.date | date:'shortDate' }}</div>
          </div>
        </div>
      </div>

      <!-- AI Insights -->
      <div class="insights-section">
        <h4>💡 AI Insights</h4>
        <div class="insights-list">
          <div class="insight-card" 
               *ngFor="let insight of insights" 
               [class]="'priority-' + insight.priority">
            <div class="insight-header">
              <div class="insight-type" [class]="insight.type">
                {{ getInsightIcon(insight.type) }} {{ insight.type | titlecase }}
              </div>
              <div class="insight-confidence">
                {{ (insight.confidence * 100) | number:'1.0-0' }}%
              </div>
            </div>
            <div class="insight-title">{{ insight.title }}</div>
            <div class="insight-description">{{ insight.description }}</div>
            <div class="insight-actions" *ngIf="insight.actionable">
              <button class="action-btn">Take Action</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Training Status -->
      <div class="training-section">
        <h4>🎯 AI Training Status</h4>
        <div class="training-status">
          <div class="status-item">
            <div class="status-indicator active"></div>
            <span>Model Training: Active</span>
          </div>
          <div class="status-item">
            <div class="status-indicator active"></div>
            <span>Real-time Learning: Enabled</span>
          </div>
          <div class="status-item">
            <div class="status-indicator active"></div>
            <span>Performance Monitoring: Active</span>
          </div>
        </div>
        <button class="train-btn" (click)="trainModel()">
          🚀 Train Model with New Data
        </button>
      </div>
    </div>
  `,
  styles: [`
    .ai-insights-panel {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      margin: 20px;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e0e0e0;
    }

    .panel-header h3 {
      margin: 0;
      color: #333;
      font-size: 18px;
    }

    .refresh-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      transition: background 0.2s ease;
    }

    .refresh-btn:hover {
      background: #f5f5f5;
    }

    .metrics-section, .insights-section, .training-section {
      margin-bottom: 25px;
    }

    .metrics-section h4, .insights-section h4, .training-section h4 {
      margin: 0 0 15px 0;
      color: #555;
      font-size: 16px;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .metric-card {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
    }

    .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 5px;
    }

    .metric-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
    }

    .metric-date {
      font-size: 10px;
      color: #999;
    }

    .insights-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .insight-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 15px;
      border-left: 4px solid #ddd;
    }

    .insight-card.priority-high {
      border-left-color: #ff4757;
      background: #fff5f5;
    }

    .insight-card.priority-medium {
      border-left-color: #ffa502;
      background: #fff9f0;
    }

    .insight-card.priority-low {
      border-left-color: #2ed573;
      background: #f0fff4;
    }

    .insight-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .insight-type {
      font-size: 12px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 12px;
      background: #e9ecef;
    }

    .insight-type.trend {
      background: #e3f2fd;
      color: #1976d2;
    }

    .insight-type.recommendation {
      background: #e8f5e8;
      color: #388e3c;
    }

    .insight-type.anomaly {
      background: #fff3e0;
      color: #f57c00;
    }

    .insight-type.prediction {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .insight-confidence {
      font-size: 12px;
      color: #666;
      font-weight: 600;
    }

    .insight-title {
      font-weight: 600;
      color: #333;
      margin-bottom: 5px;
    }

    .insight-description {
      font-size: 14px;
      color: #666;
      line-height: 1.4;
      margin-bottom: 10px;
    }

    .insight-actions {
      display: flex;
      justify-content: flex-end;
    }

    .action-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .action-btn:hover {
      background: #5a6fd8;
    }

    .training-status {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 15px;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ccc;
    }

    .status-indicator.active {
      background: #2ed573;
    }

    .train-btn {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: transform 0.2s ease;
    }

    .train-btn:hover {
      transform: translateY(-1px);
    }

    @media (max-width: 480px) {
      .ai-insights-panel {
        margin: 10px;
        padding: 15px;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AIInsightsComponent implements OnInit, OnDestroy {
  insights: AIInsight[] = [];
  performanceMetrics: PerformanceMetric[] = [];
  private subscription = new Subscription();

  constructor(private aiAnalysisService: AIAnalysisService) {}

  ngOnInit() {
    // Subscribe to insights
    this.subscription.add(
      this.aiAnalysisService.analysis$.subscribe(insights => {
        this.insights = insights;
      })
    );

    // Subscribe to performance metrics
    this.subscription.add(
      this.aiAnalysisService.performance$.subscribe(metrics => {
        this.performanceMetrics = metrics;
      })
    );

    // Load initial data
    this.loadInsights();
    this.loadPerformanceMetrics();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  refreshInsights(): void {
    this.loadInsights();
    this.loadPerformanceMetrics();
  }

  trainModel(): void {
    console.log('Training AI model...');
    // You can implement actual training logic here
    alert('AI model training initiated! This will improve response quality over time.');
  }

  private loadInsights(): void {
    // Generate insights based on conversation history
    this.aiAnalysisService.generateInsights([]).subscribe(insights => {
      this.aiAnalysisService.updateInsights(insights);
    });
  }

  private loadPerformanceMetrics(): void {
    this.aiAnalysisService.getPerformanceMetrics().subscribe(metrics => {
      this.aiAnalysisService.updatePerformance(metrics);
    });
  }

  getInsightIcon(type: string): string {
    switch (type) {
      case 'trend': return '📈';
      case 'recommendation': return '💡';
      case 'anomaly': return '⚠️';
      case 'prediction': return '🔮';
      default: return '📊';
    }
  }
} 