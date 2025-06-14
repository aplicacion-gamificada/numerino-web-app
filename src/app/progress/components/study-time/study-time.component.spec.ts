import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyTimeComponent } from './study-time.component';

describe('StudyTimeComponent', () => {
  let component: StudyTimeComponent;
  let fixture: ComponentFixture<StudyTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
