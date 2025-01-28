import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsibleGoalPanelsComponent } from './collapsible-goal-panels.component';

describe('CollapsibleGoalPanelsComponent', () => {
  let component: CollapsibleGoalPanelsComponent;
  let fixture: ComponentFixture<CollapsibleGoalPanelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollapsibleGoalPanelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollapsibleGoalPanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
