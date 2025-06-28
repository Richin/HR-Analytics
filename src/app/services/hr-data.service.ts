import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { 
  Job,
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
  
  constructor(private http: HttpClient) {
    this.initializeDataFromAPIs();
  }

  private initializeDataFromAPIs() {
    // Initialize with empty data first
    const initialData = {
      jobs: [],
      jobDescriptions: [],
      resumes: [],
      candidates: [],
      metrics: null,
      weeklyResumeData: [],
      stageMetrics: []
    };
    
    this.dataSubject.next(initialData);
    
    // Fetch jobs from API
    this.fetchJobsFromAPI().subscribe({
      next: (jobs) => {
        const currentData = this.dataSubject.value || {};
        const updatedData = {
          ...currentData,
          jobs: jobs,
          jobDescriptions: jobs // Use same data for jobDescriptions
        };
        this.dataSubject.next(updatedData);
      },
      error: (err) => {
        console.error('Failed to fetch jobs from API:', err);
      }
    });

    // Fetch resumes from API (if endpoint exists)
    this.fetchResumesFromAPI().subscribe({
      next: (resumes) => {
        const currentData = this.dataSubject.value || {};
        const updatedData = {
          ...currentData,
          resumes: resumes
        };
        this.dataSubject.next(updatedData);
      },
      error: (err) => {
        console.error('Failed to fetch resumes from API:', err);
        // Fall back to mock data if API fails
        const currentData = this.dataSubject.value || {};
        const updatedData = {
          ...currentData,
          resumes: this.generateMockResumes()
        };
        this.dataSubject.next(updatedData);
      }
    });

    // Fetch candidates from API (if endpoint exists)
    this.fetchCandidatesFromAPI().subscribe({
      next: (candidates) => {
        const currentData = this.dataSubject.value || {};
        const updatedData = {
          ...currentData,
          candidates: candidates
        };
        this.dataSubject.next(updatedData);
      },
      error: (err) => {
        console.error('Failed to fetch candidates from API:', err);
        // Fall back to mock data if API fails
        const currentData = this.dataSubject.value || {};
        const updatedData = {
          ...currentData,
          candidates: this.generateMockCandidates()
        };
        this.dataSubject.next(updatedData);
      }
    });

    // Fetch metrics from API (if endpoint exists)
    this.fetchMetricsFromAPI().subscribe({
      next: (metrics) => {
        const currentData = this.dataSubject.value || {};
        const updatedData = {
          ...currentData,
          metrics: metrics
        };
        this.dataSubject.next(updatedData);
      },
      error: (err) => {
        console.error('Failed to fetch metrics from API:', err);
        // Fall back to mock data if API fails
        const currentData = this.dataSubject.value || {};
        const updatedData = {
          ...currentData,
          metrics: this.generateMockMetrics()
        };
        this.dataSubject.next(updatedData);
      }
    });

    // Fetch weekly resume data from API (if endpoint exists)
    this.fetchWeeklyResumeDataFromAPI().subscribe({
      next: (weeklyData) => {
        const currentData = this.dataSubject.value || {};
        const updatedData = {
          ...currentData,
          weeklyResumeData: weeklyData
        };
        this.dataSubject.next(updatedData);
      },
      error: (err) => {
        console.error('Failed to fetch weekly resume data from API:', err);
        // Fall back to mock data if API fails
        const currentData = this.dataSubject.value || {};
        const updatedData = {
          ...currentData,
          weeklyResumeData: this.generateWeeklyResumeData()
        };
        this.dataSubject.next(updatedData);
      }
    });

    // Fetch stage metrics from API (if endpoint exists)
    this.fetchStageMetricsFromAPI().subscribe({
      next: (stageMetrics) => {
        const currentData = this.dataSubject.value || {};
        const updatedData = {
          ...currentData,
          stageMetrics: stageMetrics
        };
        this.dataSubject.next(updatedData);
      },
      error: (err) => {
        console.error('Failed to fetch stage metrics from API:', err);
        // Fall back to mock data if API fails
        const currentData = this.dataSubject.value || {};
        const updatedData = {
          ...currentData,
          stageMetrics: this.generateStageMetrics()
        };
        this.dataSubject.next(updatedData);
      }
    });
  }

  getHiringMetrics(): Observable<HiringMetrics> {
    return this.dataSubject.pipe(
      map(data => data?.metrics || null)
    );
  }

  getJobDescriptions(): Observable<JobDescription[]> {
    return this.dataSubject.pipe(
      map(data => data?.jobDescriptions || [])
    );
  }

  getJobs(): Observable<Job[]> {
    return this.dataSubject.pipe(
      map(data => data?.jobs || [])
    );
  }

  fetchJobsFromAPI(): Observable<Job[]> {
    console.log('Fetching jobs from local JSON file');
    return new Observable(observer => {
      this.http.get<any[]>('https://hr.gofreefolk.com/jobs.json').subscribe({
        next: (jobsData) => {
          console.log('Jobs data:', jobsData);
          const jobs: Job[] = jobsData.map((item, i) => ({
            id: item.id || `job-${i + 1}`,
            title: item.title,
            department: item.department,
            status: item.status,
            createdDate: new Date(item.createdDate),
            daysOpen: item.daysOpen,
            applicantsCount: item.applicantsCount,
            location: item.location,
            priority: item.priority
          }));

          const currentData = this.dataSubject.value || {};
          const updatedData = {
            ...currentData,
            jobs: jobs
          };
    
          this.dataSubject.next(updatedData);
          observer.next(jobs);
          observer.complete();
        },
        error: (err) => {
          console.error('Failed to fetch jobs from local file:', err);
          observer.error(err);
        }
      });
    });
  }

  fetchResumesFromAPI(): Observable<Resume[]> {
    console.log('Fetching resumes from local JSON file');
    return new Observable(observer => {
      this.http.get<any[]>('https://hr.gofreefolk.com/resumes.json').subscribe({
        next: (resumesData) => {
          console.log('Resumes data:', resumesData);
          const resumes: Resume[] = resumesData.map((item, i) => ({
            id: item.id || `resume-${i + 1}`,
            candidateName: item.candidateName,
            email: item.email,
            phone: item.phone,
            submittedDate: new Date(item.submittedDate),
            status: item.status,
            jobId: item.jobId,
            source: item.source
          }));
          observer.next(resumes);
          observer.complete();
        },
        error: (err) => {
          console.error('Failed to fetch resumes from local file:', err);
          observer.error(err);
        }
      });
    });
  }

  fetchCandidatesFromAPI(): Observable<Candidate[]> {
    console.log('Fetching candidates from local JSON file');
    return new Observable(observer => {
      this.http.get<any[]>('https://hr.gofreefolk.com/candidates.json').subscribe({
        next: (candidatesData) => {
          console.log('Candidates data:', candidatesData);
          const candidates: Candidate[] = candidatesData.map((item, i) => ({
            id: item.id || `candidate-${i + 1}`,
            name: item.name,
            email: item.email,
            jobId: item.jobId,
            currentStage: item.currentStage,
            stageHistory: item.stageHistory || [],
            demographics: item.demographics
          }));
          observer.next(candidates);
          observer.complete();
        },
        error: (err) => {
          console.error('Failed to fetch candidates from local file:', err);
          observer.error(err);
        }
      });
    });
  }

  fetchMetricsFromAPI(): Observable<HiringMetrics> {
    console.log('Fetching metrics from local JSON file');
    return new Observable(observer => {
      this.http.get<any>('https://hr.gofreefolk.com/metrics.json').subscribe({
        next: (metricsData) => {
          console.log('Metrics data:', metricsData);
          observer.next(metricsData);
          observer.complete();
        },
        error: (err) => {
          console.error('Failed to fetch metrics from local file:', err);
          observer.error(err);
        }
      });
    });
  }

  fetchWeeklyResumeDataFromAPI(): Observable<WeeklyResumeData[]> {
    console.log('Fetching weekly resume data from local JSON file');
    return new Observable(observer => {
      this.http.get<any[]>('https://hr.gofreefolk.com/weekly-resumes.json').subscribe({
        next: (weeklyData) => {
          console.log('Weekly resume data:', weeklyData);
          observer.next(weeklyData);
          observer.complete();
        },
        error: (err) => {
          console.error('Failed to fetch weekly resume data from local file:', err);
          observer.error(err);
        }
      });
    });
  }

  fetchStageMetricsFromAPI(): Observable<StageMetrics[]> {
    console.log('Fetching stage metrics from local JSON file');
    return new Observable(observer => {
      this.http.get<any[]>('https://hr.gofreefolk.com/stage-metrics.json').subscribe({
        next: (stageData) => {
          console.log('Stage metrics data:', stageData);
          observer.next(stageData);
          observer.complete();
        },
        error: (err) => {
          console.error('Failed to fetch stage metrics from local file:', err);
          observer.error(err);
        }
      });
    });
  }

  getResumes(): Observable<Resume[]> {
    return this.dataSubject.pipe(
      map(data => data?.resumes || [])
    );
  }

  getCandidates(): Observable<Candidate[]> {
    return this.dataSubject.pipe(
      map(data => data?.candidates || [])
    );
  }

  getWeeklyResumeData(): Observable<WeeklyResumeData[]> {
    return this.dataSubject.pipe(
      map(data => data?.weeklyResumeData || [])
    );
  }

  getStageMetrics(): Observable<StageMetrics[]> {
    return this.dataSubject.pipe(
      map(data => data?.stageMetrics || [])
    );
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