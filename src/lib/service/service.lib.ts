import {Knex} from "knex";
import Database from "@/lib/database/database.lib";

// Singleton
class Service {
    protected db: Knex;
    private static instances: Map<any, any> = new Map();
    constructor() {
        this.db = Database.getInstance().getConnection();
    }

    public static getInstance<T extends typeof Service>(this: T): InstanceType<T> {
        if (!Service.instances.has(this)) {
            Service.instances.set(this, new this());
        }
        return Service.instances.get(this);
    }

    protected async getUUID(): Promise<string> {
        const uuidResult = await this.db.raw('SELECT UUID() AS id');
        return uuidResult[0][0].id;
    }
}

export default Service;