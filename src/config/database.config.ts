import { registerAs } from '@nestjs/config';
import { typeOrmConfig } from './typeorm.config';

export interface IDatabaseConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  entities: string[];
  migrations: string[];
  synchronize: boolean;
  logging: boolean;
  autoLoadEntities: boolean;
}

export default registerAs(
  'database',
  (): IDatabaseConfig => ({
    ...typeOrmConfig,
    autoLoadEntities: true
  })
);
