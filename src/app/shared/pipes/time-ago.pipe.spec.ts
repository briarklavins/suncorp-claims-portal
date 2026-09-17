import { TimeAgoPipe } from './time-ago.pipe';

describe('TimeAgoPipe', () => {

  const pipe = new TimeAgoPipe();

  it('should return an empty string for a missing value', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should describe recent instants in minutes', () => {
    expect(pipe.transform(new Date(Date.now() - 5 * 60 * 1000))).toBe('5 minutes ago');
  });

  it('should describe older instants in days', () => {
    expect(pipe.transform(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))).toBe('3 days ago');
  });
});
