import Service from '@/lib/service/service.lib';
import { TableName } from '@/config/database.config';
import { Session } from '@/models/session.model';

export class SessionService extends Service {
  async createSession(user_id: number, expires_at: Date): Promise<Session> {
    const [id] = await this.db.table(TableName.SESSIONS).insert({ user_id, expires_at });
    const session = await this.findSessionById(id);
    if (!session) throw new Error('Session creation failed');
    return session;
  }

  async findSessionById(id: number): Promise<Session | undefined> {
    return this.db.table<Session>(TableName.SESSIONS).where('id', id).first();
  }

  async findActiveSession(id: number): Promise<Session | undefined> {
    return this.db
      .table<Session>(TableName.SESSIONS)
      .where({ id, revoked: false })
      .andWhere('expires_at', '>', this.db.fn.now())
      .first();
  }

  async extendSession(id: number, newExpiresAt: Date): Promise<void> {
    await this.db.table(TableName.SESSIONS).where({ id }).update({ expires_at: newExpiresAt });
  }

  async revokeSession(id: number): Promise<void> {
    await this.db.table(TableName.SESSIONS).where({ id }).update({ revoked: true });
  }
}

export default SessionService;
