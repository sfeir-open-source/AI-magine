import { render, screen, waitFor } from '@testing-library/react';
import { AutoScrollContainer } from '@/src/components/auto-scroll-container/auto-scroll-container';

describe('AutoScrollContainer', () => {
  it('updates scrollTop', async () => {
    render(
      <AutoScrollContainer
        scrollSpeed={500}
        bottomPauseTime={0}
        topPauseTime={0}
      >
        <div style={{ height: '10000px' }}>Content</div>
      </AutoScrollContainer>
    );

    await waitFor(
      () =>
        expect(
          screen.getByTestId('auto-scroll-container').scrollTop
        ).toBeGreaterThan(0),
      { timeout: 4000 }
    );
  });
});
