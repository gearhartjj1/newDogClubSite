declare module 'express-mysql-session' {
  import { Store } from 'express-session';
  import { Pool } from 'mysql2/promise';

  interface MySQLStoreOptions {
    clearExpired?: boolean;
    checkExpirationInterval?: number;
    expiration?: number;
    createDatabaseTable?: boolean;
    schema?: {
      tableName?: string;
      columnNames?: {
        session_id?: string;
        expires?: string;
        data?: string;
      };
    };
  }

  function expressMySqlSession(session: any): {
    new (options: MySQLStoreOptions, connection: Pool | any): Store;
  };

  export = expressMySqlSession;
}