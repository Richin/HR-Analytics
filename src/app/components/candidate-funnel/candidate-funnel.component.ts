import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrDataService } from '../../services/hr-data.service';
import { HiringMetrics, StageMetrics } from '../../models/hr-data.interface';

@Component({
  selector: 'app-candidate-funnel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="funnel-layout">
      <!-- Header Section -->
      <div class="funnel-header">
        <div class="header-content">
          <div class="header-title">
            <h1 class="main-title">Candidate Funnel Analytics</h1>
            <p class="subtitle">Track candidate progression and optimize your hiring pipeline</p>
          </div>
          <div class="header-actions">
            <button class="btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 19c-5 0-8-3-8-6s3-6 8-6 8 3 8 6-3 6-8 6z"></path>
                <path d="M17 16l3 3"></path>
              </svg>
              Analyze Bottlenecks
            </button>
            <button class="btn-primary" (click)="refreshData()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M8 16H3v5"></path>
              </svg>
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="funnel-content">
        <!-- Pipeline Visualization -->
        <div class="pipeline-section">
          <div class="content-card pipeline-card">
            <div class="card-header">
              <h3 class="card-title">Hiring Pipeline Visualization</h3>
              <div class="pipeline-stats">
                <div class="stat-item">
                  <span class="stat-value">{{ getTotalCandidates() }}</span>
                  <span class="stat-label">Total</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{{ getConversionRate() }}%</span>
                  <span class="stat-label">Overall Conversion</span>
                </div>
              </div>
            </div>
            <div class="pipeline-content-area">
              <div class="funnel-visualization">
                <div *ngFor="let stage of stageMetrics; let i = index" class="funnel-stage" 
                     [class.critical-dropoff]="stage.dropoffRate > 40">
                  <div class="stage-header">
                    <div class="stage-info">
                      <span class="stage-name">{{ stage.stage }}</span>
                      <span class="stage-timing">{{ stage.avgDays }} days avg</span>
                    </div>
                    <div class="stage-metrics">
                      <span class="candidate-count">{{ stage.count }}</span>
                      <span *ngIf="stage.dropoffRate > 0" class="dropoff-rate" 
                            [class.high-dropoff]="stage.dropoffRate > 30">
                        -{{ stage.dropoffRate }}%
                      </span>
                    </div>
                  </div>
                  <div class="stage-bar-container">
                    <div class="stage-bar" 
                         [style.width.%]="(stage.count / getMaxStageCount()) * 100"
                         [class]="getStageBarClass(i)">
                      <div class="stage-bar-fill"></div>
                      <div class="stage-label">{{ stage.count }} candidates</div>
                    </div>
                    <div *ngIf="i < stageMetrics.length - 1" class="stage-arrow">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9,6 15,12 9,18"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Analytics Grid -->
        <div class="analytics-section">
          <div class="analytics-grid">
            <!-- Drop-off Analysis -->
            <div class="content-card">
              <div class="card-header">
                <h3 class="card-title">Drop-off Analysis</h3>
                <div class="status-badge" [class]="getDropoffStatus()">
                  {{ getDropoffStatusText() }}
                </div>
              </div>
              <div class="dropoff-content">
                <div class="dropoff-item critical">
                  <div class="dropoff-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </div>
                  <div class="dropoff-details">
                    <div class="dropoff-title">Highest Drop-off Stage</div>
                    <div class="dropoff-stage">{{ getHighestDropoffStage() }}</div>
                    <div class="dropoff-value">{{ getHighestDropoffRate() }}% candidate loss</div>
                  </div>
                </div>
                <div class="dropoff-item success">
                  <div class="dropoff-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22,4 12,14.01 9,11.01"></polyline>
                    </svg>
                  </div>
                  <div class="dropoff-details">
                    <div class="dropoff-title">Interview Success Rate</div>
                    <div class="dropoff-stage">Interview to Offer</div>
                    <div class="dropoff-value">{{ getInterviewToOfferRate() }}% conversion</div>
                  </div>
                </div>
                <div class="dropoff-item info">
                  <div class="dropoff-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 6v6l4 2"></path>
                    </svg>
                  </div>
                  <div class="dropoff-details">
                    <div class="dropoff-title">Average Pipeline Time</div>
                    <div class="dropoff-stage">Complete Process</div>
                    <div class="dropoff-value">{{ getTotalPipelineTime() }} days average</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stage Performance -->
            <div class="content-card">
              <div class="card-header">
                <h3 class="card-title">Stage Performance</h3>
                <div class="card-actions">
                  <button class="icon-btn" title="Optimize Stages">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 20v-6M6 20V10M18 20V4"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="performance-content">
                <div class="performance-item fastest">
                  <div class="performance-indicator">
                    <div class="performance-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"></polygon>
                      </svg>
                    </div>
                    <div class="performance-badge fastest-badge">Fastest</div>
                  </div>
                  <div class="performance-details">
                    <div class="performance-stage">{{ getFastestStage().stage }}</div>
                    <div class="performance-time">{{ getFastestStage().avgDays }} days average</div>
                  </div>
                </div>
                <div class="performance-item slowest">
                  <div class="performance-indicator">
                    <div class="performance-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12,6 12,12 16,14"></polyline>
                      </svg>
                    </div>
                    <div class="performance-badge slowest-badge">Slowest</div>
                  </div>
                  <div class="performance-details">
                    <div class="performance-stage">{{ getSlowestStage().stage }}</div>
                    <div class="performance-time">{{ getSlowestStage().avgDays }} days average</div>
                  </div>
                </div>
                <div class="performance-item optimal">
                  <div class="performance-indicator">
                    <div class="performance-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 12l2 2 4-4"></path>
                        <circle cx="12" cy="12" r="9"></circle>
                      </svg>
                    </div>
                    <div class="performance-badge optimal-badge">Target</div>
                  </div>
                  <div class="performance-details">
                    <div class="performance-stage">Total Time to Hire</div>
                    <div class="performance-time">{{ metrics?.hiringVelocity?.timeToOffer || 14.1 }} days target</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Conversion Metrics -->
            <div class="content-card">
              <div class="card-header">
                <h3 class="card-title">Conversion Insights</h3>
                <div class="status-badge info">Insights</div>
              </div>
              <div class="conversion-content">
                <div class="conversion-chart">
                  <div class="conversion-stages">
                    <div *ngFor="let stage of stageMetrics; let i = index" class="conversion-stage">
                      <div class="conversion-bar">
                        <div class="conversion-fill" 
                             [style.height.%]="(stage.count / getMaxStageCount()) * 100"
                             [class]="getConversionBarClass(i)">
                        </div>
                      </div>
                      <div class="conversion-label">{{ stage.stage.substring(0, 8) }}</div>
                      <div class="conversion-count">{{ stage.count }}</div>
                    </div>
                  </div>
                </div>
                <div class="conversion-insights">
                  <div class="insight-item">
                    <span class="insight-label">Best Converting Stage:</span>
                    <span class="insight-value">{{ getBestConvertingStage() }}</span>
                  </div>
                  <div class="insight-item">
                    <span class="insight-label">Improvement Opportunity:</span>
                    <span class="insight-value">{{ getImprovementOpportunity() }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Current Status Summary -->
        <div class="status-section">
          <div class="content-card status-card">
            <div class="card-header">
              <h3 class="card-title">Current Status Summary</h3>
              <div class="status-overview">
                <span class="total-candidates">{{ getTotalStatusCount() }} Total Candidates</span>
              </div>
            </div>
            <div class="status-grid">
              <div class="status-item rejected">
                <div class="status-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </div>
                <div class="status-content">
                  <div class="status-value">{{ metrics?.currentStatus?.rejected || 0 }}</div>
                  <div class="status-label">Rejected</div>
                  <div class="status-percentage">{{ getStatusPercentage('rejected') }}%</div>
                </div>
              </div>
              <div class="status-item withdrawn">
                <div class="status-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 9l3 3 3-3"></path>
                    <path d="M9 15l3-3 3 3"></path>
                  </svg>
                </div>
                <div class="status-content">
                  <div class="status-value">{{ metrics?.currentStatus?.withdrawn || 0 }}</div>
                  <div class="status-label">Withdrawn</div>
                  <div class="status-percentage">{{ getStatusPercentage('withdrawn') }}%</div>
                </div>
              </div>
              <div class="status-item offered">
                <div class="status-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22,4 12,14.01 9,11.01"></polyline>
                  </svg>
                </div>
                <div class="status-content">
                  <div class="status-value">{{ metrics?.currentStatus?.offersMade || 0 }}</div>
                  <div class="status-label">Offers Made</div>
                  <div class="status-percentage">{{ getStatusPercentage('offersMade') }}%</div>
                </div>
              </div>
              <div class="status-item in-process">
                <div class="status-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                </div>
                <div class="status-content">
                  <div class="status-value">{{ metrics?.currentStatus?.inProcess || 0 }}</div>
                  <div class="status-label">In Process</div>
                  <div class="status-percentage">{{ getStatusPercentage('inProcess') }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Base Layout */
    .funnel-layout {
      width: 100%;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      display: flex;
      flex-direction: column;
    }

    /* Header Styles */
    .funnel-header {
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

    /* Funnel Content */
    .funnel-content {
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

    /* Content Card */
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

    .status-badge.info {
      background: #eff6ff;
      color: #2563eb;
      border: 1px solid #bfdbfe;
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

    /* Pipeline Section */
    .pipeline-section {
      width: 100%;
    }

    .pipeline-card {
      width: 100%;
    }

    .pipeline-stats {
      display: flex;
      gap: 24px;
      align-items: center;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 800;
      color: #1e293b;
    }

    .stat-label {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }

    .pipeline-content-area {
      padding: 24px;
    }

    /* Funnel Visualization */
    .funnel-visualization {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .funnel-stage {
      position: relative;
      transition: all 0.3s ease;
    }

    .funnel-stage.critical-dropoff {
      background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
      border-radius: 12px;
      padding: 16px;
      border: 1px solid #f87171;
    }

    .stage-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .stage-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stage-name {
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
    }

    .stage-timing {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
    }

    .stage-metrics {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .candidate-count {
      font-size: 20px;
      font-weight: 800;
      color: #3b82f6;
    }

    .dropoff-rate {
      font-size: 14px;
      font-weight: 600;
      color: #ef4444;
      background: #fef2f2;
      padding: 4px 8px;
      border-radius: 6px;
    }

    .dropoff-rate.high-dropoff {
      background: #dc2626;
      color: white;
    }

    .stage-bar-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .stage-bar {
      flex: 1;
      height: 48px;
      border-radius: 12px;
      position: relative;
      overflow: hidden;
      min-width: 100px;
    }

    .stage-bar-fill {
      width: 100%;
      height: 100%;
      border-radius: 12px;
    }

    .stage-bar.stage-0 .stage-bar-fill {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
    }

    .stage-bar.stage-1 .stage-bar-fill {
      background: linear-gradient(135deg, #06b6d4, #0891b2);
    }

    .stage-bar.stage-2 .stage-bar-fill {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .stage-bar.stage-3 .stage-bar-fill {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }

    .stage-bar.stage-4 .stage-bar-fill {
      background: linear-gradient(135deg, #f97316, #ea580c);
    }

    .stage-bar.stage-5 .stage-bar-fill {
      background: linear-gradient(135deg, #ef4444, #dc2626);
    }

    .stage-label {
      position: absolute;
      top: 50%;
      left: 16px;
      transform: translateY(-50%);
      color: white;
      font-size: 14px;
      font-weight: 600;
    }

    .stage-arrow {
      color: #9ca3af;
      flex-shrink: 0;
    }

    /* Analytics Section */
    .analytics-section {
      width: 100%;
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
      width: 100%;
    }

    /* Drop-off Content */
    .dropoff-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .dropoff-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid;
      transition: all 0.2s ease;
    }

    .dropoff-item.critical {
      background: #fef2f2;
      border-color: #fecaca;
    }

    .dropoff-item.success {
      background: #f0fdf4;
      border-color: #bbf7d0;
    }

    .dropoff-item.info {
      background: #eff6ff;
      border-color: #bfdbfe;
    }

    .dropoff-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      flex-shrink: 0;
    }

    .dropoff-item.critical .dropoff-icon {
      color: #dc2626;
    }

    .dropoff-item.success .dropoff-icon {
      color: #059669;
    }

    .dropoff-item.info .dropoff-icon {
      color: #2563eb;
    }

    .dropoff-details {
      flex: 1;
    }

    .dropoff-title {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 4px;
    }

    .dropoff-stage {
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 2px;
    }

    .dropoff-value {
      font-size: 14px;
      color: #64748b;
    }

    /* Performance Content */
    .performance-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .performance-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-radius: 12px;
      transition: all 0.2s ease;
    }

    .performance-item.fastest {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 1px solid #bbf7d0;
    }

    .performance-item.slowest {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 1px solid #fcd34d;
    }

    .performance-item.optimal {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border: 1px solid #bfdbfe;
    }

    .performance-indicator {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .performance-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
    }

    .performance-item.fastest .performance-icon {
      color: #059669;
    }

    .performance-item.slowest .performance-icon {
      color: #d97706;
    }

    .performance-item.optimal .performance-icon {
      color: #2563eb;
    }

    .performance-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .fastest-badge {
      background: #059669;
      color: white;
    }

    .slowest-badge {
      background: #d97706;
      color: white;
    }

    .optimal-badge {
      background: #2563eb;
      color: white;
    }

    .performance-details {
      flex: 1;
    }

    .performance-stage {
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .performance-time {
      font-size: 14px;
      color: #64748b;
      font-weight: 500;
    }

    /* Conversion Content */
    .conversion-content {
      padding: 24px;
    }

    .conversion-chart {
      margin-bottom: 20px;
    }

    .conversion-stages {
      display: flex;
      justify-content: space-between;
      align-items: end;
      height: 120px;
      gap: 8px;
      margin-bottom: 12px;
    }

    .conversion-stage {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .conversion-bar {
      width: 100%;
      height: 80px;
      border-radius: 6px 6px 0 0;
      background: #f1f5f9;
      display: flex;
      align-items: end;
      overflow: hidden;
    }

    .conversion-fill {
      width: 100%;
      border-radius: 6px 6px 0 0;
      transition: height 0.8s ease;
      min-height: 4px;
    }

    .conversion-fill.bar-0 {
      background: linear-gradient(180deg, #60a5fa, #3b82f6);
    }

    .conversion-fill.bar-1 {
      background: linear-gradient(180deg, #67e8f9, #06b6d4);
    }

    .conversion-fill.bar-2 {
      background: linear-gradient(180deg, #6ee7b7, #10b981);
    }

    .conversion-fill.bar-3 {
      background: linear-gradient(180deg, #fbbf24, #f59e0b);
    }

    .conversion-fill.bar-4 {
      background: linear-gradient(180deg, #fb7185, #f97316);
    }

    .conversion-fill.bar-5 {
      background: linear-gradient(180deg, #f87171, #ef4444);
    }

    .conversion-label {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      text-align: center;
    }

    .conversion-count {
      font-size: 14px;
      color: #1e293b;
      font-weight: 700;
    }

    .conversion-insights {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
    }

    .insight-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .insight-label {
      font-size: 14px;
      color: #64748b;
      font-weight: 500;
    }

    .insight-value {
      font-size: 14px;
      color: #1e293b;
      font-weight: 600;
    }

    /* Status Section */
    .status-section {
      width: 100%;
    }

    .status-card {
      width: 100%;
    }

    .status-overview {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .total-candidates {
      font-size: 14px;
      color: #64748b;
      font-weight: 600;
      background: #f8fafc;
      padding: 6px 12px;
      border-radius: 8px;
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      padding: 24px;
    }

    .status-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px;
      border-radius: 16px;
      text-align: center;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .status-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px -3px rgba(0, 0, 0, 0.1);
    }

    .status-item.rejected {
      background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
    }

    .status-item.rejected:hover {
      border-color: #f87171;
    }

    .status-item.withdrawn {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    }

    .status-item.withdrawn:hover {
      border-color: #fbbf24;
    }

    .status-item.offered {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    }

    .status-item.offered:hover {
      border-color: #6ee7b7;
    }

    .status-item.in-process {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    }

    .status-item.in-process:hover {
      border-color: #93c5fd;
    }

    .status-icon {
      margin-bottom: 16px;
    }

    .status-item.rejected .status-icon {
      color: #dc2626;
    }

    .status-item.withdrawn .status-icon {
      color: #d97706;
    }

    .status-item.offered .status-icon {
      color: #059669;
    }

    .status-item.in-process .status-icon {
      color: #2563eb;
    }

    .status-content {
      width: 100%;
    }

    .status-value {
      font-size: 36px;
      font-weight: 800;
      margin-bottom: 8px;
      line-height: 1;
    }

    .status-item.rejected .status-value {
      color: #dc2626;
    }

    .status-item.withdrawn .status-value {
      color: #d97706;
    }

    .status-item.offered .status-value {
      color: #059669;
    }

    .status-item.in-process .status-value {
      color: #2563eb;
    }

    .status-label {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 4px;
    }

    .status-percentage {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .analytics-grid {
        grid-template-columns: 1fr;
      }
      
      .status-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .funnel-layout {
        padding: 0;
      }

      .funnel-header {
        padding: 16px;
      }

      .funnel-content {
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

      .pipeline-stats {
        flex-direction: column;
        gap: 12px;
      }

      .analytics-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .status-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .card-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
        padding: 20px;
      }

      .stage-header {
        flex-direction: column;
        gap: 8px;
        align-items: stretch;
        text-align: center;
      }

      .stage-metrics {
        justify-content: center;
      }

      .stage-bar-container {
        flex-direction: column;
        gap: 8px;
      }

      .stage-arrow {
        transform: rotate(90deg);
      }

      .main-title {
        font-size: 24px;
      }

      .conversion-stages {
        height: 100px;
      }

      .conversion-bar {
        height: 60px;
      }
    }

    @media (max-width: 480px) {
      .funnel-header {
        padding: 12px;
      }

      .funnel-content {
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

      .dropoff-item,
      .performance-item {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }

      .conversion-stages {
        gap: 4px;
        height: 80px;
      }

      .conversion-bar {
        height: 50px;
      }

      .conversion-label {
        font-size: 10px;
      }

      .main-title {
        font-size: 20px;
      }

      .subtitle {
        font-size: 14px;
      }

      .status-value {
        font-size: 28px;
      }
    }
  `]
})
export class CandidateFunnelComponent implements OnInit {
  metrics: HiringMetrics | null = null;
  stageMetrics: StageMetrics[] = [];
  isLoading = true;

  constructor(private hrDataService: HrDataService) {}

  ngOnInit() {
    this.loadFunnelData();
  }

  private loadFunnelData() {
    this.isLoading = true;

    this.hrDataService.getHiringMetrics().subscribe(metrics => {
      this.metrics = metrics;
      this.isLoading = false;
    });

    this.hrDataService.getStageMetrics().subscribe(stages => {
      this.stageMetrics = stages;
    });
  }

  getTotalCandidates(): number {
    if (!this.stageMetrics.length) return 0;
    return this.stageMetrics[0]?.count || 0;
  }

  getConversionRate(): number {
    if (!this.stageMetrics.length) return 0;
    const initial = this.stageMetrics[0]?.count || 1;
    const final = this.stageMetrics[this.stageMetrics.length - 1]?.count || 0;
    return Math.round((final / initial) * 100);
  }

  getMaxStageCount(): number {
    if (!this.stageMetrics.length) return 1;
    return Math.max(...this.stageMetrics.map(stage => stage.count));
  }

  getStageBarClass(index: number): string {
    return `stage-${index % 6}`;
  }

  getConversionBarClass(index: number): string {
    return `bar-${index % 6}`;
  }

  getHighestDropoffStage(): string {
    if (!this.stageMetrics.length) return 'N/A';
    const maxDropoff = Math.max(...this.stageMetrics.map(s => s.dropoffRate));
    return this.stageMetrics.find(s => s.dropoffRate === maxDropoff)?.stage || 'N/A';
  }

  getHighestDropoffRate(): number {
    if (!this.stageMetrics.length) return 0;
    return Math.max(...this.stageMetrics.map(s => s.dropoffRate));
  }

  getInterviewToOfferRate(): number {
    const interviewed = this.stageMetrics.find(s => s.stage === 'Interviewed')?.count || 0;
    const offered = this.stageMetrics.find(s => s.stage === 'Offered')?.count || 0;
    return interviewed > 0 ? Math.round((offered / interviewed) * 100) : 0;
  }

  getFastestStage(): { stage: string; avgDays: number } {
    if (!this.stageMetrics.length) return { stage: 'N/A', avgDays: 0 };
    const filtered = this.stageMetrics.filter(s => s.avgDays > 0);
    if (!filtered.length) return { stage: 'N/A', avgDays: 0 };
    const minDays = Math.min(...filtered.map(s => s.avgDays));
    const stage = filtered.find(s => s.avgDays === minDays);
    return { stage: stage?.stage || 'N/A', avgDays: minDays };
  }

  getSlowestStage(): { stage: string; avgDays: number } {
    if (!this.stageMetrics.length) return { stage: 'N/A', avgDays: 0 };
    const filtered = this.stageMetrics.filter(s => s.avgDays > 0);
    if (!filtered.length) return { stage: 'N/A', avgDays: 0 };
    const maxDays = Math.max(...filtered.map(s => s.avgDays));
    const stage = filtered.find(s => s.avgDays === maxDays);
    return { stage: stage?.stage || 'N/A', avgDays: maxDays };
  }

  getTotalPipelineTime(): number {
    if (!this.stageMetrics.length) return 0;
    return this.stageMetrics.reduce((total, stage) => total + stage.avgDays, 0);
  }

  getBestConvertingStage(): string {
    if (this.stageMetrics.length < 2) return 'N/A';
    
    let bestStage = '';
    let lowestDropoff = Infinity;
    
    this.stageMetrics.forEach(stage => {
      if (stage.dropoffRate > 0 && stage.dropoffRate < lowestDropoff) {
        lowestDropoff = stage.dropoffRate;
        bestStage = stage.stage;
      }
    });
    
    return bestStage || 'Applied';
  }

  getImprovementOpportunity(): string {
    const highestDropoff = this.getHighestDropoffStage();
    return highestDropoff !== 'N/A' ? highestDropoff : 'No major bottlenecks';
  }

  getTotalStatusCount(): number {
    if (!this.metrics) return 0;
    const status = this.metrics.currentStatus;
    return status.rejected + status.withdrawn + status.offersMade + status.inProcess;
  }

  getStatusPercentage(statusType: string): number {
    if (!this.metrics) return 0;
    const total = this.getTotalStatusCount();
    if (total === 0) return 0;
    
    const value = this.metrics.currentStatus[statusType as keyof typeof this.metrics.currentStatus] || 0;
    return Math.round((value / total) * 100);
  }

  getDropoffStatus(): string {
    const highestDropoff = this.getHighestDropoffRate();
    if (highestDropoff > 40) return 'error';
    if (highestDropoff > 25) return 'warning';
    return 'success';
  }

  getDropoffStatusText(): string {
    const highestDropoff = this.getHighestDropoffRate();
    if (highestDropoff > 40) return 'Critical';
    if (highestDropoff > 25) return 'Attention';
    return 'Healthy';
  }

  refreshData() {
    this.loadFunnelData();
  }
}