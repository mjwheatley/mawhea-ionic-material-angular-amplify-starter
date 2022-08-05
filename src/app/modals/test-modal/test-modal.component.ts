import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-test-modal',
  templateUrl: './test-modal.component.html',
  styleUrls: ['./test-modal.component.scss']
})
export class TestModalComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
  }

  public async dismiss(payload?: any) {
    await this.modalCtrl.dismiss(payload);
  }
}
