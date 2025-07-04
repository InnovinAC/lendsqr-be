import { Knex } from 'knex';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('transactions');
  await knex.schema.dropTableIfExists('wallets');
  await knex.schema.dropTableIfExists('users');

  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 255).unique().notNullable();
    table.string('password', 255).notNullable();
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('phone_number', 20).notNullable();
    table.boolean('is_blacklisted').defaultTo(false);
    table.timestamp('blacklisted_at').nullable();
    table.string('blacklist_reason', 500).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index(['email']);
    table.index(['phone_number']);
    table.index(['is_blacklisted']);
  });

  await knex.schema.createTable('wallets', (table) => {
    table.increments('id').primary(); // unsigned by default
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.decimal('balance', 15, 2).defaultTo(0.0).notNullable();
    table.string('currency', 3).defaultTo('NGN').notNullable();
    table.boolean('is_active').defaultTo(true).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index(['user_id']);
    table.index(['is_active']);
    table.unique(['user_id']);
  });

  await knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
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
    table
      .integer('wallet_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('wallets')
      .onDelete('CASCADE');
    table.integer('recipient_wallet_id').unsigned().nullable().references('id').inTable('wallets');
    table.string('description', 255).nullable();
    table.json('metadata').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index(['wallet_id']);
    table.index(['type']);
    table.index(['status']);
    table.index(['reference']);
    table.index(['created_at']);
    table.index(['recipient_wallet_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('transactions');
  await knex.schema.dropTableIfExists('wallets');
  await knex.schema.dropTableIfExists('users');
}
