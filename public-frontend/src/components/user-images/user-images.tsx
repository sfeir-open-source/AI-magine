import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from '@/src/domain/Image';
import { useTranslation } from 'react-i18next';

type UserImagesProps = {
  images: Image[];
  onSelect: (image: Image) => void;
  displayedImageId?: string;
};

export function UserImages({
  images,
  onSelect,
  displayedImageId,
}: UserImagesProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t('your-images')}</h3>
        <span className="text-sm text-muted-foreground">
          {images.length} image{images.length > 1 && 's'}
        </span>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)] rounded-md border">
        <div className="grid grid-cols-2 gap-2 p-2">
          {images?.length ? (
            images.map((image) => (
              <Card
                key={image.id}
                className={`overflow-hidden cursor-pointer transition-all ${
                  displayedImageId === image.id ? 'ring-2 ring-primary' : ''
                } p-0`}
                onClick={() => onSelect(image)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square w-full overflow-hidden">
                    <img
                      src={image.url || '/placeholder.svg'}
                      alt={image.prompt}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center' }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center gap-4 text-muted-foreground col-span-2 mt-6">
              <p>{t('no-images-to-display')}</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
