/* eslint-disable @typescript-eslint/naming-convention */
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Auth } from 'aws-amplify';
import { SessionService } from './services';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { ICognitoUserAttributes } from './models';

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
  public isAuthenticated: boolean;
  public user: ICognitoUserAttributes;
  public appPages: IAppPage[] = [];
  private userSub: Subscription;

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
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  async signOut() {
    await Auth.signOut();
    this.authService.currentAuthenticatedUser();
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
}
