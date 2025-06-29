import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('wallets', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
        table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.decimal('balance', 15, 2).defaultTo(0.00).notNullable();
        table.string('currency', 3).defaultTo('NGN').notNullable();
        table.boolean('is_active').defaultTo(true).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        // Indexes
        table.index(['user_id']);
        table.index(['is_active']);
        table.unique(['user_id']);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('wallets');
}

