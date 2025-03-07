import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import {
  ArrowBigDown,
  Download,
  ImageOff,
  Share2,
  Star,
  ZoomIn,
} from 'lucide-react';
import { Lightbox } from '@/src/components/lightbox/lightbox';
import { Image } from '@/src/domain/Image';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export function DisplayedImage({ image }: { image?: Image }) {
  const { t } = useTranslation();

  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <div>
      <Card className="overflow-hidden py-0">
        <CardContent className="p-0 relative">
          <div className="flex justify-center bg-black/5 min-h-[300px] relative">
            {image ? (
              <>
                <img
                  src={image?.url}
                  alt={image?.prompt}
                  className="max-w-full max-h-[400px] object-contain"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-4 right-4 hover:bg-secondary-light"
                >
                  <Star
                    className={cn(
                      'h-4 w-4 mr-2',
                      image?.selected && 'fill-yellow-300 text-yellow-300'
                    )}
                  />
                  {t('promote')}
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-4 justify-center items-center">
                <ImageOff width={150} height={150} className="text-gray-300" />
                <div className="flex items-center">
                  <ArrowBigDown className="animate-bounce mt-1.5" />
                  <span className="mx-2">{t('write-a-prompt-hint')}</span>
                  <ArrowBigDown className="animate-bounce mt-1.5" />
                </div>
              </div>
            )}
          </div>
          {image && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex justify-between items-center">
                <div className="text-white">
                  <p className="text-sm opacity-80">
                    Created {new Date(image.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-white">
                    <Download />
                    {t('download')}
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white">
                    <Share2 />
                    {t('share')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white"
                    onClick={() => setLightboxOpen(true)}
                  >
                    <ZoomIn />
                    {t('view-full')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {lightboxOpen && (
        <Lightbox image={image} onClose={() => setLightboxOpen(false)} />
      )}
    </div>
  );
}
