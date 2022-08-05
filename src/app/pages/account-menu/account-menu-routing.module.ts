import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountMenuPage } from './account-menu.page';

const routes: Routes = [
  {
    path: '',
    component: AccountMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountMenuPageRoutingModule {}
