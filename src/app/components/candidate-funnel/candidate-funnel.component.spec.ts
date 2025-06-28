const { ComponentFixture, TestBed } = require('@angular/core/testing');
const { CandidateFunnelComponent } = require('./candidate-funnel.component');

describe('CandidateFunnelComponent', () => {
	let component: CandidateFunnelComponent;
	let fixture: ComponentFixture<CandidateFunnelComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CandidateFunnelComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CandidateFunnelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});