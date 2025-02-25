import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityAssessmentComponent } from './quality-assessment.component';

describe('QualityAssessmentComponent', () => {
  let component: QualityAssessmentComponent;
  let fixture: ComponentFixture<QualityAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualityAssessmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QualityAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
