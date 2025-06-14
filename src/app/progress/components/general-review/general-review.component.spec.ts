import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralReviewComponent } from './general-review.component';

describe('GeneralReviewComponent', () => {
  let component: GeneralReviewComponent;
  let fixture: ComponentFixture<GeneralReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
