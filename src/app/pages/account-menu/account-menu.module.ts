import { NgModule } from '@angular/core';
import { AccountMenuPageRoutingModule } from './account-menu-routing.module';
import { AccountMenuPage } from './account-menu.page';
import { SharedModule } from '../../shared.module';
import { SharedModule as NgxAmplifyAuthUiSharedModule } from '@mawhea/ngx-amplify-auth-ui';
import { SharedModule as NgxCameraSharedModule } from '@mawhea/ngx-camera';

@NgModule({
  imports: [
    SharedModule,
    NgxAmplifyAuthUiSharedModule,
    AccountMenuPageRoutingModule,
    NgxCameraSharedModule
  ],
  declarations: [AccountMenuPage]
})
export class AccountMenuPageModule {
}
