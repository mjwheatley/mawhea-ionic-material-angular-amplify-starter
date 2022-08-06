import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TestModalComponent } from './modals';
import { AuthService } from './auth/auth.service';
import { LoadingService, SessionService, TranslateNpmModulesService } from './services';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateNpmModulesLoader } from './utils/TranslateNpmModulesLoader';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export const createTranslateLoader = (
  http: HttpClient,
  translateNpmModulesService: TranslateNpmModulesService
) => new TranslateNpmModulesLoader(http, translateNpmModulesService);

@NgModule({
  declarations: [
    AppComponent,
    TestModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient, TranslateNpmModulesService]
      }
    }),
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    },
    AuthService,
    LoadingService,
    SessionService,
    Storage,
    TranslateNpmModulesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
