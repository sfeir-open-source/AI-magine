import { EventGalleryPage } from '@/src/pages/event-gallery.page';
import { render, screen } from '@testing-library/react';
import { PropsWithChildren } from 'react';

vi.mock('@/src/components/auto-scroll-container/auto-scroll-container', () => ({
  AutoScrollContainer: ({ children }: PropsWithChildren) => (
    <div>
      <span>AutoScrollContainer</span>
      {children}
    </div>
  ),
}));
vi.mock('@/src/components/event-image-gallery/event-image-gallery', () => ({
  EventImageGallery: () => <span>EventImageGallery</span>,
}));

describe('EventGalleryPage', () => {
  it('displays image gallery in auto scroll container', () => {
    render(<EventGalleryPage />);

    expect(screen.getByText('AutoScrollContainer')).toBeInTheDocument();
    expect(screen.getByText('EventImageGallery')).toBeInTheDocument();
  });
});
