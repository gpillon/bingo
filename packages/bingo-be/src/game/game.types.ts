import * as italian from './variants/Italian.json';
import * as english from './variants/English.json';
import * as napoletana from './variants/Napoletana.json';
import * as romano from './variants/Romano.json';
import * as milanese from './variants/Milanese.json';
import * as redHat from './variants/RedHat.json';
import * as redHatIta from './variants/RedHatIta.json';
export interface IGameVariantT {
  name: string;
  min: number;
  max: number;
  cardNumbers: number;
  labels: { [key: string]: string };
}

export enum IGameStatus {
  RUNNING = 'Running',
  CLOSED = 'Closed',
  CREATED = 'Created',
}

export enum IGameVariant {
  REDHAT = 'RedHat',
  REDHATITA = 'RedHatIta',
  ITALIAN = 'Italian',
  ENGLISH = 'English',
  NAPOLETANA = 'Napoletana',
  ROMANO = 'Romano',
  MILANESE = 'Milanese',
}

export const VARIANTS: { [k in IGameVariant]: IGameVariantT } = {
  RedHat: redHat,
  RedHatIta: redHatIta,
  Italian: italian,
  English: english,
  Napoletana: napoletana,
  Romano: romano,
  Milanese: milanese,
};
