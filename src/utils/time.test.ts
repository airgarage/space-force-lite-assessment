import { formatDate, formatShortDate } from './time';

describe('Time Utils', () => {
  describe('formatDate', () => {
    it('formats ISO date string correctly', () => {
      const isoDate = '2023-01-01T12:00:00Z';
      const formattedDate = formatDate(isoDate);

      expect(formattedDate).toContain('2023');
      expect(formattedDate).toContain('Jan');
      // Check that it includes time
      expect(formattedDate).toMatch(/\d{1,2}:\d{2}/);
    });

    it('returns a fallback for invalid dates', () => {
      const invalidDate = 'not-a-date';
      const formattedDate = formatDate(invalidDate);

      expect(formattedDate).toBe('Invalid Date');
    });
  });

  describe('formatShortDate', () => {
    it('formats ISO date string to short format', () => {
      const isoDate = '2023-01-01T12:00:00Z';
      const formattedDate = formatShortDate(isoDate);
      expect(formattedDate).toBe('1/1/2023')
    });

    it('returns a fallback for invalid dates', () => {
      const invalidDate = 'not-a-date';
      const formattedDate = formatShortDate(invalidDate);

      expect(formattedDate).toBe('Invalid Date');
    });
  });
}); 