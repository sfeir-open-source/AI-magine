import { useEventSelectedImages } from '@/src/hooks/useEventSelectedImages';
import { Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EventSelectedImages } from '@/src/components/event-selected-images/event-selected-images';
import i18n from '@/src/config/i18n';

vi.mock('@/src/hooks/useEventSelectedImages');

describe('EventSelectedImages', () => {
  it('displays selected images for an event', () => {
    const fakeImage = {
      id: '1',
      url: 'https://foo.com',
      prompt: 'test prompt',
      author: 'test author',
    };

    (useEventSelectedImages as Mock).mockReturnValue({ data: [fakeImage] });

    render(<EventSelectedImages eventId="event-id" />);

    expect(screen.getByAltText('test prompt')).toBeInTheDocument();
    expect(screen.getByText('test prompt')).toBeInTheDocument();
    expect(screen.getByText(new RegExp('test author'))).toBeInTheDocument();
  });

  it('displays a message if no images found', () => {
    (useEventSelectedImages as Mock).mockReturnValue({ data: [] });

    render(<EventSelectedImages eventId="event-id" />);

    expect(screen.getByText(i18n.t('no-selected-images'))).toBeInTheDocument();
  });
});
