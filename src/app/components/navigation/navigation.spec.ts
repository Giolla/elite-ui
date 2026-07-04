import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Navigation } from './navigation';

describe('Navigation', () => {
  let component: Navigation;
  let fixture: ComponentFixture<Navigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navigation],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
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
