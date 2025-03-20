import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { PromotedImage } from '@/src/domain/EventRepository';
import { useTranslation } from 'react-i18next';

type ImageLightboxProps = {
  image: PromotedImage | null;
  isOpen: boolean;
  onClose: () => void;
};

export const Lightbox = ({ image, isOpen, onClose }: ImageLightboxProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-[90vw] sm:max-w-4xl"
        onInteractOutside={onClose}
      >
        {image && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="max-h-[70vh] overflow-hidden rounded-lg">
                <img
                  src={image.url}
                  alt={image.prompt}
                  width={800}
                  height={800}
                  className="object-contain max-h-[70vh]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Prompt
                </h3>
                <div className="mt-1 max-h-[150px] overflow-y-auto rounded-md border border-border bg-muted/20 p-3">
                  <p className="text-sm">{image.prompt}</p>
                </div>
              </div>

              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {t('user')}: {image.author}
                </span>
              </div>
            </div>

            <div className="text-right">
              <DialogClose asChild>
                <Button variant="outline">{t('close')}</Button>
              </DialogClose>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
