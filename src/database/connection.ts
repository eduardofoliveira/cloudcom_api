import knex from 'knex';

import configuration from '../knexfile';

interface ExportObj {
  connectionOracle: knex;
  connectionZabbix: knex;
}

const connectionOracle = knex(configuration.oracleCloud);
const connectionZabbix = knex(configuration.mysqlZabbix);

export { connectionOracle, connectionZabbix };
