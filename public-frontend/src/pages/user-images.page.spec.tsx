import { UserImagesPage } from '@/src/pages/user-images.page';
import { render, screen } from '@testing-library/react';
import { useUserImages } from '@/src/hooks/useUserImages';
import { expect, Mock } from 'vitest';
import { Image } from '@/src/domain/Image';
import { useImagePromotionMutation } from '@/src/hooks/useImagePromotionMutation';
import { userEvent } from '@testing-library/user-event';
import i18n from '@/src/config/i18n';
import { Toaster } from '@/components/ui/sonner';

vi.mock('@/src/hooks/useUserImages');
vi.mock('@/src/hooks/useImagePromotionMutation');

describe('user-images.page', () => {
  const fakeImages = [
    new Image('1', 'prompt-1', 'http://url-1', false),
    new Image('2', 'prompt-2', 'http://url-2', true),
  ];

  it('renders currently selected image with its prompt and all images below', () => {
    (useUserImages as Mock).mockReturnValue({ data: fakeImages });

    (useImagePromotionMutation as Mock).mockReturnValue({});

    render(<UserImagesPage />);

    expect(screen.getByAltText('prompt-1')).toBeInTheDocument();
    expect(screen.getAllByAltText('prompt-2')).toHaveLength(2);
    expect(screen.getByText('prompt-2')).toBeInTheDocument();
  });

  it('calls provider on promote and show a success toast', async () => {
    (useUserImages as Mock).mockReturnValue({ data: fakeImages });

    const mutateAsyncMock = vi.fn().mockResolvedValue('ok');
    (useImagePromotionMutation as Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
    });

    render(
      <>
        <UserImagesPage />
        <Toaster />
      </>
    );

    await userEvent.click(screen.getByAltText('prompt-1'));
    await userEvent.click(screen.getByText(i18n.t('promote')));

    expect(mutateAsyncMock).toHaveBeenCalledWith({ imageId: '1' });
    expect(
      await screen.findByText(i18n.t('successful-promote'))
    ).toBeInTheDocument();
  });

  it('shows an error toast if promote fails ', async () => {
    (useUserImages as Mock).mockReturnValue({ data: fakeImages });

    const mutateAsyncMock = vi
      .fn()
      .mockRejectedValue(new Error('Unknown error'));
    (useImagePromotionMutation as Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
    });

    render(
      <>
        <UserImagesPage />
        <Toaster />
      </>
    );

    await userEvent.click(screen.getByAltText('prompt-1'));
    await userEvent.click(screen.getByText(i18n.t('promote')));

    expect(mutateAsyncMock).toHaveBeenCalledWith({ imageId: '1' });
    expect(
      await screen.findByText(`${i18n.t('failed-promote')}: Unknown error`)
    ).toBeInTheDocument();
  });

  it('changes the main displayed image by clicking on any other', async () => {
    (useUserImages as Mock).mockReturnValue({ data: fakeImages });

    (useImagePromotionMutation as Mock).mockReturnValue({});

    render(<UserImagesPage />);

    expect(screen.getByAltText('prompt-1')).toBeInTheDocument();
    expect(screen.getAllByAltText('prompt-2')).toHaveLength(2);

    await userEvent.click(screen.getByAltText('prompt-1'));

    expect(screen.getByAltText('prompt-2')).toBeInTheDocument();
    expect(screen.getAllByAltText('prompt-1')).toHaveLength(2);
    expect(screen.getByText('prompt-1')).toBeInTheDocument();
  });
});
