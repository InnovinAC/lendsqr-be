import {Knex} from "knex";

class Service {
    constructor(protected db: Knex) {}
}