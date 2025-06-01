// // Denne seed-fil sletter alle eksisterende brugere og indsætter tre eksempelbrugere i users-tabellen.
// Bruges til at fylde databasen med testdata efter migrationer.

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  await knex('users').del();

  await knex('users').insert([
    { id: 1, first_name: 'John', last_name: 'Doe' },
    { id: 2, first_name: 'Jane', last_name: 'Smith' },
    { id: 3, first_name: 'Alice', last_name: 'Johnson' }
  ]);
}