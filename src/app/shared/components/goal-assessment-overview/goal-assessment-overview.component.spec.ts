import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalAssessmentOverviewComponent } from './goal-assessment-overview.component';

describe('GoalAssessmentOverviewComponent', () => {
  let component: GoalAssessmentOverviewComponent;
  let fixture: ComponentFixture<GoalAssessmentOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalAssessmentOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoalAssessmentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
