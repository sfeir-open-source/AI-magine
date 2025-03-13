import { render, screen } from '@testing-library/react';
import { UserImages } from '@/src/components/user-images/user-images';
import { Image } from '@/src/domain/Image';
import i18n from '@/src/config/i18n';
import { userEvent } from '@testing-library/user-event';

describe('UserImages', () => {
  const fakeImages = [
    new Image('1', 'test prompt', 'http://foo.com', false, ''),
    new Image('2', 'test prompt 2', 'http://foo.com', true, ''),
  ];

  it('displays the number of user images', () => {
    render(<UserImages images={fakeImages} onSelect={vi.fn()} />);

    expect(screen.getByText(`${fakeImages.length} images`)).toBeInTheDocument();
  });

  it('displays the images of the user', () => {
    render(<UserImages images={fakeImages} onSelect={vi.fn()} />);

    expect(screen.getByAltText(fakeImages[0].prompt)).toBeInTheDocument();
    expect(screen.getByAltText(fakeImages[1].prompt)).toBeInTheDocument();
  });

  it('displays a specific message when user does not have any images', () => {
    render(<UserImages images={[]} onSelect={vi.fn()} />);

    expect(
      screen.getByText(i18n.t('no-images-to-display'))
    ).toBeInTheDocument();
  });

  it('displays promote icon if image is promoted', () => {
    render(<UserImages images={fakeImages} onSelect={vi.fn()} />);

    expect(screen.getByTestId('promote-icon')).toBeInTheDocument();
  });

  it('calls onSelect when clicking on an image', async () => {
    const onSelectMock = vi.fn();
    render(<UserImages images={fakeImages} onSelect={onSelectMock} />);

    await userEvent.click(screen.getByAltText(fakeImages[0].prompt));

    expect(onSelectMock).toHaveBeenCalledWith(fakeImages[0]);
  });
});
