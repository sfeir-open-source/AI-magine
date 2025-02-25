import { renderHook, waitFor } from '@testing-library/react';
import { useFingerprint } from '@/src/hooks/useFingerprint';

vi.mock('@fingerprintjs/fingerprintjs', () => ({
  __esModule: true,
  default: {
    load: vi.fn().mockResolvedValue({
      get: vi.fn().mockResolvedValue({ visitorId: 'fingerprint' }),
    }),
  },
}));

describe('useFingerprint', () => {
  it('returns the browser fingerprint', async () => {
    const { result } = renderHook(() => useFingerprint());

    await waitFor(() => expect(result.current).toEqual('fingerprint'));
  });
});
