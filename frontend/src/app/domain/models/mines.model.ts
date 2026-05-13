import { IBet } from './bet.model';

export interface IMines extends Pick<IBet, 'viniCoinsAmount'> {
  cards: 12;
  bombs: 3;
  diamonds: 9;
  rounds: 3;
  result: 'vitoria' | 'derrota';
}
