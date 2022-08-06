import { TranslateService } from '@ngx-translate/core';
import { TranslateNpmModulesService } from '../services';

export class AppComponentUtils {

  static initializeTranslateServiceConfig({
                                            translateService,
                                            translateNpmModulesService,
                                            translateModules
                                          }: {
    translateService: TranslateService;
    translateNpmModulesService: TranslateNpmModulesService;
    translateModules: string[];
  }) {
    translateNpmModulesService.setTranslateModules(translateModules);
    let userLang = navigator.language.split('-')[0];
    userLang = /(en|es)/gi.test(userLang) ? userLang : 'en';
    // this language will be used as a fallback when a translation isn't found in the current language
    translateService.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translateService.use(userLang);
  }

  static listenForDarkModePref(): boolean {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    let isDarkMode = prefersDark.matches;
    AppComponentUtils.toggleDarkTheme({ isDarkMode });
    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addListener((mediaQuery) => {
      isDarkMode = mediaQuery.matches;
      AppComponentUtils.toggleDarkTheme({ isDarkMode });
    });
    return isDarkMode;
  }

  static toggleDarkTheme({ isDarkMode = true }: { isDarkMode: boolean }) {
    document.body.classList.toggle('dark', isDarkMode);
  }
}
