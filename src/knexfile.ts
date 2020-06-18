require('dotenv').config();

const conexoes = {
  oracleCloud: {
    client: 'oracledb',
    connection: {
      user: process.env.CLOUD_ORACLE_USER,
      password: process.env.CLOUD_ORACLE_PASS,
      connectString: process.env.CLOUD_CONNECTSTRING,
    },
    pool: {
      min: 0,
      max: 2,
    },
  },
  mysqlZabbix: {
    client: 'mysql2',
    connection: {
      host: process.env.ZABBIX_HOST,
      user: process.env.ZABBIX_USER,
      password: process.env.ZABBIX_PASS,
      database: process.env.ZABBIX_DATABASE,
    },
    pool: {
      min: 0,
      max: 7,
    },
  },
  mysqlZabbixProd: {
    client: 'mysql2',
    connection: {
      socketPath: process.env.ZABBIX_SOCKET,
      user: process.env.ZABBIX_USER,
      password: process.env.ZABBIX_PASS,
      database: process.env.ZABBIX_DATABASE,
    },
    pool: {
      min: 0,
      max: 7,
    },
  },
};

export default conexoes;
