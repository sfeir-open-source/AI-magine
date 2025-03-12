import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import {
  ArrowBigDown,
  ImageOff,
  MoreHorizontal,
  Star,
  ZoomIn,
} from 'lucide-react';
import { Lightbox } from '@/src/components/lightbox/lightbox';
import { Image } from '@/src/domain/Image';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useImagePromotionMutation } from '@/src/hooks/useImagePromotionMutation';

export function DisplayedImage({ image }: { image?: Image }) {
  const { t } = useTranslation();
  const { mutateAsync: promoteImage } = useImagePromotionMutation();

  const [lightboxOpen, setLightboxOpen] = useState(false);

  const onClickViewFull = () => {
    setLightboxOpen(true);
  };

  const onClickPromote = async (image: Image) => {
    await promoteImage({ imageId: image?.id });
  };

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
                  onClick={() => onClickPromote(image)}
                >
                  <Star
                    className={cn(
                      'h-4 w-4 mr-2',
                      image.isPromoted() && 'fill-yellow-300 text-yellow-300'
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

                {/* Desktop actions - hidden on mobile */}
                <div className="hidden sm:flex gap-2">
                  {/*<Button size="sm" variant="ghost" className="text-white" disabled>
                    <Download />
                    {t('download')}
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white" disabled>
                    <Share2 />
                    {t('share')}
                  </Button>*/}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white"
                    onClick={onClickViewFull}
                  >
                    <ZoomIn />
                    {t('view-full')}
                  </Button>
                </div>

                {/* Mobile actions - shown only on mobile */}
                <div className="sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      {/*<DropdownMenuItem disabled>
                        <Share2 />
                        {t('share')}
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled>
                        <Download />
                        {t('download')}
                      </DropdownMenuItem>*/}
                      <DropdownMenuItem onClick={onClickViewFull}>
                        <ZoomIn />
                        {t('view-full')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
