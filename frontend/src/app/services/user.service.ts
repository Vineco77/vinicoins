import { Injectable, signal } from '@angular/core';
import { IUser } from '../domain/models/user.model';

const USER_STORAGE_KEY = 'vinicoins.user';
const DEFAULT_VINI_COINS = 30;

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly userState = signal<IUser>(this.loadUser());

  readonly user = this.userState.asReadonly();

  setViniCoins(viniCoins: number): void {
    this.updateUser({
      ...this.userState(),
      viniCoins: this.normalizeViniCoins(viniCoins),
    });
  }

  addViniCoins(amount: number): void {
    this.updateUser({
      ...this.userState(),
      viniCoins: this.normalizeViniCoins(this.userState().viniCoins + amount),
    });
  }

  subtractViniCoins(amount: number): void {
    this.updateUser({
      ...this.userState(),
      viniCoins: this.normalizeViniCoins(
        Math.max(0, this.userState().viniCoins - amount),
      ),
    });
  }

  resetWithStartingBalance(): void {
    this.updateUser({
      name: this.userState().name || 'Player',
      viniCoins: this.normalizeViniCoins(DEFAULT_VINI_COINS),
    });
  }

  private updateUser(user: IUser): void {
    this.userState.set(user);
    this.saveUser(user);
  }

  private loadUser(): IUser {
    if (typeof localStorage === 'undefined') {
      return {
        name: 'Player',
        viniCoins: this.normalizeViniCoins(DEFAULT_VINI_COINS),
      };
    }

    const rawUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!rawUser) {
      const defaultUser = {
        name: 'Player',
        viniCoins: this.normalizeViniCoins(DEFAULT_VINI_COINS),
      };
      this.saveUser(defaultUser);

      return defaultUser;
    }

    try {
      const parsedUser = JSON.parse(rawUser) as Partial<IUser>;

      return {
        name: parsedUser.name || 'Player',
        viniCoins: this.normalizeViniCoins(
          typeof parsedUser.viniCoins === 'number'
            ? parsedUser.viniCoins
            : DEFAULT_VINI_COINS,
        ),
      };
    } catch {
      const fallbackUser = {
        name: 'Player',
        viniCoins: this.normalizeViniCoins(DEFAULT_VINI_COINS),
      };
      this.saveUser(fallbackUser);

      return fallbackUser;
    }
  }

  private saveUser(user: IUser): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  private normalizeViniCoins(viniCoins: number): number {
    return Math.round(viniCoins * 100) / 100;
  }
}
