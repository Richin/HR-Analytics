import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { 
  JobDescription, 
  Resume, 
  Candidate, 
  HiringMetrics, 
  WeeklyResumeData, 
  StageMetrics 
} from '../models/hr-data.interface';

@Injectable({
  providedIn: 'root'
})
export class HrDataService {
  private dataSubject = new BehaviorSubject<any>(null);
  
  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // This would be replaced with actual API endpoints
    const mockData = {
      jobDescriptions: this.generateMockJobDescriptions(),
      resumes: this.generateMockResumes(),
      candidates: this.generateMockCandidates(),
      metrics: this.generateMockMetrics(),
      weeklyResumeData: this.generateWeeklyResumeData(),
      stageMetrics: this.generateStageMetrics()
    };
    
    this.dataSubject.next(mockData);
  }

  getHiringMetrics(): Observable<HiringMetrics> {
    return of(this.dataSubject.value.metrics);
  }

  getJobDescriptions(): Observable<JobDescription[]> {
    return of(this.dataSubject.value.jobDescriptions);
  }

  getResumes(): Observable<Resume[]> {
    return of(this.dataSubject.value.resumes);
  }

  getCandidates(): Observable<Candidate[]> {
    return of(this.dataSubject.value.candidates);
  }

  getWeeklyResumeData(): Observable<WeeklyResumeData[]> {
    return of(this.dataSubject.value.weeklyResumeData);
  }

  getStageMetrics(): Observable<StageMetrics[]> {
    return of(this.dataSubject.value.stageMetrics);
  }

  private generateMockJobDescriptions(): JobDescription[] {
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
    const locations = ['New York', 'San Francisco', 'Austin', 'Remote', 'Boston'];
    const titles = ['Software Engineer', 'Product Manager', 'Sales Executive', 'Marketing Specialist', 'Data Analyst'];
    
    return Array.from({ length: 25 }, (_, i) => ({
      id: `job-${i + 1}`,
      title: titles[Math.floor(Math.random() * titles.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      status: Math.random() > 0.3 ? 'open' : 'closed' as 'open' | 'closed',
      createdDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      daysOpen: Math.floor(Math.random() * 120),
      applicantsCount: Math.floor(Math.random() * 50),
      location: locations[Math.floor(Math.random() * locations.length)],
      priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low'
    }));
  }

  private generateMockResumes(): Resume[] {
    const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
    const sources = ['LinkedIn', 'Indeed', 'Company Website', 'Referral', 'Recruiter'];
    
    return Array.from({ length: 150 }, (_, i) => ({
      id: `resume-${i + 1}`,
      candidateName: names[Math.floor(Math.random() * names.length)],
      email: `candidate${i + 1}@email.com`,
      phone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
      submittedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      status: ['unprocessed', 'processed', 'duplicate'][Math.floor(Math.random() * 3)] as 'unprocessed' | 'processed' | 'duplicate',
      jobId: `job-${Math.floor(Math.random() * 25) + 1}`,
      source: sources[Math.floor(Math.random() * sources.length)]
    }));
  }

  private generateMockCandidates(): Candidate[] {
    const stages = ['applied', 'screened', 'shortlisted', 'interviewed', 'hr_round', 'offered', 'rejected', 'withdrawn'];
    const educationLevels = ['Bachelor\'s', 'Master\'s', 'PhD', 'Associate', 'High School'];
    const locations = ['New York', 'California', 'Texas', 'Florida', 'Illinois'];
    
    return Array.from({ length: 80 }, (_, i) => ({
      id: `candidate-${i + 1}`,
      name: `Candidate ${i + 1}`,
      email: `candidate${i + 1}@email.com`,
      jobId: `job-${Math.floor(Math.random() * 25) + 1}`,
      currentStage: stages[Math.floor(Math.random() * stages.length)] as any,
      stageHistory: [],
      demographics: {
        age: Math.floor(Math.random() * 30) + 22,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        location: locations[Math.floor(Math.random() * locations.length)],
        experience: Math.floor(Math.random() * 15),
        education: educationLevels[Math.floor(Math.random() * educationLevels.length)]
      }
    }));
  }

  private generateMockMetrics(): HiringMetrics {
    return {
      totalJobDescriptions: 25,
      openPositions: 18,
      closedPositions: 7,
      agingJobs: {
        thirtyPlus: 8,
        sixtyPlus: 4,
        ninetyPlus: 2
      },
      attentionRequired: {
        noApplicants: 3,
        agingBeyondSixty: 4
      },
      resumeMetrics: {
        totalResumes: 150,
        todayInflow: 12,
        unprocessed: 25,
        duplicates: 8
      },
      hiringVelocity: {
        avgTimeToFill: 21.5,
        timeToFirstInterview: 5.2,
        timeToOffer: 14.1,
        timeToAcceptance: 3.8
      },
      currentStatus: {
        rejected: 25,
        withdrawn: 8,
        offersMade: 6,
        inProcess: 41
      }
    };
  }

  private generateWeeklyResumeData(): WeeklyResumeData[] {
    return [
      { week: 'Week 1', count: 23 },
      { week: 'Week 2', count: 18 },
      { week: 'Week 3', count: 31 },
      { week: 'Week 4', count: 25 },
      { week: 'Week 5', count: 28 },
      { week: 'Week 6', count: 35 },
      { week: 'Week 7', count: 22 },
      { week: 'Week 8', count: 29 }
    ];
  }

  private generateStageMetrics(): StageMetrics[] {
    return [
      { stage: 'Applied', count: 120, dropoffRate: 0, avgDays: 0 },
      { stage: 'Screened', count: 85, dropoffRate: 29.2, avgDays: 2.1 },
      { stage: 'Shortlisted', count: 45, dropoffRate: 47.1, avgDays: 1.8 },
      { stage: 'Interviewed', count: 28, dropoffRate: 37.8, avgDays: 4.1 },
      { stage: 'HR Round', count: 18, dropoffRate: 35.7, avgDays: 2.3 },
      { stage: 'Offered', count: 12, dropoffRate: 33.3, avgDays: 1.5 }
    ];
  }
}