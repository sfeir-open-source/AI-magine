import { ImageGenerationPage } from '@/src/pages/image-generation.page';
import { act, render, waitFor } from '@testing-library/react';
import { useUserId } from '@/src/hooks/useUserId';
import { Mock } from 'vitest';
import { useNavigate, useParams } from 'react-router';
import i18n from '@/src/config/i18n';
import { useUserImages } from '@/src/hooks/useUserImages';
import { toast, Toaster } from 'sonner';
import { DisplayedImage } from '@/src/components/displayed-image/displayed-image';
import { Image } from '@/src/domain/Image';
import { UserImages } from '@/src/components/user-images/user-images';

vi.mock('@/src/hooks/useUserId');
vi.mock('react-router');
vi.mock('@/src/hooks/useUserImages');
vi.mock('@/src/components/prompt-editor/prompt-editor');
vi.mock('@/src/components/user-images/user-images');
vi.mock('@/src/components/displayed-image/displayed-image');
vi.mock('sonner', async (importOriginal) => ({
  ...(await importOriginal()),
  toast: {
    error: vi.fn((_message: string, options) => {
      options?.onAutoClose?.();
    }),
  },
}));

describe('ImageGenerationPage', () => {
  it('navigates to event page if userId is missing', async () => {
    (useUserImages as Mock).mockReturnValue({});
    (useParams as Mock).mockReturnValue({ eventId: 'event-id' });
    (useUserId as Mock).mockReturnValue(undefined);

    const navigateMock = vi.fn();
    (useNavigate as Mock).mockReturnValue(navigateMock);

    render(
      <>
        <ImageGenerationPage />
        <Toaster />
      </>
    );

    expect(toast.error).toHaveBeenCalledWith(
      i18n.t('missing-user-information'),
      expect.any(Object)
    );
    expect(navigateMock).toHaveBeenCalledWith('/events/event-id');
  });

  it('finds the selected image and displays it', async () => {
    expect.assertions(1);

    const fakeImages = [
      new Image('1', 'test prompt', 'http://foo', false, ''),
      new Image('2', 'test prompt 2', 'http://foo', true, ''),
    ];

    (useUserImages as Mock).mockReturnValue({ data: fakeImages });
    (useParams as Mock).mockReturnValue({ eventId: 'event-id' });
    (useUserId as Mock).mockReturnValue('user-id');
    (useNavigate as Mock).mockReturnValue(vi.fn());
    (DisplayedImage as Mock).mockImplementation(async ({ image }) => {
      await waitFor(() => expect(image).toEqual(fakeImages[1]));
    });

    await act(async () => {
      render(<ImageGenerationPage />);
    });
  });

  it('updates selected image on click on a different image', async () => {
    expect.assertions(2);

    const fakeImages = [
      new Image('1', 'test prompt', 'http://foo', false, ''),
      new Image('2', 'test prompt 2', 'http://foo', true, ''),
    ];

    (useUserImages as Mock).mockReturnValue({ data: fakeImages });
    (useParams as Mock).mockReturnValue({ eventId: 'event-id' });
    (useUserId as Mock).mockReturnValue('user-id');
    (useNavigate as Mock).mockReturnValue(vi.fn());

    (DisplayedImage as Mock).mockImplementation(async ({ image }) => {
      await waitFor(() => expect(image).toEqual(fakeImages[1]));

      (UserImages as Mock).mockImplementation(({ onSelect }) => {
        onSelect(fakeImages[0]);
      });

      await waitFor(() => expect(image).toEqual(fakeImages[0]));
    });

    await act(async () => {
      render(<ImageGenerationPage />);
    });
  });
});
