import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ResumePipelineComponent } from './components/resume-pipeline/resume-pipeline.component';
import { CandidateFunnelComponent } from './components/candidate-funnel/candidate-funnel.component';
import { HiringVelocityComponent } from './components/hiring-velocity/hiring-velocity.component';
import { AIInsightsComponent } from './components/ai-insights/ai-insights.component';
import { AITrainingComponent } from './components/ai-training/ai-training.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'resume-pipeline', component: ResumePipelineComponent },
  { path: 'candidate-funnel', component: CandidateFunnelComponent },
  { path: 'hiring-velocity', component: HiringVelocityComponent },
  { path: 'ai-insights', component: AIInsightsComponent },
  { path: 'ai-training', component: AITrainingComponent },
  { path: '**', redirectTo: '/dashboard' }
];