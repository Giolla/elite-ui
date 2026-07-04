import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aliens } from './aliens';

describe('Aliens', () => {
  let component: Aliens;
  let fixture: ComponentFixture<Aliens>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aliens],
    }).compileComponents();

    fixture = TestBed.createComponent(Aliens);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
