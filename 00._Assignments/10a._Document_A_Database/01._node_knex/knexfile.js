// Denne konfigurationsfil definerer Knex-databaseforbindelsen (PostgreSQL) og migrationsindstillinger.
// Bruges af Knex til at vide, hvordan det skal forbinde til databasen.
import 'dotenv/config';

/**
 * @type { import("knex").Knex.Config }
 */
export default {
  client: 'postgresql',
  connection: {
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};