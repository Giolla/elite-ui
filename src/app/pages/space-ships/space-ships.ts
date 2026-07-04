import { Component, inject, input } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { ShipStore } from '../../stores/ship.store';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-space-ships',
  imports: [MatGridListModule, NgOptimizedImage, RouterLink],
  templateUrl: './space-ships.html',
  styleUrl: './space-ships.css',
})
export class SpaceShips {
  isDropDown = input(false);
  store = inject(ShipStore);
  ships = this.store.ships;
}
