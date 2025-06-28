import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrDataService } from '../../services/hr-data.service';
import { HiringMetrics, StageMetrics, Candidate } from '../../models/hr-data.interface';

@Component({
  selector: 'app-hiring-velocity',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fade-in">
      <div class="mb-8">
        <h1>Hiring Velocity</h1>
        <p class="text-gray-600">Analyze hiring speed and identify process bottlenecks</p>
      </div>

      <!-- Hiring Velocity Insights -->
      <div class="grid grid-4 mb-8">
        <div class="card text-center">
          <div class="metric-value text-blue-600">{{ metrics?.hiringVelocity?.avgTimeToFill || 0 }}</div>
          <div class="metric-label">Avg Time to Fill (days)</div>
        </div>
        <div class="card text-center">
          <div class="metric-value text-green-600">{{ metrics?.hiringVelocity?.timeToFirstInterview || 0 }}</div>
          <div class="metric-label">Time to First Interview (days)</div>
        </div>
        <div class="card text-center">
          <div class="metric-value text-orange-600">{{ metrics?.hiringVelocity?.timeToOffer || 0 }}</div>
          <div class="metric-label">Time to Offer (days)</div>
        </div>
        <div class="card text-center">
          <div class="metric-value text-purple-600">{{ metrics?.hiringVelocity?.timeToAcceptance || 0 }}</div>
          <div class="metric-label">Time to Acceptance (days)</div>
        </div>
      </div>

      <!-- Identified Bottlenecks -->
      <div class="grid grid-2 mb-8">
        <div class="card">
          <h3>Identified Bottlenecks</h3>
          <div class="space-y-4 mt-4">
            <div class="flex items-center p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
              <span class="text-red-500 text-xl mr-3">🔴</span>
              <div>
                <div class="font-semibold text-red-800">Technical Interview</div>
                <div class="text-sm text-red-600">Longest stage in the process</div>
                <div class="text-xs text-red-500 mt-1">4.1 days average</div>
              </div>
            </div>
            <div class="flex items-center p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <span class="text-yellow-500 text-xl mr-3">🟡</span>
              <div>
                <div class="font-semibold text-yellow-800">HR Feedback</div>
                <div class="text-sm text-yellow-600">Delayed feedback collection</div>
                <div class="text-xs text-yellow-500 mt-1">2.3 days average</div>
              </div>
            </div>
            <div class="flex items-center p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
              <span class="text-orange-500 text-xl mr-3">🟠</span>
              <div>
                <div class="font-semibold text-orange-800">Reference Check</div>
                <div class="text-sm text-orange-600">Slow external verification</div>
                <div class="text-xs text-orange-500 mt-1">3.2 days average</div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <h3>Velocity Recommendations</h3>
          <div class="space-y-4 mt-4">
            <div class="flex items-center p-4 bg-green-50 rounded-lg">
              <span class="text-green-500 text-xl mr-3">✅</span>
              <div class="text-sm">
                <div class="font-semibold text-green-800">Streamline Technical Interviews</div>
                <div class="text-green-600">Reduce scheduling delays by 2 days</div>
              </div>
            </div>
            <div class="flex items-center p-4 bg-blue-50 rounded-lg">
              <span class="text-blue-500 text-xl mr-3">📋</span>
              <div class="text-sm">
                <div class="font-semibold text-blue-800">Automate Reference Checks</div>
                <div class="text-blue-600">Use digital reference platforms</div>
              </div>
            </div>
            <div class="flex items-center p-4 bg-purple-50 rounded-lg">
              <span class="text-purple-500 text-xl mr-3">⚡</span>
              <div class="text-sm">
                <div class="font-semibold text-purple-800">Set SLA for HR Feedback</div>
                <div class="text-purple-600">24-hour feedback requirement</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Velocity Breakdown by Stage -->
      <div class="card mb-8">
        <h3>Velocity Breakdown by Stage</h3>
        <div class="mt-6">
          <div class="grid grid-2 gap-6">
            <div *ngFor="let stage of stageMetrics" class="p-4 bg-gray-50 rounded-lg">
              <div class="flex justify-between items-center mb-2">
                <span class="font-semibold text-gray-700">{{ stage.stage }}</span>
                <span class="text-lg font-bold" [class]="getVelocityClass(stage.avgDays)">
                  {{ stage.avgDays }} days
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  [class]="getVelocityBarClass(stage.avgDays)"
                  class="h-2 rounded-full transition-all duration-300"
                  [style.width.%]="(stage.avgDays / getMaxStageDays()) * 100">
                </div>
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ getVelocityDescription(stage.avgDays) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Candidate Performance Demographics -->
      <div class="card">
        <h3>Candidate Performance Demographics</h3>
        <div class="grid grid-4 gap-6 mt-6">
          <div class="text-center">
            <h4 class="font-semibold text-gray-700 mb-4">Geographic Distribution</h4>
            <div class="space-y-2">
              <div *ngFor="let location of getTopLocations()" class="flex justify-between">
                <span class="text-sm text-gray-600">{{ location.name }}</span>
                <span class="text-sm font-semibold">{{ location.count }}</span>
              </div>
            </div>
          </div>
          
          <div class="text-center">
            <h4 class="font-semibold text-gray-700 mb-4">Experience Distribution</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">0-2 years</span>
                <span class="text-sm font-semibold">{{ getExperienceCount('junior') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">3-7 years</span>
                <span class="text-sm font-semibold">{{ getExperienceCount('mid') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">8+ years</span>
                <span class="text-sm font-semibold">{{ getExperienceCount('senior') }}</span>
              </div>
            </div>
          </div>

          <div class="text-center">
            <h4 class="font-semibold text-gray-700 mb-4">Education Background</h4>
            <div class="space-y-2">
              <div *ngFor="let edu of getEducationDistribution()" class="flex justify-between">
                <span class="text-sm text-gray-600">{{ edu.level }}</span>
                <span class="text-sm font-semibold">{{ edu.count }}</span>
              </div>
            </div>
          </div>

          <div class="text-center">
            <h4 class="font-semibold text-gray-700 mb-4">Success Metrics</h4>
            <div class="space-y-3">
              <div class="p-3 bg-green-50 rounded-lg">
                <div class="font-bold text-green-700">{{ getOfferAcceptanceRate() }}%</div>
                <div class="text-xs text-green-600">Offer Acceptance</div>
              </div>
              <div class="p-3 bg-blue-50 rounded-lg">
                <div class="font-bold text-blue-700">{{ getInterviewShowRate() }}%</div>
                <div class="text-xs text-blue-600">Interview Show Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .space-y-2 > * + * {
      margin-top: 8px;
    }
    
    .space-y-3 > * + * {
      margin-top: 12px;
    }
    
    .space-y-4 > * + * {
      margin-top: 16px;
    }
  `]
})
export class HiringVelocityComponent implements OnInit {
  metrics: HiringMetrics | null = null;
  stageMetrics: StageMetrics[] = [];
  candidates: Candidate[] = [];

  constructor(private hrDataService: HrDataService) {}

  ngOnInit() {
    this.hrDataService.getHiringMetrics().subscribe(metrics => {
      this.metrics = metrics;
    });

    this.hrDataService.getStageMetrics().subscribe(stages => {
      this.stageMetrics = stages.filter(s => s.avgDays > 0);
    });

    this.hrDataService.getCandidates().subscribe(candidates => {
      this.candidates = candidates;
    });
  }

  getMaxStageDays(): number {
    return Math.max(...this.stageMetrics.map(stage => stage.avgDays));
  }

  getVelocityClass(days: number): string {
    if (days <= 1.5) return 'text-green-600';
    if (days <= 3) return 'text-yellow-600';
    return 'text-red-600';
  }

  getVelocityBarClass(days: number): string {
    if (days <= 1.5) return 'bg-green-500';
    if (days <= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  getVelocityDescription(days: number): string {
    if (days <= 1.5) return 'Excellent velocity';
    if (days <= 3) return 'Good velocity';
    return 'Needs improvement';
  }

  getTopLocations(): { name: string; count: number }[] {
    const locations = this.candidates.reduce((acc, candidate) => {
      const location = candidate.demographics.location;
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
      const experience = candidate.demographics.experience;
      switch (level) {
        case 'junior': return experience <= 2;
        case 'mid': return experience >= 3 && experience <= 7;
        case 'senior': return experience >= 8;
        default: return false;
      }
    }).length;
  }

  getEducationDistribution(): { level: string; count: number }[] {
    const education = this.candidates.reduce((acc, candidate) => {
      const level = candidate.demographics.education;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(education)
      .map(([level, count]) => ({ level, count }))
      .sort((a, b) => b.count - a.count);
  }

  getOfferAcceptanceRate(): number {
    return 85; // Mock data - would be calculated from actual offer/acceptance data
  }

  getInterviewShowRate(): number {
    return 92; // Mock data - would be calculated from actual interview attendance data
  }
}