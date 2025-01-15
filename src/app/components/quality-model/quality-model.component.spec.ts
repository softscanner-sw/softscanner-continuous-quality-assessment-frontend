import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityModelComponent } from './quality-model.component';

describe('QualityModelComponent', () => {
  let component: QualityModelComponent;
  let fixture: ComponentFixture<QualityModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualityModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QualityModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
