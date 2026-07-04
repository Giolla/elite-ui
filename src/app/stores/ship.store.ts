import { inject, Service, signal } from '@angular/core';
import { Ship } from '../models/ship';
import { ApiService } from '../services/api.service';

@Service()
export class ShipStore {
  private apiService = inject(ApiService);
  private _ships = signal<Ship[]>([]);
  readonly ships = this._ships.asReadonly();

  constructor() {
    this.apiService.getShips().subscribe((ships) => {
      this._ships.set(ships);
    });
  }
}
