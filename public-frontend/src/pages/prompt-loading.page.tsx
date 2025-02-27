import { LoadingSpinner } from '@/src/components/loading-spinner/loading-spinner';
import { useImageGenerationListener } from '@/src/hooks/useImageGenerationListener';

export const PromptLoadingPage = () => {
  useImageGenerationListener()

  return (
    <div className="mt-16 flex flex-col items-center">
      <LoadingSpinner width={120} height={120} />
      <p className="leading-7 mt-6">Generating your image. Please wait ...</p>
    </div>
  );
};
