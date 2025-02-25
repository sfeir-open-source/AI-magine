import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import i18n from '@/src/config/i18n';
import { useTranslation } from 'react-i18next';
import { TypographyH2 } from '@/src/components/typography/h2';
import { Event } from '@/src/domain/Event';
import { TypographyLead } from '@/src/components/typography/lead';
import { format } from 'date-fns';
import { useEventPromptMutation } from '@/src/hooks/useEventPromptMutation';
import { useFingerprint } from '@/src/hooks/useFingerprint';
import { useNavigate } from 'react-router';
import { LoadingSpinner } from '@/src/components/loading-spinner/loading-spinner';

export const STORAGE_NAME_KEY = 'name';
export const STORAGE_EMAIL_KEY = 'email';
export const STORAGE_JOB_KEY = 'job-title';
export const STORAGE_ALLOW_CONTACT_KEY = 'allow-contact';
export const STORAGE_PROMPT_KEY = 'prompt';

const PromptFormSchema = z.object({
  name: z.string().nonempty({ message: i18n.t('empty-name-error') }),
  email: z
    .string()
    .email({ message: i18n.t('invalid-email-error') })
    .nonempty({ message: i18n.t('empty-email-error') }),
  jobTitle: z.string().nonempty({ message: i18n.t('empty-job-title-error') }),
  allowContact: z
    .string()
    .nonempty({ message: i18n.t('empty-allow-contact-error') }),
  prompt: z.string().nonempty({ message: i18n.t('empty-prompt-error') }),
});

type EventPromptFormProps = {
  event: Event;
};

export const EventPromptForm = ({ event }: EventPromptFormProps) => {
  const { t } = useTranslation();

  const { mutateAsync, isPending } = useEventPromptMutation();

  const fingerprint = useFingerprint();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof PromptFormSchema>>({
    resolver: zodResolver(PromptFormSchema),
    defaultValues: {
      name: localStorage.getItem(STORAGE_NAME_KEY) ?? '',
      email: localStorage.getItem(STORAGE_EMAIL_KEY) ?? '',
      jobTitle: localStorage.getItem(STORAGE_JOB_KEY) ?? '',
      allowContact: localStorage.getItem(STORAGE_ALLOW_CONTACT_KEY) ?? '',
      prompt: localStorage.getItem(STORAGE_PROMPT_KEY) ?? '',
    },
  });

  const onSubmit = async (data: z.infer<typeof PromptFormSchema>) => {
    localStorage.setItem(STORAGE_NAME_KEY, data.name);
    localStorage.setItem(STORAGE_EMAIL_KEY, data.email);
    localStorage.setItem(STORAGE_JOB_KEY, data.jobTitle);
    localStorage.setItem(STORAGE_ALLOW_CONTACT_KEY, data.allowContact);
    localStorage.setItem(STORAGE_PROMPT_KEY, data.prompt);

    const promptId = await mutateAsync({
      browserFingerprint: fingerprint,
      eventId: event.id,
      userName: data.name,
      userEmail: data.email,
      jobTitle: data.jobTitle,
      allowContact: data.allowContact === 'true',
      prompt: data.prompt,
    });

    navigate(`/events/${event.id}/prompts/${promptId}/loading`);
  };

  return (
    <div className="mt-8">
      <TypographyH2>{event.name}</TypographyH2>
      <TypographyLead className="mt-2 mb-6 text-lg">
        {t('ends')}: {format(event.endDate, 'dd/MM/yyyy HH:mm')}
      </TypographyLead>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 mb-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email-address')}</FormLabel>
                  <FormControl>
                    <Input placeholder="doe.john@sfeir.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('job-title')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('job-title-placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="allowContact"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="mb-4 block">
                  {t('allow-contact')}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    className="flex gap-16"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="false" className="my-0" />
                      </FormControl>
                      <FormLabel>{t('no')}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="true" className="my-0" />
                      </FormControl>
                      <FormLabel>{t('yes')}</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('prompt')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('enter-prompt-placeholder')}
                    rows={10}
                    className="mb-2"
                    {...field}
                  />
                </FormControl>
                <FormDescription>You already used x tokens</FormDescription>
                <FormDescription>
                  This prompt uses Imagen to generate your image
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full mt-4" type="submit" disabled={isPending}>
            {isPending ? <LoadingSpinner /> : 'Go'}
          </Button>
        </form>
      </Form>
    </div>
  );
};
