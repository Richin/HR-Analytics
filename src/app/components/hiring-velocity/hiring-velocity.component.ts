import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrDataService } from '../../services/hr-data.service';
import { HiringMetrics, StageMetrics, Candidate } from '../../models/hr-data.interface';

declare var Chart: any; // For Chart.js

interface StageData {
  name: string;
  days: number;
  description: string;
}

interface DemographicData {
  name: string;
  count: number;
  level?: string; // Add optional level property
}

@Component({
  selector: 'app-hiring-velocity',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="header">
        <h1>Hiring Velocity Dashboard</h1>
        <p>Analyze hiring speed and identify process bottlenecks with advanced insights</p>
      </div>

      <!-- Key Metrics -->
      <div class="metrics-grid">
        <div class="metric-card" [style.--accent-color]="'#667eea'">
          <div class="metric-value" [id]="'avgTimeToFill'">
            {{ animatedMetrics.avgTimeToFill }}
          </div>
          <div class="metric-label">Avg Time to Fill (days)</div>
        </div>
        <div class="metric-card" [style.--accent-color]="'#10b981'">
          <div class="metric-value" [id]="'timeToFirstInterview'">
            {{ animatedMetrics.timeToFirstInterview }}
          </div>
          <div class="metric-label">Time to First Interview (days)</div>
        </div>
        <div class="metric-card" [style.--accent-color]="'#f59e0b'">
          <div class="metric-value" [id]="'timeToOffer'">
            {{ animatedMetrics.timeToOffer }}
          </div>
          <div class="metric-label">Time to Offer (days)</div>
        </div>
        <div class="metric-card" [style.--accent-color]="'#8b5cf6'">
          <div class="metric-value" [id]="'timeToAcceptance'">
            {{ animatedMetrics.timeToAcceptance }}
          </div>
          <div class="metric-label">Time to Acceptance (days)</div>
        </div>
      </div>

      <!-- Bottlenecks and Recommendations -->
      <div class="content-grid">
        <div class="card">
          <h3>🚨 Identified Bottlenecks</h3>
          <div class="bottleneck-item bottleneck-critical">
            <div class="bottleneck-icon">🔴</div>
            <div class="bottleneck-content">
              <h4>Technical Interview</h4>
              <div class="bottleneck-description">Longest stage in the process</div>
              <div class="bottleneck-time critical-time">4.1 days average</div>
            </div>
          </div>
          <div class="bottleneck-item bottleneck-warning">
            <div class="bottleneck-icon">🟡</div>
            <div class="bottleneck-content">
              <h4>HR Feedback</h4>
              <div class="bottleneck-description">Delayed feedback collection</div>
              <div class="bottleneck-time warning-time">2.3 days average</div>
            </div>
          </div>
          <div class="bottleneck-item bottleneck-moderate">
            <div class="bottleneck-icon">🟠</div>
            <div class="bottleneck-content">
              <h4>Reference Check</h4>
              <div class="bottleneck-description">Slow external verification</div>
              <div class="bottleneck-time moderate-time">14 days average</div>
            </div>
          </div>
        </div>

        <div class="card">
          <h3>💡 Velocity Recommendations</h3>
          <div class="recommendation-item recommendation-green">
            <div class="recommendation-icon green-icon">✅</div>
            <div>
              <h4 class="green-title">Streamline Technical Interviews</h4>
              <div class="green-text">Reduce scheduling delays by 2 days</div>
            </div>
          </div>
          <div class="recommendation-item recommendation-blue">
            <div class="recommendation-icon blue-icon">📋</div>
            <div>
              <h4 class="blue-title">Automate Reference Checks</h4>
              <div class="blue-text">Use digital reference platforms</div>
            </div>
          </div>
          <div class="recommendation-item recommendation-purple">
            <div class="recommendation-icon purple-icon">⚡</div>
            <div>
              <h4 class="purple-title">Set SLA for HR Feedback</h4>
              <div class="purple-text">24-hour feedback requirement</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stage Velocity Breakdown -->
      <div class="card">
        <h3>📊 Velocity Breakdown by Stage</h3>
        <div class="stage-grid">
          <div *ngFor="let stage of processedStageMetrics" class="stage-item">
            <div class="stage-header">
              <span class="stage-name">{{ stage.name }}</span>
              <span class="stage-days" [ngClass]="getVelocityClass(stage.days)">
                {{ stage.days }} days
              </span>
            </div>
            <div class="velocity-bar">
              <div class="velocity-progress" 
                   [ngClass]="getProgressClass(stage.days)"
                   [style.width.%]="getProgressWidth(stage.days)">
              </div>
            </div>
            <div class="velocity-description">{{ stage.description }}</div>
          </div>
        </div>
      </div>

      <!-- Performance Chart -->
      <!-- <div class="chart-container">
        <h3>📈 Hiring Velocity Trends</h3>
        <canvas #velocityChart width="400" height="200"></canvas>
      </div> -->

      <!-- Demographics -->
      <div class="card">
        <h3>👥 Candidate Performance Demographics</h3>
        <div class="demographics-grid">
          <div class="demo-section">
            <h4>🌍 Geographic Distribution</h4>
            <div *ngFor="let location of getTopLocations()" class="demo-item">
              <span class="demo-label">{{ location.name }}</span>
              <span class="demo-value">{{ location.count }}</span>
            </div>
          </div>

          <div class="demo-section">
            <h4>💼 Experience Distribution</h4>
            <div class="demo-item">
              <span class="demo-label">0-2 years</span>
              <span class="demo-value">{{ getExperienceCount('junior') }}</span>
            </div>
            <div class="demo-item">
              <span class="demo-label">3-7 years</span>
              <span class="demo-value">{{ getExperienceCount('mid') }}</span>
            </div>
            <div class="demo-item">
              <span class="demo-label">8+ years</span>
              <span class="demo-value">{{ getExperienceCount('senior') }}</span>
            </div>
          </div>

          <div class="demo-section">
  <h4>🎓 Education Background</h4>
  <div *ngFor="let edu of getEducationDistribution()" class="demo-item">
    <span class="demo-label">{{ edu.name }}</span>
    <span class="demo-value">{{ edu.count }}</span>
  </div>
</div>

          <div class="demo-section">
            <h4>📈 Success Metrics</h4>
            <div class="success-metric success-green">
              <div class="success-value">{{ getOfferAcceptanceRate() }}%</div>
              <div class="success-label">Offer Acceptance</div>
            </div>
            <div class="success-metric success-blue">
              <div class="success-value">{{ getInterviewShowRate() }}%</div>
              <div class="success-label">Interview Show Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 2rem;
      color: #1a1a1a;
    }

    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      animation: fadeInUp 0.6s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 2.5rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .header h1 {
      font-size: 3rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }

    .header p {
      font-size: 1.1rem;
      color: #6b7280;
      font-weight: 400;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .metric-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .metric-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--accent-color);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    .metric-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
    }

    .metric-card:hover::before {
      transform: scaleX(1);
    }

    .metric-value {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      color: var(--accent-color);
    }

    .metric-label {
      font-size: 0.9rem;
      color: #6b7280;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    .card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: #1a1a1a;
    }

    .bottleneck-item {
      display: flex;
      align-items: center;
      padding: 1.25rem;
      border-radius: 16px;
      margin-bottom: 1rem;
      transition: all 0.3s ease;
      border-left: 4px solid;
    }

    .bottleneck-item:hover {
      transform: translateX(8px);
    }

    .bottleneck-critical {
      background: linear-gradient(135deg, #fef2f2, #fee2e2);
      border-left-color: #ef4444;
    }

    .bottleneck-warning {
      background: linear-gradient(135deg, #fefce8, #fef3c7);
      border-left-color: #f59e0b;
    }

    .bottleneck-moderate {
      background: linear-gradient(135deg, #fff7ed, #fed7aa);
      border-left-color: #f97316;
    }

    .bottleneck-icon {
      font-size: 1.5rem;
      margin-right: 1rem;
    }

    .bottleneck-content h4 {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .bottleneck-description {
      font-size: 0.9rem;
      color: #6b7280;
      margin-bottom: 0.25rem;
    }

    .bottleneck-time {
      font-size: 0.8rem;
      font-weight: 600;
    }

    .critical-time { color: #dc2626; }
    .warning-time { color: #d97706; }
    .moderate-time { color: #ea580c; }

    .recommendation-item {
      display: flex;
      align-items: center;
      padding: 1.25rem;
      border-radius: 16px;
      margin-bottom: 1rem;
      transition: all 0.3s ease;
    }

    .recommendation-item:hover {
      transform: scale(1.02);
    }

    .recommendation-green {
      background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    }

    .recommendation-blue {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
    }

    .recommendation-purple {
      background: linear-gradient(135deg, #faf5ff, #e9d5ff);
    }

    .recommendation-icon {
      font-size: 1.5rem;
      margin-right: 1rem;
    }

    .green-icon { color: #059669; }
    .blue-icon { color: #2563eb; }
    .purple-icon { color: #7c3aed; }

    .green-title { color: #065f46; margin-bottom: 0.25rem; }
    .blue-title { color: #1e40af; margin-bottom: 0.25rem; }
    .purple-title { color: #6d28d9; margin-bottom: 0.25rem; }

    .green-text { color: #059669; font-size: 0.9rem; }
    .blue-text { color: #2563eb; font-size: 0.9rem; }
    .purple-text { color: #7c3aed; font-size: 0.9rem; }

    .stage-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .stage-item {
      padding: 1.5rem;
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      border-radius: 16px;
      transition: all 0.3s ease;
    }

    .stage-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .stage-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .stage-name {
      font-weight: 600;
      color: #374151;
    }

    .stage-days {
      font-size: 1.25rem;
      font-weight: 700;
    }

    .velocity-bar {
      width: 100%;
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .velocity-progress {
      height: 100%;
      border-radius: 4px;
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .velocity-excellent { color: #10b981; }
    .velocity-good { color: #f59e0b; }
    .velocity-poor { color: #ef4444; }

    .progress-excellent { background: linear-gradient(90deg, #10b981, #34d399); }
    .progress-good { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
    .progress-poor { background: linear-gradient(90deg, #ef4444, #f87171); }

    .velocity-description {
      font-size: 0.8rem;
      color: #6b7280;
    }

    .demographics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 1.5rem;
    }

    .demo-section h4 {
      font-weight: 600;
      color: #374151;
      margin-bottom: 1rem;
      text-align: center;
    }

    .demo-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .demo-item:last-child {
      border-bottom: none;
    }

    .demo-label {
      font-size: 0.9rem;
      color: #6b7280;
    }

    .demo-value {
      font-weight: 600;
      color: #374151;
    }

    .success-metric {
      text-align: center;
      padding: 1.25rem;
      border-radius: 12px;
      margin-bottom: 1rem;
    }

    .success-value {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .success-label {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .success-green {
      background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    }

    .success-green .success-value {
      color: #059669;
    }

    .success-green .success-label {
      color: #065f46;
    }

    .success-blue {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
    }

    .success-blue .success-value {
      color: #2563eb;
    }

    .success-blue .success-label {
      color: #1e40af;
    }

    .chart-container {
      margin-top: 2rem;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .chart-container h3 {
      margin-bottom: 1.5rem;
    }
  `]
})
export class HiringVelocityComponent implements OnInit, AfterViewInit {
  @ViewChild('velocityChart') velocityChartRef!: ElementRef<HTMLCanvasElement>;

  metrics: HiringMetrics | null = null;
  stageMetrics: StageMetrics[] = [];
  candidates: Candidate[] = [];
  processedStageMetrics: StageData[] = [];
  
  animatedMetrics = {
    avgTimeToFill: 0,
    timeToFirstInterview: 0,
    timeToOffer: 0,
    timeToAcceptance: 0
  };

  private chart: any;

  constructor(private hrDataService: HrDataService) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    // Delay chart creation to ensure view is ready
    setTimeout(() => {
      this.createVelocityChart();
    }, 500);
  }

  private loadData() {
    this.hrDataService.getHiringMetrics().subscribe(metrics => {
      this.metrics = metrics;
      this.animateMetrics();
    });

    this.hrDataService.getStageMetrics().subscribe(stages => {
      this.stageMetrics = stages.filter(s => s.avgDays > 0);
      this.processStageMetrics();
    });

    this.hrDataService.getCandidates().subscribe(candidates => {
      this.candidates = candidates;
    });
  }

  private animateMetrics() {
    if (!this.metrics?.hiringVelocity) return;

    const targets = {
      avgTimeToFill: this.metrics.hiringVelocity.avgTimeToFill || 35,
      timeToFirstInterview: this.metrics.hiringVelocity.timeToFirstInterview || 5,
      timeToOffer: this.metrics.hiringVelocity.timeToOffer || 18,
      timeToAcceptance: this.metrics.hiringVelocity.timeToAcceptance || 7
    };

    Object.keys(targets).forEach(key => {
      const target = targets[key as keyof typeof targets];
      const increment = target / 30;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        this.animatedMetrics[key as keyof typeof this.animatedMetrics] = Math.round(current);
      }, 50);
    });
  }

  private processStageMetrics() {
    this.processedStageMetrics = this.stageMetrics.map(stage => ({
      name: stage.stage,
      days: stage.avgDays,
      description: this.getVelocityDescription(stage.avgDays)
    }));
  }

  private createVelocityChart() {
    if (!this.velocityChartRef?.nativeElement) return;

    const ctx = this.velocityChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Avg Time to Fill',
          data: [42, 38, 35, 41, 36, 35],
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }, {
          label: 'Time to Offer',
          data: [22, 20, 18, 24, 19, 18],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        },
        elements: {
          point: {
            radius: 6,
            hoverRadius: 8
          }
        }
      }
    });
  }

  getMaxStageDays(): number {
    return Math.max(...this.processedStageMetrics.map(stage => stage.days));
  }

  getVelocityClass(days: number): string {
    if (days <= 1.5) return 'velocity-excellent';
    if (days <= 3) return 'velocity-good';
    return 'velocity-poor';
  }

  getProgressClass(days: number): string {
    if (days <= 1.5) return 'progress-excellent';
    if (days <= 3) return 'progress-good';
    return 'progress-poor';
  }

  getProgressWidth(days: number): number {
    const maxDays = this.getMaxStageDays();
    return maxDays > 0 ? (days / maxDays) * 100 : 0;
  }

  getVelocityDescription(days: number): string {
    if (days <= 1.5) return 'Excellent velocity';
    if (days <= 3) return 'Good velocity';
    return 'Needs improvement';
  }

  getTopLocations(): DemographicData[] {
    const locations = this.candidates.reduce((acc, candidate) => {
      const location = candidate.demographics?.location || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(locations)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  getExperienceCount(level: 'junior' | 'mid' | 'senior'): number {
    return this.candidates.filter(candidate => {
      const experience = candidate.demographics?.experience || 0;
      switch (level) {
        case 'junior': return experience <= 2;
        case 'mid': return experience >= 3 && experience <= 7;
        case 'senior': return experience >= 8;
        default: return false;
      }
    }).length;
  }

// Finally, update the getEducationDistribution method to use name property
getEducationDistribution(): DemographicData[] {
  const education = this.candidates.reduce((acc, candidate) => {
    const level = candidate.demographics?.education || 'Unknown';
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(education)
    .map(([level, count]) => ({ 
      name: level, // Use name instead of level
      count 
    }))
    .sort((a, b) => b.count - a.count);
}

  getOfferAcceptanceRate(): number {
    // Calculate from actual data or return mock data
    return 85;
  }

  getInterviewShowRate(): number {
    // Calculate from actual data or return mock data
    return 92;
  }
}