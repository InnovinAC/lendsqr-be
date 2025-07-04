import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('wallet_id').notNullable().references('id').inTable('wallets').onDelete('CASCADE');
    table.enum('type', ['fund', 'transfer', 'withdrawal']).notNullable();
    table.decimal('amount', 15, 2).notNullable();
    table.decimal('balance_before', 15, 2).notNullable();
    table.decimal('balance_after', 15, 2).notNullable();
    table.string('currency', 3).defaultTo('NGN').notNullable();
    table
      .enum('status', ['pending', 'completed', 'failed', 'cancelled'])
      .defaultTo('pending')
      .notNullable();
    table.string('reference', 100).unique().notNullable();
    table.uuid('recipient_wallet_id').nullable().references('id').inTable('wallets');
    table.string('description', 255).nullable();
    table.json('metadata').nullable(); // For additional transaction data
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Indexes
    table.index(['wallet_id']);
    table.index(['type']);
    table.index(['status']);
    table.index(['reference']);
    table.index(['created_at']);
    table.index(['recipient_wallet_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('transactions');
}
