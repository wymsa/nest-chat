import { registerAs } from '@nestjs/config';

export interface IApplicationConfig {
  port: number;
  environment: 'development' | 'production' | 'test';
  apiPrefix: string;
}

export default registerAs(
  'application',
  (): IApplicationConfig => ({
    port: Number(process.env.APP_PORT) || 3001,
    environment: (process.env.NODE_ENV as IApplicationConfig['environment']) || 'development',
    apiPrefix: process.env.APP_PREFIX || 'api'
  })
);
