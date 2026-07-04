import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { SpaceShips } from '../../pages/space-ships/space-ships';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatTooltipModule,
    RouterLink,
    RouterOutlet,
    SpaceShips,
  ],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css'],
})
export class Navigation {
  protected readonly isMobile = signal(true);

  private readonly media = inject(MediaMatcher);
  private _mobileQuery?: MediaQueryList;

  collapsed = signal<boolean>(true);
  sideNavWidth = computed(() => (this.collapsed() ? '50px' : '240px'));

  constructor() {
    afterNextRender(() => {
      this._mobileQuery = this.media.matchMedia('(max-width: 600px)');
      this.isMobile.set(this._mobileQuery.matches);
      this._mobileQuery.addEventListener('change', (e) => this.isMobile.set(e.matches));
    });
  }

  navItems = [
    { icon: 'rocket', label: 'Ships', route: '/space-ships' },
    { icon: 'attach_money', label: 'Commerce', route: '/commerce' },
    { icon: 'group', label: 'Factions', route: '/factions' },
    { icon: 'explore', label: 'Exploration', route: '/exploration' },
    { icon: 'toys', label: 'Aliens', route: '/aliens' },
  ];

  toggleCollapse() {
    this.collapsed.set(!this.collapsed());
  }
}
