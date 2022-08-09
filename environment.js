const { writeFileSync } = require(`fs`);
const { join } = require(`path`);

const envVars = [
  `AMPLIFY_ENV`,
  `LOG_LEVEL`
];
const envJson = {};
envVars.forEach((key) => {
  if (process.env[key]) {
    envJson[key] = process.env[key];
  }
});

writeFileSync(
  join(__dirname, `src/environments/environment.json`),
  JSON.stringify(envJson, null, 2)
);
