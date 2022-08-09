import * as environmentJson from './environment.json';

const {
  AMPLIFY_ENV: amplifyEnv,
  LOG_LEVEL: logLevel = `WARN`
}: any = environmentJson;

export const environment: any = {
  production: true,
  amplifyEnv,
  logLevel
};
