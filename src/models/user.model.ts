import { Timestamp } from '@/models/timestamp';

export interface User extends Timestamp {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isBlacklisted: boolean;
  blacklistReason: string;
  blacklistedAt: Date;
}
