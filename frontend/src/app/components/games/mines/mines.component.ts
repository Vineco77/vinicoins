import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { MINES_CONFIG } from '../../../domain/models/mines.model';

interface Card {
  id: number;
  isFlipped: boolean;
  backImage: string;
  isDiamond: boolean;
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
  betAmount = signal(30);
  currentBet = signal(0);
  diamondsFound = signal(0);
  roundActive = signal(false);
  roundMessage = signal('Choose a bet and start a round.');

  constructor(public readonly userService: UserService) {
    this.initializeCards();
  }

  formatViniCoins(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      minimumIntegerDigits: 2,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  onBetAmountChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const nextBet = Number(input.value);

    this.betAmount.set(
      Number.isFinite(nextBet) && nextBet > 0 ? Math.floor(nextBet) : 0,
    );
  }

  startNewGame(): void {
    const bet = Math.floor(this.betAmount());
    const balance = this.userService.user().viniCoins;

    if (bet <= 0) {
      this.roundMessage.set('Enter a bet greater than 0.');
      return;
    }

    if (bet > balance) {
      this.roundMessage.set(`You only have ${balance} ViniCoins available.`);
      return;
    }

    this.betAmount.set(bet);
    this.currentBet.set(bet);
    this.diamondsFound.set(0);
    this.roundActive.set(true);
    this.roundMessage.set('Find 3 diamonds in a row to win 30% of your bet.');
    this.initializeCards();
  }

  private initializeCards(): void {
    const newCards: Card[] = Array.from(
      { length: MINES_CONFIG.cards },
      (_, index) => ({
        id: index,
        isFlipped: false,
        backImage: '',
        isDiamond: false,
      }),
    );

    const cardTypes = Array(MINES_CONFIG.diamonds)
      .fill(true)
      .concat(Array(MINES_CONFIG.bombs).fill(false));

    for (let i = cardTypes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardTypes[i], cardTypes[j]] = [cardTypes[j], cardTypes[i]];
    }

    newCards.forEach((card, index) => {
      card.isDiamond = cardTypes[index];
      card.backImage = `assets/${card.isDiamond ? 'dima.png' : 'bomb.png'}`;
    });

    this.cards.set(newCards);
  }

  toggleFlip(cardId: number): void {
    if (!this.roundActive()) {
      return;
    }

    const selectedCard = this.cards().find((card) => card.id === cardId);

    if (!selectedCard || selectedCard.isFlipped) {
      return;
    }

    this.cards.update((cardList) =>
      cardList.map((card) =>
        card.id === cardId ? { ...card, isFlipped: true } : card,
      ),
    );

    if (selectedCard.isDiamond) {
      this.handleDiamondPick();
      return;
    }

    this.handleBombPick();
  }

  private handleDiamondPick(): void {
    const nextDiamondCount = this.diamondsFound() + 1;

    this.diamondsFound.set(nextDiamondCount);

    if (nextDiamondCount >= 3) {
      this.resolveWin();
      return;
    }

    this.roundMessage.set(`Diamond ${nextDiamondCount}/3. Keep going.`);
  }

  private handleBombPick(): void {
    this.resolveLoss();
  }

  private resolveWin(): void {
    const reward = this.currentBet() * 0.3;

    this.roundActive.set(false);
    this.revealAllCards();
    this.userService.addViniCoins(reward);
    this.roundMessage.set(
      `You found 3 diamonds in a row and won ${this.formatViniCoins(reward)} ViniCoins.`,
    );
  }

  private resolveLoss(): void {
    const loss = this.currentBet();

    this.roundActive.set(false);
    this.revealAllCards();
    this.userService.subtractViniCoins(loss);
    this.roundMessage.set(
      `Bomb! You lost ${this.formatViniCoins(loss)} ViniCoins.`,
    );
  }

  private revealAllCards(): void {
    this.cards.update((cardList) =>
      cardList.map((card) => ({
        ...card,
        isFlipped: true,
      })),
    );
  }

  trackByCardId(index: number, card: Card): number {
    return card.id;
  }
}
