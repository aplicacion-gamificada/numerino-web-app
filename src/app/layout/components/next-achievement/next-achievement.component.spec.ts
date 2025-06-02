import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextAchievementComponent } from './next-achievement.component';

describe('NextAchievementComponent', () => {
  let component: NextAchievementComponent;
  let fixture: ComponentFixture<NextAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextAchievementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
