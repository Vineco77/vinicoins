import { Routes } from '@angular/router';
import { FlipCoinComponent } from './components/games/flip-coin/flip-coin.component';
import { MinesComponent } from './components/games/mines/mines.component';

export const routes: Routes = [
  {
    path: 'games/flipCoin',
    component: FlipCoinComponent,
  },
  {
    path: 'games/mines',
    component: MinesComponent,
  },
];
