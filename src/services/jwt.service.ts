import * as jwt from "jsonwebtoken"
import commonConfig from "@/config/common.config";

class JwtService {

    sign(userId: string, expiry: any) {
        return jwt.sign({userId}, commonConfig.jwt.secret, {expiresIn: expiry});
    }

    verify(token: string) {
        return jwt.verify(token, commonConfig.jwt.secret);
    }
}
export default new JwtService();