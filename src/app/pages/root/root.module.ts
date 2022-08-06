import { NgModule } from '@angular/core';
import { RootPageRoutingModule } from './root-routing.module';
import { RootPage } from './root.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    SharedModule,
    RootPageRoutingModule
  ],
  declarations: [RootPage]
})
export class RootPageModule {
}
