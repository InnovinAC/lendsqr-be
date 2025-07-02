import {Knex} from "knex";
import Database from "@/lib/database/database.lib";

class Service {
    protected db: Knex;
    private static instances: Map<any, any> = new Map();
    constructor() {
        console.log(Database.getInstance())
        this.db = Database.getInstance().getConnection();
    }

    public static getInstance<T extends typeof Service>(this: T): InstanceType<T> {
        if (!Service.instances.has(this)) {
            Service.instances.set(this, new this());
        }
        return Service.instances.get(this);
    }
}

export default Service;