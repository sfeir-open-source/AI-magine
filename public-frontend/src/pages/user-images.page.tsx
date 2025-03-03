import { Button } from '@/components/ui/button';
import { CircleCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useUserImages } from '@/src/hooks/useUserImages';
import { Image } from '@/src/domain/Image';
import { useImagePromotionMutation } from '@/src/hooks/useImagePromotionMutation';
import { LoadingSpinner } from '@/src/components/loading-spinner/loading-spinner';
import { useTranslation } from 'react-i18next';

export const UserImagesPage = () => {
  const { t } = useTranslation();

  const { data: userImages } = useUserImages();
  const { mutateAsync, isPending: isPromotePending } =
    useImagePromotionMutation();

  const [displayedImage, setDisplayedImage] = useState<Image | null>(null);

  useEffect(() => {
    if (userImages) {
      const defaultImage = userImages[0] || null;
      const selectedImage = userImages.find((image) => image.selected);
      setDisplayedImage(selectedImage || defaultImage);
    }
  }, [userImages]);

  const onSelectImage = (image: Image) => {
    setDisplayedImage(image);
  };

  const onPromote = async () => {
    try {
      await mutateAsync({
        imageId: displayedImage!.id,
      });

      toast.success(t('successful-promote'));
    } catch (e) {
      toast.error(`${t('failed-promote')}: ${(e as Error).message}`);
    }
  };

  return (
    <div className="flex flex-col">
      {displayedImage && (
        <div className="flex flex-col">
          <img src={displayedImage.url} alt={displayedImage.prompt} />
          <blockquote className="mt-6 border-l-2 pl-6 italic">
            {displayedImage.prompt}
          </blockquote>
          <Button
            className="my-6 mx-auto"
            onClick={onPromote}
            disabled={isPromotePending || displayedImage.selected}
          >
            {isPromotePending ? <LoadingSpinner /> : t('promote')}
          </Button>
        </div>
      )}

      <div className="flex flex-wrap -mx-1 justify-center">
        {userImages?.map((image) => (
          <div className="relative max-w-1/3 p-1">
            <img
              alt={image.prompt}
              key={image.url}
              src={image.url}
              onClick={() => onSelectImage(image)}
            />
            {image.selected && (
              <CircleCheck
                className="fill-white text-green-500 absolute top-1.5 right-1.5"
                width="17%"
                height="30%"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
