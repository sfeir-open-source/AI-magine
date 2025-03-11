import { Card, CardContent } from '@/components/ui/card';
import { useEventPromotedImages } from '@/src/hooks/useEventPromotedImages';

export function EventImageGallery() {
  const { data: galleryItems } = useEventPromotedImages();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {galleryItems?.map((item) => (
        <Card key={item.id} className="overflow-hidden group py-0">
          <CardContent className="p-0 relative">
            <div className="flex justify-center bg-black/5 aspect-[4/3] relative">
              <img
                src={item.url}
                alt={item.prompt}
                className="max-w-full max-h-[400px] object-contain"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <span className="text-white font-medium">@{item.author}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
