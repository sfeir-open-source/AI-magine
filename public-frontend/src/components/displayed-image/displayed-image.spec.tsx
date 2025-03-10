import { render, screen } from '@testing-library/react';
import { DisplayedImage } from '@/src/components/displayed-image/displayed-image';
import i18n from '@/src/config/i18n';
import { Image } from '@/src/domain/Image';
import { userEvent } from '@testing-library/user-event';
import { Mock } from 'vitest';
import { useImagePromotionMutation } from '@/src/hooks/useImagePromotionMutation';

vi.mock('@/src/hooks/useImagePromotionMutation');
vi.mock('react-router');
vi.mock('@/src/hooks/useUserId');

describe('DisplayedImage', () => {
  const fakeImage = new Image(
    '1',
    'test prompt',
    'http://image.com',
    false,
    new Date().toISOString()
  );

  it('displays a message if no images were generated yet', () => {
    (useImagePromotionMutation as Mock).mockReturnValue({});

    render(<DisplayedImage />);

    expect(screen.getByText(i18n.t('write-a-prompt-hint'))).toBeInTheDocument();
  });

  it('displays the image', () => {
    (useImagePromotionMutation as Mock).mockReturnValue({});

    render(<DisplayedImage image={fakeImage} />);

    expect(screen.getByAltText(fakeImage.prompt)).toBeInTheDocument();
  });

  it('opens a lightbox when clicking on associated button', async () => {
    (useImagePromotionMutation as Mock).mockReturnValue({});

    render(<DisplayedImage image={fakeImage} />);

    expect(screen.getAllByAltText(fakeImage.prompt)).toHaveLength(1);

    await userEvent.click(screen.getByText(i18n.t('view-full')));

    expect(screen.getAllByAltText(fakeImage.prompt)).toHaveLength(2);
  });

  it('call useImagePromotionMutation when clicking on associated button', async () => {
    const mutateAsyncMock = vi.fn();
    (useImagePromotionMutation as Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
    });

    render(<DisplayedImage image={fakeImage} />);

    expect(screen.getAllByAltText(fakeImage.prompt)).toHaveLength(1);

    await userEvent.click(screen.getByText(i18n.t('promote')));

    expect(mutateAsyncMock).toHaveBeenCalledWith({ imageId: fakeImage.id });
  });
});
