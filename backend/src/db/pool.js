import { createRequire } from 'node:module';
import { env } from '../config/env.js';

const require = createRequire(import.meta.url);
const useWindowsAuth = env.db.authMode === 'windows';
export const sql = useWindowsAuth
  ? require('mssql/msnodesqlv8')
  : require('mssql');

function buildSqlConfig() {
  const [serverName, instanceFromServer] = String(env.db.server || '').split('\\');
  const instanceName = env.db.options.instanceName || instanceFromServer || '';
  const serverAddress = instanceName
    ? `${serverName}\\${instanceName}`
    : `${serverName || 'localhost'},${env.db.port || 1433}`;
  const database = env.db.database || 'CinegoldDB';
  const config = {
    ...(useWindowsAuth ? {} : { user: env.db.user, password: env.db.password }),
    server: serverName || 'localhost',
    database,
    options: {
      encrypt: env.db.options.encrypt,
      trustServerCertificate: env.db.options.trustServerCertificate,
      ...(useWindowsAuth ? { trustedConnection: true } : {}),
      connectTimeout: 30000,
      requestTimeout: 30000,
      ...(instanceName ? { instanceName } : {}),
    },
    pool: env.db.pool,
  };

  if (useWindowsAuth) {
    const encrypt = env.db.options.encrypt ? 'Yes' : 'No';
    const trustCertificate = env.db.options.trustServerCertificate ? 'Yes' : 'No';
    config.connectionString = [
      `Driver={${env.db.odbcDriver}}`,
      `Server=${serverAddress}`,
      `Database=${database}`,
      'Trusted_Connection=Yes',
      `Encrypt=${encrypt}`,
      `TrustServerCertificate=${trustCertificate}`,
    ].join(';') + ';';
  } else if (!instanceName && env.db.port) {
    config.port = env.db.port;
  }

  return config;
}

const config = buildSqlConfig();
const target = config.options.instanceName
  ? `${config.server}\\${config.options.instanceName}`
  : `${config.server}:${config.port || 1433}`;

export const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log(`Conectado exitosamente a SQL Server (${target}/${config.database}) con autenticación ${useWindowsAuth ? 'de Windows' : 'SQL'}`);
    return pool;
  })
  .catch((err) => {
    console.error(`Error al conectar a SQL Server (${target}/${config.database}):`, err.message);
    throw err;
  });

export async function checkDatabaseConnection() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT
      DB_NAME() AS databaseName,
      SUSER_SNAME() AS loginName,
      SYSDATETIME() AS serverTime
  `);

  return result.recordset?.[0] || null;
}
