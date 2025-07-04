import { generateReference } from '@/utils/generate-reference.utils';

describe('generateReference', () => {
  it('should generate a reference with custom prefix', () => {
    const reference = generateReference('TXN');
    
    expect(reference).toMatch(/^TXN-\w+-\w+$/);
  });

  it('should generate unique references', () => {
    const ref1 = generateReference('TEST');
    const ref2 = generateReference('TEST');
    
    expect(ref1).not.toBe(ref2);
  });

  it('should generate reference with correct format', () => {
    const reference = generateReference('TEST');
    
    expect(reference).toMatch(/^TEST-\w+-\w+$/);
    expect(reference.length).toBeGreaterThan(10);
  });
}); 