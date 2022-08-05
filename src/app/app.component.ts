/* eslint-disable @typescript-eslint/naming-convention */
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Auth } from 'aws-amplify';
import { SessionService } from './services';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { ICognitoUserAttributes } from './models';
import { AppComponentUtils, Constants } from './utils';

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
  public isAuthenticated: boolean;
  public user: ICognitoUserAttributes;
  public appPages: IAppPage[] = [];
  private userSub: Subscription;
  private darkModeSessionSub: Subscription | undefined;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private session: SessionService,
    private zone: NgZone
  ) {
  }

  async ngOnInit() {
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
    this.authService.currentAuthenticatedUser();
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
        },
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
