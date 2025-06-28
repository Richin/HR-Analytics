import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sidebar">
      <!-- Header Section -->
      <div class="sidebar-header">
        <div class="logo-container">
          <div class="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#2563eb"/>
              <path d="M12 10h8v2h-8V10zm0 4h8v2h-8v-2zm0 4h6v2h-6v-2z" fill="white"/>
            </svg>
          </div>
          <div class="logo-text">
            <h1 class="company-name">TalentFlow</h1>
            <p class="company-subtitle">HR Analytics</p>
          </div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <div class="nav-section">
        <div class="nav-group">
          <h3 class="nav-group-title">Analytics</h3>
          <ul class="nav-menu">
            <li class="nav-item">
              <a routerLink="/dashboard" 
                 routerLinkActive="active"
                 [routerLinkActiveOptions]="{exact: true}"
                 class="nav-link">
                <div class="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                </div>
                <span class="nav-text">Dashboard</span>
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/resume-pipeline" 
                 routerLinkActive="active"
                 class="nav-link">
                <div class="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                </div>
                <span class="nav-text">Resume Pipeline</span>
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/candidate-funnel" 
                 routerLinkActive="active"
                 class="nav-link">
                <div class="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </div>
                <span class="nav-text">Candidate Funnel</span>
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/hiring-velocity" 
                 routerLinkActive="active"
                 class="nav-link">
                <div class="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                </div>
                <span class="nav-text">Hiring Velocity</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="https://joyful-panda-1f1f02.netlify.app/" 
                 target="_blank"
                 class="nav-link">
                <div class="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <span class="nav-text">Interview Analyzer</span>
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/ai-insights" 
                 routerLinkActive="active"
                 class="nav-link">
                <div class="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 11H1l8-8 8 8h-8v8z"/>
                    <path d="M21 13h-8v8"/>
                  </svg>
                </div>
                <span class="nav-text">AI Insights</span>
              </a>
            </li>

          </ul>
        </div>

        <div class="nav-group">
          <h3 class="nav-group-title">Management</h3>
          <ul class="nav-menu">
            <li class="nav-item">
              <a routerLink="/candidates" 
                 routerLinkActive="active"
                 class="nav-link">
                <div class="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <span class="nav-text">Candidates</span>
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/job-postings" 
                 routerLinkActive="active"
                 class="nav-link">
                <div class="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <span class="nav-text">Job Postings</span>
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/interviews" 
                 routerLinkActive="active"
                 class="nav-link">
                <div class="nav-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <span class="nav-text">Interviews</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- User Profile Section -->
      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="user-avatar">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format" 
                 alt="User Avatar" 
                 class="avatar-img">
          </div>
          <div class="user-info">
            <p class="user-name">John Smith</p>
            <p class="user-role">HR Manager</p>
          </div>
          <button class="settings-btn" title="Settings">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      min-height: 100vh;
      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    /* Header Section */
    .sidebar-header {
      padding: 24px 20px;
      border-bottom: 1px solid #e2e8f0;
      background: white;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      flex-shrink: 0;
    }

    .logo-text {
      flex: 1;
    }

    .company-name {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
      line-height: 1.2;
    }

    .company-subtitle {
      font-size: 13px;
      color: #64748b;
      margin: 2px 0 0 0;
      font-weight: 500;
    }

    /* Navigation Section */
    .nav-section {
      flex: 1;
      padding: 20px 0;
      overflow-y: auto;
    }

    .nav-group {
      margin-bottom: 32px;
    }

    .nav-group:last-child {
      margin-bottom: 0;
    }

    .nav-group-title {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 12px 20px;
      padding-left: 4px;
    }

    .nav-menu {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-item {
      margin-bottom: 2px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      color: #475569;
      text-decoration: none;
      transition: all 0.2s ease;
      border-radius: 0;
      position: relative;
      font-weight: 500;
      font-size: 14px;
    }

    .nav-link:hover {
      background-color: #f1f5f9;
      color: #2563eb;
    }

    .nav-link.active {
      background-color: #eff6ff;
      color: #2563eb;
      border-right: 3px solid #2563eb;
      font-weight: 600;
    }

    .nav-link.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background-color: #2563eb;
    }

    .nav-icon {
      margin-right: 12px;
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .nav-text {
      flex: 1;
    }

    /* Footer Section */
    .sidebar-footer {
      padding: 20px;
      border-top: 1px solid #e2e8f0;
      background: white;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 12px;
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
    }

    .user-avatar {
      flex-shrink: 0;
    }

    .avatar-img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #e2e8f0;
    }

    .user-info {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
      line-height: 1.2;
    }

    .user-role {
      font-size: 12px;
      color: #64748b;
      margin: 2px 0 0 0;
    }

    .settings-btn {
      background: none;
      border: none;
      padding: 8px;
      border-radius: 6px;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .settings-btn:hover {
      background-color: #e2e8f0;
      color: #475569;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }

      .sidebar.open {
        transform: translateX(0);
      }
    }

    /* Scrollbar Styling */
    .nav-section::-webkit-scrollbar {
      width: 4px;
    }

    .nav-section::-webkit-scrollbar-track {
      background: transparent;
    }

    .nav-section::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 2px;
    }

    .nav-section::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `]
})
export class SidebarComponent {}