import Database from '@/lib/database/database.lib';
import {Knex} from 'knex';

describe('Database Singleton', () => {
    let dbInstance: Database;
    let dbConnection: Knex;

    beforeAll((done) => {
        dbInstance = Database.getInstance();
        dbConnection = dbInstance.getConnection();
        done();
    });

    afterAll(done => {
        dbConnection.destroy();
        done();
    });

    it('should return an instance of Database', () => {
        expect(dbInstance).toBeInstanceOf(Database);
    });

    it('should return a valid Knex connection', () => {
        expect(dbConnection).toBeDefined();
        expect(dbConnection).toBeInstanceOf(Function);
        expect(typeof dbConnection.raw).toBe('function');
    });

    it('should return the same instance across calls (singleton)', () => {
        const anotherInstance = Database.getInstance();
        expect(anotherInstance).toBe(dbInstance);
    });

    it('should be able to perform a simple query', async () => {
        const result = await dbConnection.raw('SELECT 1+1 AS result');
        const row = result[0][0];
        expect(row.result).toBe(2);
    });
});
