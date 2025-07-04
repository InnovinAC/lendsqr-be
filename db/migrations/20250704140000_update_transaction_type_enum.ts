import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
        ALTER TABLE transactions
            MODIFY COLUMN type ENUM('fund', 'transfer', 'withdrawal', 'transfer_in', 'transfer_out') NOT NULL
    `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
        ALTER TABLE transactions
            MODIFY COLUMN type ENUM('fund', 'transfer', 'withdrawal') NOT NULL
    `);
}
