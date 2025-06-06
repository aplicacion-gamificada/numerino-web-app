import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentClassroomComponent } from './student-classroom.component';

describe('StudentClassroomComponent', () => {
  let component: StudentClassroomComponent;
  let fixture: ComponentFixture<StudentClassroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentClassroomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentClassroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
