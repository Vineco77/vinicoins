import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-mines',
  standalone: true,
  animations: [
    trigger('flipState', [
      state('active', style({ transform: 'rotateY(179.9deg)' })),
      state('inactive', style({ transform: 'rotateY(0)' })),
      transition('active <=> inactive', animate('500ms ease-out')),
    ]),
  ],
  templateUrl: './mines.component.html',
  styleUrl: './mines.component.scss',
})
export class MinesComponent {
  isFlipped = signal('inactive');

  toggleFlip() {
    this.isFlipped.update((val) =>
      val === 'inactive' ? 'active' : 'inactive',
    );
  }
}
