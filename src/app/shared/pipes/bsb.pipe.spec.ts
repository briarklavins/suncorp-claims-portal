import { BsbPipe } from './bsb.pipe';

describe('BsbPipe', () => {

  const pipe = new BsbPipe();

  it('should return an empty string for a missing bsb', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should format a six digit bsb as NNN-NNN', () => {
    expect(pipe.transform('484799')).toBe('484-799');
    expect(pipe.transform('484-799')).toBe('484-799');
  });

  it('should leave a value that is not a six digit bsb untouched', () => {
    expect(pipe.transform('4847')).toBe('4847');
  });
});
