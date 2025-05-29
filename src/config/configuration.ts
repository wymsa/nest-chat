import applicationConfig, { IApplicationConfig } from './application.config';
import databaseConfg, { IDatabaseConfig } from './database.config';

export interface IConfiguration {
  application: IApplicationConfig;
  database: IDatabaseConfig;
}

export default (): IConfiguration => ({
  application: applicationConfig(),
  database: databaseConfg()
});
