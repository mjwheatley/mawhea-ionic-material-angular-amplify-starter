import { NgModule } from '@angular/core';
import { AccountMenuPageRoutingModule } from './account-menu-routing.module';
import { AccountMenuPage } from './account-menu.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    SharedModule,
    AccountMenuPageRoutingModule
  ],
  declarations: [AccountMenuPage]
})
export class AccountMenuPageModule {
}
