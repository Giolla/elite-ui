import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Factions } from './factions';

describe('Factions', () => {
  let component: Factions;
  let fixture: ComponentFixture<Factions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Factions],
    }).compileComponents();

    fixture = TestBed.createComponent(Factions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
