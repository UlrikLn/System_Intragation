// node migrate.js for at køre det.
// Siden opgaven kræver at man skulle migrære data og ikke bare schema bruger vi altså node migrate til at kører scriptet. 
import 'dotenv/config';
import Knex from 'knex';

// Initialiser Knex til Postgres-forbindelse
const pg = Knex({
  client: 'pg',
  connection: {
    host:     process.env.POSTGRES_HOST,
    user:     process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
});

// Initialiser Knex til MySQL-forbindelse
const mysql = Knex({
  client: 'mysql2',
  connection: {
    host:     process.env.MYSQL_HOST,
    user:     process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
});

// Mapping af Postgres-datatyper til MySQL-datatyper
const TYPE_MAP = {
  int2:              'SMALLINT',
  int4:              'INT',
  int8:              'BIGINT',
  numeric:           'DECIMAL(38,10)',
  bool:              'TINYINT(1)',
  text:              'TEXT',
  varchar:           'VARCHAR(255)',
  bpchar:            'CHAR(1)',
  date:              'DATE',
  timestamp:         'DATETIME',
  timestamptz:       'DATETIME',
  json:              'JSON',
  jsonb:             'JSON',
};

// Funktion til at bygge CREATE TABLE statement til MySQL
function buildCreateTableDDL(table, columns) {
  const colLines = columns.map(({ column_name, udt_name, is_nullable }) => {
    const mysqlType = TYPE_MAP[udt_name] || 'TEXT'; // fallback til TEXT hvis ukendt type
    const nullSpec  = is_nullable === 'NO' ? 'NOT NULL' : 'NULL';
    return `\`${column_name}\` ${mysqlType} ${nullSpec}`;
  });
  return `CREATE TABLE IF NOT EXISTS \`${table}\` (${colLines.join(', ')})`;
}

// Funktion til at kopiere én tabels data fra Postgres til MySQL
async function copyTable(table) {
  // Hent kolonneinfo fra Postgres information_schema
  const columns = await pg
    .select('column_name', 'udt_name', 'is_nullable')
    .from('information_schema.columns')
    .where({ table_name: table, table_schema: 'public' });

  // Opret tabel i MySQL (hvis ikke allerede eksisterende)
  await mysql.raw(buildCreateTableDDL(table, columns));

  const BATCH = 1000; // antal rækker per batch
  let offset  = 0;

  // Loop gennem alle rækker i tabellen i batches
  for (;;) {
    const rows = await pg.select('*').from(table).limit(BATCH).offset(offset);
    if (!rows.length) break; // stop, hvis ingen flere rækker
    await mysql.batchInsert(table, rows, BATCH);
    offset += BATCH;
    process.stdout.write(`\r${table}: ${offset} rows copied`);
  }
  console.log();
}

// Main-funktion der migrerer alle tabeller
(async () => {
  try {
    // Hent alle base tables fra Postgres
    const tables = await pg
      .select('table_name')
      .from('information_schema.tables')
      .where({ table_schema: 'public', table_type: 'BASE TABLE' });

    // Migrér hver tabel én ad gangen
    for (const { table_name } of tables) {
      console.log(`\n▶  Migrating ${table_name}`);
      await copyTable(table_name);
    }
    console.log('\n✅  Migration complete');
  } catch (err) {
    console.error(err);
  } finally {
    // Clean up connections
    await pg.destroy();
    await mysql.destroy();
  }
})();
