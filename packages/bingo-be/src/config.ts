import { randomBytes } from 'crypto';

const config = {
  jwtSecret: process.env.JWT_SECRET,
  adminPass: process.env.ADMIN_PASS,
};

if (!config.jwtSecret) {
  config.jwtSecret = randomBytes(32).toString('hex');
  console.log(
    'WARNING: JWT_SECRET is not set, using random secret:',
    config.jwtSecret,
  );
}
if (!config.adminPass) {
  config.adminPass =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  console.log(
    'WARNING: ADMIN_PASS is not set, using random password:',
    config.adminPass,
  );
}

export type Config = typeof config;

export { config };
