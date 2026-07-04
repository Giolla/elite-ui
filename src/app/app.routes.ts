import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { SpaceShips } from './pages/space-ships/space-ships';
import { SelectedSpaceship } from './pages/selected-spaceship/selected-spaceship';
import { Aliens } from './pages/aliens/aliens';
import { Exploration } from './pages/exploration/exploration';
import { Commerce } from './pages/commerce/commerce';
import { Factions } from './pages/factions/factions';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'space-ships',
    component: SpaceShips,
  },
  {
    path: 'selected-space-ship/:id',
    component: SelectedSpaceship,
  },
  {
    path: 'exploration',
    component: Exploration,
  },
  {
    path: 'aliens',
    component: Aliens,
  },
  {
    path: 'commerce',
    component: Commerce,
  },
  {
    path: 'factions',
    component: Factions,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
