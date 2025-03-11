import { describe, expect } from 'vitest';
import { uniq } from '@/utils';

describe('utils', () => {
  describe('uniq', () => {
    it('returns unique elements', () => {
      expect(uniq(['a', 'b', 'a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
    });
  });
});
