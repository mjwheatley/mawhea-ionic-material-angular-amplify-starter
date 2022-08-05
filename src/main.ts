import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { Amplify } from 'aws-amplify';
import aws_exports from './aws-exports';

Amplify.configure(aws_exports);
Amplify.Logger.LOG_LEVEL = environment.logLevel || 'DEBUG';
if (environment.production) {
  Amplify.Logger.LOG_LEVEL = 'WARN';
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
