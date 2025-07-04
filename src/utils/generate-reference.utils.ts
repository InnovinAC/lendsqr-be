import { randomBytes } from 'crypto';
export function generateReference(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(4).toString('hex');
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
}

export default generateReference;
