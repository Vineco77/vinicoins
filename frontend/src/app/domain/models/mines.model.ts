import { IBet } from './bet.model';

export const MINES_CONFIG = {
  cards: 12,
  bombs: 6,
  diamonds: 6,
  rounds: 3,
} as const;

export interface IMines extends Pick<IBet, 'viniCoinsAmount'> {
  cards: typeof MINES_CONFIG.cards;
  bombs: typeof MINES_CONFIG.bombs;
  diamonds: typeof MINES_CONFIG.diamonds;
  rounds: typeof MINES_CONFIG.rounds;
  result: 'vitoria' | 'derrota';
}
