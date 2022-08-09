/* eslint-disable @typescript-eslint/naming-convention */
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Auth, Hub, Logger } from 'aws-amplify';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {
  AppComponentUtils,
  AuthService,
  ICognitoUserAttributes,
  SessionService,
  TranslateNpmModulesService
} from '@mawhea/ngx-core';
import { Constants } from './Constants';
import { ActivatedRoute, Router } from '@angular/router';

const logger = new Logger(`AppComponent`);

interface IAppPage {
  title: string;
  url: string;
  icon: string;
  isHidden?: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public isDarkMode: boolean;
  public user: ICognitoUserAttributes;
  public appPages: IAppPage[] = [];
  private userSub: Subscription;
  private darkModeSessionSub: Subscription | undefined;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private session: SessionService,
    private zone: NgZone,
    private translate: TranslateService,
    private translateNpmModulesService: TranslateNpmModulesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    Hub.listen('auth', async (data) => {
      logger.debug(`Amplify Auth Hub event`, data.payload.event);
      switch (data.payload.event) {
        case 'signIn':
          logger.debug('user signed in');
          const user = data.payload.data.attributes;
          this.authService.isAuthenticated = true;
          await this.session.updateUser(user);
          const { queryParams } = this.route.snapshot;
          logger.debug(`queryParams`, queryParams);
          const { redirect = `/home` } = queryParams;
          await this.router.navigate([redirect]);
          break;
        case 'signUp':
          logger.debug('user signed up');
          break;
        case 'signOut':
          logger.debug('user signed out');
          // this.authService.updateAuthenticationStatus();
          this.authService.isAuthenticated = false;
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
  }

  async ngOnInit() {
    AppComponentUtils.initializeTranslateServiceConfig({
      translateService: this.translate,
      translateNpmModulesService: this.translateNpmModulesService,
      translateModules: [`ngx-core`, `ngx-amplify-auth-ui`]
    });
    await this.subscribeToUser();
    this.updateMenuOptions();
    const darkModePref = AppComponentUtils.listenForDarkModePref();
    this.subscribeToDarkModeSession(darkModePref);
    this.subscribeToDarkModeSession(true);
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.darkModeSessionSub) {
      this.darkModeSessionSub.unsubscribe();
    }
  }

  async signOut() {
    await Auth.signOut();
    this.authService.updateAuthenticationStatus();
  }

  public async onChangeDarkMode() {
    await AppComponentUtils.toggleDarkTheme({
      isDarkMode: this.isDarkMode
    });
    await this.session.setPersistent(Constants.SESSION.IS_DARK_MODE, this.isDarkMode);
  }

  private updateMenuOptions() {
    this.zone.run(() => {
      this.appPages = [
        {
          title: 'Sign In',
          url: '/login',
          icon: 'log-in',
          isHidden: !!this.user.sub
        },
        {
          title: 'Home',
          url: '/home',
          icon: 'home',
          isHidden: !this.user.sub
        }
        // {
        //   title: 'Account Menu',
        //   url: '/account-menu',
        //   icon: 'settings',
        //   isHidden: !this.user.sub
        // }
      ];
    });
  }

  private async subscribeToUser() {
    this.user = this.session.getUser();
    console.log(`user`, this.user);
    if (this.user.sub) {

    }
    this.userSub = this.session.getUserAsObservable().subscribe(async (user: any) => {
      await this.zone.run(async () => {
        console.log(`user updated`, user);
        this.user = user;
        this.updateMenuOptions();
      });
    });
  }

  private subscribeToDarkModeSession(darkModePref?: boolean) {
    this.isDarkMode = this.session.get(Constants.SESSION.IS_DARK_MODE);
    this.darkModeSessionSub = this.session.getSessionAsObservable().subscribe(async (session) => {
      await this.zone.run(async () => {
        this.isDarkMode = session[Constants.SESSION.IS_DARK_MODE];
        if (this.isDarkMode === undefined) {
          this.isDarkMode = darkModePref;
          await this.session.setPersistent(Constants.SESSION.IS_DARK_MODE, this.isDarkMode);
        }
        AppComponentUtils.toggleDarkTheme({
          isDarkMode: this.isDarkMode
        });
      });
    });
  }
}
