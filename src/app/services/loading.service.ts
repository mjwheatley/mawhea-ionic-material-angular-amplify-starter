import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | undefined;
  private isLoading = false;

  constructor(private loadingCtrl: LoadingController) {
  }

  public setIsLoading(isLoading: boolean) {

    if (isLoading) {
      this.isLoading = isLoading;
      // Delay to prevent showing if loaded quickly
      setTimeout(async () => {
        if (!this.loading && this.isLoading) {
          this.loading = await this.loadingCtrl.create({
            spinner: 'crescent'
          });
          if (this.isLoading) {
            await this.loading.present();
          }
        }
      }, 500);
    } else {
      if (this.isLoading && this.loading) {
        this.loading.dismiss().then(() => {
          this.loading = undefined;
        });
      }
      this.isLoading = false;
    }
  }
}
