import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrDataService } from '../../services/hr-data.service';
import { HiringMetrics, JobDescription } from '../../models/hr-data.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-layout">
      <!-- Header Section -->
      <div class="dashboard-header">
        <div class="header-content">
          <div class="header-title">
            <h1 class="main-title">Dashboard Overview</h1>
            <p class="subtitle">Real-time insights into your hiring process performance</p>
          </div>
          <div class="header-actions">
            <button class="btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export Report
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

      <!-- Main Dashboard Content -->
      <div class="dashboard-content">
        <!-- Key Metrics Cards -->
        <div class="metrics-section">
          <div class="metrics-grid">
            <div class="metric-card primary">
              <div class="metric-header">
                <div class="metric-icon bg-blue">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <span class="metric-trend positive">+12%</span>
              </div>
              <div class="metric-value">{{ metrics?.totalJobDescriptions || 0 }}</div>
              <div class="metric-label">TOTAL JOB DESCRIPTIONS</div>
              <div class="metric-description">Active and closed positions</div>
            </div>

            <div class="metric-card success">
              <div class="metric-header">
                <div class="metric-icon bg-green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22,4 12,14.01 9,11.01"/>
                  </svg>
                </div>
                <span class="metric-trend positive">+8%</span>
              </div>
              <div class="metric-value">{{ metrics?.openPositions || 0 }}</div>
              <div class="metric-label">OPEN POSITIONS</div>
              <div class="metric-description">Currently accepting applications</div>
            </div>

            <div class="metric-card neutral">
              <div class="metric-header">
                <div class="metric-icon bg-gray">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4"/>
                    <path d="M20 12h-4a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2h4"/>
                    <path d="M4 15v-3a6 6 0 1 1 12 0v3"/>
                  </svg>
                </div>
                <span class="metric-trend neutral">--</span>
              </div>
              <div class="metric-value">{{ metrics?.closedPositions || 0 }}</div>
              <div class="metric-label">CLOSED POSITIONS</div>
              <div class="metric-description">Successfully filled roles</div>
            </div>

            <div class="metric-card purple">
              <div class="metric-header">
                <div class="metric-icon bg-purple">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                </div>
                <span class="metric-trend positive">+5%</span>
              </div>
              <div class="metric-value">{{ getOpenPositionRate() }}%</div>
              <div class="metric-label">OPEN POSITION RATE</div>
              <div class="metric-description">Percentage of active openings</div>
            </div>
          </div>

          <!-- Secondary Metrics Row -->
          <div class="secondary-metrics">
            <div class="metric-card-small orange">
              <div class="small-metric-value">{{ metrics?.agingJobs?.thirtyPlus || 0 }}</div>
              <div class="small-metric-label">30+ Days Open</div>
            </div>
            <div class="metric-card-small red">
              <div class="small-metric-value">{{ metrics?.agingJobs?.sixtyPlus || 0 }}</div>
              <div class="small-metric-label">60+ Days Open</div>
            </div>
            <div class="metric-card-small emerald">
              <div class="small-metric-value">{{ metrics?.resumeMetrics?.todayInflow || 0 }}</div>
              <div class="small-metric-label">Today's Resumes</div>
            </div>
            <div class="metric-card-small blue">
              <div class="small-metric-value">{{ metrics?.currentStatus?.inProcess || 0 }}</div>
              <div class="small-metric-label">In Process</div>
            </div>
          </div>
        </div>

        <!-- Analysis Cards Section -->
        <div class="analysis-section">
          <div class="analysis-grid">
            <!-- Aging Analysis -->
            <div class="content-card">
              <div class="card-header">
                <h3 class="card-title">Job Aging Analysis</h3>
                <div class="card-actions">
                  <button class="icon-btn" title="View Details">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="aging-metrics">
                <div class="aging-item warning">
                  <div class="aging-indicator">
                    <div class="indicator-dot warning-dot"></div>
                    <span class="aging-label">30+ days open</span>
                  </div>
                  <div class="aging-value">{{ metrics?.agingJobs?.thirtyPlus || 0 }}</div>
                </div>
                <div class="aging-item error">
                  <div class="aging-indicator">
                    <div class="indicator-dot error-dot"></div>
                    <span class="aging-label">60+ days open</span>
                  </div>
                  <div class="aging-value">{{ metrics?.agingJobs?.sixtyPlus || 0 }}</div>
                </div>
                <div class="aging-item critical">
                  <div class="aging-indicator">
                    <div class="indicator-dot critical-dot"></div>
                    <span class="aging-label">90+ days open</span>
                  </div>
                  <div class="aging-value">{{ metrics?.agingJobs?.ninetyPlus || 0 }}</div>
                </div>
              </div>
            </div>

            <!-- Attention Required -->
            <div class="content-card">
              <div class="card-header">
                <h3 class="card-title">Requires Attention</h3>
                <div class="status-badge urgent">Urgent</div>
              </div>
              <div class="attention-items">
                <div class="attention-item high-priority">
                  <div class="attention-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                      <path d="M12 9v4"/>
                      <path d="m12 17.02.01 0"/>
                    </svg>
                  </div>
                  <div class="attention-content">
                    <div class="attention-value">{{ metrics?.attentionRequired?.noApplicants || 0 }}</div>
                    <div class="attention-label">Jobs with no applicants</div>
                  </div>
                </div>
                <div class="attention-item medium-priority">
                  <div class="attention-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                  </div>
                  <div class="attention-content">
                    <div class="attention-value">{{ metrics?.attentionRequired?.agingBeyondSixty || 0 }}</div>
                    <div class="attention-label">Jobs aging beyond 60 days</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Hiring Velocity Card -->
            <div class="content-card">
              <div class="card-header">
                <h3 class="card-title">Hiring Velocity</h3>
                <!-- <div class="status-badge success">On Track</div> -->
              </div>
              <div class="velocity-metrics">
                <div class="velocity-item">
                  <div class="velocity-label">Avg Time to Fill</div>
                  <div class="velocity-value">{{ metrics?.hiringVelocity?.avgTimeToFill || 0 }} days</div>
                </div>
                <div class="velocity-item">
                  <div class="velocity-label">Time to First Interview</div>
                  <div class="velocity-value">{{ metrics?.hiringVelocity?.timeToFirstInterview || 0 }} days</div>
                </div>
                <div class="velocity-item">
                  <div class="velocity-label">Time to Offer</div>
                  <div class="velocity-value">{{ metrics?.hiringVelocity?.timeToOffer || 0 }} days</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Job Descriptions Table -->
        <div class="table-section">
          <div class="content-card table-card">
            <div class="card-header">
              <h3 class="card-title">Recent Job Descriptions</h3>
              <div class="card-actions">
                <div class="search-box">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input type="text" placeholder="Search jobs..." class="search-input">
                </div>
                <button class="btn-secondary-small">View All</button>
              </div>
            </div>
            <div class="table-container">
              <table class="professional-table">
                <thead>
                  <tr>
                    <th>
                      <div class="th-content">
                        Job Title
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="6,9 12,15 18,9"/>
                        </svg>
                      </div>
                    </th>
                    <th>
                      <div class="th-content">
                        Department
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="6,9 12,15 18,9"/>
                        </svg>
                      </div>
                    </th>
                    <th>Status</th>
                    <th>Days Open</th>
                    <th>Applicants</th>
                    <th>Priority</th>
                    <th class="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let job of recentJobs; trackBy: trackByJobId" class="table-row">
                    <td class="job-title-cell">
                      <div class="job-info">
                        <div class="job-title">{{ job.title }}</div>
                        <div class="job-id">{{ job.id }}</div>
                      </div>
                    </td>
                    <td>
                      <span class="department-tag">{{ job.department }}</span>
                    </td>
                    <td>
                      <span [class]="'status-badge ' + getStatusClass(job.status)">
                        <span class="status-dot" [class]="getStatusDotClass(job.status)"></span>
                        {{ job.status | titlecase }}
                      </span>
                    </td>
                    <td class="days-cell">
                      <span [class]="getDaysClass(job.daysOpen)">{{ job.daysOpen }}</span>
                    </td>
                    <td class="applicants-cell">
                      <div class="applicant-info">
                        <span class="applicant-count">{{ job.applicantsCount }}</span>
                        <div class="applicant-bar">
                          <div class="applicant-progress" [style.width.%]="getApplicantProgress(job.applicantsCount)"></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span [class]="'priority-badge ' + getPriorityClass(job.priority)">
                        {{ job.priority | titlecase }}
                      </span>
                    </td>
                    <td class="actions-cell">
                      <div class="action-buttons">
                        <button class="action-btn" title="View Details">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                        <button class="action-btn" title="Edit">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Base Layout */
    .dashboard-layout {
      width: 100%;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      display: flex;
      flex-direction: column;
    }

    /* Header Styles */
    .dashboard-header {
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
      max-width: none;
      width: 100%;
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

    /* Dashboard Content */
    .dashboard-content {
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

    .btn-secondary-small:hover {
      background: #f1f5f9;
      color: #334155;
    }

    /* Metrics Section */
    .metrics-section {
      width: 100%;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
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

    .metric-card.neutral {
      --card-color: #6b7280;
      --card-color-light: #9ca3af;
    }

    .metric-card.purple {
      --card-color: #8b5cf6;
      --card-color-light: #a78bfa;
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
    .metric-icon.bg-gray { background: linear-gradient(135deg, #6b7280, #4b5563); }
    .metric-icon.bg-purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

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

    .metric-trend.neutral {
      background: #f3f4f6;
      color: #374151;
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

    /* Secondary Metrics */
    .secondary-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      width: 100%;
    }

    .metric-card-small {
      background: white;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      border: 1px solid #e2e8f0;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }

    .metric-card-small:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .metric-card-small.orange .small-metric-value { color: #ea580c; }
    .metric-card-small.red .small-metric-value { color: #dc2626; }
    .metric-card-small.emerald .small-metric-value { color: #059669; }
    .metric-card-small.blue .small-metric-value { color: #2563eb; }

    .small-metric-value {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .small-metric-label {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
    }

    /* Analysis Section */
    .analysis-section {
      width: 100%;
    }

    .analysis-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
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

    .status-badge.urgent {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }

    .status-badge.success {
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
    }

    /* Aging Metrics */
    .aging-metrics {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .aging-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-radius: 12px;
      transition: all 0.2s ease;
    }

    .aging-item.warning {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 1px solid #f59e0b;
    }

    .aging-item.error {
      background: linear-gradient(135deg, #fed7d7 0%, #fc8181 100%);
      border: 1px solid #e53e3e;
    }

    .aging-item.critical {
      background: linear-gradient(135deg, #fecaca 0%, #f87171 100%);
      border: 1px solid #dc2626;
    }

    .aging-indicator {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .indicator-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .indicator-dot.warning-dot { background: #f59e0b; }
    .indicator-dot.error-dot { background: #e53e3e; }
    .indicator-dot.critical-dot { background: #dc2626; }

    .aging-label {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
    }

    .aging-value {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
    }

    /* Attention Items */
    .attention-items {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .attention-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid;
    }

    .attention-item.high-priority {
      background: #fef2f2;
      border-left-color: #dc2626;
    }

    .attention-item.medium-priority {
      background: #fefbf2;
      border-left-color: #f59e0b;
    }

    .attention-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      color: inherit;
      flex-shrink: 0;
    }

    .attention-item.high-priority .attention-icon {
      color: #dc2626;
    }

    .attention-item.medium-priority .attention-icon {
      color: #f59e0b;
    }

    .attention-content {
      flex: 1;
    }

    .attention-value {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .attention-label {
      font-size: 14px;
      color: #64748b;
      font-weight: 500;
    }

    /* Velocity Metrics */
    .velocity-metrics {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .velocity-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .velocity-label {
      font-size: 14px;
      color: #64748b;
      font-weight: 500;
    }

    .velocity-value {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
    }

    /* Table Section */
    .table-section {
      width: 100%;
    }

    .table-card {
      width: 100%;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px 12px;
      min-width: 240px;
    }

    .search-input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 14px;
      color: #374151;
      flex: 1;
      min-width: 0;
    }

    .search-input::placeholder {
      color: #9ca3af;
    }

    .table-container {
      overflow-x: auto;
      width: 100%;
    }

    .professional-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      min-width: 800px;
    }

    .professional-table th {
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      padding: 16px 20px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    .th-content {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .th-content svg {
      color: #9ca3af;
      transition: all 0.2s ease;
    }

    .th-content:hover svg {
      color: #6b7280;
    }

    .professional-table td {
      padding: 16px 20px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
      white-space: nowrap;
    }

    .table-row {
      transition: all 0.2s ease;
    }

    .table-row:hover {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    }

    .job-title-cell {
      min-width: 200px;
    }

    .job-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .job-title {
      font-weight: 600;
      color: #1e293b;
      font-size: 15px;
    }

    .job-id {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }

    .department-tag {
      display: inline-block;
      background: #f1f5f9;
      color: #475569;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      border: 1px solid #e2e8f0;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-badge.status-open {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
    }

    .status-badge.status-closed {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .status-dot.dot-open {
      background: #16a34a;
    }

    .status-dot.dot-closed {
      background: #6b7280;
    }

    .days-cell {
      font-weight: 600;
      font-size: 14px;
    }

    .days-normal {
      color: #16a34a;
    }

    .days-warning {
      color: #ea580c;
    }

    .days-critical {
      color: #dc2626;
    }

    .applicants-cell {
      min-width: 120px;
    }

    .applicant-info {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .applicant-count {
      font-weight: 600;
      color: #1e293b;
      font-size: 14px;
    }

    .applicant-bar {
      width: 60px;
      height: 4px;
      background: #e5e7eb;
      border-radius: 2px;
      overflow: hidden;
    }

    .applicant-progress {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #2563eb);
      border-radius: 2px;
      transition: width 0.3s ease;
    }

    .priority-badge {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .priority-badge.priority-high {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }

    .priority-badge.priority-medium {
      background: #fefbf2;
      color: #d97706;
      border: 1px solid #fed7aa;
    }

    .priority-badge.priority-low {
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
    }

    .actions-cell {
      text-align: center;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      justify-content: center;
    }

    .action-btn {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #64748b;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background: #f8fafc;
      color: #374151;
      border-color: #cbd5e1;
      transform: translateY(-1px);
    }

    .text-center {
      text-align: center;
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
      .dashboard-layout {
        padding: 0;
      }

      .dashboard-header {
        padding: 16px;
      }

      .dashboard-content {
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

      .secondary-metrics {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
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

      .search-box {
        min-width: 200px;
      }

      .professional-table th,
      .professional-table td {
        padding: 12px 16px;
        font-size: 13px;
      }

      .main-title {
        font-size: 24px;
      }

      .metric-value {
        font-size: 28px;
      }
    }

    @media (max-width: 480px) {
      .dashboard-header {
        padding: 12px;
      }

      .dashboard-content {
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

      .secondary-metrics {
        grid-template-columns: 1fr;
      }

      .aging-item,
      .attention-item {
        padding: 12px;
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }

      .aging-indicator {
        justify-content: center;
      }

      .professional-table {
        font-size: 12px;
        min-width: 600px;
      }

      .professional-table th,
      .professional-table td {
        padding: 8px 12px;
      }

      .search-box {
        min-width: 180px;
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

    .dashboard-layout > * {
      animation: fadeInUp 0.6s ease-out;
    }

    .dashboard-layout > *:nth-child(2) {
      animation-delay: 0.1s;
    }

    .metrics-grid .metric-card {
      animation: fadeInUp 0.6s ease-out;
    }

    .metrics-grid .metric-card:nth-child(1) { animation-delay: 0.1s; }
    .metrics-grid .metric-card:nth-child(2) { animation-delay: 0.2s; }
    .metrics-grid .metric-card:nth-child(3) { animation-delay: 0.3s; }
    .metrics-grid .metric-card:nth-child(4) { animation-delay: 0.4s; }

    /* Print Styles */
    @media print {
      .dashboard-layout {
        background: white;
        box-shadow: none;
      }

      .header-actions,
      .card-actions,
      .action-buttons {
        display: none;
      }

      .content-card,
      .metric-card {
        box-shadow: none;
        border: 1px solid #e5e7eb;
        break-inside: avoid;
      }

      .dashboard-content {
        gap: 16px;
      }
    }

    /* Loading States */
    .loading {
      opacity: 0.6;
      pointer-events: none;
    }

    .metric-skeleton {
      background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
      height: 20px;
      margin: 4px 0;
    }

    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    /* Scroll Behavior */
    .dashboard-layout {
      scroll-behavior: smooth;
    }

    .table-container {
      scroll-behavior: smooth;
    }

    /* Focus States for Accessibility */
    .btn-primary:focus,
    .btn-secondary:focus,
    .icon-btn:focus,
    .action-btn:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    .search-input:focus {
      outline: 2px solid #3b82f6;
      outline-offset: -2px;
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  metrics: HiringMetrics | null = null;
  recentJobs: JobDescription[] = [];
  isLoading = true;
  private subscription: Subscription | null = null;

  constructor(private hrDataService: HrDataService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private loadDashboardData() {
    this.isLoading = true;
    
    // Unsubscribe from previous subscriptions
    this.subscription?.unsubscribe();
    
    // Create a combined subscription for both metrics and jobs
    const metricsSub = this.hrDataService.getHiringMetrics().subscribe({
      next: (metrics) => {
        console.log('Metrics updated:', metrics);
        this.metrics = metrics;
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Failed to load hiring metrics', err);
        this.checkLoadingComplete();
      }
    });

    const jobsSub = this.hrDataService.getJobDescriptions().subscribe({
      next: (jobs) => {
        console.log('Jobs data updated:', jobs);
        if (Array.isArray(jobs)) {
          this.recentJobs = jobs
            .filter(job => !!job?.createdDate)
            .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
            .slice(0, 10);
        } else {
          this.recentJobs = [];
          console.warn('Jobs data was not an array:', jobs);
        }
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Failed to load job descriptions', err);
        this.recentJobs = [];
        this.checkLoadingComplete();
      }
    });

    // Combine subscriptions
    this.subscription = new Subscription();
    this.subscription.add(metricsSub);
    this.subscription.add(jobsSub);
  }

  private checkLoadingComplete() {
    // Only set loading to false if we have both metrics and jobs data
    if (this.metrics !== null && this.recentJobs.length > 0) {
      this.isLoading = false;
    }
  }

  getOpenPositionRate(): number {
    if (!this.metrics || this.metrics.totalJobDescriptions === 0) return 0;
    return Math.round((this.metrics.openPositions / this.metrics.totalJobDescriptions) * 100);
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority.toLowerCase()}`;
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  getStatusDotClass(status: string): string {
    return `dot-${status.toLowerCase()}`;
  }

  getDaysClass(days: number): string {
    if (days <= 30) return 'days-normal';
    if (days <= 60) return 'days-warning';
    return 'days-critical';
  }

  getApplicantProgress(count: number): number {
    // Assuming max of 50 applicants for full bar
    return Math.min((count / 50) * 100, 100);
  }

  trackByJobId(index: number, job: JobDescription): string {
    return job.id;
  }

  refreshData() {
    this.loadDashboardData();
  }

  exportReport() {
    // Implementation for exporting reports
    console.log('Exporting dashboard report...');
  }
}