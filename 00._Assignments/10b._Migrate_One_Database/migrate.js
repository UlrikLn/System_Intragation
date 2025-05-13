// node migrate.js for at køre det.
// Siden opgaven kræver at man skulle migrære data og ikke bare schema bruger vi altså node migrate til at kører scriptet. 
import 'dotenv/config';
import Knex from 'knex';

// ---------------------------------------------------------------------------
// Two Knex clients, one per RDBMS
// ---------------------------------------------------------------------------
const pg = Knex({
  client: 'pg',
  connection: {
    host:     process.env.POSTGRES_HOST,
    user:     process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
});

const mysql = Knex({
  client: 'mysql2',
  connection: {
    host:     process.env.MYSQL_HOST,
    user:     process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
});

// Mapping Postgres types to MySQL types
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

// Helper function to build the CREATE TABLE DDL
function buildCreateTableDDL(table, columns) {
  const colLines = columns.map(({ column_name, udt_name, is_nullable }) => {
    const mysqlType = TYPE_MAP[udt_name] || 'TEXT';
    const nullSpec  = is_nullable === 'NO' ? 'NOT NULL' : 'NULL';
    return `\`${column_name}\` ${mysqlType} ${nullSpec}`;
  });
  return `CREATE TABLE IF NOT EXISTS \`${table}\` (${colLines.join(', ')})`;
}

// Helper function to copy a table from Postgres to MySQL
async function copyTable(table) {
  const columns = await pg
    .select('column_name', 'udt_name', 'is_nullable')
    .from('information_schema.columns')
    .where({ table_name: table, table_schema: 'public' });

  await mysql.raw(buildCreateTableDDL(table, columns));

  const BATCH = 1000;
  let offset  = 0;

  for (;;) {
    const rows = await pg.select('*').from(table).limit(BATCH).offset(offset);
    if (!rows.length) break;
    await mysql.batchInsert(table, rows, BATCH);
    offset += BATCH;
    process.stdout.write(`\r${table}: ${offset} rows copied`);
  }
  console.log();
}


(async () => {
  try {
    const tables = await pg
      .select('table_name')
      .from('information_schema.tables')
      .where({ table_schema: 'public', table_type: 'BASE TABLE' });

    for (const { table_name } of tables) {
      console.log(`\n▶  Migrating ${table_name}`);
      await copyTable(table_name);
    }
    console.log('\n✅  Migration complete');
  } catch (err) {
    console.error(err);
  } finally {
    await pg.destroy();
    await mysql.destroy();
  }
})();
