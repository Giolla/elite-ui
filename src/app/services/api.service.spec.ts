import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ApiService } from './api.service';
import { Ship } from '../models/ship';
import { SongGroup } from '../models/song-group';
import { environment } from '../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should GET the ships list from the ships endpoint', () => {
    const ships = [{ id: 'anaconda', title: 'Anaconda' }] as Ship[];
    let result: Ship[] | undefined;

    service.getShips().subscribe((r) => (result = r));

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/ships`);
    expect(req.request.method).toBe('GET');
    req.flush(ships);

    expect(result).toEqual(ships);
  });

  it('should GET the song groups from the songs endpoint', () => {
    const songs: SongGroup[] = [
      { id: 'ambient', name: 'Ambient', disabled: false, order: 0, songs: [] },
    ];
    let result: SongGroup[] | undefined;

    service.getSongs().subscribe((r) => (result = r));

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/songs`);
    expect(req.request.method).toBe('GET');
    req.flush(songs);

    expect(result).toEqual(songs);
  });
});
