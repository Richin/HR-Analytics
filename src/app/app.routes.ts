import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ResumePipelineComponent } from './components/resume-pipeline/resume-pipeline.component';
import { CandidateFunnelComponent } from './components/candidate-funnel/candidate-funnel.component';
import { HiringVelocityComponent } from './components/hiring-velocity/hiring-velocity.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'resume-pipeline', component: ResumePipelineComponent },
  { path: 'candidate-funnel', component: CandidateFunnelComponent },
  { path: 'hiring-velocity', component: HiringVelocityComponent },
  { path: '**', redirectTo: '/dashboard' }
];