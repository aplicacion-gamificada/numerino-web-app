import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementSummaryComponent } from './achievement-summary.component';

describe('AchievementSummaryComponent', () => {
  let component: AchievementSummaryComponent;
  let fixture: ComponentFixture<AchievementSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchievementSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
