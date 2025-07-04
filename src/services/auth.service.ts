import Service from '@/lib/service/service.lib';
import JwtService from '@/services/jwt.service';
import SessionService from '@/services/session.service';

class AuthService extends Service {
  constructor() {
    super();
  }

  async authenticate(userId: number) {
    // Sliding expiry: 1 hour from now
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const session = await SessionService.getInstance().createSession(userId, expiresAt);
    return { accessToken: JwtService.sign(userId, session.id, '1h') };
  }
}

export default AuthService;
