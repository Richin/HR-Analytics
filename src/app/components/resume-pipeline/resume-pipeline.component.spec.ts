import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumePipelineComponent } from './resume-pipeline.component';

describe('ResumePipelineComponent', () => {
	let component: ResumePipelineComponent;
	let fixture: ComponentFixture<ResumePipelineComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ResumePipelineComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(ResumePipelineComponent);
		component = fixture.componentInstance;
	});

	it('should handle undefined metrics gracefully', () => {
		component.metrics = undefined;
		fixture.detectChanges();
		expect(component.metrics).toBeUndefined();
	});

	it('should display 0 for unprocessed resumes when metrics is undefined', () => {
		component.metrics = undefined;
		fixture.detectChanges();
		const compiled = fixture.nativeElement;
		expect(compiled.querySelector('.unprocessed').textContent).toContain('0');
	});

	it('should display 0 for duplicates when metrics is undefined', () => {
		component.metrics = undefined;
		fixture.detectChanges();
		const compiled = fixture.nativeElement;
		expect(compiled.querySelector('.duplicates').textContent).toContain('0');
	});
});