import {Knex} from "knex";

class Service {
    constructor(protected db: Knex) {}
}

export default Service;