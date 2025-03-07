import { Image } from '@/src/domain/Image';

type LightboxProps = {
  image?: Image;
  onClose: () => void;
};

export const Lightbox = ({ image, onClose }: LightboxProps) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      data-testid="backdrop"
      onClick={onClose}
    >
      <div className="relative max-w-full max-h-full">
        <img
          src={image?.url}
          alt={image?.prompt}
          className="max-w-full max-h-[90vh] object-contain"
        />
        <button
          className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 cursor-pointer"
          data-testid="close-button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};
