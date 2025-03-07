import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { LoaderCircle, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useImageGenerationListener } from '@/src/hooks/useImageGenerationListener';
import { useCreateEventPromptMutation } from '@/src/hooks/useCreateEventPromptMutation';
import { useParams } from 'react-router';
import { ProgressButton } from '@/src/components/progress-button/progress-button';
import { toast } from 'sonner';
import { useUserId } from '@/src/hooks/useUserId';

type PromptEditorProps = {
  displayedImagePrompt?: string;
};

export function PromptEditor({ displayedImagePrompt }: PromptEditorProps) {
  const { t } = useTranslation();

  const { eventId } = useParams<{ eventId: string }>();

  const userId = useUserId();

  const [prompt, setPrompt] = useState<string>('');

  const { listen: listenImageGeneration, progress } =
    useImageGenerationListener(userId as string);

  const { mutateAsync: createPrompt } = useCreateEventPromptMutation();

  useEffect(() => {
    if (displayedImagePrompt) setPrompt(displayedImagePrompt);
  }, [displayedImagePrompt]);

  const handleGenerateImage = async () => {
    if (!eventId)
      throw new Error(`Cannot generate image for unknown event : ${eventId}`);

    if (!userId)
      throw new Error(`Cannot generate image for unknown user : ${userId}`);

    try {
      const { promptId } = await createPrompt({
        eventId: eventId,
        userId: userId,
        prompt: prompt,
      });

      if (listenImageGeneration) listenImageGeneration(promptId);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Card className="gap-4 py-4">
      <CardHeader className="px-4">
        <CardTitle>
          {displayedImagePrompt ? t('edit-prompt') : t('write-prompt')}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <Textarea
          placeholder={t('enter-prompt-placeholder')}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={10}
        />
      </CardContent>
      <CardFooter className="px-4">
        <ProgressButton
          progress={progress}
          onClick={handleGenerateImage}
          className="w-full"
          disabled={!prompt || progress > 0}
        >
          {progress > 0 ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              {t('generating-your-image')} ...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              {t('generate-new-image')}
            </>
          )}
        </ProgressButton>
      </CardFooter>
    </Card>
  );
}
