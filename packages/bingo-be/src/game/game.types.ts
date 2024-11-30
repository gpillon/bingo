
import * as italian from './variants/Italian.json';
import * as english from './variants/English.json';
import * as napoletana from './variants/Napoletana.json';

export enum IGameStatus {
  RUNNING = 'Running',
  CLOSED = 'Closed',
  CREATED = 'Created',
}

export enum IGameVariant {
  ITALIAN = 'Italian',
  ENGLISH = 'English',
  NAPOLETANA = 'Napoletana',
}


export const VARIANTS: { [k in IGameVariant]: any } = {
  Italian: italian,
  English: english,
  Napoletana: napoletana,
};
