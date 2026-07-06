import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Navigation } from './navigation';
import { ApiService } from '../../services/api.service';

describe('Navigation', () => {
  let component: Navigation;
  let fixture: ComponentFixture<Navigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navigation],
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: { getShips: () => of([]) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Navigation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start collapsed', () => {
    expect(component.collapsed()).toBe(true);
  });

  it('should widen the sidenav when expanded', () => {
    const collapsedWidth = component.sideNavWidth();
    component.toggleCollapse();
    expect(component.collapsed()).toBe(false);
    expect(component.sideNavWidth()).not.toBe(collapsedWidth);
  });
});
