import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { SnackService } from '../services/snack.service';

/**
 * NOTE: Angular fire already provides a AuthGuard with some nice features in their repo at: src\auth-guard\auth-guard.ts
 *       If you ever need to do something custom you should try to build on top of it.
 * A guard used for preventing unauthenticated users form accessing routes.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private snack: SnackService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const user = await this.auth.currentUser;
    const isLoggedIn = !!user;

    if (!isLoggedIn) {
      this.snack.authError();
    }

    return isLoggedIn;
  }
}
