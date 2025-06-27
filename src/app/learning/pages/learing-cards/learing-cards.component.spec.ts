import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearingCardsComponent } from './learing-cards.component';

describe('LearingCardsComponent', () => {
  let component: LearingCardsComponent;
  let fixture: ComponentFixture<LearingCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearingCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearingCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
