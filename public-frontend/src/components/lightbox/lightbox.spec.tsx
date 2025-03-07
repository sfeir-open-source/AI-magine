import { Lightbox } from '@/src/components/lightbox/lightbox';
import { render, screen } from '@testing-library/react';
import { Image } from '@/src/domain/Image';
import { userEvent } from '@testing-library/user-event';

describe('lightbox', () => {
  const fakeImage = new Image(
    'id',
    'test prompt',
    'http://image.com',
    false,
    new Date().toISOString()
  );

  it('renders provided image', () => {
    render(<Lightbox image={fakeImage} onClose={vi.fn()} />);

    expect(screen.getByAltText(fakeImage.prompt)).toBeInTheDocument();
  });

  it('calls onClose when clicking on close button', async () => {
    const onCloseMock = vi.fn();

    render(<Lightbox image={fakeImage} onClose={onCloseMock} />);

    await userEvent.click(screen.getByTestId('close-button'));

    expect(onCloseMock).toHaveBeenCalled();
  });

  it('calls onClose when clicking on backdrop', async () => {
    const onCloseMock = vi.fn();

    render(<Lightbox image={fakeImage} onClose={onCloseMock} />);

    await userEvent.click(screen.getByTestId('backdrop'));

    expect(onCloseMock).toHaveBeenCalled();
  });
});
