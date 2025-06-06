import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementCardExpandedComponent } from './achievement-card-expanded.component';

describe('AchievementCardExpandedComponent', () => {
  let component: AchievementCardExpandedComponent;
  let fixture: ComponentFixture<AchievementCardExpandedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementCardExpandedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchievementCardExpandedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
