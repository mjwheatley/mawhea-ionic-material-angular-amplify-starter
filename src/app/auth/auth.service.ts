import { Injectable } from '@angular/core';
import { Auth, Hub, Logger } from 'aws-amplify';
import { SessionService } from '../services';
import { ActivatedRoute, Router } from '@angular/router';
const logger = new Logger(`AuthServiceLogger`);

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn: boolean;

  constructor(
    private router: Router,
    private session: SessionService,
    private route: ActivatedRoute
  ) {
    Hub.listen('auth', async (data) => {
      logger.debug(`Amplify Auth Hub event`, data.payload.event);
      switch (data.payload.event) {
        case 'signIn':
          logger.debug('user signed in');
          const user = data.payload.data.attributes;
          await this.session.updateUser(user);
          this.isLoggedIn = true;
          const { queryParams } = this.route.snapshot;
          const { redirect = `/home` } = queryParams;
          await this.router.navigate([redirect]);
          break;
        case 'signUp':
          logger.debug('user signed up');
          break;
        case 'signOut':
          logger.debug('user signed out');
          this.isLoggedIn = false;
          await this.session.updateUser({});
          await this.router.navigate([`/login`]);
          break;
        case 'signIn_failure':
          logger.debug('user sign in failed');
          break;
        case 'configured':
          logger.debug('the Auth module is configured');
      }
    });
    this.currentAuthenticatedUser();
  }

  public isAuthenticated() {
    logger.debug(`AuthService.isAuthenticated()`, this.isLoggedIn);
    return this.isLoggedIn;
  }

  public currentAuthenticatedUser(): void {
    this.session.set(`isAuthServiceInit`, true);
    Auth.currentAuthenticatedUser().then(async (user: any) => {
      logger.debug(`AuthService.currentAuthenticatedUser()`, user);
      this.isLoggedIn = true;
      await this.session.updateUser(user.attributes);
    }).catch(async (error) => {
      logger.debug(`Auth.currentAuthenticatedUser() Error`, error);
      this.isLoggedIn = false;
      await this.session.updateUser({});
    });
  }
}
