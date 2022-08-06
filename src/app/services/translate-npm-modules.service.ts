import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateNpmModulesService {
  private translateModules: string[] = [];

  constructor() {
  }

  public getTranslateModules(): string[] {
    return this.translateModules;
  }

  public setTranslateModules(translateModules: string[]) {
    this.translateModules = translateModules;
  }
}
