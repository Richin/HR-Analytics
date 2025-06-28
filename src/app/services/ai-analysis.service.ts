import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  MessageAnalysis, 
  ResponseAnalysis, 
  AIInsight, 
  DataInsight, 
  TrainingData,
  PerformanceMetric 
} from '../models/chat.interface';

@Injectable({
  providedIn: 'root'
})
export class AIAnalysisService {
  private analysisSubject = new BehaviorSubject<AIInsight[]>([]);
  private performanceSubject = new BehaviorSubject<PerformanceMetric[]>([]);

  analysis$ = this.analysisSubject.asObservable();
  performance$ = this.performanceSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Analyze user message for intent, sentiment, and entities
  analyzeMessage(message: string): Observable<MessageAnalysis> {
    const request = {
      text: message,
      context: 'hr_analytics',
      timestamp: new Date().toISOString()
    };

    return this.http.post<MessageAnalysis>('https://hr.gofreefolk.com/ai/analyze', request).pipe(
      catchError(error => {
        console.log('AI analysis failed, using mock analysis:', error);
        return of(this.getMockMessageAnalysis(message));
      })
    );
  }

  // Analyze bot response for quality and improvements
  analyzeResponse(response: string, userMessage: string): Observable<ResponseAnalysis> {
    const request = {
      userMessage: userMessage,
      botResponse: response,
      context: 'hr_analytics'
    };

    return this.http.post<ResponseAnalysis>('https://hr.gofreefolk.com/ai/analyze-response', request).pipe(
      catchError(error => {
        console.log('Response analysis failed, using mock analysis:', error);
        return of(this.getMockResponseAnalysis(response, userMessage));
      })
    );
  }

  // Generate AI insights based on conversation context
  generateInsights(conversationHistory: any[]): Observable<AIInsight[]> {
    const request = {
      conversations: conversationHistory,
      context: 'hr_analytics',
      timestamp: new Date().toISOString()
    };

    return this.http.post<AIInsight[]>('https://hr.gofreefolk.com/ai/insights', request).pipe(
      catchError(error => {
        console.log('Insights generation failed, using mock insights:', error);
        return of(this.getMockInsights(conversationHistory));
      })
    );
  }

  // Train the AI model with new data
  trainModel(trainingData: TrainingData): Observable<any> {
    return this.http.post('https://hr.gofreefolk.com/ai/train', trainingData).pipe(
      catchError(error => {
        console.log('Training failed:', error);
        return of({ success: false, message: 'Training failed, using mock response' });
      })
    );
  }

  // Get performance metrics
  getPerformanceMetrics(): Observable<PerformanceMetric[]> {
    return this.http.get<PerformanceMetric[]>('https://hr.gofreefolk.com/ai/performance').pipe(
      catchError(error => {
        console.log('Performance metrics failed, using mock data:', error);
        return of(this.getMockPerformanceMetrics());
      })
    );
  }

  // Predict user intent
  predictIntent(message: string): Observable<{ intent: string; confidence: number }> {
    return this.http.post<{ intent: string; confidence: number }>('https://hr.gofreefolk.com/ai/predict', { message }).pipe(
      catchError(error => {
        console.log('Intent prediction failed, using mock prediction:', error);
        return of(this.getMockIntentPrediction(message));
      })
    );
  }

  // Mock implementations
  private getMockMessageAnalysis(message: string): MessageAnalysis {
    const lowerMessage = message.toLowerCase();
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let intent = 'general_inquiry';
    let hrRelevance = 0.5;
    const keywords: string[] = [];
    const entities: any[] = [];

    // Analyze sentiment
    if (lowerMessage.includes('good') || lowerMessage.includes('great') || lowerMessage.includes('excellent')) {
      sentiment = 'positive';
    } else if (lowerMessage.includes('bad') || lowerMessage.includes('poor') || lowerMessage.includes('terrible')) {
      sentiment = 'negative';
    }

    // Extract keywords and entities
    if (lowerMessage.includes('job')) {
      keywords.push('job', 'position', 'opening');
      entities.push({ name: 'job', type: 'position', value: 'job opening', confidence: 0.9 });
      intent = 'job_inquiry';
      hrRelevance = 0.9;
    }

    if (lowerMessage.includes('candidate')) {
      keywords.push('candidate', 'applicant');
      entities.push({ name: 'candidate', type: 'entity', value: 'candidate', confidence: 0.8 });
      intent = 'candidate_inquiry';
      hrRelevance = 0.8;
    }

    if (lowerMessage.includes('metric')) {
      keywords.push('metric', 'analytics', 'data');
      intent = 'metrics_inquiry';
      hrRelevance = 0.9;
    }

    return {
      sentiment,
      keywords,
      intent,
      confidence: 0.85,
      entities,
      hrRelevance
    };
  }

  private getMockResponseAnalysis(response: string, userMessage: string): ResponseAnalysis {
    return {
      responseQuality: 0.88,
      suggestedImprovements: [
        'Add more specific data points',
        'Include actionable next steps',
        'Provide visual context'
      ],
      nextBestActions: [
        'Ask for specific department information',
        'Offer to show detailed metrics',
        'Suggest related queries'
      ],
      dataInsights: [
        {
          metric: 'Response Relevance',
          currentValue: 0.88,
          previousValue: 0.82,
          trend: 'up',
          significance: 0.7,
          recommendation: 'Response quality is improving'
        }
      ]
    };
  }

  private getMockInsights(conversationHistory: any[]): AIInsight[] {
    return [
      {
        type: 'trend',
        title: 'Increasing Job Inquiries',
        description: 'Job-related queries have increased by 25% this week compared to last week.',
        confidence: 0.85,
        actionable: true,
        priority: 'medium'
      },
      {
        type: 'recommendation',
        title: 'Improve Candidate Response Time',
        description: 'Average response time for candidate queries is 3.2 seconds. Consider optimizing for faster responses.',
        confidence: 0.78,
        actionable: true,
        priority: 'high'
      },
      {
        type: 'anomaly',
        title: 'Unusual Metrics Inquiry Pattern',
        description: 'Metrics queries typically peak on Mondays, but this week shows a different pattern.',
        confidence: 0.72,
        actionable: false,
        priority: 'low'
      },
      {
        type: 'prediction',
        title: 'Expected Hiring Surge',
        description: 'Based on current conversation patterns, expect 15% more hiring-related queries next month.',
        confidence: 0.68,
        actionable: true,
        priority: 'medium'
      }
    ];
  }

  private getMockPerformanceMetrics(): PerformanceMetric[] {
    return [
      {
        date: new Date(),
        totalConversations: 156,
        averageSatisfaction: 4.2,
        responseTime: 2.1,
        accuracy: 0.87,
        commonIntents: ['job_inquiry', 'metrics_inquiry', 'candidate_inquiry']
      },
      {
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        totalConversations: 142,
        averageSatisfaction: 4.1,
        responseTime: 2.3,
        accuracy: 0.85,
        commonIntents: ['job_inquiry', 'help_request', 'metrics_inquiry']
      }
    ];
  }

  private getMockIntentPrediction(message: string): { intent: string; confidence: number } {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('job')) {
      return { intent: 'job_inquiry', confidence: 0.9 };
    } else if (lowerMessage.includes('candidate')) {
      return { intent: 'candidate_inquiry', confidence: 0.85 };
    } else if (lowerMessage.includes('metric')) {
      return { intent: 'metrics_inquiry', confidence: 0.88 };
    } else {
      return { intent: 'general_inquiry', confidence: 0.6 };
    }
  }

  // Update insights
  updateInsights(insights: AIInsight[]): void {
    this.analysisSubject.next(insights);
  }

  // Update performance metrics
  updatePerformance(metrics: PerformanceMetric[]): void {
    this.performanceSubject.next(metrics);
  }
} 