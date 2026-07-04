import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedSpaceship } from './selected-spaceship';

describe('SelectedSpaceship', () => {
  let component: SelectedSpaceship;
  let fixture: ComponentFixture<SelectedSpaceship>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedSpaceship],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectedSpaceship);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
