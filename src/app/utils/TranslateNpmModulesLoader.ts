import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateNpmModulesService } from '../services';

export class TranslateNpmModulesLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private translateNpmModulesService: TranslateNpmModulesService
  ) {
  }

  getTranslation(langCountry: string): Observable<any> {
    const observables = [
      this.http.get(`assets/i18n/${langCountry}.json`)
    ];
    const translateModules = this.translateNpmModulesService.getTranslateModules();
    if (translateModules && Array.isArray(translateModules)) {
      observables.push(...translateModules.map(
        module => this.http.get(`assets/i18n/${module}/${langCountry}.json`)
      ));
    }
    return forkJoin(observables).pipe(map(data => {
      const res = {};
      data.forEach((obj) => {
        Object.assign(res, obj);
      });
      return res;
    }));
  }
}
