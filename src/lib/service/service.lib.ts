import {Knex} from "knex";
import Database from "@/lib/database/database.lib";

class Service {
    protected db: Knex;
    constructor() {
        this.db = Database.getInstance().getConnection();
    }
}

export default Service;