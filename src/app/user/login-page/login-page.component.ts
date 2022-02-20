import { Component } from '@angular/core';
import { Auth, authState, signOut, User } from '@angular/fire/auth';
import { EMPTY, Observable } from 'rxjs';

/**
 * Displays the diferent ways of login and signup, or the current user
 * in case he is already logged in.
 */
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  public readonly user$: Observable<User | null> = EMPTY;

  constructor(public auth: Auth) {
    if (auth) {
      this.user$ = authState(this.auth);
      // TODO: Test fire performance package
      // authState(this.auth)
      //   .pipe(
      //     traceUntilFirst('auth'),
      //     map((u) => !!u)
      //   )
      //   .subscribe((isLoggedIn) => {
      //     console.warn('sub', isLoggedIn);
      //     this.isLoggedIn = isLoggedIn as boolean;
      //   });
    }
  }

  async logout() {
    return await signOut(this.auth);
  }
}
