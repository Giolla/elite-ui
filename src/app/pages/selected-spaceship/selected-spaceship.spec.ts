import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { SelectedSpaceship } from './selected-spaceship';
import { ApiService } from '../../services/api.service';

describe('SelectedSpaceship', () => {
  let component: SelectedSpaceship;
  let fixture: ComponentFixture<SelectedSpaceship>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedSpaceship],
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: { getShips: () => of([]) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectedSpaceship);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
