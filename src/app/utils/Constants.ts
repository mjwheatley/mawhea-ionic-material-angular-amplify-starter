/* eslint-disable @typescript-eslint/naming-convention */
export class Constants {
  public static EMPTY_STRING = '';

  public static SESSION: any = {
    USER: 'user',
    LANGUAGE: 'language',
    LOADING: 'isLoading',
    PLATFORM_READY: 'platformReady',
    TRANSLATIONS_READY: 'translationsReady',
    PATH: 'path',
    IMAGE_URI: 'imageUri',
    PERSISTENT_SESSION: 'persistentSession',
    IS_DARK_MODE: 'isDarkMode',
    EMAIL_ADDRESS: 'emailAddress',
    PASSWORD: `password`,
    LAST_AUTH_STATE: 'lastAuthState',
    S3_DOMAIN_NAME: 's3DomainName',
    IS_AUTHORIZED: 'isAuthorized',
    LAST_AUTH_USER: 'lastAuthUser'
  };

  public static PLATFORM: any = {
    CORDOVA: 'cordova',
    ANDROID: 'android',
    IOS: 'ios'
  };
}
