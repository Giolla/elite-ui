import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { SpaceShips } from './space-ships';
import { ApiService } from '../../services/api.service';

describe('SpaceShips', () => {
  let component: SpaceShips;
  let fixture: ComponentFixture<SpaceShips>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaceShips],
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: { getShips: () => of([]) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpaceShips);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the ships resource from the store', () => {
    expect(component.ships.value()).toEqual([]);
  });
});
