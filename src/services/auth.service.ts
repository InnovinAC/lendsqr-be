import Service from '@/lib/service/service.lib';
import JwtService from '@/services/jwt.service';

class AuthService extends Service {
  constructor() {
    super();
  }

  authenticate(userId: number) {
    return { accessToken: JwtService.sign(userId, '1h') };
  }
}

export default AuthService;
