import { NgModule } from '@angular/core';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { SharedModule } from '../../shared.module';
import { AmplifyAuthenticatorModule } from '@mawhea/ngx-amplify-auth-ui';

@NgModule({
  imports: [
    SharedModule,
    LoginPageRoutingModule,
    AmplifyAuthenticatorModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {
}
