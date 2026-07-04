import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Ship } from '../models/ship';
import { SongGroup } from '../models/song-group';
import { environment } from '../../environments/environment';

@Service()
export class ApiService {
  API_URL = environment.apiBaseUrl;
  private httpClient = inject(HttpClient);

  getShips(): Observable<Ship[]> {
    return this.GET('ships');
  }

  getSongs(): Observable<SongGroup[]> {
    return this.GET('songs');
  }

  private GET<T>(endpoint: string, params?: any): Observable<T> {
    return this.httpClient.get<T>(`${this.API_URL}/${endpoint}`, { params });
  }
}
