import Service from "@/lib/service/service.lib";
import {TableName} from "@/config/database.config";
import {ICreateUser, ILogin} from "@/interfaces/user.interface";
import {User} from "@/models";
import PasswordService from "@/services/password.service";
import AuthService from "@/services/auth.service";
import createError from "http-errors";

class UserService extends Service {
    constructor() {
        super();
    }

    async findUserByEmail(email: string) {
        return this.db.table<User>(TableName.USERS)
            .where('email', email)
            .first();
    }
    async findUserById(id: string) {
        return this.db.table<User>(TableName.USERS)
            .where('id', id)
            .first();
    }

    async isUniqueEmail(email: string) {
        const existingUser = await this.findUserByEmail(email);
        return !existingUser;
    }

    async createUser(data: ICreateUser) {
        // const generatedId = await this.getUUID();
        data.password = await PasswordService.hashPassword(data.password)
        const id = await this.db.transaction(async (tx) => {
            const [userId] = await tx.table(TableName.USERS).insert(data);

            await tx.table(TableName.WALLET).insert({
                user_id: userId,
            });
            return userId
        });

        return AuthService.getInstance().authenticate(id);
    }

    async loginUser(data: ILogin) {
        const existingUser = await this.findUserByEmail(data.email);
        if (!existingUser) {
            throw createError.BadRequest('Incorrect email or password');
        }
        const valid = await PasswordService.comparePassword(data.password, existingUser.password)
        if (!valid) {
            throw createError.BadRequest('Incorrect email or password');
        }
        return AuthService.getInstance().authenticate(existingUser.id);
    }

}

export default UserService;