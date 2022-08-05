export class AppComponentUtils {

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
