import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { SpaceShips } from './space-ships';

describe('SpaceShips', () => {
  let component: SpaceShips;
  let fixture: ComponentFixture<SpaceShips>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaceShips],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SpaceShips);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the ships signal from the store', () => {
    expect(component.ships.value()).toEqual([]);
  });
});
