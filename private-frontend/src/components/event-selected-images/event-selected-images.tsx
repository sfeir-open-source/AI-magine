import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useEventSelectedImages } from '@/src/hooks/useEventSelectedImages';
import { Lightbox } from '@/src/components/lightbox/lightbox';
import { PromotedImage } from '@/src/domain/EventRepository';
import { useState } from 'react';

export const EventSelectedImages = ({ eventId }: { eventId: string }) => {
  const { t } = useTranslation();

  const { data: selectedImages = [] } = useEventSelectedImages(eventId);

  const [selectedImage, setSelectedImage] = useState<PromotedImage | null>(
    null
  );

  const openLightbox = (image: PromotedImage) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('selected-images')}</CardTitle>
        <CardDescription>{t('images-chosen-by-users')}</CardDescription>
      </CardHeader>
      <CardContent>
        {selectedImages.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {selectedImages.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-lg border"
                onClick={() => openLightbox(image)}
              >
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.prompt}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover transition-all hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-medium">
                    {image.prompt}
                  </p>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>
                      {t('user')}: {image.author}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-lg border">
            <p className="text-muted-foreground">{t('no-selected-images')}</p>
          </div>
        )}
      </CardContent>
      <Lightbox
        image={selectedImage}
        isOpen={selectedImage !== null}
        onClose={closeLightbox}
      />
    </Card>
  );
};
