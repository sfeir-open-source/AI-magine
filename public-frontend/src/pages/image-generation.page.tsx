import { useEffect, useState } from 'react';
import { DisplayedImage } from '@/src/components/displayed-image/displayed-image';
import { UserImages } from '@/src/components/user-images/user-images';
import { PromptEditor } from '@/src/components/prompt-editor/prompt-editor';
import { byDateSelector, useUserImages } from '@/src/hooks/useUserImages';
import { Image } from '@/src/domain/Image';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useUserId } from '@/src/hooks/useUserId';

export const ImageGenerationPage = () => {
  const { t } = useTranslation();

  const { eventId } = useParams<{ eventId: string }>();

  const userId = useUserId();

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      toast.error(t('missing-user-information'), {
        onAutoClose: () => {
          navigate(`/events/${eventId}`);
        },
      });
    }
  }, [navigate, eventId, userId, t]);

  const { data: userImages } = useUserImages(userId ?? '', {
    select: byDateSelector,
  });

  const [displayedImage, setDisplayedImage] = useState<Image | undefined>();

  useEffect(() => {
    if (userImages) {
      setDisplayedImage(userImages[0]);
    }
  }, [userImages]);

  const onSelectImage = (image: Image) => {
    setDisplayedImage(image);
  };

  return (
    <div className="container mx-auto py-8 px-4 flex-1">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <DisplayedImage image={displayedImage} />
          <PromptEditor displayedImagePrompt={displayedImage?.prompt} />
        </div>
        <div>
          <UserImages
            images={userImages ?? []}
            displayedImageId={displayedImage?.id}
            onSelect={onSelectImage}
          />
        </div>
      </div>
    </div>
  );
};
