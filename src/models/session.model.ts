export interface Session {
  id: number;
  user_id: number;
  created_at: Date;
  expires_at: Date;
  revoked: boolean;
} 