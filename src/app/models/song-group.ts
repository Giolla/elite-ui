import { Song } from './song';

export interface SongGroup {
  id: string;
  name: string;
  disabled: boolean;
  order: number;
  songs: Song[];
}
