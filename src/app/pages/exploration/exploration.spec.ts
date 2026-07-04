import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Exploration } from './exploration';

describe('Exploration', () => {
  let component: Exploration;
  let fixture: ComponentFixture<Exploration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Exploration],
    }).compileComponents();

    fixture = TestBed.createComponent(Exploration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
