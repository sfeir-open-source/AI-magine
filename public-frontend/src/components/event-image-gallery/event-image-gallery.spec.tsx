import { useEventPromotedImages } from '@/src/hooks/useEventPromotedImages';
import { Mock } from 'vitest';
import { ImageWithPromptTextAndAuthorDto } from '@/src/providers/events/dto/ImageWithPromptTextAndAuthor.dto';
import { EventImageGallery } from '@/src/components/event-image-gallery/event-image-gallery';
import { render, screen } from '@testing-library/react';

vi.mock('@/src/hooks/useEventPromotedImages');

describe('EventImageGallery', () => {
  it('renders all images retrieved from event provider', () => {
    const fakeImages = [
      new ImageWithPromptTextAndAuthorDto(
        '1',
        'url',
        'test prompt 1',
        'author 1'
      ),
      new ImageWithPromptTextAndAuthorDto(
        '2',
        'url',
        'test prompt 2',
        'author 2'
      ),
    ];

    (useEventPromotedImages as Mock).mockReturnValue({ data: fakeImages });

    render(<EventImageGallery />);

    expect(screen.getByAltText('test prompt 1')).toBeInTheDocument();
    expect(screen.getByText(/author 1/)).toBeInTheDocument();
    expect(screen.getByAltText('test prompt 2')).toBeInTheDocument();
    expect(screen.getByText(/author 2/)).toBeInTheDocument();
  });
});
