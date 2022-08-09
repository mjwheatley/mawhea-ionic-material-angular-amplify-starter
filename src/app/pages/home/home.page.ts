import { Component, NgZone, OnInit } from '@angular/core';
import { TestModalComponent } from '../../modals';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ICognitoUserAttributes, SessionService } from '@mawhea/ngx-core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  public user: ICognitoUserAttributes;
  private userSub: Subscription;

  constructor(
    private session: SessionService,
    private zone: NgZone,
    private modalCtrl: ModalController
  ) {
  }

  async ngOnInit() {
    await this.subscribeToUser();
  }

  public async openTestModal() {
    const modal: HTMLIonModalElement = await this.modalCtrl.create({
      component: TestModalComponent,
      backdropDismiss: true
    });
    await modal.present();
  }

  private async subscribeToUser() {
    this.user = this.session.getUser();
    this.userSub = this.session.getUserAsObservable().subscribe(async (user: any) => {
      await this.zone.run(async () => {
        this.user = user;
      });
    });


  }
}
