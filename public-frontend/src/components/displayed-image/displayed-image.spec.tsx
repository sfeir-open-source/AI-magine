import { render, screen } from '@testing-library/react';
import { DisplayedImage } from '@/src/components/displayed-image/displayed-image';
import i18n from '@/src/config/i18n';
import { Image } from '@/src/domain/Image';
import { userEvent } from '@testing-library/user-event';

describe('DisplayedImage', () => {
  const fakeImage = new Image(
    '1',
    'test prompt',
    'http://image.com',
    false,
    new Date().toISOString()
  );

  it('displays a message if no images were generated yet', () => {
    render(<DisplayedImage />);

    expect(screen.getByText(i18n.t('write-a-prompt-hint'))).toBeInTheDocument();
  });

  it('displays the image', () => {
    render(<DisplayedImage image={fakeImage} />);

    expect(screen.getByAltText(fakeImage.prompt)).toBeInTheDocument();
  });

  it('opens a lightbox when clicking on associated button', async () => {
    render(<DisplayedImage image={fakeImage} />);

    expect(screen.getAllByAltText(fakeImage.prompt)).toHaveLength(1);

    await userEvent.click(screen.getByText(i18n.t('view-full')));

    expect(screen.getAllByAltText(fakeImage.prompt)).toHaveLength(2);
  });
});
