import { inject, Service, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Ship } from '../models/ship';
import { ApiService } from '../services/api.service';

@Service()
export class ShipStore {
  private apiService = inject(ApiService);

  ships = rxResource({
    stream: () => this.apiService.getShips(),
    defaultValue: [] as Ship[],
  });
}
