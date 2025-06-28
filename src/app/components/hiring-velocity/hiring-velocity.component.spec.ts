import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HiringVelocityComponent } from './hiring-velocity.component';

describe('HiringVelocityComponent', () => {
	let component: HiringVelocityComponent;
	let fixture: ComponentFixture<HiringVelocityComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [HiringVelocityComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(HiringVelocityComponent);
		component = fixture.componentInstance;
		component.metrics = { hiringVelocity: { timeToAcceptance: 5 } };
		fixture.detectChanges();
	});

	it('should display time to acceptance', () => {
		const compiled = fixture.nativeElement;
		expect(compiled.querySelector('.time-to-acceptance').textContent).toContain('5');
	});

	it('should display 0 if time to acceptance is undefined', () => {
		component.metrics = { hiringVelocity: {} };
		fixture.detectChanges();
		const compiled = fixture.nativeElement;
		expect(compiled.querySelector('.time-to-acceptance').textContent).toContain('0');
	});
});