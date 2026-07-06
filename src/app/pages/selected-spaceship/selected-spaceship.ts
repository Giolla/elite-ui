import { Component, computed, inject, input, signal } from '@angular/core';
import { ShipStore } from '../../stores/ship.store';
import { Ship } from '../../models/ship';
import { Lightbox } from '../../components/lightbox/lightbox';
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: 'app-selected-spaceship',
  imports: [Lightbox, NgOptimizedImage],
  templateUrl: './selected-spaceship.html',
  styleUrl: './selected-spaceship.css',
})
export class SelectedSpaceship {
  private store = inject(ShipStore);

  id = input<string>();

  selectedSpaceShip = computed(() => {
    const shipId = this.id();
    return this.store.ships.value().find((ship: Ship) => ship.id === shipId);
  });

  activeImageIndex = signal<number | null>(null);
  lightboxImages = signal<string[]>([]);

  openLightbox(images: string[], index: number) {
    this.lightboxImages.set(images);
    this.activeImageIndex.set(index);
  }
}
