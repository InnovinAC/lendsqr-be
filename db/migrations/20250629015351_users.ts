import type {Knex} from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
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

        // Indexes
        table.index(['email']);
        table.index(['phone_number']);
        table.index(['is_blacklisted']);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('users');
}
