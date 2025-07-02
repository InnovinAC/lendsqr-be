import Service from "@/lib/service/service.lib";
import {TableName} from "@/config/database.config";
import {ICreateUser} from "@/interfaces/user.interface";
import {User} from "@/models";
import PasswordService from "@/services/password.service";

class UserService extends Service {
    constructor() {
        super();
    }

    async findUserByEmail(email: string) {
        return this.db.table<User>(TableName.USERS)
            .where('email', email)
            .first();
    }

    async isUniqueEmail(email: string) {
        const existingUser = await this.findUserByEmail(email);
        return !existingUser;
    }

    async createUser(data: ICreateUser) {
        await this.db.transaction(async (tx) => {
            data.password = await PasswordService.hashPassword(data.password)
            const user = await tx
                .table(TableName.USERS)
                .insert(data)
                .returning("id");

            await tx.insert(TableName.WALLET).insert({
                user_id: user[0].id
            })
        })
    }
}

export default UserService;