import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrDataService } from '../../services/hr-data.service';
import { HiringMetrics, WeeklyResumeData } from '../../models/hr-data.interface';

@Component({
  selector: 'app-resume-pipeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pipeline-layout">
      <!-- Header Section -->
      <div class="pipeline-header">
        <div class="header-content">
          <div class="header-title">
            <h1 class="main-title">Resume Pipeline Tracker</h1>
            <p class="subtitle">Monitor resume inflow, processing status, and quality metrics</p>
          </div>
          <div class="header-actions">
            <button class="btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              Process Resumes
            </button>
            <button class="btn-primary" (click)="refreshData()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M8 16H3v5"/>
              </svg>
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="pipeline-content">
        <!-- Resume Metrics Overview -->
        <div class="metrics-section">
          <div class="metrics-grid">
            <div class="metric-card primary">
              <div class="metric-header">
                <div class="metric-icon bg-blue">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
                <span class="metric-trend positive">+{{ getTodayGrowth() }}%</span>
              </div>
              <div class="metric-value">{{ metrics?.resumeMetrics?.totalResumes || 0 }}</div>
              <div class="metric-label">TOTAL RESUMES</div>
              <div class="metric-description">All resumes received to date</div>
            </div>

            <div class="metric-card success">
              <div class="metric-header">
                <div class="metric-icon bg-green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v20m8-10H4"/>
                  </svg>
                </div>
                <span class="metric-trend positive">+{{ metrics?.resumeMetrics?.todayInflow || 0 }}</span>
              </div>
              <div class="metric-value">{{ metrics?.resumeMetrics?.todayInflow || 0 }}</div>
              <div class="metric-label">TODAY'S INFLOW</div>
              <div class="metric-description">New resumes received today</div>
            </div>

            <div class="metric-card warning">
              <div class="metric-header">
                <div class="metric-icon bg-orange">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                </div>
                <span class="metric-trend warning">{{ getUnprocessedTrend() }}%</span>
              </div>
              <div class="metric-value">{{ metrics?.resumeMetrics?.unprocessed || 0 }}</div>
              <div class="metric-label">UNPROCESSED</div>
              <div class="metric-description">Awaiting review and processing</div>
            </div>

            <div class="metric-card error">
              <div class="metric-header">
                <div class="metric-icon bg-red">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m0 6v6a2 2 0 0 1-2 2H6"/>
                    <line x1="16" y1="10" x2="16" y2="14"/>
                    <line x1="20" y1="10" x2="20" y2="14"/>
                  </svg>
                </div>
                <span class="metric-trend error">{{ getDuplicateRate() }}%</span>
              </div>
              <div class="metric-value">{{ metrics?.resumeMetrics?.duplicates || 0 }}</div>
              <div class="metric-label">DUPLICATES</div>
              <div class="metric-description">Duplicate submissions detected</div>
            </div>
          </div>
        </div>

        <!-- Analysis Cards Section -->
        <div class="analysis-section">
          <div class="analysis-grid">
            <!-- Processing Status -->
            <div class="content-card">
              <div class="card-header">
                <h3 class="card-title">Processing Status</h3>
                <div class="status-badge" [class.success]="getProcessingRate() >= 80" [class.warning]="getProcessingRate() < 80 && getProcessingRate() >= 60" [class.error]="getProcessingRate() < 60">
                  {{ getProcessingRate() >= 80 ? 'Excellent' : getProcessingRate() >= 60 ? 'Good' : 'Needs Attention' }}
                </div>
              </div>
              <div class="processing-content">
                <div class="processing-overview">
                  <div class="processing-metric">
                    <span class="processing-label">Processing Rate</span>
                    <span class="processing-value">{{ getProcessingRate() }}%</span>
                  </div>
                  <div class="progress-container">
                    <div class="progress-bar">
                      <div 
                        class="progress-fill"
                        [style.width.%]="getProcessingRate()"
                        [class.high]="getProcessingRate() >= 80"
                        [class.medium]="getProcessingRate() >= 60 && getProcessingRate() < 80"
                        [class.low]="getProcessingRate() < 60">
                      </div>
                    </div>
                    <div class="progress-labels">
                      <span class="progress-label">Processed: {{ getProcessedCount() }}</span>
                      <span class="progress-label">Remaining: {{ metrics?.resumeMetrics?.unprocessed || 0 }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quality Metrics -->
            <div class="content-card">
              <div class="card-header">
                <h3 class="card-title">Quality Metrics</h3>
                <div class="card-actions">
                  <button class="icon-btn" title="View Details">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="quality-metrics">
                <div class="quality-item success">
                  <div class="quality-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 12l2 2 4-4"/>
                      <circle cx="12" cy="12" r="9"/>
                    </svg>
                  </div>
                  <div class="quality-content">
                    <div class="quality-value">{{ 100 - getDuplicateRate() }}%</div>
                    <div class="quality-label">Unique Rate</div>
                    <div class="quality-description">Non-duplicate submissions</div>
                  </div>
                </div>
                <div class="quality-item info">
                  <div class="quality-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                    </svg>
                  </div>
                  <div class="quality-content">
                    <div class="quality-value">{{ getAverageDaily() }}</div>
                    <div class="quality-label">Avg Daily Inflow</div>
                    <div class="quality-description">Resumes per day</div>
                  </div>
                </div>
                <div class="quality-item warning">
                  <div class="quality-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </div>
                  <div class="quality-content">
                    <div class="quality-value">{{ getDuplicateRate() }}%</div>
                    <div class="quality-label">Duplicate Rate</div>
                    <div class="quality-description">Needs cleanup</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Weekly Trend Chart -->
        <div class="chart-section">
          <div class="content-card chart-card">
            <div class="card-header">
              <h3 class="card-title">Weekly Resume Inflow Trend</h3>
              <div class="chart-controls">
                <div class="chart-legend">
                  <div class="legend-item">
                    <div class="legend-color primary"></div>
                    <span class="legend-label">Resume Count</span>
                  </div>
                </div>
                <button class="btn-secondary-small">Export Chart</button>
              </div>
            </div>
            <div class="chart-container">
              <div class="chart-grid">
                <div class="chart-y-axis">
                  <div class="y-axis-label" *ngFor="let tick of getYAxisTicks()">{{ tick }}</div>
                </div>
                <div class="chart-area">
                  <div class="chart-bars">
                    <div 
                      *ngFor="let week of weeklyData; let i = index" 
                      class="chart-bar"
                      [style.height.%]="(week.count / getMaxWeeklyCount()) * 100"
                      [title]="week.week + ': ' + week.count + ' resumes'"
                      (mouseenter)="showTooltip($event, week)"
                      (mouseleave)="hideTooltip()">
                      <div class="bar-fill"></div>
                      <div class="bar-value">{{ week.count }}</div>
                    </div>
                  </div>
                  <div class="chart-x-axis">
                    <div class="x-axis-label" *ngFor="let week of weeklyData">{{ week.week }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Items -->
        <div class="actions-section">
          <div class="content-card">
            <div class="card-header">
              <h3 class="card-title">Action Items</h3>
              <div class="status-badge" [class]="getActionItemsStatus()">
                {{ getActionItemsCount() }} {{ getActionItemsCount() === 1 ? 'Item' : 'Items' }}
              </div>
            </div>
            <div class="actions-content">
              <div 
                *ngIf="(metrics?.resumeMetrics?.unprocessed || 0) > 20"
                class="action-item high-priority">
                <div class="action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div class="action-content">
                  <div class="action-title">High Unprocessed Volume</div>
                  <div class="action-description">{{ metrics?.resumeMetrics?.unprocessed }} resumes need immediate processing</div>
                  <div class="action-meta">Priority: Critical</div>
                </div>
                <button class="action-btn primary">Process Now</button>
              </div>

              <div 
                *ngIf="(metrics?.resumeMetrics?.duplicates || 0) > 5"
                class="action-item medium-priority">
                <div class="action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                </div>
                <div class="action-content">
                  <div class="action-title">Duplicate Detection Needed</div>
                  <div class="action-description">{{ metrics?.resumeMetrics?.duplicates }} duplicate resumes require cleanup</div>
                  <div class="action-meta">Priority: Medium</div>
                </div>
                <button class="action-btn secondary">Review Duplicates</button>
              </div>

              <div class="action-item low-priority">
                <div class="action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4"/>
                    <circle cx="12" cy="12" r="9"/>
                  </svg>
                </div>
                <div class="action-content">
                  <div class="action-title">Daily Target Status</div>
                  <div class="action-description">Today's inflow ({{ metrics?.resumeMetrics?.todayInflow }}) is within expected range</div>
                  <div class="action-meta">Status: On Track</div>
                </div>
                <button class="action-btn success">View Report</button>
              </div>

              <div 
                *ngIf="getProcessingRate() < 70"
                class="action-item medium-priority">
                <div class="action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                </div>
                <div class="action-content">
                  <div class="action-title">Processing Rate Below Target</div>
                  <div class="action-description">Current rate is {{ getProcessingRate() }}%, target is 80%+</div>
                  <div class="action-meta">Priority: Medium</div>
                </div>
                <button class="action-btn warning">Optimize Pipeline</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Base Layout */
    .pipeline-layout {
      width: 100%;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      display: flex;
      flex-direction: column;
    }

    /* Header Styles */
    .pipeline-header {
      width: 100%;
      padding: 24px;
      flex-shrink: 0;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      background: white;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid #e2e8f0;
      width: 100%;
      box-sizing: border-box;
    }

    .header-title {
      flex: 1;
    }

    .main-title {
      font-size: 32px;
      font-weight: 800;
      color: #1e293b;
      margin: 0 0 8px 0;
      line-height: 1.2;
    }

    .subtitle {
      font-size: 16px;
      color: #64748b;
      margin: 0;
      font-weight: 500;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-shrink: 0;
    }

    /* Pipeline Content */
    .pipeline-content {
      flex: 1;
      padding: 0 24px 24px 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      width: 100%;
      box-sizing: border-box;
    }

    /* Button Styles */
    .btn-primary, .btn-secondary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 14px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 8px -1px rgba(59, 130, 246, 0.4);
    }

    .btn-secondary {
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-secondary:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }

    .btn-secondary-small {
      padding: 8px 16px;
      font-size: 13px;
      background: #f8fafc;
      color: #475569;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    /* Metrics Section */
    .metrics-section {
      width: 100%;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      width: 100%;
    }

    .metric-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      width: 100%;
      box-sizing: border-box;
    }

    .metric-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--card-color), var(--card-color-light));
    }

    .metric-card.primary {
      --card-color: #3b82f6;
      --card-color-light: #60a5fa;
    }

    .metric-card.success {
      --card-color: #10b981;
      --card-color-light: #34d399;
    }

    .metric-card.warning {
      --card-color: #f59e0b;
      --card-color-light: #fbbf24;
    }

    .metric-card.error {
      --card-color: #ef4444;
      --card-color-light: #f87171;
    }

    .metric-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .metric-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .metric-icon.bg-blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
    .metric-icon.bg-green { background: linear-gradient(135deg, #10b981, #059669); }
    .metric-icon.bg-orange { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .metric-icon.bg-red { background: linear-gradient(135deg, #ef4444, #dc2626); }

    .metric-trend {
      font-size: 12px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 6px;
      white-space: nowrap;
    }

    .metric-trend.positive {
      background: #dcfce7;
      color: #166534;
    }

    .metric-trend.warning {
      background: #fef3c7;
      color: #92400e;
    }

    .metric-trend.error {
      background: #fecaca;
      color: #991b1b;
    }

    .metric-value {
      font-size: 36px;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 8px;
      line-height: 1;
    }

    .metric-label {
      font-size: 13px;
      font-weight: 700;
      color: #64748b;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .metric-description {
      font-size: 14px;
      color: #64748b;
    }

    /* Analysis Section */
    .analysis-section {
      width: 100%;
    }

    .analysis-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
      width: 100%;
    }

    .content-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid #e2e8f0;
      overflow: hidden;
      width: 100%;
      box-sizing: border-box;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 16px 24px;
      border-bottom: 1px solid #f1f5f9;
    }

    .card-title {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .card-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .icon-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #64748b;
      transition: all 0.2s ease;
    }

    .icon-btn:hover {
      background: #f8fafc;
      color: #374151;
    }

    .status-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.success {
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
    }

    .status-badge.warning {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fcd34d;
    }

    .status-badge.error {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }

    /* Processing Content */
    .processing-content {
      padding: 24px;
    }

    .processing-overview {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .processing-metric {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .processing-label {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
    }

    .processing-value {
      font-size: 24px;
      font-weight: 800;
      color: #1e293b;
    }

    .progress-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .progress-fill.high {
      background: linear-gradient(90deg, #10b981, #059669);
    }

    .progress-fill.medium {
      background: linear-gradient(90deg, #f59e0b, #d97706);
    }

    .progress-fill.low {
      background: linear-gradient(90deg, #ef4444, #dc2626);
    }

    .progress-labels {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #64748b;
    }

    /* Quality Metrics */
    .quality-metrics {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .quality-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid;
      transition: all 0.2s ease;
    }

    .quality-item.success {
      background: #f0fdf4;
      border-color: #bbf7d0;
    }

    .quality-item.info {
      background: #eff6ff;
      border-color: #bfdbfe;
    }

    .quality-item.warning {
      background: #fef3c7;
      border-color: #fcd34d;
    }

    .quality-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      flex-shrink: 0;
    }

    .quality-item.success .quality-icon {
      color: #059669;
    }

    .quality-item.info .quality-icon {
      color: #2563eb;
    }

    .quality-item.warning .quality-icon {
      color: #d97706;
    }

    .quality-content {
      flex: 1;
    }

    .quality-value {
      font-size: 24px;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .quality-label {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 2px;
    }

    .quality-description {
      font-size: 13px;
      color: #64748b;
    }

    /* Chart Section */
    .chart-section {
      width: 100%;
    }

    .chart-card {
      width: 100%;
    }

    .chart-controls {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .chart-legend {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .legend-item {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    .legend-color.primary {
      background: linear-gradient(45deg, #3b82f6, #2563eb);
    }

    .legend-label {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
    }

    .chart-container {
      padding: 24px;
      height: 320px;
    }

    .chart-grid {
      display: flex;
      height: 100%;
      gap: 16px;
    }

    .chart-y-axis {
      display: flex;
      flex-direction: column-reverse;
      justify-content: space-between;
      width: 40px;
      padding-bottom: 40px;
    }

    .y-axis-label {
      font-size: 12px;
      color: #64748b;
      text-align: right;
      font-weight: 500;
    }

    .chart-area {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .chart-bars {
      flex: 1;
      display: flex;
      align-items: end;
      gap: 8px;
      padding: 0 8px;
    }

    .chart-bar {
      flex: 1;
      min-height: 20px;
      position: relative;
      cursor: pointer;
      border-radius: 6px 6px 0 0;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      justify-content: end;
      align-items: center;
    }

    .chart-bar:hover {
      transform: translateY(-2px);
    }

    .bar-fill {
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%);
      border-radius: 6px 6px 0 0;
      transition: all 0.2s ease;
    }

    .chart-bar:hover .bar-fill {
      background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
    }

    .bar-value {
      position: absolute;
      top: -20px;
      font-size: 12px;
      font-weight: 600;
      color: #374151;
      white-space: nowrap;
    }

    .chart-x-axis {
      display: flex;
      gap: 8px;
      padding: 12px 8px 0 8px;
      margin-top: 8px;
      border-top: 1px solid #e5e7eb;
    }

    .x-axis-label {
      flex: 1;
      font-size: 12px;
      color: #64748b;
      text-align: center;
      font-weight: 500;
    }

    /* Actions Section */
    .actions-section {
      width: 100%;
    }

    .actions-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .action-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid;
      transition: all 0.2s ease;
    }

    .action-item.high-priority {
      background: #fef2f2;
      border-left-color: #dc2626;
    }

    .action-item.medium-priority {
      background: #fefbf2;
      border-left-color: #f59e0b;
    }

    .action-item.low-priority {
      background: #f0fdf4;
      border-left-color: #059669;
    }

    .action-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      flex-shrink: 0;
    }

    .action-item.high-priority .action-icon {
      color: #dc2626;
    }

    .action-item.medium-priority .action-icon {
      color: #f59e0b;
    }

    .action-item.low-priority .action-icon {
      color: #059669;
    }

    .action-content {
      flex: 1;
    }

    .action-title {
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .action-description {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 4px;
    }

    .action-meta {
      font-size: 12px;
      color: #9ca3af;
      font-weight: 500;
    }

    .action-btn {
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .action-btn.primary {
      background: #dc2626;
      color: white;
    }

    .action-btn.primary:hover {
      background: #b91c1c;
    }

    .action-btn.secondary {
      background: #f59e0b;
      color: white;
    }

    .action-btn.secondary:hover {
      background: #d97706;
    }

    .action-btn.success {
      background: #059669;
      color: white;
    }

    .action-btn.success:hover {
      background: #047857;
    }

    .action-btn.warning {
      background: #f59e0b;
      color: white;
    }

    .action-btn.warning:hover {
      background: #d97706;
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .analysis-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .pipeline-layout {
        padding: 0;
      }

      .pipeline-header {
        padding: 16px;
      }

      .pipeline-content {
        padding: 0 16px 16px 16px;
      }

      .header-content {
        flex-direction: column;
        gap: 20px;
        align-items: stretch;
        padding: 24px;
      }

      .header-actions {
        justify-content: flex-start;
        flex-wrap: wrap;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .analysis-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .card-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
        padding: 20px;
      }

      .chart-controls {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
      }

      .action-item {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }

      .main-title {
        font-size: 24px;
      }

      .metric-value {
        font-size: 28px;
      }
    }

    @media (max-width: 480px) {
      .pipeline-header {
        padding: 12px;
      }

      .pipeline-content {
        padding: 0 12px 12px 12px;
        gap: 16px;
      }

      .header-content {
        padding: 20px;
      }

      .header-actions {
        flex-direction: column;
        gap: 8px;
      }

      .quality-item {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }

      .chart-container {
        height: 280px;
        padding: 16px;
      }

      .chart-y-axis {
        width: 30px;
      }

      .chart-bars {
        gap: 4px;
      }

      .x-axis-label {
        font-size: 10px;
      }

      .main-title {
        font-size: 20px;
      }

      .subtitle {
        font-size: 14px;
      }
    }

    /* Animation */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .pipeline-layout > * {
      animation: fadeInUp 0.6s ease-out;
    }

    .metrics-grid .metric-card {
      animation: fadeInUp 0.6s ease-out;
    }

    .metrics-grid .metric-card:nth-child(1) { animation-delay: 0.1s; }
    .metrics-grid .metric-card:nth-child(2) { animation-delay: 0.2s; }
    .metrics-grid .metric-card:nth-child(3) { animation-delay: 0.3s; }
    .metrics-grid .metric-card:nth-child(4) { animation-delay: 0.4s; }

    .chart-bar {
      animation: slideUp 0.8s ease-out;
    }

    @keyframes slideUp {
      from {
        height: 0;
      }
      to {
        height: var(--final-height);
      }
    }

    /* Tooltip */
    .tooltip {
      position: absolute;
      background: #1e293b;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      z-index: 1000;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .tooltip.show {
      opacity: 1;
    }

    /* Focus States */
    .btn-primary:focus,
    .btn-secondary:focus,
    .icon-btn:focus,
    .action-btn:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    /* Print Styles */
    @media print {
      .pipeline-layout {
        background: white;
      }

      .header-actions,
      .card-actions,
      .action-btn {
        display: none;
      }

      .content-card,
      .metric-card {
        box-shadow: none;
        border: 1px solid #e5e7eb;
        break-inside: avoid;
      }
    }
  `]
})
export class ResumePipelineComponent implements OnInit {
  metrics: HiringMetrics | null = null;
  weeklyData: WeeklyResumeData[] = [];
  isLoading = true;

  constructor(private hrDataService: HrDataService) {}

  ngOnInit() {
    this.loadPipelineData();
  }

  private loadPipelineData() {
    this.isLoading = true;

    this.hrDataService.getHiringMetrics().subscribe(metrics => {
      this.metrics = metrics;
      this.isLoading = false;
    });

    this.hrDataService.getWeeklyResumeData().subscribe(data => {
      this.weeklyData = data;
    });
  }

  getProcessingRate(): number {
    if (!this.metrics) return 0;
    const processed = this.getProcessedCount();
    const total = this.metrics.resumeMetrics.totalResumes;
    return total > 0 ? Math.round((processed / total) * 100) : 0;
  }

  getProcessedCount(): number {
    if (!this.metrics) return 0;
    return this.metrics.resumeMetrics.totalResumes - this.metrics.resumeMetrics.unprocessed;
  }

  getDuplicateRate(): number {
    if (!this.metrics || this.metrics.resumeMetrics.totalResumes === 0) return 0;
    return Math.round((this.metrics.resumeMetrics.duplicates / this.metrics.resumeMetrics.totalResumes) * 100);
  }

  getAverageDaily(): number {
    if (!this.weeklyData.length) return 0;
    const total = this.weeklyData.reduce((sum, week) => sum + week.count, 0);
    return Math.round((total / this.weeklyData.length) / 7);
  }

  getMaxWeeklyCount(): number {
    if (!this.weeklyData.length) return 1;
    return Math.max(...this.weeklyData.map(week => week.count));
  }

  getTodayGrowth(): number {
    // Calculate growth percentage for today's inflow
    const avgDaily = this.getAverageDaily();
    const todayInflow = this.metrics?.resumeMetrics?.todayInflow || 0;
    if (avgDaily === 0) return 0;
    return Math.round(((todayInflow - avgDaily) / avgDaily) * 100);
  }

  getUnprocessedTrend(): string {
    const unprocessed = this.metrics?.resumeMetrics?.unprocessed || 0;
    const total = this.metrics?.resumeMetrics?.totalResumes || 1;
    const percentage = (unprocessed / total) * 100;
    return percentage > 20 ? '+' + percentage.toFixed(1) : percentage.toFixed(1);
  }

  getYAxisTicks(): number[] {
    const max = this.getMaxWeeklyCount();
    const step = Math.ceil(max / 5);
    return Array.from({ length: 6 }, (_, i) => i * step);
  }

  getActionItemsCount(): number {
    let count = 1; // Always show the daily target status
    
    if ((this.metrics?.resumeMetrics?.unprocessed || 0) > 20) count++;
    if ((this.metrics?.resumeMetrics?.duplicates || 0) > 5) count++;
    if (this.getProcessingRate() < 70) count++;
    
    return count;
  }

  getActionItemsStatus(): string {
    const critical = (this.metrics?.resumeMetrics?.unprocessed || 0) > 20;
    const hasIssues = (this.metrics?.resumeMetrics?.duplicates || 0) > 5 || this.getProcessingRate() < 70;
    
    if (critical) return 'error';
    if (hasIssues) return 'warning';
    return 'success';
  }

  showTooltip(event: MouseEvent, week: WeeklyResumeData) {
    // Tooltip implementation
    console.log('Show tooltip for', week);
  }

  hideTooltip() {
    // Hide tooltip implementation
    console.log('Hide tooltip');
  }

  refreshData() {
    this.loadPipelineData();
  }

  exportChart() {
    console.log('Exporting chart...');
  }
}