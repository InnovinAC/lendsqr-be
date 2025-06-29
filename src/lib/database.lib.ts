import commonConfig from "@/config/common.config";
import knexConfig from "@/../knexfile"
import Knex from "knex";

// Singleton pattern
class Database {
    static instance: Database;
    private readonly db: Knex.Knex;

    constructor() {
        const config = knexConfig[commonConfig.environment];
        this.db = Knex(config);
    }

    /**
    * Used to get a universal instance of the Database class
    * @returns Database
     **/
    public static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    /**
     * Get db connection
     * @returns Knex
     */
    public getConnection(): Knex.Knex {
        return this.db;
    }
}

export default Database;