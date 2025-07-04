import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.enu('type', ['fund', 'transfer', 'withdrawal', 'transfer_in', 'transfer_out']).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.enu('type', ['fund', 'transfer', 'withdrawal']).alter();
  });
} 