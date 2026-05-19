import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Card {
  id: number;
  isFlipped: boolean;
}

@Component({
  selector: 'app-mines',
  standalone: true,
  imports: [CommonModule],
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
  cards = signal<Card[]>([]);

  constructor() {
    this.initializeCards();
  }

  private initializeCards() {
    const newCards: Card[] = Array.from({ length: 12 }, (_, index) => ({
      id: index,
      isFlipped: false,
    }));
    this.cards.set(newCards);
  }

  toggleFlip(cardId: number) {
    this.cards.update((cardList) =>
      cardList.map((card) =>
        card.id === cardId ? { ...card, isFlipped: !card.isFlipped } : card,
      ),
    );
  }

  trackByCardId(index: number, card: Card): number {
    return card.id;
  }
}
