import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { routes } from './app/app.routes';
import { SidebarComponent } from './app/components/sidebar/sidebar.component';
import { ChatbotComponent } from './app/components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, ChatbotComponent],
  template: `
    <div class="app-layout">
      <app-sidebar></app-sidebar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-chatbot></app-chatbot>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
    }
  `]
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});