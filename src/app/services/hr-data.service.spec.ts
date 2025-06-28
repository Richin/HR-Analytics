import { TestBed } from '@angular/core/testing';
import { HrDataService } from './hr-data.service';

describe('HrDataService', () => {
	let service: HrDataService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(HrDataService);
	});

	it('should return default metrics when metrics is undefined', () => {
		const metrics = service.getMetrics();
		expect(metrics).toBeDefined();
		expect(metrics.hiringVelocity).toBeDefined();
		expect(metrics.resumeMetrics).toBeDefined();
		expect(metrics.hiringVelocity.timeToAcceptance).toBe(0);
		expect(metrics.resumeMetrics.totalResumes).toBe(0);
		expect(metrics.resumeMetrics.todayInflow).toBe(0);
		expect(metrics.resumeMetrics.unprocessed).toBe(0);
		expect(metrics.resumeMetrics.duplicates).toBe(0);
	});
});