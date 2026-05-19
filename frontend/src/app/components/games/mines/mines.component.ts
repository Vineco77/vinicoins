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
  backImage: 'bomb' | 'dima';
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
    const cardImages: ('bomb' | 'dima')[] = [
      ...Array(9).fill('bomb'),
      ...Array(3).fill('dima'),
    ];

    const shuffledImages = this.shuffleArray(cardImages);

    const newCards: Card[] = Array.from({ length: 12 }, (_, index) => ({
      id: index,
      isFlipped: false,
      backImage: shuffledImages[index],
    }));
    this.cards.set(newCards);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
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
