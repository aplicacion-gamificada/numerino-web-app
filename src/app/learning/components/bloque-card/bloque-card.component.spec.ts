import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloqueCardComponent } from './bloque-card.component';

describe('BloqueCardComponent', () => {
  let component: BloqueCardComponent;
  let fixture: ComponentFixture<BloqueCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloqueCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloqueCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
