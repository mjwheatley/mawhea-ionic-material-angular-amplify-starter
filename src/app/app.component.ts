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
import { ZenObservable } from 'zen-observable-ts';

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
  private onUpdateCognitoUserListener: ZenObservable.Subscription;

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
          const user = data.payload.data.attributes || {};
          this.authService.isAuthenticated = true;
          const { queryParams } = this.route.snapshot;
          logger.debug(`queryParams`, queryParams);
          const { redirect = `/home` } = queryParams;
          await this.router.navigate([redirect]);
          await this.setupUser(user);
          break;
        case 'signUp':
          logger.debug('user signed up');
          break;
        case 'signOut':
          logger.debug('user signed out');
          this.authService.isAuthenticated = false;
          this.onUpdateCognitoUserListenerUnsubscribe();
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
      translateModules: [`ngx-core`, `ngx-amplify-auth-ui`, `ngx-camera`]
    });
    const darkModePref = AppComponentUtils.listenForDarkModePref();
    this.subscribeToDarkModeSession(darkModePref);
    await this.subscribeToUser();
    this.updateMenuOptions();
    try {
      const user = await Auth.currentAuthenticatedUser();
      logger.debug(`ngOnInit() currentAuthenticatedUser`, user);
      await this.setupUser(user.attributes);
    } catch (error) {
      logger.debug(`ngOnInit() No authenticated user`);
      await this.session.updateUser({});
    }
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.darkModeSessionSub) {
      this.darkModeSessionSub.unsubscribe();
    }
    // this.onUpdateCognitoUserListenerUnsubscribe();
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
          title: 'menu.signIn',
          url: '/login',
          icon: 'log-in',
          isHidden: !!this.user.sub
        },
        {
          title: 'page-home.title',
          url: '/home',
          icon: 'home',
          isHidden: !this.user.sub
        }
        // {
        //   title: 'page-account-menu-title',
        //   url: '/account-menu',
        //   icon: 'settings',
        //   isHidden: !this.user.sub
        // }
      ];
    });
  }

  private async subscribeToUser() {
    this.user = this.session.getUser();
    logger.debug(`user`, this.user);
    if (this.user.sub) {

    }
    this.userSub = this.session.getUserAsObservable().subscribe(async (user: any) => {
      await this.zone.run(async () => {
        logger.debug(`user updated`, user);
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

  private async setupUser(userAttributes: ICognitoUserAttributes) {
    logger.debug(`Trace`, `setupUser()`);
    // let user: any = userAttributes;
    // try {
    //   user = await this.apiService.GetCognitoUser(userAttributes.sub);
    //   logger.debug(`setupUser() user`, user);
    //   this.onUpdateCognitoUserListener = this.apiService.OnUpdateCognitoUserListener(user.sub).subscribe(async (evt) => {
    //     const updatedUser = (evt as any).value.data.onUpdateCognitoUser;
    //     logger.verbose(`OnUpdateCognitoUserListener()`, updatedUser);
    //     await this.session.updateUser(updatedUser);
    //   });
    // } catch (error) {
    //   logger.error(`setupUser() GetCognitoUser() Error`, error);
    // }
    // await this.session.updateUser(user);
    await this.session.updateUser(userAttributes);
  }

  private onUpdateCognitoUserListenerUnsubscribe() {
    if (this.onUpdateCognitoUserListener) {
      this.onUpdateCognitoUserListener.unsubscribe();
      this.onUpdateCognitoUserListener = null;
    }
  }
}
