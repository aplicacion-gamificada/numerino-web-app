import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaNivelesComponent } from './vista-niveles.component';

describe('VistaNivelesComponent', () => {
  let component: VistaNivelesComponent;
  let fixture: ComponentFixture<VistaNivelesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaNivelesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaNivelesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
