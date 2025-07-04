import { Timestamp } from '@/models/timestamp';

export interface Session extends Timestamp {
  id: number;
  user_id: number;
  created_at: Date;
  expires_at: Date;
  revoked: boolean;
}
