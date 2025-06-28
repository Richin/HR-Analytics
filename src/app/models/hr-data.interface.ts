export interface JobDescription {
  id: string;
  title: string;
  department: string;
  status: 'open' | 'closed';
  createdDate: Date;
  daysOpen: number;
  applicantsCount: number;
  location: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Resume {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  submittedDate: Date;
  status: 'unprocessed' | 'processed' | 'duplicate';
  jobId: string;
  source: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  jobId: string;
  currentStage: 'applied' | 'screened' | 'shortlisted' | 'interviewed' | 'hr_round' | 'offered' | 'rejected' | 'withdrawn';
  stageHistory: StageHistory[];
  demographics: {
    age: number;
    gender: string;
    location: string;
    experience: number;
    education: string;
  };
}

export interface StageHistory {
  stage: string;
  date: Date;
  daysInStage: number;
  outcome: 'passed' | 'failed' | 'pending';
}

export interface HiringMetrics {
  totalJobDescriptions: number;
  openPositions: number;
  closedPositions: number;
  agingJobs: {
    thirtyPlus: number;
    sixtyPlus: number;
    ninetyPlus: number;
  };
  attentionRequired: {
    noApplicants: number;
    agingBeyondSixty: number;
  };
  resumeMetrics: {
    totalResumes: number;
    todayInflow: number;
    unprocessed: number;
    duplicates: number;
  };
  hiringVelocity: {
    avgTimeToFill: number;
    timeToFirstInterview: number;
    timeToOffer: number;
    timeToAcceptance: number;
  };
  currentStatus: {
    rejected: number;
    withdrawn: number;
    offersMade: number;
    inProcess: number;
  };
}

export interface WeeklyResumeData {
  week: string;
  count: number;
}

export interface StageMetrics {
  stage: string;
  count: number;
  dropoffRate: number;
  avgDays: number;
}