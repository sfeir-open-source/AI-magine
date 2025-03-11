import { AutoScrollContainer } from '@/src/components/auto-scroll-container/auto-scroll-container';
import { EventImageGallery } from '@/src/components/event-image-gallery/event-image-gallery';

export const EventGalleryPage = () => {
  return (
    <AutoScrollContainer
      scrollSpeed={100}
      bottomPauseTime={3000}
      topPauseTime={3000}
    >
      <EventImageGallery />
    </AutoScrollContainer>
  );
};
